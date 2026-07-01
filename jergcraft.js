/**
 * jergcraft.js
 * Version: v1.0.0
 * If knockoff equals true, triggers an optimized mobile environment with 
 * stabilization layers, a custom loading sequence, and version overlays.
 */
(function() {
    'use strict';

    // 1. Configuration Toggle
    const knockoff = false; 
    const VERSION_TAG = 'v1.0.0';

    // 2. Execution logic
    if (knockoff === true) {
        window.addEventListener('DOMContentLoaded', () => {
            
            // Apply strict full-screen mobile resets to stabilize layout scrolling
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
                
                /* Custom Mobile Loading Screen Layout */
                #jerg-loader {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, #1c1c1c 0%, #0d0d0d 100%);
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
                    width: 50px;
                    height: 50px;
                    border: 5px solid #333;
                    border-top: 5px solid #55ff55;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 20px;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                /* Stationary Version Display Overlay */
                #jerg-version {
                    position: fixed;
                    bottom: 10px;
                    right: 15px;
                    color: rgba(255, 255, 255, 0.4);
                    font-family: monospace;
                    font-size: 12px;
                    z-index: 999998; /* Stays right beneath the loader but above the game */
                    pointer-events: none;
                    text-shadow: 1px 1px 2px #000;
                }
            `;
            document.head.appendChild(styleFix);

            // Clear the existing HTML wrapper completely
            document.body.innerHTML = '';

            // Construct and Inject the Loading Screen
            const loader = document.createElement('div');
            loader.id = 'jerg-loader';
            loader.innerHTML = `
                <div class="spinner"></div>
                <h2 style="letter-spacing: 2px; margin: 0;">LOADING JERGCRAFT...</h2>
                <p style="color: #666; font-size: 14px; margin-top: 5px;">Optimizing Mobile Controls</p>
            `;
            document.body.appendChild(loader);

            // Construct and Inject the Version Label
            const versionDisplay = document.createElement('div');
            versionDisplay.id = 'jerg-version';
            versionDisplay.innerText = VERSION_TAG;
            document.body.appendChild(versionDisplay);

            // Create the full-screen game canvas container iframe
            const mobileFrame = document.createElement('iframe');
            mobileFrame.src = "https://irv77.github.io/EaglerPocketMobile/demo/";
            mobileFrame.style.width = '100%';
            mobileFrame.style.height = '100%';
            mobileFrame.style.border = 'none';
            mobileFrame.style.display = 'block';
            mobileFrame.style.position = 'absolute';
            mobileFrame.style.top = '0';
            mobileFrame.style.left = '0';
            mobileFrame.style.zIndex = '99999';

            // Add permissions required to stabilize locks and inputs natively
            mobileFrame.setAttribute('allow', 'autoplay; gamepad; fullscreen; keyboard; pointer-lock');
            mobileFrame.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-pointer-lock allow-forms');

            // Fade out loader screen once the external frame resources resolve
            mobileFrame.addEventListener('load', () => {
                setTimeout(() => {
                    loader.style.opacity = '
