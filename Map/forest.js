/**
 * Map/forest.js
 * True 3D Isometric Singleplayer Game Loop Module
 */
window.ForestMap = {
    name: "Local 3D Forest World",
    // Format: [X, Y, Z, BlockTypeID]
    blocks: [
        // Layer 0: Ground Plane (Grass/Dirt Matrix)
        [-2, 0, -2, 1], [-1, 0, -2, 1], [0, 0, -2, 1], [1, 0, -2, 1], [2, 0, -2, 1],
        [-2, 0, -1, 1], [-1, 0, -1, 1], [0, 0, -1, 1], [1, 0, -1, 1], [2, 0, -1, 1],
        [-2, 0,  0, 1], [-1, 0,  0, 1], [0, 0,  0, 1], [1, 0,  0, 1], [2, 0,  0, 1],
        [-2, 0,  1, 1], [-1, 0,  1, 1], [0, 0,  1, 1], [1, 0,  1, 1], [2, 0,  1, 1],
        [-2, 0,  2, 1], [-1, 0,  2, 1], [0, 0,  2, 1], [1, 0,  2, 1], [2, 0,  2, 1],

        // Center Tree Trunk (Wood Log Column)
        [0, 1, 0, 3], 
        [0, 2, 0, 3], 
        
        // Tree Canopy (Green Leaves Layer)
        [0,  3,  0, 4], 
        [-1, 3,  0, 4], 
        [1,  3,  0, 4], 
        [0,  3, -1, 4], 
        [0,  3,  1, 4],
        [0,  4,  0, 4]
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

    log("Loaded Local 3D Map Vector Structure: " + window.ForestMap.name);

    function drawIsometricCube(ctx, x, y, z, size, id) {
        // Define color profiles for each 3D face depending on block type
        let topColor, leftColor, rightColor;

        if (id === 1) { // Grass Block
            topColor = "#10b981";   // Bright Green
            leftColor = "#047857";  // Darker Grass Edge
            rightColor = "#78350f"; // Dirt Side
        } else if (id === 2) { // Dirt
            topColor = "#92400e";
            leftColor = "#78350f";
            rightColor = "#451a03";
        } else if (id === 3) { // Tree Log
            topColor = "#b45309";
            leftColor = "#451a03";
            rightColor = "#292524";
        } else if (id === 4) { // Leaves
            topColor = "#059669";
            leftColor = "#065f46";
            rightColor = "#044e3a";
        } else { // Default Stone
            topColor = "#9ca3af";
            leftColor = "#6b7280";
            rightColor = "#4b5563";
        }

        // --- 3D Projection Math Equations ---
        // Width factor adjustments
        const isoX = (x - z) * size;
        // Height factor adjustments (subtracting Y pushes the block UP visually)
        const isoY = (x + z) * (size / 2) - (y * size * 1.2);

        // Center projection points onto viewport
        const cx = canvas.width / 2 + isoX;
        const cy = canvas.height / 2 + isoY + 50; 

        // 1. Render Top Face (Diamond Shape Polygon)
        ctx.fillStyle = topColor;
        ctx.beginPath();
        ctx.moveTo(cx, cy - size / 2);
        ctx.lineTo(cx + size, cy);
        ctx.lineTo(cx, cy + size / 2);
        ctx.lineTo(cx - size, cy);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,0.15)";
        ctx.stroke();

        // 2. Render Left Face
        ctx.fillStyle = leftColor;
        ctx.beginPath();
        ctx.moveTo(cx - size, cy);
        ctx.lineTo(cx, cy + size / 2);
        ctx.lineTo(cx, cy + size / 2 + size);
        ctx.lineTo(cx - size, cy + size);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 3. Render Right Face
        ctx.fillStyle = rightColor;
        ctx.beginPath();
        ctx.moveTo(cx, cy + size / 2);
        ctx.lineTo(cx + size, cy);
        ctx.lineTo(cx + size, cy + size);
        ctx.lineTo(cx, cy + size / 2 + size);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    function renderLoop() {
        if (canvas.style.display !== 'block') return;
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Draw sky background
        ctx.fillStyle = "#1e293b"; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Sort voxel blocks from back-to-front (Painter's algorithm)
        // This ensures objects further back don't render on top of foreground blocks
        let sortedBlocks = [...window.ForestMap.blocks].sort((a, b) => {
            if (a[1] !== b[1]) return a[1] - b[1]; // Sort by altitude layer (Y) first
            return (a[0] + a[2]) - (b[0] + b[2]);  // Sort by depth footprint (X + Z)
        });

        // Loop through and project each block onto the screen layout
        const blockSize = 35; 
        sortedBlocks.forEach(b => {
            drawIsometricCube(ctx, b[0], b[1], b[2], blockSize, b[3]);
        });

        requestAnimationFrame(renderLoop);
    }

    renderLoop();
};
