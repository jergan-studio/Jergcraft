/**
 * Map/forest.js
 * True First-Person 3D Voxel Engine Module
 */
window.ForestMap = {
    name: "Local 1st Person Voxel Forest",
    // Voxel Blocks Array: [X, Y, Z, BlockTypeID]
    blocks: [
        // Ground Floor Voxel Surface Matrix Plane
        [-3, -1, -3, 1], [-2, -1, -3, 1], [-1, -1, -3, 1], [0, -1, -3, 1], [1, -1, -3, 1], [2, -1, -3, 1], [3, -1, -3, 1],
        [-3, -1, -2, 1], [-2, -1, -2, 1], [-1, -1, -2, 1], [0, -1, -2, 1], [1, -1, -2, 1], [2, -1, -2, 1], [3, -1, -2, 1],
        [-3, -1, -1, 1], [-2, -1, -1, 1], [-1, -1, -1, 1], [0, -1, -1, 1], [1, -1, -1, 1], [2, -1, -1, 1], [3, -1, -1, 1],
        [-3, -1,  0, 1], [-2, -1,  0, 1], [-1, -1,  0, 1], [0, -1,  0, 1], [1, -1,  0, 1], [2, -1,  0, 1], [3, -1,  0, 1],
        [-3, -1,  1, 1], [-2, -1,  1, 1], [-1, -1,  1, 1], [0, -1,  1, 1], [1, -1,  1, 1], [2, -1,  1, 1], [3, -1,  1, 1],
        [-3, -1,  2, 1], [-2, -1,  2, 1], [-1, -1,  2, 1], [0, -1,  2, 1], [1, -1,  2, 1], [2, -1,  2, 1], [3, -1,  2, 1],
        [-3, -1,  3, 1], [-2, -1,  3, 1], [-1, -1,  3, 1], [0, -1,  3, 1], [1, -1,  3, 1], [2, -1,  3, 1], [3, -1,  3, 1],

        // Tree Trunk (Wood Columns)
        [1, 0, 2, 3], 
        [1, 1, 2, 3], 
        
        // Tree Canopy Leaves
        [1, 2, 2, 4], [0, 2, 2, 4], [2, 2, 2, 4], [1, 2, 1, 4], [1, 2, 3, 4],
        [1, 3, 2, 4]
    ]
};

