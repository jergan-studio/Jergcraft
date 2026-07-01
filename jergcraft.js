/**
 * jergcraft.js
 * Version: v1.1.0 (Shader Stable)
 * Core injection router optimized for Vercel deployment and Median.co wrapper integration.
 */
(function() {
    'use strict';

    // 1. Core Variables Configuration
    const knockoff = false; 
    const VERSION_TAG = 'v1.1.0 (Shader Stable)';

    // 2. Automated Knockoff Setup Engine
    if (knockoff === true) {
        window.addEventListener('DOMContentLoaded', () => {
            
            // Inject strict styling rules to stop screen bouncing and stabilize rendering engines
            const styleFix = document.createElement('style');
            styleFix.innerHTML = `
                html, body {
                    margin: 0 !important;
                    padding: 0 !important;
                    width: 100% !important;
                    height: 100% !important;
                    overflow: hidden !important;
                    background-color: #000 !important;
                    /* Core mobile stabilization rules */
                    overscroll-behavior: none !important; 
                    touch-action: none !important;
                    -webkit-touch-callout: none !important;
                    -webkit-user-select: none !important;
                    user-select: none !important;
                }
                
                /* Chromium Loading Overlay */
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

                /* Stationary Text Version Tag Overlay */
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

            // Wipe out standard background menus to prioritize the mobile canvas layout
            document.body.innerHTML = '';

            // Generate Loading UI Screen
            const loader = document.createElement('div');
            loader.id = 'jerg-loader';
            loader.innerHTML = `
                <div class="spinner"></div>
                <h2 style="letter-spacing: 3px; margin: 0; color: #00ffcc; font-weight: 700;">JERGCRAFT MOBILE</h2>
                <p style="color: #888; font-size: 13px; margin-top: 8px; letter-spacing: 1px;">Loading Chromium Shaders...</p>
            `;
            document.body.appendChild(loader);

            // Generate App Version Overlay Tag
            const versionDisplay = document.createElement('div');
            versionDisplay.id = 'jerg-version';
            versionDisplay.innerText = VERSION_TAG;
            document.body.appendChild(versionDisplay);

            // Initialize the Fullscreen High-Performance Sandbox Game Canvas Frame
            const mobileFrame = document.createElement('iframe');
            mobileFrame.src = "https://irv77.github.io/EaglerPocketMobile/demo/";
            mobileFrame.style.width = '100%';
            mobileFrame.style.height = '100%';
            mobileFrame.style.border = 'none';
            mobileFrame.style.display = 'block';
            mobileFrame.style.position = 'absolute';
            mobileFrame.style.top = '0';
            mobileFrame.style.left = '0';
            mobileFrame.style.zIndex = '99995';

            // High-performance feature policies to allow shader execution on mobile hardware runtimes
            mobileFrame.setAttribute('allow', 'autoplay; gamepad; fullscreen; keyboard; pointer-lock; xr-spatial-tracking');
            mobileFrame.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-pointer-lock allow-forms');

            // Listen for structural frame rendering changes to hide loading layouts cleanly
            mobileFrame.addEventListener('load', () => {
                setTimeout(() => {
                    loader.style.opacity = '0';
                    setTimeout(() => loader.remove(), 600);
                }, 2000); // 2-second canvas buffering time to safely compile WebGL shader pipelines
            });

            // Embed runtime engine element and focus canvas context inputs
            document.body.appendChild(mobileFrame);
            mobileFrame.focus();
        });
    }
})();
