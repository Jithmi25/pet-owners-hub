document.addEventListener('DOMContentLoaded', function() {

    // Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 20,
                behavior: 'smooth'
            });
            
            // Close any open FAQ items when navigating
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
        }
    });
});


    // Form submission handling
    const supportForm = document.getElementById('supportForm');
    const confirmationModal = document.getElementById('confirmationModal');
    const closeModal = document.querySelector('.close-modal');
    const closeBtn = document.getElementById('closeBtn');

    supportForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // In a real application, you would send the form data to a server here
        // For this example, we'll just show the confirmation modal
        
        // Get form values (just for demonstration)
        const formData = new FormData(supportForm);
        const formValues = Object.fromEntries(formData.entries());
        console.log('Form submitted:', formValues);
        
        // Show confirmation modal
        confirmationModal.style.display = 'block';
        
        // Reset form
        supportForm.reset();
    });

    // Modal close functionality
    closeModal.addEventListener('click', function() {
        confirmationModal.style.display = 'none';
    });

    closeBtn.addEventListener('click', function() {
        confirmationModal.style.display = 'none';
    });

    // Close modal when clicking outside of it
    window.addEventListener('click', function(e) {
        if (e.target === confirmationModal) {
            confirmationModal.style.display = 'none';
        }
    });
});

        // FAQ toggle functionality
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', () => {
                const item = question.parentElement;
                item.classList.toggle('active');
            });
        });
        
        // Form submission handling
        document.getElementById('supportForm').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! Our support team will get back to you within 24 hours.');
            this.reset();
        });