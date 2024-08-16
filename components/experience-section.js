async function loadHTML(url) {
    const response = await fetch(url);
    return await response.text();
}

class ExperienceSection extends HTMLElement {
    constructor() {
        super();
        this.observer = null;
    }

    async connectedCallback() {
        const content = await loadHTML('components/experience-section.html');
        this.innerHTML = content;
        this.initializeComponent();
    }

    initializeComponent() {
        this.setupIntersectionObserver();
        this.setupExpandCollapse();
        this.animateSkillTags();
    }

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        this.observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        const experienceItems = this.querySelectorAll('.experience-item');
        experienceItems.forEach(item => this.observer.observe(item));
    }

    setupExpandCollapse() {
        const toggleButtons = this.querySelectorAll('.toggle-details');
        toggleButtons.forEach(button => {
            button.addEventListener('click', () => {
                const details = button.nextElementSibling;
                if (details) {
                    details.classList.toggle('hidden');
                    button.textContent = details.classList.contains('hidden') ? 'Show More' : 'Show Less';
                }
            });
        });
    }

    animateSkillTags() {
        const skillTags = this.querySelectorAll('.skill-tag');
        skillTags.forEach((tag, index) => {
            setTimeout(() => {
                tag.classList.add('animate__animated', 'animate__fadeIn');
            }, index * 100);
        });
    }

    disconnectedCallback() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

customElements.define('experience-section', ExperienceSection);