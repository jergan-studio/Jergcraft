/**
 * jergcraft.js
 * Version: v1.4.0 (Direct Stable Engine)
 * Handles high-stability routing with an integrated pre-load screen.
 */
(function() {
    'use strict';

    // 1. Core Variables Configuration
    const knockoff = true; 
    const VERSION_TAG = 'v1.4.0 (Stable)';
    const ACCESS_PASSWORD = 'Iamha';
    const GAME_URL = "https://irv77.github.io/EaglerPocketMobile/demo/";

    // 2. Secret Menu Key Handler
    window.addEventListener('keydown', function(event) {
        if (event.code === 'ShiftRight') {
            const enteredPassword = prompt("Enter menu access password:");

            if (enteredPassword === ACCESS_PASSWORD) {
                alert("Access Granted: Initializing menu layers...");
                initializeCustomMenu();
            } else {
                alert("Incorrect password. Access denied.");
            }
        }
    });

    function initializeCustomMenu() {
        console.log("Custom engine configurations unlocked.");
    }

    // 3. Automated Setup Engine
    if (knockoff === true) {
        window.addEventListener('DOMContentLoaded', () => {
            
            // Inject structural styling for the loading screen layer
            const styleFix = document.createElement('style');
            styleFix.innerHTML = `
                html, body {
                    margin: 0 !important;
                    padding: 0 !important;
                    width: 100% !important;
                    height: 100% !important;
                    overflow: hidden !important;
                    background-color: #0d0d0d !important;
                    font-family: 'Segoe UI', sans-serif;
                    -webkit-user-select: none !important;
                    user-select: none !important;
                }
                
                /* High-Stability Loading Overlay Layout */
                #jerg-loader {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, #141414 0%, #050505 100%);
                    color: #fff;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    z-index: 999999;
                }

                .spinner {
                    width: 60px;
                    height: 60px;
                    border: 5px solid #222;
                    border-top: 5px solid #00ffcc;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                    margin-bottom: 20px;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                /* Stationary Version Display Overlay */
                #jerg-version {
                    position: fixed;
                    bottom: 12px;
                    right: 15px;
                    color: rgba(0, 255, 200, 0.35);
                    font-family: monospace;
                    font-size: 11px;
                    z-index: 999998;
                    letter-spacing: 0.5px;
                }
            `;
            document.head.appendChild(styleFix);

            // Clear background components to draw the clean loader interface
            document.body.innerHTML = '';

            // Generate the Loader Interface elements
            const loader = document.createElement('div');
            loader.id = 'jerg-loader';
            loader.innerHTML = `
                <div class="spinner"></div>
                <h2 style="letter-spacing: 3px; margin: 0; color: #00ffcc; font-weight: 700;">JERGCRAFT MOBILE</h2>
                <p style="color: #888; font-size: 13px; margin-top: 8px; letter-spacing: 1px;">Optimizing Environment...</p>
            `;
            document.body.appendChild(loader);

            // Generate App Version Overlay Tag
            const versionDisplay = document.createElement('div');
            versionDisplay.id = 'jerg-version';
            versionDisplay.innerText = VERSION_TAG;
            document.body.appendChild(versionDisplay);

            // Execution sequence: Display loader briefly, then cleanly route the window context
            setTimeout(() => {
                window.location.href = GAME_URL;
            }, 1800); // 1.8-second display duration to ensure visual loader rendering completes
        });
    }
})();
