/**
 * jergcraft.js
 * Version: v4.1.0 (Dynamic JergServer Input Loader)
 * Optimized for Vercel & Median.co. Adds an on-screen custom domain utility.
 */
(function() {
    'use strict';

    // 1. Core Variables Configuration
    const knockoff = false; // Set to true to automatically launch full-screen framework
    const GAME_URL = "https://irv77.github.io/EaglerPocketMobile/demo/"; 
    
    // Default Fallback Server
    const DEFAULT_SERVER_NAME = "JergServer Main";
    const DEFAULT_SERVER_WSS  = "wss://jerggames-server.onrender.com";

    // Helper to inject servers into localStorage safely
    function injectServerIntoStorage(name, address) {
        try {
            let serverList = localStorage.getItem('eaglercraft_servers');
            let parsedList = [];
            
            if (serverList) {
                try { parsedList = JSON.parse(serverList); } catch(e) { parsedList = []; }
            }

            // Remove existing version of this address to avoid duplicates and update the name
            parsedList = parsedList.filter(srv => srv.addr !== address);

            // Add new server to the top of the list
            parsedList.unshift({
                name: name,
                addr: address,
                hide: false
            });
            
            localStorage.setItem('eaglercraft_servers', JSON.stringify(parsedList));
            console.log(`[JergServer Matrix] Successfully registered: ${name} (${address})`);
            return true;
        } catch (err) {
            console.error("[JergServer Matrix] Storage write failed:", err);
            return false;
        }
    }

    // 2. Automated Routing Initialization Execution Engine
    function initAppEngine() {
        if (knockoff === true) {
            // Setup explicit layout parameters and custom UI elements
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
                    width: 50px;
                    height: 50px;
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
                
                /* Custom Load JergServer Controls */
                .jerg-load-btn {
                    margin-top: 25px;
                    background: #141414;
                    color: #00ffcc;
                    border: 2px solid #00ffcc;
                    padding: 10px 20px;
                    font-size: 14px;
                    font-weight: bold;
                    letter-spacing: 1px;
                    border-radius: 5px;
                    cursor: pointer;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.5);
                    transition: all 0.2s ease;
                    z-index: 999999;
                }
                .jerg-load-btn:active {
                    background: #00ffcc;
                    color: #141414;
                    transform: scale(0.95);
                }

                /* Input Prompt Popup Modal */
                #jerg-input-modal {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 300px;
                    background: #141414;
                    border: 2px solid #00ffcc;
                    border-radius: 8px;
                    padding: 20px;
                    color: #fff;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.8);
                    z-index: 1000005;
                    display: none;
                    text-align: center;
                }
                #jerg-input-modal h4 {
                    margin: 0 0 15px 0;
                    color: #00ffcc;
                    letter-spacing: 1px;
                }
                .jerg-modal-input {
                    width: 90%;
                    background: #222;
                    border: 1px solid #444;
                    padding: 10px;
                    border-radius: 4px;
                    color: #fff;
                    text-align: center;
                    font-size: 14px;
                    margin-bottom: 10px;
                    outline: none;
                }
                .jerg-modal-input:focus {
                    border-color: #00ffcc;
                }
                .jerg-modal-btn-group {
                    display: flex;
                    gap: 10px;
                    margin-top: 5px;
                }
                .jerg-modal-btn {
                    flex: 1;
                    padding: 8px;
                    border-radius: 4px;
                    border: none;
                    cursor: pointer;
                    font-weight: bold;
                }
                .jerg-btn-submit { background: #00ffcc; color: #141414; }
                .jerg-btn-cancel { background: #444; color: #fff; }
            `;
            document.head.appendChild(loaderStyle);

            // Purge document to cleanly set up layers
            document.body.innerHTML = '';

            // Inject the Default Server layout configurations right away
            injectServerIntoStorage(DEFAULT_SERVER_NAME, DEFAULT_SERVER_WSS);

            // Construct Loader Screen UI
            const loader = document.createElement('div');
            loader.id = 'jerg-loader';
            loader.innerHTML = `
                <div class="spinner"></div>
                <h2 style="letter-spacing: 3px; margin: 0; color: #00ffcc; font-weight: 700;">JERGCRAFT MOBILE</h2>
                <p style="color: #888; font-size: 13px; margin-top: 8px; letter-spacing: 1px;">Loading Framework Assets...</p>
                <button class="jerg-load-btn" id="load-jergserver-trigger">LOAD JERGSERVER</button>
            `;
            document.body.appendChild(loader);

            // Construct Custom Domain Input Dialog Box
            const inputModal = document.createElement('div');
            inputModal.id = 'jerg-input-modal';
            inputModal.innerHTML = `
                <h4>CONNECT CUSTOM DOMAIN</h4>
                <input type="text" id="jerg-srv-name" class="jerg-modal-input" placeholder="Server Name (e.g., My Server)">
                <input type="text" id="jerg-srv-url" class="jerg-modal-input" placeholder="wss://your-domain.com">
                <div class="jerg-modal-btn-group">
                    <button class="jerg-modal-btn jerg-btn-submit" id="jerg-submit-domain">ADD SERVER</button>
                    <button class="jerg-modal-btn jerg-btn-cancel" id="jerg-cancel-domain">CANCEL</button>
                </div>
            `;
            document.body.appendChild(inputModal);

            // --- INPUT BOX LOGIC AND EVENT LISTENERS ---
            const triggerBtn = document.getElementById('load-jergserver-trigger');
            const submitBtn = document.getElementById('jerg-submit-domain');
            const cancelBtn = document.getElementById('jerg-cancel-domain');
            const srvNameInput = document.getElementById('jerg-srv-name');
            const srvUrlInput = document.getElementById('jerg-srv-url');

            triggerBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Avoid clicking elements underneath
                srvNameInput.value = "";
                srvUrlInput.value = "wss://";
                inputModal.style.display = 'block';
                srvNameInput.focus();
            });

            cancelBtn.addEventListener('click', () => {
                inputModal.style.display = 'none';
            });

            submitBtn.addEventListener('click', processCustomDomainInput);

            function processCustomDomainInput() {
                const name = srvNameInput.value.trim() || "Custom JergServer";
                const url = srvUrlInput.value.trim();

                if (!url.startsWith("ws://") && !url.startsWith("wss://")) {
                    alert("Invalid Protocol! Your domain address must start with wss:// or ws://");
                    return;
                }

                // Inject custom entry directly into internal client engine configurations
                const success = injectServerIntoStorage(name, url);
                
                if (success) {
                    alert(`Successfully added "${name}" to your multiplayer index!`);
                    inputModal.style.display = 'none';
                } else {
                    alert("Error saving configuration data.");
                }
            }

            // Create primary Game Window Core Canvas Frame
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

            mobileFrame.setAttribute('allow', 'autoplay; gamepad; fullscreen; keyboard; pointer-lock; xr-spatial-tracking');

            mobileFrame.addEventListener('load', () => {
                // If the load screen screen is clear, hide loading curtains automatically
                setTimeout(() => {
                    // Only auto-remove if the user isn't currently using the pop-up menu container box
                    if (inputModal.style.display !== 'block') {
                        loader.style.opacity = '0';
                        setTimeout(() => loader.remove(), 600);
                    } else {
                        // If they are typing, look out for when they close the modal box to remove the screen wrapper
                        const closeChecker = setInterval(() => {
                            if (inputModal.style.display !== 'block') {
                                clearInterval(closeChecker);
                                loader.style.opacity = '0';
                                setTimeout(() => loader.remove(), 600);
                            }
                        }, 500);
                    }
                }, 2500); 
            });

            document.body.appendChild(mobileFrame);
        }
    }

    // Safety fallback checking status before initializing scripts
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', initAppEngine);
    } else {
        initAppEngine();
    }
})();
