/**
 * jergcraft.js
 * Version: v4.4.6 (Cache Isolation & Console Hardened Runtime)
 */
(function() {
    'use strict';

    console.log("[Jergcraft Core] Engine initialized.");

    const knockoff = false; 

    const MOBILE_URL = "https://irv77.github.io/EaglerPocketMobile/demo/"; 
    const COMPUTER_URL = "https://jerg-crafter.vercel.app/jergcraft/index.html";

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
            console.warn("[JergServer Core] Database access blocked.");
            return false;
        }
    }

    function launchGameInstance(targetSrc) {
        console.log(`[Jergcraft Core] Swapping screens. Loading target source: ${targetSrc}`);
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
        console.log("[Jergcraft Core] Executing core layout configurations.");
        const menuContainer = document.getElementById('menu-container');
        const dashModal = document.getElementById('jerg-dashboard-modal');
        
        if (knockoff === true) {
            if (menuContainer) menuContainer.remove();
            if (dashModal) dashModal.remove();
            launchGameInstance(MOBILE_URL);
            return; 
        }

        const mobileBtn = document.getElementById('btn-manual-mobile');
        if (mobileBtn) {
            mobileBtn.onclick = function() { launchGameInstance(MOBILE_URL); };
        } else { console.error("Mobile button element missing from DOM tree!"); }

        const compBtn = document.getElementById('btn-manual-comp');
        if (compBtn) {
            compBtn.onclick = function() { launchGameInstance(COMPUTER_URL); };
        } else { console.error("Computer button element missing from DOM tree!"); }

        const openDashBtn = document.getElementById('btn-open-jergservers');
        const nameInput = document.getElementById('jerg-input-name');
        const urlInput = document.getElementById('jerg-input-url');
        if (openDashBtn && dashModal) {
            openDashBtn.onclick = function() {
                if (nameInput) nameInput.value = "";
                if (urlInput) urlInput.value = "https://"; 
                dashModal.style.display = 'block';
                if (nameInput) nameInput.focus();
            };
        }

        const closeDashBtn = document.getElementById('btn-dashboard-close');
        if (closeDashBtn && dashModal) {
            closeDashBtn.onclick = function() {
                dashModal.style.display = 'none';
            };
        }

        const submitDashBtn = document.getElementById('btn-dashboard-submit');
        if (submitDashBtn) {
            submitDashBtn.onclick = function() {
                if (!nameInput || !urlInput) return;
                
                const name = nameInput.value.trim() || "JergServer Secure Node";
                let url = urlInput.value.trim();

                if (url.startsWith("https://")) {
                    url = url.replace("https://", "wss://");
                } else if (url.startsWith("http://")) {
                    url = url.replace("http://", "ws://");
                }

                if (!url.startsWith("ws://") && !url.startsWith("wss://")) {
                    alert("Format Error! Use a standard address starting with 'https://' or 'wss://'");
                    return;
                }

                if (injectServerIntoStorage(name, url)) {
                    alert(`Successfully added server: "${name}"`);
                    if (dashModal) dashModal.style.display = 'none';
                } else {
                    alert("Failed to save server details.");
                }
            };
        }
    }

    // Direct universal fallback loading triggers
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initAppEngine();
    } else {
        window.addEventListener('DOMContentLoaded', initAppEngine);
        window.addEventListener('load', initAppEngine);
    }
})();
