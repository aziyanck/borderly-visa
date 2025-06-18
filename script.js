// This script runs after the HTML document has been fully loaded.
document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navbar Logic ---
    // This section handles the functionality for the mobile navigation menu.
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');

    // Toggles the visibility of the mobile menu when the hamburger button is clicked.
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Hides the mobile menu when any of its links are clicked.
    // This is useful for single-page applications where links scroll to sections.
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

    // --- CounterUp Animation Logic ---
    // This part handles the counting animation for stats like "10000+ Visas Processed".
    const { counterUp } = window.counterUp;
    const counterElements = document.querySelectorAll('.counter');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                counterUp(el, { duration: 2000, delay: 16 });
                observer.unobserve(el); // Stop observing once animated.
            }
        });
    }, { threshold: 0.1 });

    counterElements.forEach(el => {
        observer.observe(el);
    });

});
