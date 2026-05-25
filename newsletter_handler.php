<?php
/**
 * Secure Newsletter Handler for Kadesh Barnea
 */

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Honeypot check for SPAM
    if (!empty($_POST["honeypot"])) {
        http_response_code(400);
        exit;
    }
    
    $to = "kadeshbanear@gmail.com";
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Please provide a valid email address.";
        exit;
    }

    $subject = "New Newsletter Subscription";
    $email_content = "A new user has subscribed to the newsletter:\n\nEmail: $email";
    
    // Static headers are safer
    $email_headers = "From: Newsletter <noreply@kadeshbarnea.com>\r\n";
    $email_headers .= "Reply-To: $email\r\n";
    $email_headers .= "X-Mailer: PHP/" . phpversion();

    if (mail($to, $subject, $email_content, $email_headers)) {
        header("Location: index.html?newsletter=success");
        exit;
    } else {
        http_response_code(500);
        echo "Oops! Something went wrong.";
    }

} else {
    http_response_code(403);
    echo "Access denied.";
}
?>
