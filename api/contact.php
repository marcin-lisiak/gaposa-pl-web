<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Nieobsługiwana metoda.']);
    exit;
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && !preg_match('~^https?://(www\.)?gaposa\.pl$~i', $origin)) {
    http_response_code(403);
    echo json_encode(['ok' => false, 'message' => 'Nieprawidłowe źródło formularza.']);
    exit;
}

$rawInput = file_get_contents('php://input') ?: '';
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
$payload = [];

if (stripos($contentType, 'application/json') !== false) {
    $decoded = json_decode($rawInput, true);
    if (is_array($decoded)) {
        $payload = $decoded;
    }
} else {
    $payload = $_POST;
}

function field_value(array $payload, string $key): string
{
    return trim((string)($payload[$key] ?? ''));
}

$name = field_value($payload, 'name');
$email = field_value($payload, 'email');
$phone = field_value($payload, 'phone');
$message = field_value($payload, 'message');
$website = field_value($payload, 'website');
$startedAt = (int)($payload['started_at'] ?? 0);

if ($website !== '') {
    echo json_encode(['ok' => true, 'message' => 'Dziękujemy za wiadomość.']);
    exit;
}

if ($name === '' || $email === '' || $message === '') {
    http_response_code(422);
    echo json_encode(['ok' => false, 'message' => 'Uzupełnij wymagane pola formularza.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'message' => 'Podaj poprawny adres e-mail.']);
    exit;
}

if (strlen($message) > 5000 || strlen($name) > 240 || strlen($phone) > 120) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'message' => 'Wiadomość jest zbyt długa.']);
    exit;
}

$to = 'biuro@cezab-distribution.pl';
$subject = 'Zapytanie ze strony Gaposa';
$safeName = str_replace(["\r", "\n"], ' ', $name);
$safeEmail = str_replace(["\r", "\n"], '', $email);

$body = implode("\n", [
    'Nowe zapytanie ze strony gaposa.pl',
    '',
    'Imię i nazwisko: ' . $safeName,
    'E-mail: ' . $safeEmail,
    'Telefon: ' . ($phone !== '' ? $phone : '-'),
    '',
    'Wiadomość:',
    $message,
    '',
    '---',
    'Wiadomość wysłana z formularza na stronie gaposa.pl',
]);

function encode_header_value(string $value): string
{
    return '=?UTF-8?B?' . base64_encode($value) . '?=';
}

function smtp_read($socket): string
{
    $response = '';
    while (($line = fgets($socket, 515)) !== false) {
        $response .= $line;
        if (preg_match('/^\d{3}\s/', $line) === 1) {
            break;
        }
    }
    return $response;
}

function smtp_command($socket, string $command, array $expectedCodes): string
{
    fwrite($socket, $command . "\r\n");
    $response = smtp_read($socket);
    $code = (int)substr($response, 0, 3);
    if (!in_array($code, $expectedCodes, true)) {
        throw new RuntimeException('SMTP error: ' . trim($response));
    }
    return $response;
}

function smtp_send_mail(array $config, string $replyToEmail, string $replyToName, string $subject, string $body): void
{
    $host = (string)$config['host'];
    $port = (int)$config['port'];
    $username = (string)$config['username'];
    $password = (string)$config['password'];
    $fromEmail = (string)$config['from_email'];
    $fromName = (string)$config['from_name'];
    $toEmail = (string)$config['to_email'];
    $toName = (string)$config['to_name'];

    $socket = stream_socket_client(
        'ssl://' . $host . ':' . $port,
        $errno,
        $errstr,
        20,
        STREAM_CLIENT_CONNECT
    );

    if (!$socket) {
        throw new RuntimeException('Nie można połączyć się z serwerem SMTP.');
    }

    stream_set_timeout($socket, 20);

    try {
        $welcome = smtp_read($socket);
        if ((int)substr($welcome, 0, 3) !== 220) {
            throw new RuntimeException('Nieprawidłowa odpowiedź serwera SMTP.');
        }

        smtp_command($socket, 'EHLO gaposa.pl', [250]);
        smtp_command($socket, 'AUTH LOGIN', [334]);
        smtp_command($socket, base64_encode($username), [334]);
        smtp_command($socket, base64_encode($password), [235]);
        smtp_command($socket, 'MAIL FROM:<' . $fromEmail . '>', [250]);
        smtp_command($socket, 'RCPT TO:<' . $toEmail . '>', [250, 251]);
        smtp_command($socket, 'DATA', [354]);

        $encodedBody = quoted_printable_encode($body);
        $encodedBody = preg_replace('/^\./m', '..', $encodedBody);

        $headers = [
            'Date: ' . date(DATE_RFC2822),
            'From: ' . encode_header_value($fromName) . ' <' . $fromEmail . '>',
            'To: ' . encode_header_value($toName) . ' <' . $toEmail . '>',
            'Reply-To: ' . encode_header_value($replyToName) . ' <' . $replyToEmail . '>',
            'Subject: ' . encode_header_value($subject),
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: quoted-printable',
            'X-Mailer: Gaposa contact form',
        ];

        $message = implode("\r\n", $headers) . "\r\n\r\n" . $encodedBody;
        fwrite($socket, $message . "\r\n.\r\n");
        $dataResponse = smtp_read($socket);
        if ((int)substr($dataResponse, 0, 3) !== 250) {
            throw new RuntimeException('SMTP error: ' . trim($dataResponse));
        }

        smtp_command($socket, 'QUIT', [221]);
    } finally {
        fclose($socket);
    }
}

$configPath = dirname(__DIR__, 2) . '/private_html/mail-config.php';
if (!is_file($configPath)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => 'Brakuje konfiguracji wysyłki formularza.']);
    exit;
}

$mailConfig = require $configPath;

try {
    smtp_send_mail($mailConfig, $safeEmail, $safeName, $subject, $body);
    echo json_encode(['ok' => true, 'message' => 'Dziękujemy. Wiadomość została wysłana.']);
} catch (Throwable $error) {
    http_response_code(500);
    error_log('Gaposa contact form SMTP error: ' . $error->getMessage());
    echo json_encode(['ok' => false, 'message' => 'Nie udało się wysłać wiadomości. Spróbuj ponownie lub napisz bezpośrednio na biuro@cezab-distribution.pl.']);
}
