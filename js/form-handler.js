// Form Handler Module
const FormHandler = {
  apiBaseUrl: 'http://localhost:3000/api',

  // Show toast notification
  showNotification: function(message, type = 'success') {
    const toastHtml = `
      <div class="alert alert-${type === 'success' ? 'success' : 'danger'} alert-dismissible fade show" 
           role="alert" style="position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px;">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
    $('body').append(toastHtml);
    
    // Auto-dismiss after 5 seconds
    setTimeout(function() {
      $('.alert').fadeOut('slow', function() {
        $(this).remove();
      });
    }, 5000);
  },

  // Contact Form Handler
  handleContactForm: function() {
    const form = $('form');
    if (form.length === 0) return;

    form.on('submit', function(e) {
      e.preventDefault();

      const name = $(this).find('input[placeholder="Your Name"]').val();
      const email = $(this).find('input[placeholder="Your Email"]').val();
      const subject = $(this).find('input[placeholder="Subject"]').val();
      const message = $(this).find('textarea[placeholder="Message"]').val();

      // Disable button during submission
      const $submitBtn = $(this).find('button[type="submit"]');
      const originalText = $submitBtn.text();
      $submitBtn.prop('disabled', true).text('Sending...');

      $.ajax({
        url: FormHandler.apiBaseUrl + '/contact',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          name: name,
          email: email,
          subject: subject,
          message: message
        }),
        success: function(response) {
          FormHandler.showNotification(response.message, 'success');
          form[0].reset();
          $submitBtn.prop('disabled', false).text(originalText);
        },
        error: function(xhr) {
          const errorMsg = xhr.responseJSON ? xhr.responseJSON.message : 'An error occurred';
          FormHandler.showNotification(errorMsg, 'error');
          $submitBtn.prop('disabled', false).text(originalText);
        }
      });
    });
  },

  // Quote Form Handler
  handleQuoteForm: function() {
    // Target quote form specifically
    const quoteForm = $('form:has(select)');
    if (quoteForm.length === 0) return;

    quoteForm.on('submit', function(e) {
      e.preventDefault();

      const name = $(this).find('input[placeholder="Your Name"]').val();
      const email = $(this).find('input[placeholder="Your Email"]').val();
      const service = $(this).find('select').val();
      const message = $(this).find('textarea[placeholder="Message"]').val();

      // Disable button during submission
      const $submitBtn = $(this).find('button[type="submit"]');
      const originalText = $submitBtn.text();
      $submitBtn.prop('disabled', true).text('Sending...');

      $.ajax({
        url: FormHandler.apiBaseUrl + '/quote',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          name: name,
          email: email,
          service: service,
          message: message
        }),
        success: function(response) {
          FormHandler.showNotification(response.message, 'success');
          quoteForm[0].reset();
          $submitBtn.prop('disabled', false).text(originalText);
        },
        error: function(xhr) {
          const errorMsg = xhr.responseJSON ? xhr.responseJSON.message : 'An error occurred';
          FormHandler.showNotification(errorMsg, 'error');
          $submitBtn.prop('disabled', false).text(originalText);
        }
      });
    });
  },

  // Newsletter Form Handler
  handleNewsletterForm: function() {
    // Target newsletter form in footer
    const footerForm = $('form:has(.input-group):not(:has(select))').last();
    if (footerForm.length === 0) return;

    footerForm.on('submit', function(e) {
      e.preventDefault();

      const email = $(this).find('input[placeholder="Your Email"]').val();
      const $submitBtn = $(this).find('button');
      const originalText = $submitBtn.text();

      $submitBtn.prop('disabled', true).text('Subscribing...');

      $.ajax({
        url: FormHandler.apiBaseUrl + '/newsletter',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          email: email
        }),
        success: function(response) {
          FormHandler.showNotification(response.message, 'success');
          footerForm[0].reset();
          $submitBtn.prop('disabled', false).text(originalText);
        },
        error: function(xhr) {
          const errorMsg = xhr.responseJSON ? xhr.responseJSON.message : 'An error occurred';
          FormHandler.showNotification(errorMsg, 'error');
          $submitBtn.prop('disabled', false).text(originalText);
        }
      });
    });
  },

  // Initialize all forms
  init: function() {
    // Check if we're on contact page
    if (window.location.pathname.includes('contact.html') || window.location.pathname === '/') {
      this.handleContactForm();
    }
    
    // Check if we're on quote page
    if (window.location.pathname.includes('quote.html')) {
      this.handleQuoteForm();
    }
    
    // Newsletter form is on every page (in footer)
    this.handleNewsletterForm();
  }
};

// Initialize forms when document is ready
$(document).ready(function() {
  FormHandler.init();
});
