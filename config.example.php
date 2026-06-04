<?php
/**
 * Configuration file for Kadesh Barnea Services Ltd.
 * Rename this to config.php and fill in your details.
 */

// ── Email Settings ───────────────────────────────────────────────────────────
// The email address that will receive form submissions
define('RECIPIENT_EMAIL', 'kadeshbanear@gmail.com');

// ── Security ─────────────────────────────────────────────────────────────────
// A random secret key for CSRF token generation (Change this to a long random string)
define('CSRF_SECRET', 'replace_this_with_a_long_random_string');

// ── Rate Limiting ────────────────────────────────────────────────────────────
// The time window in seconds (e.g., 3600 = 1 hour)
define('RATE_LIMIT_WINDOW', 3600);
// Maximum number of requests allowed within that window
define('RATE_LIMIT_MAX', 5);

// ── Debugging ────────────────────────────────────────────────────────────────
// Set to true only during development
define('DEBUG_MODE', false);

if (DEBUG_MODE) {
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
} else {
    ini_set('display_errors', 0);
    error_reporting(0);
}
