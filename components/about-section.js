async function loadHTML(url) {
    const response = await fetch(url);
    return await response.text();
}

class AboutSection extends HTMLElement {
    constructor() {
        super();
        this.expandedDetails = false;
    }

    async connectedCallback() {
        const content = await loadHTML('components/about-section.html');
        this.innerHTML = content;
        this.initializeComponent();
    }

    initializeComponent() {
        this.setupExpandDetails();
        this.animateSkills();
    }

    setupExpandDetails() {
        const expandButton = this.querySelector('#expand-details');
        const additionalDetails = this.querySelector('#additional-details');
        
        if (expandButton && additionalDetails) {
            expandButton.addEventListener('click', () => {
                this.expandedDetails = !this.expandedDetails;
                additionalDetails.classList.toggle('hidden');
                expandButton.textContent = this.expandedDetails ? 'Show Less' : 'Show More';
            });
        }
    }

    animateSkills() {
        const skills = this.querySelectorAll('.skill-item');
        skills.forEach((skill, index) => {
            setTimeout(() => {
                skill.classList.add('animate__animated', 'animate__fadeIn');
            }, index * 200);
        });
    }

    updateProfileImage(imageUrl) {
        const profileImage = this.querySelector('#profile-image');
        if (profileImage && imageUrl) {
            profileImage.src = imageUrl;
            profileImage.alt = "Updated profile picture";
        }
    }
}

customElements.define('about-section', AboutSection);