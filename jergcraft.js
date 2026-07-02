/**
 * jergcraft.js
 * Version: v4.4.1 (Knockoff Compatible Menu Hub)
 */
(function() {
    'use strict';

    // Toggle execution: true = bypass menu into knockoff mobile layout | false = normal choice menu
    const knockoff = false; 

    const MOBILE_URL = "https://irv77.github.io/EaglerPocketMobile/demo/"; 
    const COMPUTER_URL = "https://eaglercraft.app/web/";

    // Internal tracker injection engine
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
            console.log(`[JergServer Core] Registered: ${name} -> ${address}`);
            return true;
        } catch (err) {
            console.warn("[JergServer Core] Local browser database write restricted.");
            return false;
        }
    }

    // Standard engine rendering launcher
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
                    // Fail silently over cross-domain sandbox lines
                }
                frame.focus();
            });
        }
    }

    function initAppEngine() {
        const menuContainer = document.getElementById('menu-container');
        const openDashBtn = document.getElementById('btn-open-jergservers');
        const closeDashBtn = document.getElementById('btn-dashboard-close');
        const submitDashBtn = document.getElementById('btn-dashboard-submit');
        const dashModal = document.getElementById('jerg-dashboard-modal');
        
        const nameInput = document.getElementById('jerg-input-name');
        const urlInput = document.getElementById('jerg-input-url');

        // --- CHECK KNOCKOFF ROUTING STATUS ---
        if (knockoff === true) {
            if (menuContainer) menuContainer.remove();
            if (dashModal) dashModal.remove();
            launchGameInstance(MOBILE_URL);
            return; // Exit out to prevent menu attachments
        }

        // --- ATTACH MAIN MENU BUTTON LISTENERS (knockoff = false) ---
        document.getElementById('btn-manual-mobile').addEventListener('click', () => launchGameInstance(MOBILE_URL));
        document.getElementById('btn-manual-comp').addEventListener('click', () => launchGameInstance(COMPUTER_URL));

        if (openDashBtn && dashModal) {
            openDashBtn.addEventListener('click', () => {
                nameInput.value = "";
                urlInput.value = "ws://"; // Defaults directly to standard ws:// layout format
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

                // Accepts both standard unencrypted ws:// and secure wss:// protocols
                if (!url.startsWith("ws://") && !url.startsWith("wss://")) {
                    alert("Protocol Error! Address string must begin with ws:// or wss://");
                    return;
                }

                if (injectServerIntoStorage(name, url)) {
                    alert(`Successfully added "${name}" to your server list!`);
                    if (dashModal) dashModal.style.display = 'none';
                } else {
                    alert("Failed to write connection profiles.");
                }
            });
        }
    }

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', initAppEngine);
    } else {
        initAppEngine();
    }
})();
