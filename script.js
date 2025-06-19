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
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });


})