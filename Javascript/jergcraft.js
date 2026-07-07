/**
 * Map/forest.js
 * True First-Person 3D Voxel Engine Module
 */
window.ForestMap = {
    name: "Local 3D First-Person Forest",
    // Format: [X, Y, Z, BlockTypeID]
    blocks: [
        // Ground Plane (Floor blocks)
        [-2, -1, -2, 1], [-1, -1, -2, 1], [0, -1, -2, 1], [1, -1, -2, 1], [2, -1, -2, 1],
        [-2, -1, -1, 1], [-1, -1, -1, 1], [0, -1, -1, 1], [1, -1, -1, 1], [2, -1, -1, 1],
        [-2, -1,  0, 1], [-1, -1,  0, 1], [0, -1,  0, 1], [1, -1,  0, 1], [2, -1,  0, 1],
        [-2, -1,  1, 1], [-1, -1,  1, 1], [0, -1,  1, 1], [1, -1,  1, 1], [2, -1,  1, 1],
        [-2, -1,  2, 1], [-1, -1,  2, 1], [0, -1,  2, 1], [1, -1,  2, 1], [2, -1,  2, 1],

        // Tree Trunk (Wood Columns)
        [1, 0, 1, 3], 
        [1, 1, 1, 3], 
        
        // Tree Canopy (Leaves Layer)
        [1, 2, 1, 4], [0, 2, 1, 4], [2, 2, 1, 4], [1, 2, 0, 4], [1, 2, 2, 4]
    ]
};

