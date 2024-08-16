async function loadHTML(url) {
    const response = await fetch(url);
    return await response.text();
}

class ContactSection extends HTMLElement {
    constructor() {
        super();
        this.formSubmitted = false;
    }

    async connectedCallback() {
        const content = await loadHTML('components/contact-section.html');
        this.innerHTML = content;
        this.initializeComponent();
    }

    initializeComponent() {
        const form = this.querySelector('#contact-form');
        if (form) {
            form.addEventListener('submit', this.handleSubmit.bind(this));
        }

        const inputs = this.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
        });
    }

    validateField(field) {
        const errorElement = this.querySelector(`#${field.id}-error`);
        if (!errorElement) return;

        if (field.validity.valid) {
            errorElement.textContent = '';
            field.setAttribute('aria-invalid', 'false');
        } else {
            this.showError(field, errorElement);
        }
    }

    showError(field, errorElement) {
        if (field.validity.valueMissing) {
            errorElement.textContent = `${field.name} is required.`;
        } else if (field.validity.typeMismatch) {
            errorElement.textContent = `Please enter a valid ${field.name}.`;
        } else if (field.validity.tooShort) {
            errorElement.textContent = `${field.name} must be at least ${field.minLength} characters long.`;
        }
        field.setAttribute('aria-invalid', 'true');
    }

    handleSubmit(event) {
        event.preventDefault();
        const form = event.target;
        
        if (this.validateForm(form)) {
            this.submitForm(form);
        }
    }

    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            if (!input.validity.valid) {
                this.validateField(input);
                isValid = false;
            }
        });
        return isValid;
    }

    async submitForm(form) {
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        try {
            // Simulating form submission with a delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            this.showFeedback('success', 'Message sent successfully!');
            form.reset();
        } catch (error) {
            this.showFeedback('error', 'Failed to send message. Please try again.');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
        }
    }

    showFeedback(type, message) {
        const feedbackElement = this.querySelector('#form-feedback');
        if (feedbackElement) {
            feedbackElement.textContent = message;
            feedbackElement.className = `mt-4 p-2 rounded ${type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`;
            feedbackElement.setAttribute('role', 'alert');
            feedbackElement.classList.add('animate__animated', 'animate__fadeIn');
            
            // Remove animation classes after animation completes
            setTimeout(() => {
                feedbackElement.classList.remove('animate__animated', 'animate__fadeIn');
            }, 1000);
        }
    }
}

customElements.define('contact-section', ContactSection);