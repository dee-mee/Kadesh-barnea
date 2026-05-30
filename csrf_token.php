<?php
/**
 * Endpoint that returns the current session CSRF token as plain text.
 * Called by the client-side JS to populate form fields.
 */
require_once __DIR__ . '/csrf.php';

header('Content-Type: text/plain; charset=UTF-8');
// Prevent caching of tokens
header('Cache-Control: no-store');
echo csrf_token();
