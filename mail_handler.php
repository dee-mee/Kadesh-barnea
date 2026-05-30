<?php
/**
 * Secure Mail Handler for Kadesh Barnea
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/csrf.php';
require_once __DIR__ . '/rate_limit.php';

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Strip characters that allow email header injection */
function sanitize_header(string $data): string {
    return str_replace(["\n", "\r", "%0a", "%0d"], '', $data);
}

/** Abort with an HTTP status and redirect back with an error flag */
function fail(int $code, string $location): never {
    http_response_code($code);
    header('Location: ' . $location);
    exit;
}

// ── Gate checks ───────────────────────────────────────────────────────────────

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(403);
    echo 'Access denied.';
    exit;
}

// CSRF
if (!csrf_verify()) {
    fail(403, 'contact.html?status=error&reason=csrf');
}

// Honeypot
if (!empty($_POST['honeypot'])) {
    // Silently succeed so bots think they won
    header('Location: contact.html?status=success');
    exit;
}

// Rate limit
if (!rate_limit_check('contact')) {
    fail(429, 'contact.html?status=error&reason=ratelimit');
}

// ── Input validation ─────────────────────────────────────────────────────────

$name    = strip_tags(trim($_POST['name']    ?? ''));
$email   = filter_var(trim($_POST['email']   ?? ''), FILTER_SANITIZE_EMAIL);
$subject = strip_tags(trim($_POST['subject'] ?? 'New Enquiry'));
$message = htmlspecialchars(trim($_POST['message'] ?? ''), ENT_QUOTES, 'UTF-8');
$service = strip_tags(trim($_POST['service'] ?? ''));
$website = filter_var(trim($_POST['website'] ?? ''), FILTER_SANITIZE_URL);
$comment = trim($_POST['comment'] ?? '');

// Support comment forms where message is sent as 'comment'
if ($message === '' && $comment !== '') {
    $message = htmlspecialchars($comment, ENT_QUOTES, 'UTF-8');
    $subject = 'New Blog Comment';
}

if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    fail(400, 'contact.html?status=error&reason=invalid');
}

// ── Build email ───────────────────────────────────────────────────────────────

$safe_name  = sanitize_header($name);
$safe_email = sanitize_header($email);
$safe_subj  = sanitize_header($subject);

$body  = "Name: {$safe_name}\n";
$body .= "Email: {$safe_email}\n\n";
if ($service !== '') $body .= "Service Requested: {$service}\n\n";
if ($website !== '') $body .= "Website: {$website}\n\n";
$body .= "Message:\n{$message}\n";

// Use a neutral From address that belongs to your own domain so mail servers
// don't reject it as spoofed. The visitor's address goes in Reply-To.
$headers  = "From: Kadesh Barnea Website <noreply@kadeshbarnea.com>\r\n";
$headers .= "Reply-To: {$safe_name} <{$safe_email}>\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . PHP_VERSION;

// Regenerate CSRF token after use
unset($_SESSION['csrf_token']);

if (mail(RECIPIENT_EMAIL, $safe_subj, $body, $headers)) {
    header('Location: contact.html?status=success');
} else {
    http_response_code(500);
    header('Location: contact.html?status=error&reason=server');
}
exit;
