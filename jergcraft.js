/**
 * jergcraft.js
 * Version: v2.3.1 (External URL Restore)
 * Optimized for Vercel & Median.co. Uses the direct live URL for maximum reliability.
 */
(function() {
    'use strict';

    // 1. Core Variables Configuration
    const knockoff = true; // Set to true to automatically load the game full-screen
    const VERSION_TAG = 'v2.3.1 (Live URL)';
    const ACCESS_PASSWORD = 'Iamha';
    const GAME_URL = "https://irv77.github.io/EaglerPocketMobile/demo/"; 

    // 2. Core Menu & Modal Builder Engine
    function injectAdminInterface() {
        const styleFix = document.createElement('style');
        styleFix.innerHTML = `
            #jerg-version {
                position: fixed;
                bottom: 12px;
                right: 15px;
                color: rgba(0, 255, 200, 0.35);
                font-family: monospace;
                font-size: 11px;
                z-index: 999999;
                pointer-events: none;
                text-shadow: 1px 1px 2px #000;
                letter-spacing: 0.5px;
            }

            /* High-Priority Button Styling */
            #jerg-admin-trigger {
                position: fixed !important;
                top: 15px !important;
                right: 15px !important;
                width: 45px !important;
                height: 45px !important;
                background-color: #141414 !important;
                border: 2px solid #00ffcc !important;
                border-radius: 50% !important;
                color: #00ffcc !important;
                font-size: 24px !important;
                font-weight: bold !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                cursor: pointer !important;
                z-index: 1000000 !important;
                box-shadow: 0 4px 10px rgba(0,0,0,0.7) !important;
                transition: background-color 0.2s, transform 0.1s;
            }

            #jerg-admin-trigger:active {
                transform: scale(0.9);
                background-color: rgba(0, 255, 200, 0.3);
            }

            /* Password Authentication Modal */
            #jerg-auth-modal {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 280px;
                background: #141414;
                border: 2px solid #ff3333;
                border-radius: 8px;
                padding: 20px;
                color: #fff;
                font-family: 'Segoe UI', sans-serif;
                box-shadow: 0 10px 30px rgba(0,0,0,0.8);
                z-index: 1000001;
                display: none;
                text-align: center;
            }

            #jerg-auth-modal h4 {
                margin: 0 0 15px 0;
                color: #ff3333;
                letter-spacing: 1px;
            }

            .modal-input {
                width: 90%;
                background: #222;
                border: 1px solid #444;
                padding: 10px;
                border-radius: 4px;
                color: #fff;
                text-align: center;
                font-size: 16px;
                margin-bottom: 15px;
                outline: none;
            }

            .modal-input:focus {
                border-color: #ff3333;
            }

            .modal-btn-group {
                display: flex;
                gap: 10px;
            }

            .modal-btn {
                flex: 1;
                padding: 8px;
                border-radius: 4px;
                border: none;
                cursor: pointer;
                font-weight: bold;
            }

            .btn-submit { background: #ff3333; color: #fff; }
            .btn-cancel { background: #444; color: #fff; }

            /* Admin Control Panel */
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
                z-index: 1000001;
                display: none;
                user-select: none;
                -webkit-user-select: none;
            }

            #jerg-admin-panel h3 {
                margin-top: 0;
                margin-bottom: 4px;
                color: #00ffcc;
                text-align: center;
            }

            .panel-version-text {
                font-size: 11px;
                color: #888;
                text-align: center;
                margin-bottom: 12px;
                font-family: monospace;
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
        `;
        document.head.appendChild(styleFix);

        // Background Watermark Overlay
        const versionDisplay = document.createElement('div');
        versionDisplay.id = 'jerg-version';
        versionDisplay.innerText = VERSION_TAG;
        document.body.appendChild(versionDisplay);

        // Floating Trigger Gear Button
        const adminButton = document.createElement('div');
        adminButton.id = 'jerg-admin-trigger';
        adminButton.innerText = '⚙';
        adminButton.addEventListener('click', () => {
            document.getElementById('jerg-auth-pass').value = '';
            document.getElementById('jerg-auth-modal').style.display = 'block';
            document.getElementById('jerg-auth-pass').focus
