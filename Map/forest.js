/**
 * Map/forest.js
 * Optimized True First-Person 3D Voxel Engine Module
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
        [0, 0, 2, 3], 
        [0, 1, 2, 3], 
        
        // Tree Canopy Leaves
        [0, 2, 2, 4], [-1, 2, 2, 4], [1, 2, 2, 4], [0, 2, 1, 4], [0, 2, 3, 4],
        [0, 3, 2, 4]
    ]
};

window.initSingleplayerEngine = function() {
    const canvas = document.getElementById('render-canvas');
    const logs = document.getElementById('chat-logs');
    
    if (logs) {
        logs.innerHTML += `<div><b style="color: #facc15;">SYSTEM:</b> <span style="color:#fff;">First-Person Engine Active. Move Mouse to look, WASD to walk.</span></div>`;
    }

    // --- First Person Camera Configurations ---
    const player = {
        x: 0.0,
        y: 0.8,      // Eye-level sitting inside the head box
        z: -2.0,     // Start back so the landscape is clearly visible
        yaw: 0.0,    // Horizontal look rotation vector
        pitch: 0.0,  // Vertical look tilt angle vector
        speed: 0.05
    };

    const mouse = { currentX: 0, currentY: 0 };
    
    // Track relative mouse movement on window axis
    window.addEventListener('mousemove', (e) => {
        const normX = (e.clientX / window.innerWidth) * 2 - 1;
        const normY = (e.clientY / window.innerHeight) * 2 - 1;
        
        // Scale input bounds directly to target looking angles 
        mouse.currentX = normX * 2.5; 
        mouse.currentY = -normY * 1.5;
    });

    const keys = {};
    window.addEventListener('keydown', (e) => { keys[e.key.toLowerCase()] = true; });
    window.addEventListener('keyup', (e) => { keys[e.key.toLowerCase()] = false; });

    function handlePlayerMovement() {
        // Smooth camera rotation looking matrix transformations
        player.yaw += (mouse.currentX - player.yaw) * 0.15;
        player.pitch += (mouse.currentY - player.pitch) * 0.15;
        
        // Clamp vertical look angle to avoid flipping upside down
        player.pitch = Math.max(-1.4, Math.min(1.4, player.pitch));

        let moveX = 0;
        let moveZ = 0;

        const sinYaw = Math.sin(player.yaw);
        const cosYaw = Math.cos(player.yaw);

        // Minecraft directional vector configurations based on current Yaw angle
        if (keys['w'] || keys['arrowup']) {
            moveX += sinYaw * player.speed;
            moveZ += cosYaw * player.speed;
        }
        if (keys['s'] || keys['arrowdown']) {
            moveX -= sinYaw * player.speed;
            moveZ -= cosYaw * player.speed;
        }
        if (keys['a'] || keys['arrowleft']) {
            moveX -= cosYaw * player.speed;
            moveZ += sinYaw * player.speed;
        }
        if (keys['d'] || keys['arrowright']) {
            moveX += cosYaw * player.speed;
            moveZ -= sinYaw * player.speed;
        }

        player.x += moveX;
        player.z += moveZ;

        // Keep player safe inside map bounds parameters
        player.x = Math.max(-4, Math.min(4, player.x));
        player.z = Math.max(-4, Math.min(4, player.z));
    }

    // --- 3D Projection Matrix Pipeline ---
    function transform3DVertex(wx, wy, wz, scaleSize) {
        // 1. Translate position relative to the first person camera point
        let x = wx * scaleSize - player.x * scaleSize;
        let y = wy * scaleSize - player.y * scaleSize;
        let z = wz * scaleSize - player.z * scaleSize;

        // 2. Apply Yaw rotation (Turning head left/right around Y axis)
        let cosY = Math.cos(-player.yaw), sinY = Math.sin(-player.yaw);
        let x1 = x * cosY - z * sinY;
        let z1 = x * sinY + z * cosY;

        // 3. Apply Pitch rotation (Tilting head up/down around X axis)
        let cosP = Math.cos(-player.pitch), sinP = Math.sin(-player.pitch);
        let y2 = y * cosP - z1 * sinP;
        let z2 = y * sinP + z1 * cosP;

        // Near clipping plane safeguard logic to ensure blocks don't distort backwards
        if (z2 < 4) return null;

        // 4. Focal length perspective projection projection logic
        const fov = 480; 
        const sx = (canvas.width / 2) + (x1 * fov / z2);
        const sy = (canvas.height / 2) - (y2 * fov / z2);

        return { x: sx, y: sy, z: z2 };
    }

    function renderPolygonFace(ctx, v1, v2, v3, v4, color) {
        // If any vertex drops off due to near plane clipping, skip rendering this face segment
        if (!v1 || !v2 || !v3 || !v4) return;

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(v1.x, v1.y);
        ctx.lineTo(v2.x, v2.y);
        ctx.lineTo(v3.x, v3.y);
        ctx.lineTo(v4.x, v4.y);
        ctx.closePath();
        ctx.fill();
        
        // Block outline mesh wireframe overlay structure
        ctx.strokeStyle = "rgba(0,0,0,0.15)";
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    function gameRenderPipeline() {
        if (canvas.style.display !== 'block') return;
        const ctx = canvas.getContext('2d');
        
        if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        handlePlayerMovement();

        // Sky Box clear background buffer trace fill
        ctx.fillStyle = "#1e293b"; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const blockSize = 50;
        let sortedBlocks = [];

        // Precompute distance mapping metrics parameters
        window.ForestMap.blocks.forEach(b => {
            let bx = b[0], by = b[1], bz = b[2], typeId = b[3];

            // Project all 8 individual vertices composing the voxel boundaries framework
            let c000 = transform3DVertex(bx - 0.5, by - 0.5, bz - 0.5, blockSize);
            let c100 = transform3DVertex(bx + 0.5, by - 0.5, bz - 0.5, blockSize);
            let c010 = transform3DVertex(bx - 0.5, by + 0.5, bz - 0.5, blockSize);
            let c110 = transform3DVertex(bx + 0.5, by + 0.5, bz - 0.5, blockSize);
            let c001 = transform3DVertex(bx - 0.5, by - 0.5, bz + 0.5, blockSize);
            let c101 = transform3DVertex(bx + 0.5, by - 0.5, bz + 0.5, blockSize);
            let c011 = transform3DVertex(bx - 0.5, by + 0.5, bz + 0.5, blockSize);
            let c111 = transform3DVertex(bx + 0.5, by + 0.5, bz + 0.5, blockSize);

            // True depth Euclidean equation metric track
            let dist = Math.pow(bx - player.x, 2) + Math.pow(by - player.y, 2) + Math.pow(bz - player.z, 2);

            sortedBlocks.push({
                depth: dist,
                id: typeId,
                verts: { c000, c100, c010, c110, c001, c101, c011, c111 }
            });
        });

        // Painter's sorting algorithm: draw distance layers farthest to closest
        sortedBlocks.sort((a, b) => b.depth - a.depth);

        // Map block textures palette hex color codes
        sortedBlocks.forEach(cube => {
            let topC, sideC, frontC;
            if (cube.id === 1) { // Grass
                topC = "#10b981"; sideC = "#047857"; frontC = "#065f46";
            } else if (cube.id === 3) { // Wood Log
                topC = "#b45309"; sideC = "#78350f"; frontC = "#451a03";
            } else if (cube.id === 4) { // Leaves
                topC = "#059669"; sideC = "#047857"; frontC = "#065f46";
            } else { // Fallback Voxel Node
                topC = "#9ca3af"; sideC = "#6b7280"; frontC = "#4b5563";
            }

            let v = cube.verts;

            // Draw individual geometric flat faces mapped onto first person depth array bounds
            // Front Side Plane
            renderPolygonFace(ctx, v.c000, v.c100, v.c110, v.c010, sideC);
            // Back Side Plane
            renderPolygonFace(ctx, v.c101, v.c001, v.c011, v.c111, sideC);
            // Left Wall Plane
            renderPolygonFace(ctx, v.c001, v.c000, v.c010, v.c011, frontC);
            // Right Wall Plane
            renderPolygonFace(ctx, v.c100, v.c101, v.c111, v.c110, frontC);
            // Bottom Base Plane
            renderPolygonFace(ctx, v.c001, v.c101, v.c100, v.c000, frontC);
            // Top Cap Plane
            renderPolygonFace(ctx, v.c010, v.c110, v.c111, v.c011, topC);
        });

        // Center crosshair HUD graphics indicators
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.fillRect(canvas.width / 2 - 6, canvas.height / 2 - 1, 12, 2);
        ctx.fillRect(canvas.width / 2 - 1, canvas.height / 2 - 6, 2, 12);

        requestAnimationFrame(gameRenderPipeline);
    }

    gameRenderPipeline();
};
