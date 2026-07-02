/**
 * jergcraft.js
 * Version: v4.4.4 (HTTPS-to-WSS Auto Protocol Alignment Engine)
 */
(function() {
    'use strict';

    // Router Configuration Controller:
    // true = Automatically bypass menu directly into mobile knockoff view setups
    // false = Hold default selection workspace menus visible
    const knockoff = false; 

    const MOBILE_URL = "https://irv77.github.io/EaglerPocketMobile/demo/"; 
    const COMPUTER_URL = "https://eaglercraft.app/web/";

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
            console.log(`[JergServer Storage] Synced endpoint successfully: ${name} -> ${address}`);
            return true;
        } catch (err) {
            console.warn("[JergServer Storage] Local client initialization array access blocked.");
            return false;
        }
    }

    function launchGameInstance(targetSrc) {
        const menuContainer = document.getElementById('menu-container');
        const frame = document.getElementById('game-frame');
        
        if (menuContainer) {
            menuContainer.style.setProperty('display', 'none', 'important');
        }
        
        if (frame) {
            frame.src = targetSrc;
            frame.style.display = "block";
            
            frame.addEventListener('load', () => {
                try {
                    frame.contentWindow.localStorage.setItem('eaglercraft_servers', localStorage.getItem('eaglercraft_servers'));
                } catch (e) {
                    // Fail silently over cross-origin context borders
                }
                frame.focus();
            });
        }
    }

    function initAppEngine() {
        const menuContainer = document.getElementById('menu-container');
        const dashModal = document.getElementById('jerg-dashboard-modal');
        
        // --- 1. RUN AUTOMATED KNOCKOFF ROUTING ENGINE IF CONFIGURED ---
        if (knockoff === true) {
            if (menuContainer) menuContainer.remove();
            if (dashModal) dashModal.remove();
            launchGameInstance(MOBILE_URL);
            return; 
        }

        // --- 2. BIND ACTIVE INTERFACE LAYERS (knockoff = false) ---
        const mobileBtn = document.getElementById('btn-manual-mobile');
        const compBtn = document.getElementById('btn-manual-comp');
        const openDashBtn = document.getElementById('btn-open-jergservers');
        const closeDashBtn = document.getElementById('btn-dashboard-close');
        const submitDashBtn = document.getElementById('btn-dashboard-submit');
        
        const nameInput = document.getElementById('jerg-input-name');
        const urlInput = document.getElementById('jerg-input-url');

        if (mobileBtn) {
            mobileBtn.onclick = function() { launchGameInstance(MOBILE_URL); };
        }
        if (compBtn) {
            compBtn.onclick = function() { launchGameInstance(COMPUTER_URL); };
        }

        if (openDashBtn && dashModal) {
            openDashBtn.onclick = function() {
                if (nameInput) nameInput.value = "";
                if (urlInput) urlInput.value = "https://"; 
                dashModal.style.display = 'block';
                if (nameInput) nameInput.focus();
            };
        }

        if (closeDashBtn && dashModal) {
            closeDashBtn.onclick = function() {
                dashModal.style.display = 'none';
            };
        }

        if (submitDashBtn) {
            submitDashBtn.onclick = function() {
                if (!nameInput || !urlInput) return;
                
                const name = nameInput.value.trim() || "JergServer Secure Node";
                let url = urlInput.value.trim();

                // Automatically morph user web domains into their proper matching socket formats
                if (url.startsWith("https://")) {
                    url = url.replace("https://", "wss://");
                } else if (url.startsWith("http://")) {
                    url = url.replace("http://", "ws://");
                }

                // Explicit protocol fallback validation sanity check
                if (!url.startsWith("ws://") && !url.startsWith("wss://")) {
                    alert("Format Error! Use a standard address, 'https://', or 'wss://' to establish connection hooks.");
                    return;
                }

                if (injectServerIntoStorage(name, url)) {
                    alert(`Successfully registered secure server "${name}" as [ ${url} ]`);
                    if (dashModal) dashModal.style.display = 'none';
                } else {
                    alert("Local file write failure. Could not update client server preferences.");
                }
            };
        }
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initAppEngine();
    } else {
        window.addEventListener('DOMContentLoaded', initAppEngine);
        window.addEventListener('load', initAppEngine);
    }
})();
