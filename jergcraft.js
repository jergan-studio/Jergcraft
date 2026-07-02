/**
 * jergcraft.js
 * Version: v4.1.0 (Dynamic JergServer Input Loader)
 * Optimized for Vercel & Median.co. Adds an on-screen custom domain utility.
 */
(function() {
    'use strict';

    // 1. Core Variables Configuration
    const knockoff = true; // Set to true to automatically launch full-screen framework
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
                <h2 style="letter-spacing: 3px; margin: 0; color: #00ffcc; font
