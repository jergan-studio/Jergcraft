/**
 * Javascript/jergcraft.js
 * Online Multiplayer WebSocket Controller
 */
(function() {
    'use strict';
    let ws = null;
    const canvas = document.getElementById('render-canvas');
    const logs = document.getElementById('chat-logs');
    let blocks = [];

    function log(m) {
        const r = document.createElement('div');
        r.innerHTML = `<b style="color: #00ffcc;">MULTIPLAYER:</b> <span style="color:#fff;">${m}</span>`;
        logs.appendChild(r);
    }

    function runNetEngine() {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
        ctx.fillStyle = "#0f172a"; ctx.fillRect(0, 0, canvas.width, canvas.height);

        const cX = canvas.width / 2, cY = canvas.height / 2;
        blocks.forEach(b => {
            const [x, y, z, id] = b; const scale = 220 / (z + 8);
            const isoX = cX + (x * 45 * scale) - (y * 8 * scale);
            const isoY = cY + (y * -35 * scale) + (z * 12 * scale);
            ctx.fillStyle = id === 1 ? "#10b981" : "#d1d5db";
            ctx.fillRect(isoX, isoY, 32 * scale, 32 * scale);
        });
        requestAnimationFrame(runNetEngine);
    }

    log("Connecting to network: wss://JergXCraft.eagler.host");
    runNetEngine();

    try {
        ws = new WebSocket("wss://JergXCraft.eagler.host");
        ws.onopen = () => log("Successfully connected to server cluster!");
        ws.onmessage = (e) => {
            try {
                let d = JSON.parse(e.data);
                if (d.type === "WORLD_DATA") blocks = d.map.blocks;
            } catch(err) {}
        };
        ws.onclose = () => log("Disconnected from server host.");
    } catch(e) { log("Uplink initialization failed."); }
})();
