async function loadHTML(url) {
    const response = await fetch(url);
    return await response.text();
}

class HeroSection extends HTMLElement {
    constructor() {
        super();
        this.profileImageUrl = '';
    }

    async connectedCallback() {
        const content = await loadHTML('components/hero-section.html');
        this.innerHTML = content;
        this.initializeComponent();
    }

    initializeComponent() {
        this.setupSmoothScroll();
    }

    setupSmoothScroll() {
        const ctaButtons = this.querySelectorAll('a[href^="#"]');
        ctaButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = button.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    updateProfileImage(imageUrl) {
        this.profileImageUrl = imageUrl;
        const profileImage = this.querySelector('#profile-image');
        if (profileImage) {
            profileImage.src = imageUrl;
            profileImage.alt = "temp's Profile Picture";
        }
    }
}

customElements.define('hero-section', HeroSection);