// Function to load HTML content
async function loadHTML(url) {
    const response = await fetch(url);
    return await response.text();
}

class FooterComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        const content = await loadHTML('components/footer-component.html');
        this.shadowRoot.innerHTML = content;
        this.initializeComponent();
    }

    initializeComponent() {
        this.updateCopyrightYear();
        this.setupBackToTopButton();
        this.addSocialIconHoverEffects();
    }

    updateCopyrightYear() {
        const copyrightElement = this.shadowRoot.querySelector('#copyright-year');
        if (copyrightElement) {
            copyrightElement.textContent = new Date().getFullYear();
        }
    }

    setupBackToTopButton() {
        const backToTopButton = this.shadowRoot.querySelector('#back-to-top');
        if (backToTopButton) {
            backToTopButton.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });

            // Show/hide button based on scroll position
            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 100) {
                    backToTopButton.classList.remove('hidden');
                } else {
                    backToTopButton.classList.add('hidden');
                }
            });
        }
    }

    addSocialIconHoverEffects() {
        const socialIcons = this.shadowRoot.querySelectorAll('.social-icon');
        socialIcons.forEach(icon => {
            icon.addEventListener('mouseenter', () => {
                icon.classList.add('text-primary', 'transform', 'scale-110');
            });
            icon.addEventListener('mouseleave', () => {
                icon.classList.remove('text-primary', 'transform', 'scale-110');
            });
        });
    }
}

customElements.define('footer-component', FooterComponent);