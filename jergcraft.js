/**
 * jergcraft.js
 * Version: v4.4.2 (Safe Asynchronous Event Thread Alignment)
 */
(function() {
    'use strict';

    // Execution Router Control Hook:
    // true = Bypass menu instantly into mobile knockoff play layout
    // false = Default manual selection layout workspace
    const knockoff = false; 

    const MOBILE_URL = "https://irv77.github.io/EaglerPocketMobile/demo/"; 
    const COMPUTER_URL = "https://eaglercraft.app/web/";

    // Save network server endpoints into browser client profile databases safely
    function injectServerIntoStorage(name, address) {
        try {
            let serverList = localStorage.getItem('eaglercraft_servers');
            let parsedList = [];
            
            if (serverList) {
                try { parsedList = JSON.parse(serverList); } catch(e) { parsedList = []; }
            }

            parsedList = parsedList.filter(srv => srv.addr !== address);
            parsedList.unshift({ name: name, addr: address, hide: false });
            
            localStorage.setItem('eaglercraft_servers', JSON.stringify(parsedList));
            console.log(`[JergServer Database] Verified mapping entry: ${name} -> ${address}`);
            return true;
        } catch (err) {
            console.warn("[JergServer Database] Local storage context blocked across origins.");
            return false;
        }
    }

    // Direct fullscreen frame launcher execution route
    function launchGameInstance(targetSrc) {
        const menuContainer = document.getElementById('menu-container');
        const frame = document.getElementById('game-frame');
        
        if (menuContainer) menuContainer.style.display = 'none';
        if (frame) {
            frame.src = targetSrc;
            frame.style.display = "block";
            
            frame.addEventListener('load', () => {
                try {
                    frame.contentWindow.localStorage.setItem('eaglercraft_servers', localStorage.getItem('eaglercraft_servers'));
                } catch (e) {
                    // Fails safely across browser cross-origin domains
                }
                frame.focus();
            });
        }
    }

    // Connects interface inputs safely after window confirms everything is ready
    function initAppEngine() {
        const menuContainer = document.getElementById('menu-container');
        const dashModal = document.getElementById('jerg-dashboard-modal');
        
        // --- 1. RUN AUTO KNOCKOFF ROUTE ROUTING IF ENABLED ---
        if (knockoff === true) {
            if (menuContainer) menuContainer.remove();
            if (dashModal) dashModal.remove();
            launchGameInstance(MOBILE_URL);
            return; 
        }

        // --- 2. SELECTIVE UI COMPONENT HOOK ATTACHMENTS (knockoff = false) ---
        const mobileBtn = document.getElementById('btn-manual-mobile');
        const compBtn = document.getElementById('btn-manual-comp');
        const openDashBtn = document.getElementById('btn-open-jergservers');
        const closeDashBtn = document.getElementById('btn-dashboard-close');
        const submitDashBtn = document.getElementById('btn-dashboard-submit');
        
        const nameInput = document.getElementById('jerg-input-name');
        const urlInput = document.getElementById('jerg-input-url');

        if (mobileBtn) {
            mobileBtn.addEventListener('click', () => launchGameInstance(MOBILE_URL));
        }
        if (compBtn) {
            compBtn.addEventListener('click', () => launchGameInstance(COMPUTER_URL));
        }

        if (openDashBtn && dashModal) {
            openDashBtn.addEventListener('click', () => {
                nameInput.value = "";
                urlInput.value = "ws://"; 
                dashModal.style.display = 'block';
                nameInput.focus();
            });
        }

        if (closeDashBtn && dashModal) {
            closeDashBtn.addEventListener('click', () => {
                dashModal.style.display = 'none';
            });
        }

        if (submitDashBtn) {
            submitDashBtn.addEventListener('click', () => {
                const name = nameInput.value.trim() || "JergServer Node";
                const url = urlInput.value.trim();

                // Accepts standard unencrypted websocket connections (ws://) and secure connections (wss://)
                if (!url.startsWith("ws://") && !url.startsWith("wss://")) {
                    alert("Protocol Error! Addresses must use ws:// or wss:// headers.");
                    return;
                }

                if (injectServerIntoStorage(name, url)) {
                    alert(`Successfully registered "${name}" into global arrays!`);
                    if (dashModal) dashModal.style.display = 'none';
                } else {
                    alert("Failed to write to your local browser configuration database.");
                }
            });
        }
    }

    // Universal application execution observer state checker
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initAppEngine();
    } else {
        window.addEventListener('DOMContentLoaded', initAppEngine);
    }
})();
