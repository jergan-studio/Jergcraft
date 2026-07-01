/**
 * jergcraft.js
 * Version: v1.6.0 (Combo Input Capture)
 * Optimized for Vercel & Median.co. Uses "/" + "J" key combination.
 */
(function() {
    'use strict';

    // 1. Core Variables Configuration
    const knockoff = false; 
    const VERSION_TAG = 'v1.6.0 (Combo Input)';
    const ACCESS_PASSWORD = 'Iamha';
    const GAME_URL = "https://irv77.github.io/EaglerPocketMobile/demo/";

    // Track state of pressed keys for the combo system
    const activeKeys = {
        Slash: false,
        KeyJ: false
    };

    // 2. Secret Menu Key Combination Handler
    function checkComboAndPrompt() {
        if (activeKeys.Slash && activeKeys.KeyJ) {
            // Reset state immediately so it doesn't trigger multiple times
            activeKeys.Slash = false;
            activeKeys.KeyJ = false;

            const enteredPassword = prompt("Enter menu access password:");

            if (enteredPassword === ACCESS_PASSWORD) {
                alert("Access Granted: Initializing utility layers...");
                initializeCustomMenu();
            } else {
                alert("Incorrect password. Access denied.");
            }
        }
    }

    // Capture when keys are pressed down
    window.addEventListener('keydown', function(event) {
        if (event.code === 'Slash') activeKeys.Slash = true;
        if (event.code === 'KeyJ') activeKeys.KeyJ = true;
        checkComboAndPrompt();
    });

    // Reset tracking variables when keys are released
    window.addEventListener('keyup', function(event) {
        if (event.code === 'Slash') activeKeys.Slash = false;
        if (event.code === 'KeyJ') activeKeys.KeyJ = false;
    });

    function initializeCustomMenu() {
        console.log("Custom engine configurations unlocked.");
        // Add your overlay, interface modification, or client-side adjustments here
    }

    // 3. Automated Knockoff Setup Engine
    if (knockoff === true) {
        window.addEventListener('DOMContentLoaded', () => {
            
            // Inject structural styling for the layout boundaries and loader
            const styleFix = document.createElement('style');
            styleFix.innerHTML = `
                html, body {
                    margin: 0 !important;
                    padding: 0 !important;
                    width: 100% !important;
                    height: 100% !important;
                    overflow: hidden !important;
                    background-color: #000 !important;
                    overscroll-behavior: none !important; 
                    touch-action: none !important;
                    -webkit-touch-callout: none !important;
                    -webkit-user-select: none !important;
                    user-select: none !important;
                }
                
                /* High-Visibility Loading Overlay Layout */
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
                    font-family: 'Segoe UI', sans-serif;
                    z-index: 999999;
                    transition: opacity 0.6s ease;
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
                    pointer-events: none;
                    text-shadow: 1px 1px 2px #000;
                    letter-spacing: 0.5px;
                }
            `;
            document.head.appendChild(styleFix);

            // Clear out standard page background structures
            document.body.innerHTML = '';

            // Generate Loading UI Screen
            const loader = document.createElement('div');
            loader.id = 'jerg-loader';
            loader.innerHTML = `
                <div class="spinner"></div>
                <h2 style="letter-spacing: 3px; margin: 0; color: #00ffcc; font-weight: 700;">JERGCRAFT MOBILE</h2>
                <p style="color: #888; font-size: 13px; margin-top: 8px; letter-spacing: 1px;">Loading Assets...</p>
            `;
            document.body.appendChild(loader);

            // Generate App Version Overlay Tag
            const versionDisplay = document.createElement('div');
            versionDisplay.id = 'jerg-version';
            versionDisplay.innerText = VERSION_TAG;
            document.body.appendChild(versionDisplay);

            // Create a clean element frame without restrictive local sandbox rules
            const mobileFrame = document.createElement('iframe');
            mobileFrame.src = GAME_URL;
            mobileFrame.id = 'game-canvas-frame';
            mobileFrame.style.width = '100%';
            mobileFrame.style.height = '100%';
            mobileFrame.style.border = 'none';
            mobileFrame.style.display = 'block';
            mobileFrame.style.position = 'absolute';
            mobileFrame.style.top = '0';
            mobileFrame.style.left = '0';
            mobileFrame.style.zIndex = '99995';

            // Allow all underlying hardware pipelines (Pointer Lock, WebGL, Fullscreen)
            mobileFrame.setAttribute('allow', 'autoplay; gamepad; fullscreen; keyboard; pointer-lock; xr-spatial-tracking');

            // Hide loader screen layers smoothly once engine compilation clears
            mobileFrame.addEventListener('load', () => {
                setTimeout(() => {
                    loader.style.opacity = '0';
                    setTimeout(() => loader.remove(), 600);
                }, 2000); 
            });

            // Append frame element directly into container space
            document.body.appendChild(mobileFrame);
            
            // Ensure main window stays targetable initially
            window.focus();
        });
    }
})();
