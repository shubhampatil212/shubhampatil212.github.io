async function loadHTML(url) {
    const response = await fetch(url);
    return await response.text();
}

class ProjectsSection extends HTMLElement {
    constructor() {
        super();
        this.projects = [];
        this.currentFilter = 'all';
    }

    async connectedCallback() {
        const content = await loadHTML('components/projects-section.html');
        this.innerHTML = content;
        this.initializeComponent();
    }

    initializeComponent() {
        this.loadProjects();
        this.setupFilterButtons();
        this.setupIntersectionObserver();
        this.addHoverEffects();
    }

    loadProjects() {
        // Simulated project data - in a real scenario, this would be fetched from an API or database
        this.projects = [
            { id: 1, title: 'ML Project 1', category: 'Machine Learning', description: 'A machine learning project description.' },
            { id: 2, title: 'Web App 1', category: 'Web Development', description: 'A web development project description.' },
            { id: 3, title: 'Software 1', category: 'Software Development', description: 'A software development project description.' },
            // Add more projects as needed
        ];
        this.renderProjects();
    }

    renderProjects() {
        const projectsContainer = this.querySelector('#projects-container');
        if (!projectsContainer) return;

        projectsContainer.innerHTML = '';
        const filteredProjects = this.currentFilter === 'all' 
            ? this.projects 
            : this.projects.filter(project => project.category === this.currentFilter);

        filteredProjects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card bg-white rounded-lg shadow-md p-6 transition-all duration-300 ease-in-out transform hover:scale-105';
            projectCard.innerHTML = `
                <h3 class="text-xl font-bold mb-2">${project.title}</h3>
                <p class="text-gray-600 mb-4">${project.description}</p>
                <span class="inline-block bg-blue-200 rounded-full px-3 py-1 text-sm font-semibold text-blue-700">${project.category}</span>
            `;
            projectCard.addEventListener('click', () => this.openProjectDetails(project));
            projectsContainer.appendChild(projectCard);
        });
    }

    setupFilterButtons() {
        const filterButtons = this.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.currentFilter = button.dataset.filter;
                this.renderProjects();
                
                // Update active button state
                filterButtons.forEach(btn => btn.classList.remove('bg-blue-500', 'text-white'));
                button.classList.add('bg-blue-500', 'text-white');
            });
        });
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        this.querySelectorAll('.project-card').forEach(card => {
            observer.observe(card);
        });
    }

    addHoverEffects() {
        this.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.classList.add('shadow-lg');
            });
            card.addEventListener('mouseleave', () => {
                card.classList.remove('shadow-lg');
            });
        });
    }

    openProjectDetails(project) {
        // Simple modal implementation
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white p-8 rounded-lg max-w-2xl w-full">
                <h2 class="text-2xl font-bold mb-4">${project.title}</h2>
                <p class="mb-4">${project.description}</p>
                <p class="mb-4"><strong>Category:</strong> ${project.category}</p>
                <button id="close-modal" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Close</button>
            </div>
        `;
        document.body.appendChild(modal);

        const closeButton = modal.querySelector('#close-modal');
        closeButton.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }
}

customElements.define('projects-section', ProjectsSection);