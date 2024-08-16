async function loadHTML(url) {
    const response = await fetch(url);
    return await response.text();
}

class HeaderComponent extends HTMLElement {
    constructor() {
        super();
        this.mobileMenuOpen = false;
    }

    async connectedCallback() {
        const content = await loadHTML('components/header-component.html');
        this.innerHTML = content;
        this.initializeComponent();
    }

    initializeComponent() {
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupScrollSpy();
    }

    setupMobileMenu() {
        const mobileMenuButton = this.querySelector('#mobile-menu-button');
        const mobileMenu = this.querySelector('#mobile-menu');

        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', () => {
                this.mobileMenuOpen = !this.mobileMenuOpen;
                mobileMenu.classList.toggle('hidden', !this.mobileMenuOpen);
                mobileMenuButton.setAttribute('aria-expanded', this.mobileMenuOpen);
            });
        }
    }

    setupSmoothScrolling() {
        const navLinks = this.querySelectorAll('a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                    this.closeMobileMenu();
                }
            });
        });
    }

    setupScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = this.querySelectorAll('nav a[href^="#"]');

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.pageYOffset >= sectionTop - sectionHeight / 3) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('text-blue-500');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('text-blue-500');
                }
            });
        });
    }

    closeMobileMenu() {
        const mobileMenu = this.querySelector('#mobile-menu');
        const mobileMenuButton = this.querySelector('#mobile-menu-button');
        if (mobileMenu && mobileMenuButton) {
            this.mobileMenuOpen = false;
            mobileMenu.classList.add('hidden');
            mobileMenuButton.setAttribute('aria-expanded', 'false');
        }
    }
}

customElements.define('header-component', HeaderComponent);