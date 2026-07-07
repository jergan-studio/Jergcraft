/**
 * Map/forest.js
 * 3D Isometric Singleplayer Engine with Keyboard Player & Tracking Camera
 */
window.ForestMap = {
    name: "3D World with Camera Tracking",
    // Base world blocks: [X, Y, Z, BlockTypeID]
    blocks: [
        // Layer 0: Ground Plane
        [-2, 0, -2, 1], [-1, 0, -2, 1], [0, 0, -2, 1], [1, 0, -2, 1], [2, 0, -2, 1],
        [-2, 0, -1, 1], [-1, 0, -1, 1], [0, 0, -1, 1], [1, 0, -1, 1], [2, 0, -1, 1],
        [-2, 0,  0, 1], [-1, 0,  0, 1], [0, 0,  0, 1], [1, 0,  0, 1], [2, 0,  0, 1],
        [-2, 0,  1, 1], [-1, 0,  1, 1], [0, 0,  1, 1], [1, 0,  1, 1], [2, 0,  1, 1],
        [-2, 0,  2, 1], [-1, 0,  2, 1], [0, 0,  2, 1], [1, 0,  2, 1], [2, 0,  2, 1],

        // Tree Structure
        [1, 1, -1, 3], 
        [1, 2, -1, 3], 
        [1, 3, -1, 4], [-1, 3, -1, 4], [2, 3, -1, 4], [1, 3, -2, 4], [1, 3, 0, 4]
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

    log("3D Engine active. Use W, A, S, D or Arrows to control your player cube.");

    // --- Player State Configuration ---
    const player = {
        x: 0,
        y: 1, // Sitting safely on top of the grass layer
        z: 0,
        speed: 0.08,
        size: 35,
        id: 99 // Unique identifier for rendering properties
    };

    // --- Camera State Configuration ---
    const camera = {
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0,
        lerpFactor: 0.1 // Determines tracking smoothness (lower = smoother delay)
    };

    // Track active key presses
    const keys = {};
    window.addEventListener('keydown', (e) => { keys[e.key.toLowerCase()] = true; });
    window.addEventListener('keyup', (e) => { keys[e.key.toLowerCase()] = false; });

    function handlePlayerMovement() {
        // Capture input directions
        let dx = 0;
        let dz = 0;

        if (keys['w'] || keys['arrowup'])    dz -= player.speed;
        if (keys['s'] || keys['arrowdown'])  dz += player.speed;
        if (keys['a'] || keys['arrowleft'])  dx -= player.speed;
        if (keys['d'] || keys['arrowright']) dx += player.speed;

        // Apply position updates
        player.x += dx;
        player.z += dz;

        // Soft boundary clamps to keep the player block on the platform grid
        player.x = Math.max(-2.2, Math.min(2.2, player.x));
        player.z = Math.max(-2.2, Math.min(2.2, player.z));
    }

    function drawIsometricCube(ctx, x, y, z, size, id) {
        let topColor, leftColor, rightColor;

        // Assign colors based on Block ID
        if (id === 1) {       // Grass
            topColor = "#10b981"; leftColor = "#047857"; rightColor = "#78350f";
        } else if (id === 3) { // Wood Trunk
            topColor = "#b45309"; leftColor = "#451a03"; rightColor = "#292524";
        } else if (id === 4) { // Leaves
            topColor = "#059669"; leftColor = "#065f46"; rightColor = "#044e3a";
        } else if (id === 99) { // Player Character (Blue Voxel Hero)
            topColor = "#38bdf8"; leftColor = "#0284c7"; rightColor = "#1e3a8a";
        } else {               // Stone
            topColor = "#9ca3af"; leftColor = "#6b7280"; rightColor = "#4b5563";
        }

        // --- Core 3D Math Projection Equations ---
        const isoX = (x - z) * size;
        const isoY = (x + z) * (size / 2) - (y * size * 1.2);

        // Apply camera offsets to the world screen anchor point
        const cx = (canvas.width / 2) + isoX - camera.x;
        const cy = (canvas.height / 2) + isoY - camera.y;

        // 1. Draw Top Polygon
        ctx.fillStyle = topColor;
        ctx.beginPath();
        ctx.moveTo(cx, cy - size / 2);
        ctx.lineTo(cx + size, cy);
        ctx.lineTo(cx, cy + size / 2);
        ctx.lineTo(cx - size, cy);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,0.18)";
        ctx.stroke();

        // 2. Draw Left Side Polygon
        ctx.fillStyle = leftColor;
        ctx.beginPath();
        ctx.moveTo(cx - size, cy);
        ctx.lineTo(cx, cy + size / 2);
        ctx.lineTo(cx, cy + size / 2 + size);
        ctx.lineTo(cx - size, cy + size);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 3. Draw Right Side Polygon
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
        
        // Dynamic full window canvas frame matching
        if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        // Processing movement and updates
        handlePlayerMovement();

        // --- Camera Calculations ---
        // Find exactly where the player stands in 3D isometric screenspace coordinates
        camera.targetX = (player.x - player.z) * player.size;
        camera.targetY = (player.x + player.z) * (player.size / 2) - (player.y * player.size * 1.2) + 40;

        // Apply linear interpolation (Lerp) to smoothly pan the camera tracking view
        camera.x += (camera.targetX - camera.x) * camera.lerpFactor;
        camera.y += (camera.targetY - camera.y) * camera.lerpFactor;

        // Clean frame draw
        ctx.fillStyle = "#1e293b"; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Merge standard map blocks and the dynamic player into a unified stack array
        let dynamicMapStack = [...window.ForestMap.blocks, [player.x, player.y, player.z, player.id]];

        // Sort via depth order (Painter's algorithm sorting formula)
        dynamicMapStack.sort((a, b) => {
            if (Math.abs(a[1] - b[1]) > 0.1) return a[1] - b[1]; // Sort altitude first
            return (a[0] + a[2]) - (b[0] + b[2]); // Sort depth space
        });

        // Loop through sorted index elements and project layout graphics
        dynamicMapStack.forEach(cube => {
            drawIsometricCube(ctx, cube[0], cube[1], cube[2], player.size, cube[3]);
        });

        requestAnimationFrame(renderLoop);
    }

    renderLoop();
};
