/**
 * jergcraft.js
 * If knockoff equals true, instantly redirects the layout 
 * to load the full-screen mobile Eaglercraft view.
 */
(function() {
    'use strict';

    // 1. Define your condition variable
    // Change this to true or false depending on your needs
    const knockoff = false; 

    // 2. Execution logic
    if (knockoff === true) {
        // Wait for the DOM to be ready so we can safely modify the page body
        window.addEventListener('DOMContentLoaded', () => {
            
            // Apply global CSS resets to make the layout perfectly full-screen
            document.documentElement.style.margin = '0';
            document.documentElement.style.padding = '0';
            document.documentElement.style.width = '100%';
            document.documentElement.style.height = '100%';
            document.documentElement.style.overflow = 'hidden';
            
            document.body.style.margin = '0';
            document.body.style.padding = '0';
            document.body.style.width = '100%';
            document.body.style.height = '100%';
            document.body.style.overflow = 'hidden';
            document.body.style.backgroundColor = '#000';

            // Clear out any existing HTML elements on the screen (like background menus)
            document.body.innerHTML = '';

            // Create the full-screen iframe elements
            const mobileFrame = document.createElement('iframe');
            
            // Set properties and mobile links
            mobileFrame.src = "https://irv77.github.io/EaglerPocketMobile/demo/";
            mobileFrame.style.width = '100%';
            mobileFrame.style.height = '100%';
            mobileFrame.style.border = 'none';
            mobileFrame.style.display = 'block';
            mobileFrame.style.position = 'absolute';
            mobileFrame.style.top = '0';
            mobileFrame.style.left = '0';
            mobileFrame.style.zIndex = '99999';

            // Assign permissions so touch inputs, keyboards, and mouse locks function correctly
            mobileFrame.setAttribute('allow', 'autoplay; gamepad; fullscreen; keyboard; pointer-lock');
            mobileFrame.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-pointer-lock allow-forms');

            // Inject the frame directly into the clean page body
            document.body.appendChild(mobileFrame);
            
            // Force focus onto the frame so player inputs work immediately
            mobileFrame.focus();
        });
    }
})();
