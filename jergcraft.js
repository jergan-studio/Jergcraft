/**
 * jergcraft.js
 * Version: v4.4.5 (Crash-Proof Button Pipeline)
 */
(function() {
    'use strict';

    // Settings Toggle
    const knockoff = false; // true = load mobile automatically | false = show interactive menu

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
            return true;
        } catch (err) {
            console.warn("[JergServer Core] Storage update restricted.");
            return false;
        }
    }

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
                } catch (e) {}
                frame.focus();
            });
        }
    }

    function initAppEngine() {
        const menuContainer = document.getElementById('menu-container');
        const dashModal = document.getElementById('jerg-dashboard-modal');
        
        // --- 1. HANDLING AUTOMATIC KNOCKOFF ROUTING ---
        if (knockoff === true) {
            if (menuContainer) menuContainer.remove();
            if (dashModal) dashModal.remove();
            launchGameInstance(MOBILE_URL);
            return; 
        }

        // --- 2. SAFE WORKING BUTTON BINDINGS ---
        const mobileBtn = document.getElementById('btn-manual-mobile');
        if (mobileBtn) {
            mobileBtn.addEventListener('click', function() { launchGameInstance(MOBILE_URL); });
        }

        const compBtn = document.getElementById('btn-manual-comp');
        if (compBtn) {
            compBtn.addEventListener('click', function() { launchGameInstance(COMPUTER_URL); });
        }

        const openDashBtn = document.getElementById('btn-open-jergservers');
        const nameInput = document.getElementById('jerg-input-name');
        const urlInput = document.getElementById('jerg-input-url');
        if (openDashBtn && dashModal) {
            openDashBtn.addEventListener('click', function() {
                if (nameInput) nameInput.value = "";
                if (urlInput) urlInput.value = "https://"; 
                dashModal.style.display = 'block';
                if (nameInput) nameInput.focus();
            });
        }

        const closeDashBtn = document.getElementById('btn-dashboard-close');
        if (closeDashBtn && dashModal) {
            closeDashBtn.addEventListener('click', function() {
                dashModal.style.display = 'none';
            });
        }

        const submitDashBtn = document.getElementById('btn-dashboard-submit');
        if (submitDashBtn) {
            submitDashBtn.addEventListener('click', function() {
                if (!nameInput || !urlInput) return;
                
                const name = nameInput.value.trim() || "JergServer Secure Node";
                let url = urlInput.value.trim();

                if (url.startsWith("https://")) {
                    url = url.replace("https://", "wss://");
                } else if (url.startsWith("http://")) {
                    url = url.replace("http://", "ws://");
                }

                if (!url.startsWith("ws://") && !url.startsWith("wss://")) {
                    alert("Format Error! Use a standard address, 'https://', or 'wss://' links.");
                    return;
                }

                if (injectServerIntoStorage(name, url)) {
                    alert(`Successfully added server: "${name}"`);
                    if (dashModal) dashModal.style.display = 'none';
                } else {
                    alert("Failed to write server configurations.");
                }
            });
        }
    }

    // Runs logic layout once components are safe and ready
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initAppEngine();
    } else {
        window.addEventListener('DOMContentLoaded', initAppEngine);
    }
})();
