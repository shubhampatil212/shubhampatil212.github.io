async function loadHTML(url) {
    const response = await fetch(url);
    return await response.text();
}

class SkillsSection extends HTMLElement {
    constructor() {
        super();
        this.skillsData = null;
        this.currentCategory = 'all';
    }

    async connectedCallback() {
        const content = await loadHTML('components/skills-section.html');
        this.innerHTML = content;
        this.initializeComponent();
    }

    initializeComponent() {
        this.loadSkillsData();
        this.setupIntersectionObserver();
        this.setupCategoryFilter();
    }

    async loadSkillsData() {
        try {
            const response = await fetch('data/skills.json');
            this.skillsData = await response.json();
            this.renderSkills();
        } catch (error) {
            console.error('Error loading skills data:', error);
        }
    }

    renderSkills() {
        const skillsContainer = this.querySelector('#skills-container');
        if (!skillsContainer || !this.skillsData) return;

        skillsContainer.innerHTML = '';
        const skills = this.currentCategory === 'all' 
            ? this.skillsData 
            : this.skillsData.filter(skill => skill.category === this.currentCategory);

        skills.forEach((skill, index) => {
            const skillElement = document.createElement('div');
            skillElement.className = 'skill-item opacity-0 transition-opacity duration-500 ease-in-out';
            skillElement.innerHTML = `
                <h3 class="text-lg font-semibold mb-2">${skill.name}</h3>
                <div class="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
                    <div class="bg-blue-600 h-2.5 rounded-full" style="width: 0%;" data-progress="${skill.level}"></div>
                </div>
            `;
            skillsContainer.appendChild(skillElement);

            setTimeout(() => {
                skillElement.classList.remove('opacity-0');
            }, index * 100);
        });
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateProgressBars();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        const skillsSection = this.querySelector('#skills-section');
        if (skillsSection) {
            observer.observe(skillsSection);
        }
    }

    animateProgressBars() {
        const progressBars = this.querySelectorAll('.bg-blue-600');
        progressBars.forEach(bar => {
            const targetWidth = bar.dataset.progress;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.transition = 'width 1s ease-in-out';
                bar.style.width = `${targetWidth}%`;
            }, 100);
        });
    }

    setupCategoryFilter() {
        const filterButtons = this.querySelectorAll('.category-filter');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.currentCategory = button.dataset.category;
                this.renderSkills();
                this.updateActiveFilter(button);
            });
        });
    }

    updateActiveFilter(activeButton) {
        const filterButtons = this.querySelectorAll('.category-filter');
        filterButtons.forEach(button => {
            button.classList.remove('bg-blue-600', 'text-white');
            button.classList.add('bg-gray-200', 'text-gray-700');
        });
        activeButton.classList.remove('bg-gray-200', 'text-gray-700');
        activeButton.classList.add('bg-blue-600', 'text-white');
    }
}

customElements.define('skills-section', SkillsSection);