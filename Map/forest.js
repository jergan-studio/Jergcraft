/**
 * Map/forest.js
 * Offline Singleplayer Game Loop Module
 */
window.ForestMap = {
    name: "Local Offline Forest",
    blocks: [
        [-2, 0, 0, 1], [-1, 0, 0, 1], [0, 0, 0, 1], [1, 0, 0, 1], [2, 0, 0, 1],
        [-2, 0, 1, 1], [-1, 0, 1, 1], [0, 0, 1, 1], [1, 0, 1, 1], [2, 0, 1, 1],
        [-2, 0, 2, 1], [-1, 0, 2, 1], [0, 0, 2, 1], [1, 0, 2, 1], [2, 0, 2, 1],
        [0, 1, 1, 3], [0, 2, 1, 3], [0, 3, 1, 4], [-1, 3, 1, 4], [1, 3, 1, 4]
    ]
};

window.initSingleplayerEngine = function() {
    const canvas = document.getElementById('render-canvas');
    const logs = document.getElementById('chat-logs');
    
    function log(msg) {
        const row = document.createElement('div');
        row.innerHTML = `<b style="color: #facc15;">SYSTEM:</b> <span style="color:#fff;">${msg}</span>`;
        logs.appendChild(row);
    }

    log("Loaded Local Offline Map: " + window.ForestMap.name);

    function draw() {
        if (canvas.style.display !== 'block') return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        ctx.fillStyle = "#1e293b"; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const cX = canvas.width / 2;
        const cY = canvas.height / 2;

        window.ForestMap.blocks.forEach(b => {
            const [x, y, z, id] = b;
            const scale = 220 / (z + 8); 
            const isoX = cX + (x * 45 * scale) - (y * 8 * scale);
            const isoY = cY + (y * -35 * scale) + (z * 12 * scale);

            if (id === 1) ctx.fillStyle = "#10b981";       
            else if (id === 2) ctx.fillStyle = "#78350f";  
            else if (id === 3) ctx.fillStyle = "#451a03";  
            else if (id === 4) ctx.fillStyle = "#065f46";  
            else ctx.fillStyle = "#d1d5db";

            ctx.fillRect(isoX, isoY, 32 * scale, 32 * scale);
            ctx.strokeRect(isoX, isoY, 32 * scale, 32 * scale);
        });
        requestAnimationFrame(draw);
    }
    draw();
};
