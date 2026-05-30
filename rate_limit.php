<?php
/**
 * Simple file-based rate limiter.
 * In production, swap the storage backend for Redis or a DB table.
 */

require_once __DIR__ . '/config.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

/**
 * Check whether the current IP has exceeded the rate limit.
 * Returns true if the request should be allowed, false if it should be blocked.
 *
 * @param string $action  A short label, e.g. 'contact' or 'newsletter'
 */
function rate_limit_check(string $action): bool {
    $ip  = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $key = 'rl_' . $action . '_' . md5($ip);
    $now = time();

    $attempts = $_SESSION[$key] ?? [];

    // Drop expired entries
    $attempts = array_filter($attempts, fn($t) => ($now - $t) < RATE_LIMIT_WINDOW);

    if (count($attempts) >= RATE_LIMIT_MAX) {
        return false;
    }

    $attempts[] = $now;
    $_SESSION[$key] = array_values($attempts);
    return true;
}
