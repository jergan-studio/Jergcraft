/**
 * jergcraft.js
 * Version: v1.9.0 (Admin Panel + Speed Optimization)
 * Optimized for Vercel & Median.co. Adds an accelerated speed toggle to the menu.
 */
(function() {
    'use strict';

    // 1. Core Variables Configuration
    const knockoff = true; 
    const VERSION_TAG = 'v1.9.0 (Speed Update)';
    const ACCESS_PASSWORD = 'Iamha';
    const GAME_URL = "https://irv77.github.io/EaglerPocketMobile/demo/";

    // 2. Automated Knockoff Setup Engine
    if (knockoff === true) {
        window.addEventListener('DOMContentLoaded', () => {
            
            // Inject structural styling for layouts, loaders, and the admin interface
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
                    z-index: 999994;
                    pointer-events: none;
                    text-shadow: 1px 1px 2px #000;
                    letter-spacing: 0.5px;
                }

                /* Floating Administrative Trigger Button */
                #jerg-admin-trigger {
                    position: fixed;
                    top: 15px;
                    right: 15px;
                    width: 40px;
                    height: 40px;
                    background-color: rgba(20, 20, 20, 0.7);
                    border: 2px solid #00ffcc;
                    border-radius: 50%;
                    color: #00ffcc;
                    font-size: 20px;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    z-index: 999990;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.5);
                    transition: background-color 0.2s, transform 0.1s;
                }

                #jerg-admin-trigger:active {
                    transform: scale(0.9);
                    background-color: rgba(0, 255, 200, 0.3);
                }

                /* Admin Control Panel Overlay Container */
                #jerg-admin-panel {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 300px;
                    background: #1a1a1a;
                    border: 3px solid #00ffcc;
                    border-radius: 10px;
                    padding: 20px;
                    color: #fff;
                    font-family: 'Segoe UI', sans-serif;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.7);
                    z-index: 999995;
                    display: none;
                }

                #jerg-admin-panel h3 {
                    margin-top: 0;
                    color: #00ffcc;
                    text-align: center;
                    border-bottom: 1px solid #333;
                    padding-bottom: 10px;
                }

                .panel-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin: 15px 0;
                }

                .panel-btn {
                    width: 100%;
                    background-color: #333;
                    border: 1px solid #555;
                    color: #fff;
                    padding: 10px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: bold;
                    margin-top: 10px;
                }

                .panel-btn:active {
                    background-color: #444;
                }
            `;
            document.head.appendChild(styleFix);

            // Wipe parent page container HTML
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

            // Generate Floating Administrative Button
            const adminButton = document.createElement('div');
            adminButton.id = 'jerg-admin-trigger';
            adminButton.innerText = '⚙';
            adminButton.addEventListener('click', handleAdminAccess);
            document.body.appendChild(adminButton    