window.initSingleplayerEngine = function() {
    const canvas = document.getElementById('render-canvas');
    const logs = document.getElementById('chat-logs');
    
    function log(msg) {
        if (!logs) return;
        const row = document.createElement('div');
        row.innerHTML = `<b style="color: #facc15;">SYSTEM:</b> <span style="color:#fff;">${msg}</span>`;
        logs.appendChild(row);
    }

    log("First-Person 3D Mode Active. Move mouse to look, WASD to walk.");

    // --- First-Person Player / Camera Variables ---
    const player = {
        x: 0.0,
        y: 0.5, // Eye height sitting above the ground floor
        z: 0.0,
        yaw: 0.0,   // Horizontal look angle (turned by mouse X)
        pitch: 0.0, // Vertical look angle (tilted by mouse Y)
        speed: 0.05
    };

    // Tracking mouse inputs across the screen layout bounds
    const mouse = { targetYaw: 0, targetPitch: 0 };
    window.addEventListener('mousemove', (e) => {
        // Convert screen pixel space to angular movement values (-1.5 to +1.5 radians)
        const normX = (e.clientX / window.innerWidth) * 2 - 1;
        const normY = (e.clientY / window.innerHeight) * 2 - 1;
        
        mouse.targetYaw = normX * 1.5;
        mouse.targetPitch = -normY * 1.0; 
    });

    // Keyboard inputs tracker map matrix
    const keys = {};
    window.addEventListener('keydown', (e) => { keys[e.key.toLowerCase()] = true; });
    window.addEventListener('keyup', (e) => { keys[e.key.toLowerCase()] = false; });

    function handleFirstPersonMovement() {
        // Smoothly ease the angles toward the target mouse positions
        player.yaw += (mouse.targetYaw - player.yaw) * 0.1;
        player.pitch += (mouse.targetPitch - player.pitch) * 0.1;

        let moveX = 0;
        let moveZ = 0;

        // Dynamic forward vector calculation based on look heading direction (Yaw)
        const forwardX = Math.sin(player.yaw);
        const forwardZ = Math.cos(player.yaw);

        if (keys['w'] || keys['arrowup']) {
            moveX += forwardX * player.speed;
            moveZ += forwardZ * player.speed;
        }
        if (keys['s'] || keys['arrowdown']) {
            moveX -= forwardX * player.speed;
            moveZ -= forwardZ * player.speed;
        }
        if (keys['a'] || keys['arrowleft']) {
            moveX -= forwardZ * player.speed; // Strafe Left
            moveZ += forwardX * player.speed;
        }
        if (keys['d'] || keys['arrowright']) {
            moveX += forwardZ * player.speed; // Strafe Right
            moveZ -= forwardX * player.speed;
        }

        player.x += moveX;
        player.z += moveZ;

        // Keep player safe on the map boundary footprint limits
        player.x = Math.max(-3, Math.min(3, player.x));
        player.z = Math.max(-3, Math.min(3, player.z));
    }

    // --- 3D Projection Engine Geometry Core Pipeline ---
    function projectVoxelToFirstPerson(x, y, z, size) {
        // Step 1: Translate world coordinates relative to the player's eye tracking point
        let relX = (x - player.x) * size;
        let relY = -(y - player.y) * size;
        let relZ = (z - player.z) * size;

        // Step 2: Apply horizontal Yaw turning rotation calculations around Y axis
        let cosY = Math.cos(-player.yaw), sinY = Math.sin(-player.yaw);
        let rx1 = relX * cosY - relZ * sinY;
        let rz1 = relX * sinY + relZ * cosY;

        // Step 3: Apply vertical Pitch tilting rotation calculations around X axis
        let cosP = Math.cos(-player.pitch), sinP = Math.sin(-player.pitch);
        let ry2 = relY * cosP - rz1 * sinP;
        let rz2 = relY * sinP + rz1 * cosP;

        // If the object is behind the camera eye plane view, skip rendering it
        if (rz2 <= 5) return null;

        // Step 4: Map 3D coordinates onto 2D viewport space
        const fovScale = 400; // Field of View projection distance constant factor
        const screenX = (canvas.width / 2) + (rx1 * fovScale / rz2);
        const screenY = (canvas.height / 2) + (ry2 * fovScale / rz2);
        const projectedRadius = (size * 0.5) * fovScale / rz2;

        return {
            x: screenX,
            y: screenY,
            depth: rz2, // Save calculation depth distance for Painter's ordering sorting logic
            r: projectedRadius
        };
    }

    function render3DBlockFace(ctx, proj, blockId) {
        let topColor, sideColor;

        if (blockId === 1) { // Grass
            topColor = "#10b981"; sideColor = "#047857";
        } else if (blockId === 3) { // Wood Log
            topColor = "#b45309"; sideColor = "#451a03";
        } else if (blockId === 4) { // Leaves
            topColor = "#059669"; sideColor = "#044e3a";
        } else { // Stone
            topColor = "#9ca3af"; sideColor = "#4b5563";
        }

        const r = proj.r;

        // Draw Front Side Projection bounding polygon shape
        ctx.fillStyle = sideColor;
        ctx.fillRect(proj.x - r, proj.y - r, r * 2, r * 2);
        
        // Draw Accent Cap Top Line layer block layout indicator mesh
        ctx.fillStyle = topColor;
        ctx.beginPath();
        ctx.moveTo(proj.x - r, proj.y - r);
        ctx.lineTo(proj.x + r, proj.y - r);
        ctx.lineTo(proj.x + r, proj.y - r + (r * 0.3));
        ctx.lineTo(proj.x - r, proj.y - r + (r * 0.3));
        ctx.closePath();
        ctx.fill();

        // Overlay clean structural wireframes
        ctx.strokeStyle = "rgba(0,0,0,0.2)";
        ctx.strokeRect(proj.x - r, proj.y - r, r * 2, r * 2);
    }

    function renderLoop() {
        if (canvas.style.display !== 'block') return;
        const ctx = canvas.getContext('2d');
        
        if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        // Process physics movement ticks
        handleFirstPersonMovement();

        // Sky background backdrop color fill
        ctx.fillStyle = "#0f172a"; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Project and filter active block arrays map vectors list elements
        let renderStack = [];
        const blockSize = 50;

        window.ForestMap.blocks.forEach(b => {
            let projectedNode = projectVoxelToFirstPerson(b[0], b[1], b[2], blockSize);
            if (projectedNode) {
                projectedNode.id = b[3]; // Attach Block Type ID
                renderStack.push(projectedNode);
            }
        });

        // Painter's algorithm: Sort objects by depth from back-to-front
        renderStack.sort((a, b) => b.depth - a.depth);

        // Flush render stack elements cleanly onto view screen canvas matrix positions
        renderStack.forEach(node => {
            render3DBlockFace(ctx, node, node.id);
        });

        requestAnimationFrame(renderLoop);
    }

    renderLoop();
};
