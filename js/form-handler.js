// Form Handler Module for Kadesh Barnea Services
const FormHandler = {
  // Use relative URL if serving from the same domain, or absolute if needed
  apiBaseUrl: '/api',

  // Show toast notification
  showNotification: function(message, type = 'success') {
    // Remove existing alerts first
    $('.custom-form-alert').remove();

    const toastHtml = `
      <div class="alert alert-${type === 'success' ? 'success' : 'danger'} alert-dismissible fade show custom-form-alert" 
           role="alert" style="position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div class="d-flex align-items-center">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
            <div>${message}</div>
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
    $('body').append(toastHtml);
    
    // Auto-dismiss after 8 seconds
    setTimeout(function() {
      $('.custom-form-alert').fadeOut('slow', function() {
        $(this).remove();
      });
    }, 8000);
  },

  // Generic Submit Handler
  handleSubmit: function(formId, endpoint, dataMapper) {
    const $form = $(formId);
    if ($form.length === 0) return;

    $form.on('submit', function(e) {
      e.preventDefault();

      const formData = dataMapper($(this));
      
      // Basic validation
      let hasError = false;
      Object.keys(formData).forEach(key => {
        if (!formData[key] && key !== 'honeypot') {
          hasError = true;
        }
      });

      if (hasError) {
        FormHandler.showNotification('Please fill in all required fields.', 'error');
        return;
      }

      // Disable button during submission
      const $submitBtn = $(this).find('button[type="submit"]');
      const originalText = $submitBtn.html();
      $submitBtn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...');

      $.ajax({
        url: FormHandler.apiBaseUrl + endpoint,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
          FormHandler.showNotification(response.message, 'success');
          $form[0].reset();
          $submitBtn.prop('disabled', false).html(originalText);
        },
        error: function(xhr) {
          const errorMsg = xhr.responseJSON ? xhr.responseJSON.message : 'An error occurred. Please try again later.';
          FormHandler.showNotification(errorMsg, 'error');
          $submitBtn.prop('disabled', false).html(originalText);
        }
      });
    });
  },

  // Initialize all forms
  init: function() {
    // 1. Contact Form
    this.handleSubmit('#contactForm', '/contact', ($form) => ({
      name: $form.find('[name="name"]').val(),
      email: $form.find('[name="email"]').val(),
      subject: $form.find('[name="subject"]').val(),
      message: $form.find('[name="message"]').val()
    }));

    // 2. Quote Form
    this.handleSubmit('#quoteForm', '/quote', ($form) => ({
      name: $form.find('[name="name"]').val(),
      email: $form.find('[name="email"]').val(),
      service: $form.find('[name="service"]').val(),
      message: $form.find('[name="message"]').val()
    }));

    // 3. Newsletter Form (Footer)
    this.handleSubmit('#newsletterForm', '/newsletter', ($form) => ({
      email: $form.find('[name="email"]').val()
    }));
  }
};

// Initialize forms when document is ready
$(document).ready(function() {
  FormHandler.init();
});
