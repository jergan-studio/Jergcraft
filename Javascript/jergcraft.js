/**
 * Javascript/jergcraft.js
 * Client Side Game Engine & WebSocket Core
 */
(function() {
    'use strict';

    let ws = null;
    const canvas = document.getElementById('render-canvas');
    const chatPanel = document.getElementById('chat-panel');
    const chatLogs = document.getElementById('chat-logs');
    const chatInput = document.getElementById('chat-input');
    const serverListContainer = document.getElementById('jerg-server-list');
    const modal = document.getElementById('server-modal');

    // Load from Map data script or use immediate safety defaults
    let worldBlocks = (window.ForestMap && window.ForestMap.blocks) ? window.ForestMap.blocks : [];

    function getServerProfiles() {
        try {
            let entries = localStorage.getItem('jergvoxel_servers');
            return entries ? JSON.parse(entries) : [];
        } catch (e) { return []; }
    }

    function storeServerProfile(name, address) {
        try {
            let parsed = getServerProfiles();
            parsed = parsed.filter(s => s.addr !== address);
            parsed.unshift({ name: name, addr: address });
            localStorage.setItem('jergvoxel_servers', JSON.stringify(parsed));
            return true;
        } catch (e) { return false; }
    }

    function deleteServerProfile(address) {
        try {
            let parsed = getServerProfiles();
            parsed = parsed.filter(s => s.addr !== address);
            localStorage.setItem('jergvoxel_servers', JSON.stringify(parsed));
            renderServerMenu(); 
        } catch(e) {}
    }

    function renderServerMenu() {
        if (!serverListContainer) return;
        serverListContainer.innerHTML = "";
        const servers = getServerProfiles();

        if (servers.length === 0) {
            serverListContainer.innerHTML = `<div style="color: #555; font-size: 13px; text-align: center; padding: 20px;">No custom nodes registered yet.</div>`;
            return;
        }

        servers.forEach(srv => {
            const item = document.createElement('div');
            item.className = 'server-item';
            item.innerHTML = `
                <div class="server-info">
                    <span class="server-name-display">${srv.name}</span>
                    <span class="server-url-display">${srv.addr}</span>
                </div>
                <div class="server-actions">
                    <button class="srv-btn srv-connect" data-addr="${srv.addr}">JOIN</button>
                    <button class="srv-btn srv-delete" data-addr="${srv.addr}">X</button>
                </div>
            `;

            item.querySelector('.srv-connect').onclick = function() {
                modal.style.display = 'none';
                establishServerSession(this.getAttribute('data-addr'));
            };

            item.querySelector('.srv-delete').onclick = function() {
                deleteServerProfile(this.getAttribute('data-addr'));
            };
            serverListContainer.appendChild(item);
        });
    }

    function start3DRenderEngineLoop() {
        if (canvas.style.display !== 'block') return;
        const ctx = canvas.getContext('2d');
        
        if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        ctx.fillStyle = "#1e293b"; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        worldBlocks.forEach(block => {
            const [x, y, z, id] = block;
            const scale = 220 / (z + 8); 
            const isoX = centerX + (x * 45 * scale) - (y * 8 * scale);
            const isoY = centerY + (y * -35 * scale) + (z * 12 * scale);

            if (isoX < -50 || isoX > canvas.width + 50 || isoY < -50 || isoY > canvas.height + 50) return;

            if (id === 1) ctx.fillStyle = "#10b981";       // Grass
            else if (id === 2) ctx.fillStyle = "#78350f";  // Dirt
            else if (id === 3) ctx.fillStyle = "#451a03";  // Log
            else if (id === 4) ctx.fillStyle = "#065f46";  // Leaves
            else ctx.fillStyle = "#d1d5db";

            ctx.strokeStyle = "rgba(0,0,0,0.25)";
            ctx.lineWidth = 1;
            ctx.fillRect(isoX, isoY, 32 * scale, 32 * scale);
            ctx.strokeRect(isoX, isoY, 32 * scale, 32 * scale);
        });

        requestAnimationFrame(start3DRenderEngineLoop);
    }

    function establishServerSession(targetDomain) {
        document.getElementById('menu-container').style.display = 'none';
        canvas.style.display = 'block';
        chatPanel.style.display = 'flex';
        
        let cleanUrl = targetDomain.trim();
        cleanUrl = cleanUrl.replace(/^(https?:\/\/|wss?:\/\/)/i, '');
        const finalWssUrl = "wss://" + cleanUrl;

        start3DRenderEngineLoop();
        logSystemNotice(`Connecting directly to network thread: ${finalWssUrl}`);

        try {
            ws = new WebSocket(finalWssUrl);

            ws.onopen = () => {
                logSystemNotice("Handshake established! Connected to the 3D server space.");
                ws.send(JSON.stringify({ type: "CHAT", user: "Player", text: "connected to space sector." }));
            };

            ws.onmessage = (event) => {
                try {
                    const packageData = JSON.parse(event.data);
                    if (packageData.type === "WORLD_DATA" && packageData.map && packageData.map.blocks) {
                        worldBlocks = packageData.map.blocks;
                        logSystemNotice(`Loaded world file matrix schema: ${packageData.map.name}`);
                    }
                    if (packageData.type === "CHAT") {
                        appendChatMessage(packageData.user, packageData.text);
                    }
                } catch(err) {}
            };

            ws.onclose = () => { logSystemNotice("Disconnected from the cluster socket backend."); };
        } catch(e) {
            logSystemNotice("Socket instantiation connection loop failure tracked.");
        }
    }

    function appendChatMessage(user, msg) {
        const row = document.createElement('div');
        row.innerHTML = `<b style="color: #00ffcc;">${user}:</b> <span style="color:#ffffff;">${msg}</span>`;
        chatLogs.appendChild(row);
        chatLogs.scrollTop = chatLogs.scrollHeight;
    }

    function logSystemNotice(msg) { appendChatMessage("SYSTEM", msg); }

    window.addEventListener('keydown', (e) => {
        if (chatPanel.style.display !== 'flex') return;
        if (e.key === 'Enter') {
            if (document.activeElement === chatInput) {
                const val = chatInput.value.trim();
                if (val && ws && ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({ type: "CHAT", user: "Player", text: val }));
                    appendChatMessage("You", val);
                }
                chatInput.value = "";
                chatInput.blur();
            } else {
                chatInput.focus();
            }
        }
    });

    window.addEventListener('DOMContentLoaded', () => {
        const nameIn = document.getElementById('jerg-input-name');
        const urlIn = document.getElementById('jerg-input-url');

        document.getElementById('btn-open-jergservers').onclick = () => {
            if(nameIn) nameIn.value = "";
            if(urlIn) urlIn.value = "https://";
            renderServerMenu(); 
            modal.style.display = 'block';
        };

        document.getElementById('btn-dashboard-close').onclick = () => { modal.style.display = 'none'; };

        document.getElementById('btn-dashboard-submit').onclick = () => {
            const name = nameIn.value.trim() || "Custom Voxel Node";
            let rawUrl = urlIn.value.trim();
            if (!rawUrl) { alert("Please input a network server domain address link."); return; }

            if (storeServerProfile(name, rawUrl)) {
                nameIn.value = "";
                urlIn.value = "https://";
                renderServerMenu();
            }
        };
    });
})();
