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

    // --- CounterUp Animation Logic ---
    // This part handles the counting animation for stats.
    const { counterUp } = window.counterUp;
    const counterElements = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                counterUp(el, { duration: 2000, delay: 16 });
                observer.unobserve(el); // Stop observing once animated.
            }
        });
    }, { threshold: 0.1 });

    counterElements.forEach(el => {
        counterObserver.observe(el);
    });


    // --- Scroll-triggered Pop-up Logic ---
    // This section handles the pop-up that appears when scrolling to the features section.
    const featureSection = document.getElementById('features');
    const featurePopup = document.getElementById('feature-popup');
    const closePopupButton = document.getElementById('close-popup');

    const popupObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // If the feature section is intersecting (visible)
            if (entry.isIntersecting) {
                featurePopup.classList.remove('hidden');
                // Use a timeout to allow the 'hidden' class to be removed before adding 'visible'
                // This ensures the CSS transition is applied correctly.
                setTimeout(() => {
                    featurePopup.classList.add('visible');
                }, 10);
                
                // Stop observing the feature section to ensure the pop-up only appears once.
                observer.unobserve(featureSection);
            }
        });
    }, {
        root: null, // relative to the viewport
        threshold: 0.5 // trigger when 50% of the section is visible
    });

    // Start observing the feature section.
    if (featureSection) {
        popupObserver.observe(featureSection);
    }

    // Add event listener to the close button to hide the pop-up.
    if (closePopupButton) {
        closePopupButton.addEventListener('click', () => {
            featurePopup.classList.remove('visible');
            // Optional: add the hidden class back after the transition
            setTimeout(() => {
                featurePopup.classList.add('hidden');
            }, 500); // Should match the transition duration
        });
    }

});
