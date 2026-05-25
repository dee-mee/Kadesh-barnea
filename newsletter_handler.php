<?php
/**
 * Secure Newsletter Handler for Kadesh Barnea
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/csrf.php';
require_once __DIR__ . '/rate_limit.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(403);
    echo 'Access denied.';
    exit;
}

// CSRF
if (!csrf_verify()) {
    http_response_code(403);
    header('Location: index.html?newsletter=error&reason=csrf');
    exit;
}

// Honeypot
if (!empty($_POST['honeypot'])) {
    header('Location: index.html?newsletter=success');
    exit;
}

// Rate limit
if (!rate_limit_check('newsletter')) {
    http_response_code(429);
    header('Location: index.html?newsletter=error&reason=ratelimit');
    exit;
}

$email = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    header('Location: index.html?newsletter=error&reason=invalid');
    exit;
}

$subject = 'New Newsletter Subscription';
$body    = "A new user has subscribed to the newsletter:\n\nEmail: {$email}";

$headers  = "From: Kadesh Barnea Website <noreply@kadeshbarnea.com>\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . PHP_VERSION;

unset($_SESSION['csrf_token']);

if (mail(RECIPIENT_EMAIL, $subject, $body, $headers)) {
    header('Location: index.html?newsletter=success');
} else {
    http_response_code(500);
    header('Location: index.html?newsletter=error&reason=server');
}
exit;
