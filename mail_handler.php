<?php
/**
 * Secure Mail Handler for Kadesh Barnea
 */

// Function to sanitize header data to prevent header injection
function sanitize_header($data) {
    return str_replace(array("\n", "\r", "%0a", "%0d"), '', $data);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Honeypot check for SPAM
    if (!empty($_POST["honeypot"])) {
        http_response_code(400);
        echo "Spam detected.";
        exit;
    }
    
    $to = "enter email here";
    
    // Basic sanitization
    $name = strip_tags(trim($_POST["name"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $message = htmlspecialchars(trim($_POST["message"]));
    
    // Determine form type and sanitize subjects/extra fields
    $subject_input = isset($_POST["subject"]) ? strip_tags(trim($_POST["subject"])) : "New Submission";
    $subject = sanitize_header($subject_input);
    
    $service = isset($_POST["service"]) ? strip_tags(trim($_POST["service"])) : "";
    $comment = isset($_POST["comment"]) ? trim($_POST["comment"]) : "";
    $website = isset($_POST["website"]) ? filter_var(trim($_POST["website"]), FILTER_SANITIZE_URL) : "";
    
    // For comment forms, message might be named 'comment'
    if (empty($message) && !empty($comment)) {
        $message = htmlspecialchars($comment);
        $subject = "New Blog Comment";
    }
    
    // Validate required fields
    if (empty($name) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Invalid input. Please complete the form correctly.";
        exit;
    }

    // Sanitize headers to prevent injection
    $safe_name = sanitize_header($name);
    $safe_email = sanitize_header($email);

    $email_content = "Name: $safe_name\n";
    $email_content .= "Email: $safe_email\n\n";
    
    if (!empty($service)) {
        $email_content .= "Service Requested: " . strip_tags($service) . "\n\n";
    }
    if (!empty($website)) {
        $email_content .= "Website: " . strip_tags($website) . "\n\n";
    }
    
    $email_content .= "Message:\n$message\n";

    // Secure headers
    $email_headers = "From: " . $safe_name . " <" . $safe_email . ">\r\n";
    $email_headers .= "Reply-To: " . $safe_email . "\r\n";
    $email_headers .= "X-Mailer: PHP/" . phpversion();

    // Use a generic subject if mail() fails or headers are malicious
    if (mail($to, $subject, $email_content, $email_headers)) {
        // Redirect safely
        header("Location: contact.html?status=success");
        exit;
    } else {
        http_response_code(500);
        echo "Server error. Could not send message.";
    }

} else {
    http_response_code(403);
    echo "Access denied.";
}
?>
