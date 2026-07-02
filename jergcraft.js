/**
 * jergcraft.js
 * Version: v3.0.0 (Core Engine Optimization)
 * Optimized for Vercel & Median.co. Focuses entirely on high-performance execution.
 */
(function() {
    'use strict';

    // 1. Core Variables Configuration
    const knockoff = false; // Set to true to automatically launch the full-screen framework
    const GAME_URL = "https://irv77.github.io/EaglerPocketMobile/demo/"; 

    // 2. Automated Routing Initialization Execution Engine
    function initAppEngine() {
        if (knockoff === true) {
            // Setup explicit layout parameters to clear existing DOM contexts immediately
            const loaderStyle = document.createElement('style');
            loaderStyle.innerHTML = `
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
                    z-index: 999995;
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
            `;
            document.head.appendChild(loaderStyle);

            // Purge document to safely instantiate the rendering layer
            document.body.innerHTML = '';

            const loader = document.createElement('div');
            loader.id = 'jerg-loader';
            loader.innerHTML = `
                <div class="spinner"></div>
                <h2 style="letter-spacing: 3px; margin: 0; color: #00ffcc; font-weight: 700;">JERGCRAFT MOBILE</h2>
                <p style="color: #888; font-size: 13px; margin-top: 8px; letter-spacing: 1px;">Loading Engine...</p>
            `;
            document.body.appendChild(loader);

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
            mobileFrame.style.zIndex = '99990';

            // Grant comprehensive device feature and input permissions
            mobileFrame.setAttribute('allow', 'autoplay; gamepad; fullscreen; keyboard; pointer-lock; xr-spatial-tracking');

            mobileFrame.addEventListener('load', () => {
                setTimeout(() => {
                    loader.style.opacity = '0';
                    setTimeout(() => loader.remove(), 600);
                }, 1500); 
            });

            document.body.appendChild(mobileFrame);
        }
    }

    // Safety fallback checking document status before attachment routines run
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', initAppEngine);
    } else {
        initAppEngine();
    }
})();
