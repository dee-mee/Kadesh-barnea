<?php
/**
 * CSRF token helpers — include this wherever you need generate/validate.
 */

require_once __DIR__ . '/config.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

/**
 * Generate (or reuse) a CSRF token for the current session.
 */
function csrf_token(): string {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = hash_hmac('sha256', random_bytes(32), CSRF_SECRET);
    }
    return $_SESSION['csrf_token'];
}

/**
 * Verify the token submitted with a form.
 */
function csrf_verify(): bool {
    $submitted = $_POST['csrf_token'] ?? '';
    $expected  = $_SESSION['csrf_token'] ?? '';
    return !empty($submitted) && hash_equals($expected, $submitted);
}

/**
 * Render a hidden CSRF input — call inside every <form>.
 */
function csrf_field(): string {
    return '<input type="hidden" name="csrf_token" value="' . htmlspecialchars(csrf_token()) . '">';
}
