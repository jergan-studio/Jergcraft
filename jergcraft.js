/**
 * jergcraft.js
 * Version: v2.2.0 (Custom Input Modal Build)
 * Optimized for Vercel & Median.co. Replaces native prompts with an HTML input field.
 */
(function() {
    'use strict';

    // 1. Core Variables Configuration
    const knockoff = false; 
    const VERSION_TAG = 'v2.2.0 (Modal Input)';
    const ACCESS_PASSWORD = 'Iamha';
    const GAME_URL = "./game/index.html"; 

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
                z-index: 999994;
                pointer-events: none;
                text-shadow: 1px 1px 2px #000;
                letter-spacing: 0.5px;
            }

            #jerg-admin-trigger {
                position: fixed;
                top: 15px;
                right: 15px;
                width: 40px;
                height: 40px;
                background-color: rgba(20, 20, 20, 0.85);
                border: 2px solid #00ffcc;
                border-radius: 50%;
                color: #00ffcc;
                font-size: 20px;
                font-weight: bold;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 999998;
                box-shadow: 0 4px 8px rgba(0,0,0,0.5);
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
                z-index: 999999;
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
                z-index: 999999;
                display: none;
                user-select: none;
                -webkit-user-select: none;
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
        `;
        document.head.appendChild(styleFix);

        // Version Display Overlay
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
            document.getElementById('jerg-auth-pass').focus();
        });
        document.body.appendChild(adminButton);

        // Secure Authentication Input Modal Layout
        const authModal = document.createElement('div');
        authModal.id = 'jerg-auth-modal';
        authModal.innerHTML = `
            <h4>ACCESS REQUIRED</h4>
            <input type="password" id="jerg-auth-pass" class="modal-input" placeholder="Enter Password">
            <div class="modal-btn-group">
                <button class="modal-btn btn-submit" id="auth-submit-btn">SUBMIT</button>
                <button class="modal-btn btn-cancel" id="auth-cancel-btn">CANCEL</button>
            </div>
        `;
        document.body.appendChild(authModal);

        // Control Panel Utilities Layout
        const adminPanel = document.createElement('div');
        adminPanel.id = 'jerg-admin-panel';
        adminPanel.innerHTML = `
            <h3>ADMIN UTILITIES</h3>
            <div class="panel-row">
                <span>Performance Mode</span>
                <input type="checkbox" id="opt-toggle" checked>
            </div>
            <div class="panel-row">
                <span>Fast Game Ticks</span>
                <input type="checkbox" id="speed-toggle">
            </div>
            <button class="panel-btn" id="close-panel-btn">CLOSE PANEL</button>
        `;
        document.body.appendChild(adminPanel);

        // Auth Modal Interaction Controls
        document.getElementById('auth-cancel-btn').addEventListener('click', () => {
            authModal.style.display = 'none';
        });

        document.getElementById('auth-submit-btn').addEventListener('click', validateModalPassword);
        document.getElementById('jerg-auth-pass').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') validateModalPassword();
        });

        function validateModalPassword() {
            const val = document.getElementById('jerg-auth-pass').value;
            if (val === ACCESS_PASSWORD) {
                authModal.style.display = 'none';
                document.getElementById('jerg-admin-panel').style.display = 'block';
            } else {
                alert("Incorrect password. Access denied.");
                document.getElementById('jerg-auth-pass').value = '';
            }
        }

        // Panel Close Control
        document.getElementById('close-panel-btn').addEventListener('click', () => {
            adminPanel.style.display = 'none';
        });

        // Local Storage Engine Integration Check
        document.getElementById('speed-toggle').addEventListener('change', (e) => {
            const frame = document.getElementById('game-canvas-frame') || document.getElementById('game-frame
