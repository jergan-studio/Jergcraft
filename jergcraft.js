/**
 * jergcraft.js
 * Advanced First-Person Voxel Engine Alternative
 * Includes Canvas Pointer Locking and 1st-Person Perspective Hand Mesh Overlays
 */
(function() {
    'use strict';

    window.JergcraftEngine = {
        isGameplayActive: false,
        activeWorldMap: null,
        blockSize: 45, 

        // True First Person Eye-Level Viewport Variables
        player: {
            x: 0.0,
            y: 0.7,      // Fixed vertical view height inside player space
            z: -1.5,     // Initial spawn point depth
            yaw: 0.0,    // Left / Right looking angle tracking vector
            pitch: 0.0,  // Up / Down looking tracking angle vector
            speed: 0.04
        },

        keys: {}
    };

    const E = window.JergcraftEngine;

    // --- TRUE POINTER LOCK API INTEGRATION ---
    function initPointerLockControls(canvas) {
        // Request mouse lock state whenever the player clicks into the environment canvas
        canvas.addEventListener('click', () => {
            if (E.isGameplayActive) {
                canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
                canvas.requestPointerLock();
            }
        });

        // Intercept raw relative motion updates across desktop screen bounds window planes
        document.addEventListener('pointerlockchange', mouseLockUpdate, false);
        document.addEventListener('mozpointerlockchange', mouseLockUpdate, false);

        function mouseLockUpdate() {
            if (document.pointerLockElement === canvas || document.mozPointerLockElement === canvas) {
                document.addEventListener("mousemove", updateCameraRotationLook, false);
            } else {
                document.removeEventListener("mousemove", updateCameraRotationLook, false);
            }
        }

        function updateCameraRotationLook(e) {
            // Read hardware level axis mouse offsets directly
            const movementX = e.movementX || e.mozMovementX || 0;
            const movementY = e.movementY || e.mozMovementY || 0;

            // Apply orientation changes to look vectors matching real-time mouse adjustments
            E.player.yaw += movementX * 0.0025;
            E.player.pitch -= movementY * 0.0025;

            // Clamp looking up/down bounds to prevent screen flipping over backwards
            E.player.pitch = Math.max(-1.4, Math.min(1.4, E.player.pitch));
        }
    }

    // --- KEYBOARD DIRECT INPUT MATRICES HANDLERS ---
    window.addEventListener('keydown', (e) => { E.keys[e.key.toLowerCase()] = true; });
    window.addEventListener('keyup', (e) => { E.keys[e.key.toLowerCase()] = false; });

    function processFirstPersonMovement() {
        let moveX = 0;
        let moveZ = 0;

        // Calculate forward/sideways vectors based on the player's yaw angle
        const sinYaw = Math.sin(E.player.yaw);
        const cosYaw = Math.cos(E.player.yaw);

        if (E.keys['w'] || E.keys['arrowup']) {
            moveX += sinYaw * E.player.speed;
            moveZ += cosYaw * E.player.speed;
        }
        if (E.keys['s'] || E.keys['arrowdown']) {
            moveX -= sinYaw * E.player.speed;
            moveZ -= cosYaw * E.player.speed;
        }
        if (E.keys['a'] || E.keys['arrowleft']) {
            moveX -= cosYaw * E.player.speed; // Relative Strafe Left
            moveZ += sinYaw * E.player.speed;
        }
        if (E.keys['d'] || E.keys['arrowright']) {
            moveX += cosYaw * E.player.speed; // Relative Strafe Right
            moveZ -= sinYaw * E.player.speed;
        }

        E.player.x += moveX;
        E.player.z += moveZ;

        // Soft limit bounds to contain camera views safely inside the engine map space
        E.player.x = Math.max(-4.5, Math.min(4.5, E.player.x));
        E.player.z = Math.max(-4.5, Math.min(4.5, E.player.z));
    }

    /**
     * 3D Vertex Vector Projection: Translates and rotates absolute world positions 
     * directly into 2D screen space coordinates based on first-person optics.
     */
    function project3DVertex(canvas, wx, wy, wz) {
        // Shift absolute coordinate targets relative to camera positions
        let x = wx * E.blockSize - E.player.x * E.blockSize;
        let y = wy * E.blockSize - E.player.y * E.blockSize;
        let z = wz * E.blockSize - E.player.z * E.blockSize;

        // Yaw Turning Matrix Transformation (Horizontal Rotation)
        let cosY = Math.cos(-E.player.yaw), sinY = Math.sin(-E.player.yaw);
        let x1 = x * cosY - z * sinY;
        let z1 = x * sinY + z * cosY;

        // Pitch Tilting Matrix Transformation (Vertical Rotation)
        let cosP = Math.cos(-E.player.pitch), sinP = Math.sin(-E.player.pitch);
        let y2 = y * cosP - z1 * sinP;
        let z2 = y * sinP + z1 * cosP;

        // Clipping Safeguard plane: ensures polygons behind the viewer do not invert
        if (z2 < 2.5) return null;

        // Compute aspect ratio correct screen coordinate coordinates points
        const fovScale = 480; 
        const sx = (canvas.width / 2) + (x1 * fovScale / z2);
        const sy = (canvas.height / 2) - (y2 * fovScale / z2);

        return { x: sx, y: sy, z: z2 };
    }

    function renderPolygonFace(ctx, v1, v2, v3, v4, color) {
        if (!v1 || !v2 || !v3 || !v4) return; // Drop damaged poly fragments cleanly

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(v1.x, v1.y);
        ctx.lineTo(v2.x, v2.y);
        ctx.lineTo(v3.x, v3.y);
        ctx.lineTo(v4.x, v4.y);
        ctx.closePath();
        ctx.fill();
        
        // Edge layout grid trace outline meshes
        ctx.strokeStyle = "rgba(0,0,0,0.14)";
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    /**
     * Draws an immersive 1st-person perspective player hand/arm model 
     * fixed into the bottom corner of the viewport frame overlay layer.
     */
    function drawFirstPersonHandOverlay(ctx, canvas) {
        const baseW = canvas.width;
        const baseH = canvas.height;

        // Add subtle view bobbing movement as the player walks
        let bobX = 0;
        let bobY = 0;
        if (E.keys['w'] || E.keys['s'] || E.keys['a'] || E.keys['d']) {
            const time = Date.now() * 0.008;
            bobX = Math.sin(time) * 6;
            bobY = Math.abs(Math.cos(time)) * 8;
        }

        const handWidth = baseW * 0.12;
        const handHeight = baseH * 0.38;
        const startX = baseW * 0.78 + bobX;
        const startY = baseH * 0.70 + bobY;

        ctx.save();
        
        // 1. Draw Arm/Sleeve base rectangle block
        ctx.fillStyle = "#e0f2fe"; // Light cyan base color tone
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX + handWidth, startY - (handHeight * 0.15));
        ctx.lineTo(startX + handWidth * 1.5, baseH);
        ctx.lineTo(startX - handWidth * 0.2, baseH);
        ctx.closePath();
        ctx.fill();

        // 2. Draw Skin/Hand box segment overlay layer bounds
        ctx.fillStyle = "#ffedd5"; // Natural peach skin tone
        ctx.beginPath();
        ctx.moveTo(startX + (handWidth * 0.1), startY);
        ctx.lineTo(startX + (handWidth * 0.8), startY - (handHeight * 0.05));
        ctx.lineTo(startX + (handWidth * 0.6), startY - (handHeight * 0.28));
        ctx.lineTo(startX - (handWidth * 0.1), startY - (handHeight * 0.20));
        ctx.closePath();
        ctx.fill();

        // Outer structural shadow accents shading trace lines
        ctx.strokeStyle = "rgba(0,0,0,0.1)";
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.restore();
    }

    /**
     * Main Core Graphics Render Loop Hook Pipeline
     */
    window.globalRenderPipelineLoop = function() {
        const canvas = document.getElementById('render-canvas');
        if (!canvas) return requestAnimationFrame(window.globalRenderPipelineLoop);
        
        const ctx = canvas.getContext('2d');
        
        // Match drawing display layers directly to parent display view size models
        if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        // Process physics movement updates
        if (E.isGameplayActive && E.activeWorldMap) {
            processFirstPersonMovement();
        }

        // Deep blue sky background clear operations
        ctx.fillStyle = "#0f172a"; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let activeBlocksList = [];
        if (E.isGameplayActive && E.activeWorldMap) {
            activeBlocksList = E.activeWorldMap.blocks || [];
        } else if (window.menuPanoramaWorld && window.menuPanoramaWorld.blocks) {
            // Spin main panorama view index elements smoothly if on menu screens
            if (typeof window.panoramaAngle !== 'undefined') {
                window.panoramaAngle += 0.0015;
                E.player.yaw = window.panoramaAngle;
                E.player.pitch = -0.10;
                E.player.x = 0; E.player.y = 0.5; E.player.z = -3.0;
            }
            activeBlocksList = window.menuPanoramaWorld.blocks;
        }

        let renderStack = [];

        // Project coordinate blocks records items maps arrays profiles lists
        activeBlocksList.forEach(b => {
            let bx = b[0], by = b[1], bz = b[2], typeId = b[3];

            // Render absolute projection space coordinates for all 8 corners of the box block
            let c000 = project3DVertex(canvas, bx - 0.5, by - 0.5, bz - 0.5);
            let c100 = project3DVertex(canvas, bx + 0.5, by - 0.5, bz - 0.5);
            let c010 = project3DVertex(canvas, bx - 0.5, by + 0.5, bz - 0.5);
            let c110 = project3DVertex(canvas, bx + 0.5, by + 0.5, bz - 0.5);
            let c001 = project3DVertex(canvas, bx - 0.5, by - 0.5, bz + 0.5);
            let c101 = project3DVertex(canvas, bx + 0.5, by - 0.5, bz + 0.5);
            let c011 = project3DVertex(canvas, bx - 0.5, by + 0.5, bz + 0.5);
            let c111 = project3DVertex(canvas, bx + 0.5, by + 0.5, bz + 0.5);

            // True depth Euclidean equation metric track
            let dist = Math.pow(bx - E.player.x, 2) + Math.pow(by - E.player.y, 2) + Math.pow(bz - E.player.z, 2);

            renderStack.push({
                depth: dist,
                id: typeId,
                verts: { c000, c100, c010, c110, c001, c101, c011, c111 }
            });
        });

        // Painter's Sorting Logic: Render elements from back to front to ensure accurate depth layering
        renderStack.sort((a, b) => b.depth - a.depth);

        // Map blocks texture array hex palettes properties variables indices
        renderStack.forEach(cube => {
            let topC, sideC, frontC;
            if (cube.id === 1) { // Grass Blocks Palette
                topC = "#10b981"; sideC = "#047857"; frontC = "#065f46";
            } else if (cube.id === 3) { // Wood Log Columns Palette
                topC = "#b45309"; sideC = "#78350f"; frontC = "#451a03";
            } else if (cube.id === 4) { // Canopy Leaves Palette
                topC = "#059669"; sideC = "#047857"; frontC = "#065f46";
            } else { // Fallback stone voxel color indicators
                topC = "#9ca3af"; sideC = "#6b7280"; frontC = "#4b5563";
            }

            let v = cube.verts;

            // Render all 6 geometric flat layout polygons faces onto viewport layers positions
            renderPolygonFace(ctx, v.c000, v.c100, v.c110, v.c010, sideC);  // Front Side Plane
            renderPolygonFace(ctx, v.c101, v.c001, v.c011, v.c111, sideC);  // Back Side Plane
            renderPolygonFace(ctx, v.c001, v.c000, v.c010, v.c011, frontC); // Left Side Plane
            renderPolygonFace(ctx, v.c100, v.c101, v.c111, v.c110, frontC); // Right Side Plane
            renderPolygonFace(ctx, v.c001, v.c101, v.c100, v.c000, frontC); // Bottom Base Plane
            renderPolygonFace(ctx, v.c010, v.c110, v.c111, v.c011, topC);   // Top Cap Plane
        });

        // Overlay first-person graphic HUD components if world is active
        if (E.isGameplayActive) {
            // 1. Draw Target Center Crosshair
            ctx.fillStyle = "rgba(255,255,255,0.45)";
            ctx.fillRect(canvas.width / 2 - 6, canvas.height / 2 - 1, 12, 2);
            ctx.fillRect(canvas.width / 2 - 1, canvas.height / 2 - 6, 2, 12);

            // 2. Draw 1st Person Perspective Arm Mesh
            drawFirstPersonHandOverlay(ctx, canvas);
        }

        requestAnimationFrame(window.globalRenderPipelineLoop);
    };

    /**
     * Boots a selected world session data model up into the first person engine pipeline loops.
     */
    window.loadAndBootEngineSession = function(targetWorldProfile) {
        E.isGameplayActive = true;
        E.activeWorldMap = targetWorldProfile;
        
        const selectorOverlay = document.getElementById('screen-worlds-selector');
        if (selectorOverlay) selectorOverlay.classList.add('hidden');
        
        const chatPanel = document.getElementById('chat-panel');
        const chatLogs = document.getElementById('chat-logs');
        if (chatPanel) chatPanel.style.display = 'flex';
        if (chatLogs) {
            chatLogs.innerHTML = `<div><b style="color:#facc15;">SYSTEM:</b> <span style="color:#fff;">First-Person Mouse Lock engaged. Click on screen to capture mouse. Use WASD to walk.</span></div>`;
        }
        
        // Reset player positions vectors inside coordinate map matrix arrays footprint
        E.player.x = 0.0; E.player.y = 0.7; E.player.z = -1.5;
        E.player.yaw = 0.0; E.player.pitch = 0.0;

        // Initialize Pointer Lock elements tracking setups
        const canvas = document.getElementById('render-canvas');
        if (canvas) initPointerLockControls(canvas);
    };

    // Auto trigger frame loop sequence processing tracking array actions
    window.globalRenderPipelineLoop();

})();
