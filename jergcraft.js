/**
 * jergcraft.js
 * Version: v4.3.1 (CORS & Fallback Safe Core)
 */
(function() {
    'use strict';

    const knockoff = false; // true = load mobile automatically | false = show menu
    const MOBILE_URL = "https://irv77.github.io/EaglerPocketMobile/demo/"; 
    const COMPUTER_URL = "https://eaglercraft.app/web/";

    const DEFAULT_SERVER_NAME = "JergServer Main";
    const DEFAULT_SERVER_WSS  = "wss://jerggames-server.onrender.com";

    // Safe injection wrapper that won't crash the script if blocked
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
            console.warn("[JergServer Core] Main storage restricted. Using frame pipeline.");
            return false;
        }
    }

    function createLoaderInterface(targetSrc) {
        const loaderStyle = document.createElement('style');
        loaderStyle.innerHTML = `
            #jerg-loader {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: linear-gradient(135deg, #141414 0%, #050505 100%);
                color: #fff; display: flex; flex-direction: column;
                align-items: center; justify-content: center; font-family: sans-serif;
                z-index: 999995; transition: opacity 0.6s ease;
            }
            .spinner {
                width: 50px; height: 50px; border: 5px solid #222;
                border-top: 5px solid #00ffcc; border-radius: 50%;
                animation: jerg-spin 0.8s linear infinite; margin-bottom: 20px;
            }
            @keyframes jerg-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            .jerg-load-btn {
                margin-top: 25px; background: #141414; color: #00ffcc; border: 2px solid #00ffcc;
                padding: 10px 20px; font-size: 14px; font-weight: bold; letter-spacing: 1px;
                border-radius: 5px; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.5);
                transition: all 0.2s ease; z-index: 999999;
            }
            #jerg-input-modal {
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                width: 300px; background: #141414; border: 2px solid #00ffcc; border-radius: 8px;
                padding: 20px; color: #fff; box-shadow: 0 10px 30px rgba(0,0,0,0.8);
                z-index: 1000005; display: none; text-align: center;
            }
            .jerg-modal-input {
                width: 90%; background: #222; border: 1px solid #444; padding: 10px;
                border-radius: 4px; color: #fff; text-align: center; font-size: 14px; margin-bottom: 10px;
            }
            .jerg-modal-btn-group { display: flex; gap: 10px; justify-content: center; }
            .jerg-modal-btn { flex: 1; padding: 8px; border-radius: 4px; border: none; cursor: pointer; font-weight: bold; }
            .jerg-btn-submit { background: #00ffcc; color: #141414; }
            .jerg-btn-cancel { background: #444; color: #fff; }
        `;
        document.head.appendChild(loaderStyle);

        // Run baseline injection
        injectServerIntoStorage(DEFAULT_SERVER_NAME, DEFAULT_SERVER_WSS);

        const loader = document.createElement('div');
        loader.id = 'jerg-loader';
        loader.innerHTML = `
            <div class="spinner"></div>
            <h2 style="letter-spacing: 3px; margin: 0; color: #00ffcc; font-weight: 700;">JERGCRAFT</h2>
            <p style="color: #888; font-size: 13px; margin-top: 8px; letter-spacing: 1px;">Loading Framework...</p>
            <button class="jerg-load-btn" id="load-jergserver-trigger">LOAD JERGSERVER</button>
        `;
        document.body.appendChild(loader);

        const inputModal = document.createElement('div');
        inputModal.id = 'jerg-input-modal';
        inputModal.innerHTML = `
            <h4 style="color:#00ffcc; margin:0 0 15px 0;">CONNECT CUSTOM DOMAIN</h4>
            <input type="text" id="jerg-srv-name" class="jerg-modal-input" placeholder="Server Name">
            <input type="text" id="jerg-srv-url" class="jerg-modal-input" placeholder="wss://your-domain.com">
            <div class="jerg-modal-btn-group">
                <button class="jerg-modal-btn jerg-btn-submit" id="jerg-submit-domain">ADD SERVER</button>
                <button class="jerg-modal-btn jerg-btn-cancel" id="jerg-cancel-domain">CANCEL</button>
            </div>
        `;
        document.body.appendChild(inputModal);

        const triggerBtn = document.getElementById('load-jergserver-trigger');
        const submitBtn = document.getElementById('jerg-submit-domain');
        const cancelBtn = document.getElementById('jerg-cancel-domain');
        const srvNameInput = document.getElementById('jerg-srv-name');
        const srvUrlInput = document.getElementById('jerg-srv-url');

        triggerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            srvNameInput.value = "";
            srvUrlInput.value = "wss://";
            inputModal.style.display = 'block';
            srvNameInput.focus();
        });

        cancelBtn.addEventListener('click', () => { inputModal.style.display = 'none'; });

        submitBtn.addEventListener('click', () => {
            const name = srvNameInput.value.trim() || "Custom Server";
            const url = srvUrlInput.value.trim();
            if (!url.startsWith("ws://") && !url.startsWith("wss://")) {
                alert("Must use wss:// or ws://");
                return;
            }
            if (injectServerIntoStorage(name, url)) {
                alert("Server saved!");
                inputModal.style.display = 'none';
            }
        });

        // Safe frame implementation
        const frame = document.getElementById('game-frame');
        frame.src = targetSrc;
        frame.style.display = "block";

        frame.addEventListener('load', () => {
            // Safe cross-origin push check
            try {
                frame.contentWindow.localStorage.setItem('eaglercraft_servers', localStorage.getItem('eaglercraft_servers'));
            } catch (e) {
                // Fails silently if CORS blocks internal storage injection
            }

            setTimeout(() => {
                if (inputModal.style.display !== 'block') {
                    loader.style.opacity = '0';
                    setTimeout(() => loader.remove(), 600);
                } else {
                    const watcher = setInterval(() => {
                        if (inputModal.style.display !== 'block') {
                            clearInterval(watcher);
                            loader.style.opacity = '0';
                            setTimeout(() => loader.remove(), 600);
                        }
                    }, 500);
                }
            }, 2000);
        });
    }

    function initAppEngine() {
        const menuContainer = document.getElementById('menu-container');

        if (knockoff === true) {
            if (menuContainer) menuContainer.remove();
            createLoaderInterface(MOBILE_URL);
        } else {
            const mobileBtn = document.getElementById('btn-manual-mobile');
            const compBtn = document.getElementById('btn-manual-comp');

            if (mobileBtn && compBtn) {
                mobileBtn.addEventListener('click', () => {
                    if (menuContainer) menuContainer.style.display = 'none';
                    createLoaderInterface(MOBILE_URL);
                });

                compBtn.addEventListener('click', () => {
                    if (menuContainer) menuContainer.style.display = 'none';
                    createLoaderInterface(COMPUTER_URL);
                });
            }
        }
    }

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', initAppEngine);
    } else {
        initAppEngine();
    }
})();