window.initSingleplayerEngine = function() {
    const canvas = document.getElementById('render-canvas');
    const logs = document.getElementById('chat-logs');
    
    if (logs) {
        const row = document.createElement('div');
        row.innerHTML = `<b style="color: #facc15;">SYSTEM:</b> <span style="color:#fff;">1st-Person 3D Engine. WASD to walk, move mouse to look around.</span>`;
        logs.appendChild(row);
    }

    // --- First-Person Camera Variables ---
    const player = {
        x: 0.0,
        y: 0.6, // Camera eye height sitting right inside the head space
        z: -1.5, // Start slightly back to view the tree straight ahead
        yaw: 0.0,   // Horizontal look rotation angle
        pitch: 0.0, // Vertical look tilting angle
        speed: 0.04
    };

    const mouse = { targetYaw: 0, targetPitch: 0 };
    
    window.addEventListener('mousemove', (e) => {
        // Map cursor coordinates directly to physical 3D radian looking vectors
        const normX = (e.clientX / window.innerWidth) * 2 - 1;
        const normY = (e.clientY / window.innerHeight) * 2 - 1;
        
        mouse.targetYaw = normX * 2.2;   // Horizontal rotational limits
        mouse.targetPitch = -normY * 1.2; // Vertical pitch limits
    });

    const keys = {};
    window.addEventListener('keydown', (e) => { keys[e.key.toLowerCase()] = true; });
    window.addEventListener('keyup', (e) => { keys[e.key.toLowerCase()] = false; });

    function handleFirstPersonPhysics() {
        // Linear interpolation for ultra-smooth fluid camera rotation look-up tables
        player.yaw += (mouse.targetYaw - player.yaw) * 0.15;
        player.pitch += (mouse.targetPitch - player.pitch) * 0.15;

        let moveX = 0;
        let moveZ = 0;

        // Vector directional calculations based on player's looking heading (Yaw)
        const sinY = Math.sin(player.yaw);
        const cosY = Math.cos(player.yaw);

        if (keys['w'] || keys['arrowup']) {
            moveX += sinY * player.speed;
            moveZ += cosY * player.speed;
        }
        if (keys['s'] || keys['arrowdown']) {
            moveX -= sinY * player.speed;
            moveZ -= cosY * player.speed;
        }
        if (keys['a'] || keys['arrowleft']) {
            moveX -= cosY * player.speed;
            moveZ += sinY * player.speed;
        }
        if (keys['d'] || keys['arrowright']) {
            moveX += cosY * player.speed;
            moveZ -= sinY * player.speed;
        }

        player.x += moveX;
        player.z += moveZ;

        // Keep player bounded within map borders footprint
        player.x = Math.max(-4, Math.min(4, player.x));
        player.z = Math.max(-4, Math.min(4, player.z));
    }

    // --- Math Vector Projector Module: Converts 3D space points to screen coordinates ---
    function project3DVertex(wx, wy, wz, blockSize) {
        // 1. Translation matrix relative to camera eyes positions
        let x = wx * blockSize - player.x * blockSize;
        let y = wy * blockSize - player.y * blockSize;
        let z = wz * blockSize - player.z * blockSize;

        // 2. Rotate horizontally (Yaw rotation around Y-Axis)
        let cosY = Math.cos(-player.yaw), sinY = Math.sin(-player.yaw);
        let x1 = x * cosY - z * sinY;
        let z1 = x * sinY + z * cosY;

        // 3. Rotate vertically (Pitch rotation around X-Axis)
        let cosP = Math.cos(-player.pitch), sinP = Math.sin(-player.pitch);
        let y2 = y * cosP - z1 * sinP;
        let z2 = y * sinP + z1 * cosP;

        // Behind view clip plane safeguard guardrail
        if (z2 <= 2) return null;

        // 4. Perspective Projection division equation
        const fovFactor = 450; // Controls lens focal field of view spread metrics
        const sx = (canvas.width / 2) + (x1 * fovFactor / z2);
        const sy = (canvas.height / 2) - (y2 * fovFactor / z2); // Invert Y for graphics screen standards

        return { x: sx, y: sy, z: z2 };
    }

    // Draws a solid filled polygon interface geometry face segment
    function drawPolygonFace(ctx, v1, v2, v3, v4, color) {
        if (!v1 || !v2 || !v3 || !v4) return;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(v1.x, v1.y);
        ctx.lineTo(v2.x, v2.y);
        ctx.lineTo(v3.x, v3.y);
        ctx.lineTo(v4.x, v4.y);
        ctx.closePath();
        ctx.fill();
        
        // Block outline borders grid separation lines overlay mesh
        ctx.strokeStyle = "rgba(0,0,0,0.18)";
        ctx.stroke();
    }

    function renderLoop() {
        if (canvas.style.display !== 'block') return;
        const ctx = canvas.getContext('2d');
        
        if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        handleFirstPersonPhysics();

        // Sky Box Clear Layer Color Fill
        ctx.fillStyle = "#1e293b"; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const scaleSize = 50; // Dimension boundary width multiplier for voxel nodes data blocks
        let renderStack = [];

        // Build composite render profiles list track array elements mappings
        window.ForestMap.blocks.forEach(b => {
            let bx = b[0], by = b[1], bz = b[2], typeId = b[3];

            // Pre-calculate coordinate translation positions for all 8 corners of each 3D box cube
            let c000 = project3DVertex(bx - 0.5, by - 0.5, bz - 0.5, scaleSize);
            let c100 = project3DVertex(bx + 0.5, by - 0.5, bz - 0.5, scaleSize);
            let c010 = project3DVertex(bx - 0.5, by + 0.5, bz - 0.5, scaleSize);
            let c110 = project3DVertex(bx + 0.5, by + 0.5, bz - 0.5, scaleSize);
            let c001 = project3DVertex(bx - 0.5, by - 0.5, bz + 0.5, scaleSize);
            let c101 = project3DVertex(bx + 0.5, by - 0.5, bz + 0.5, scaleSize);
            let c011 = project3DVertex(bx - 0.5, by + 0.5, bz + 0.5, scaleSize);
            let c111 = project3DVertex(bx + 0.5, by + 0.5, bz + 0.5, scaleSize);

            // Compute depth point using center average value coordinates
            let distanceZ = (bx - player.x)*(bx - player.x) + (by - player.y)*(by - player.y) + (bz - player.z)*(bz - player.z);

            renderStack.push({
                depth: distanceZ,
                id: typeId,
                corners: { c000, c100, c010, c110, c001, c101, c011, c111 }
            });
        });

        // Painter's Algorithm: Sort all blocks by distance from the player (farthest rendered first)
        renderStack.sort((a, b) => b.depth - a.depth);

        // Process color keys definitions maps records components parameters profiles properties
        renderStack.forEach(cube => {
            let topC, sideC, frontC;
            if (cube.id === 1) { // Grass Block
                topC = "#10b981"; sideC = "#047857"; frontC = "#78350f";
            } else if (cube.id === 3) { // Wood Trunk Log Block
                topC = "#b45309"; sideC = "#451a03"; frontC = "#292524";
            } else if (cube.id === 4) { // Leaves Block
                topC = "#059669"; sideC = "#065f46"; frontC = "#044e3a";
            } else { // Generic Grey Stone Block fallback placeholder indices profiles layout
                topC = "#9ca3af"; sideC = "#6b7280"; frontC = "#4b5563";
            }

            let c = cube.corners;

            // Draw individual independent structural 3D planar polygons segments inside first person geometry layer 
            // 1. Bottom Plane Face
            drawPolygonFace(ctx, c.c000, c.c100, c.c101, c.c001, frontC);
            // 2. Front Plane Face
            drawPolygonFace(ctx, c.c000, c.c100, c.c110, c.c010, sideC);
            // 3. Back Plane Face
            drawPolygonFace(ctx, c.c001, c.c101, c.c111, c.c011, sideC);
            // 4. Left Side Wall Face
            drawPolygonFace(ctx, c.c000, c.c001, c.c011, c.c010, frontC);
            // 5. Right Side Wall Face
            drawPolygonFace(ctx, c.c100, c.c101, c.c111, c.c110, frontC);
            // 6. Top Cap Crown Face 
            drawPolygonFace(ctx, c.c010, c.c110, c.c111, c.c011, topC);
        });

        // Crosshair HUD center targeting tracking indicators lines rendering logic
        ctx.fillStyle = "rgba(255,255,255,0.45)";
        ctx.fillRect(canvas.width / 2 - 6, canvas.height / 2 - 1, 12, 2);
        ctx.fillRect(canvas.width / 2 - 1, canvas.height / 2 - 6, 2, 12);

        requestAnimationFrame(renderLoop);
    }

    renderLoop();
};
