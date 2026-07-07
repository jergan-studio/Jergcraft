/**
 * jergcraft.js
 * Comprehensive 3D First-Person Game Loop & Projection Engine
 */
(function() {
    'use strict';

    // Core Engine State Object
    window.JergcraftEngine = {
        isGameplayActive: false,
        activeWorldMap: null,
        blockSize: 40, // Visual scale factor of voxel blocks on screen

        // 3D First-Person Camera System Variables
        player: {
            x: 0.0,
            y: 0.7,      // Fixed camera eye-height sitting naturally inside the voxel block space
            z: -2.0,     // Start spawned backwards to keep the landscape directly in frame
            yaw: 0.0,    // Left/Right horizontal rotation look tracking angle
            pitch: 0.0,  // Up/Down vertical tilt look tracking angle
            speed: 0.04  // General walk velocity factor
        },

        mouse: {
            targetYaw: 0,
            targetPitch: 0
        },

        keys: {}
    };

    const E = window.JergcraftEngine;

    // --- MOUSE & INPUT LOOK VECTORS TRACKING ---
    window.addEventListener('mousemove', (e) => {
        // Calculate raw position percentage from center screen boundary paths (-1 to 1)
        const normX = (e.clientX / window.innerWidth) * 2 - 1;
        const normY = (e.clientY / window.innerHeight) * 2 - 1;
        
        // Map normalized layout bounds directly to physical 3D looking radians
        E.mouse.targetYaw = normX * 3.0;     // Full horizontal look tracking spread
        E.mouse.targetPitch = -normY * 1.5;  // Vertical limit constraint track
    });

    // --- KEYBOARD ENGINE TICKET LISTENERS ---
    window.addEventListener('keydown', (e) => { E.keys[e.key.toLowerCase()] = true; });
    window.addEventListener('keyup', (e) => { E.keys[e.key.toLowerCase()] = false; });

    function handleFirstPersonPhysics() {
        // Smoothly ease camera rotations toward mouse target indices using linear interpolation
        E.player.yaw += (E.mouse.targetYaw - E.player.yaw) * 0.12;
        E.player.pitch += (E.mouse.targetPitch - E.player.pitch) * 0.12;
        
        // Strict boundary clamp to prevent the first-person camera from flipping upside down
        E.player.pitch = Math.max(-1.3, Math.min(1.3, E.player.pitch));

        let moveX = 0;
        let moveZ = 0;

        // Compute step directions relative to the angle the player is looking
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

        // Clip constraints to keep the first-person camera safe inside map boundary edges
        E.player.x = Math.max(-4.5, Math.min(4.5, E.player.x));
        E.player.z = Math.max(-4.5, Math.min(4.5, E.player.z));
    }

    /**
     * 3D Vertex Vector Projection: Translates and rotates absolute world positions 
     * directly into 2D screenspace coordinate points based on first-person optics.
     */
    function project3DVertex(canvas, wx, wy, wz) {
        // Step 1: Translate world coordinates relative to player eyes position offset
        let x = wx * E.blockSize - E.player.x * E.blockSize;
        let y = wy * E.blockSize - E.player.y * E.blockSize;
        let z = wz * E.blockSize - E.player.z * E.blockSize;

        // Step 2: Rotate horizontally around Y-axis (Yaw look turning)
        let cosY = Math.cos(-E.player.yaw), sinY = Math.sin(-E.player.yaw);
        let x1 = x * cosY - z * sinY;
        let z1 = x * sinY + z * cosY;

        // Step 3: Rotate vertically around X-axis (Pitch look tilting)
        let cosP = Math.cos(-E.player.pitch), sinP = Math.sin(-E.player.pitch);
        let y2 = y * cosP - z1 * sinP;
        let z2 = y * sinP + z1 * cosP;

        // Behind-camera clipping guard plane (destroys backward distortion artifact vectors)
        if (z2 < 3) return null;

        // Step 4: Map 3D coordinate point onto 2D screenspace coordinates using focal depth division
        const focalLength = 500; 
        const sx = (canvas.width / 2) + (x1 * focalLength / z2);
        const sy = (canvas.height / 2) - (y2 * focalLength / z2);

        return { x: sx, y: sy, z: z2 };
    }

    /**
     * Renders a solid geometric 3D flat polygon plane face structure 
     * complete with clean edge borders mesh separation lines.
     */
    function renderPolygonFace(ctx, v1, v2, v3, v4, color) {
        if (!v1 || !v2 || !v3 || !v4) return; // Ignore clipped faces cleanly

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(v1.x, v1.y);
        ctx.lineTo(v2.x, v2.y);
        ctx.lineTo(v3.x, v3.y);
        ctx.lineTo(v4.x, v4.y);
        ctx.closePath();
        ctx.fill();
        
        // Block grid wireframes mesh trace overlay overlay layer
        ctx.strokeStyle = "rgba(0,0,0,0.15)";
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    /**
     * Main Core Graphics Loop Hook
     */
    window.globalRenderPipelineLoop = function() {
        const canvas = document.getElementById('render-canvas');
        if (!canvas) return requestAnimationFrame(window.globalRenderPipelineLoop);
        
        const ctx = canvas.getContext('2d');
        
        // Dynamically reshape canvas drawing resolutions matching window size changes
        if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        // Drive game physics ticks only when inside an active world
        if (E.isGameplayActive && E.activeWorldMap) {
            handleFirstPersonPhysics();
        }

        // Sky Box Background Buffer Sweep Fill
        ctx.fillStyle = "#1e293b"; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Determine current map coordinate block arrays data pool source
        let activeBlocksList = [];
        if (E.isGameplayActive && E.activeWorldMap) {
            activeBlocksList = E.activeWorldMap.blocks || [];
        } else if (window.menuPanoramaWorld && window.menuPanoramaWorld.blocks) {
            // Smoothly auto-spin the home page panorama background
            if (typeof window.panoramaAngle !== 'undefined') {
                window.panoramaAngle += 0.002;
                E.player.yaw = window.panoramaAngle;
                E.player.pitch = -0.15;
                E.player.x = 0; E.player.y = 0.5; E.player.z = -3.5;
            }
            activeBlocksList = window.menuPanoramaWorld.blocks;
        }

        let renderStack = [];

        // Project and build voxel vertex maps across active list matrix records
        activeBlocksList.forEach(b => {
            let bx = b[0], by = b[1], bz = b[2], typeId = b[3];

            // Project all 8 3D corner coordinates representing the boundaries of a voxel cube
            let c000 = project3DVertex(canvas, bx - 0.5, by - 0.5, bz - 0.5);
            let c100 = project3DVertex(canvas, bx + 0.5, by - 0.5, bz - 0.5);
            let c010 = project3DVertex(canvas, bx - 0.5, by + 0.5, bz - 0.5);
            let c110 = project3DVertex(canvas, bx + 0.5, by + 0.5, bz - 0.5);
            let c001 = project3DVertex(canvas, bx - 0.5, by - 0.5, bz + 0.5);
            let c101 = project3DVertex(canvas, bx + 0.5, by - 0.5, bz + 0.5);
            let c011 = project3DVertex(canvas, bx - 0.5, by + 0.5, bz + 0.5);
            let c111 = project3DVertex(canvas, bx + 0.5, by + 0.5, bz + 0.5);

            // Compute distance depth values using Euclidean vector parameters equations
            let distanceSquare = Math.pow(bx - E.player.x, 2) + Math.pow(by - E.player.y, 2) + Math.pow(bz - E.player.z, 2);

            renderStack.push({
                depth: distanceSquare,
                id: typeId,
                verts: { c000, c100, c010, c110, c001, c101, c011, c111 }
            });
        });

        // Painter's Sorting Logic: Render all elements in order from farthest distance down to closest focus depth
        renderStack.sort((a, b) => b.depth - a.depth);

        // Map texture tones arrays keys and draw faces loop onto view screen canvas matrix positions
        renderStack.forEach(cube => {
            let topC, sideC, frontC;
            if (cube.id === 1) { // Grass Blocks Tonal Palette
                topC = "#10b981"; sideC = "#047857"; frontC = "#065f46";
            } else if (cube.id === 3) { // Wood Log Columns Palette
                topC = "#b45309"; sideC = "#78350f"; frontC = "#451a03";
            } else if (cube.id === 4) { // Canopy Leaves Palette
                topC = "#059669"; sideC = "#047857"; frontC = "#065f46";
            } else { // Fallback standard block placeholder metrics properties
                topC = "#9ca3af"; sideC = "#6b7280"; frontC = "#4b5563";
            }

            let v = cube.verts;

            // Render all 6 3D poly face boundaries cleanly relative to first-person view lines
            renderPolygonFace(ctx, v.c000, v.c100, v.c110, v.c010, sideC);  // Front
            renderPolygonFace(ctx, v.c101, v.c001, v.c011, v.c111, sideC);  // Back
            renderPolygonFace(ctx, v.c001, v.c000, v.c010, v.c011, frontC); // Left
            renderPolygonFace(ctx, v.c100, v.c101, v.c111, v.c110, frontC); // Right
            renderPolygonFace(ctx, v.c001, v.c101, v.c100, v.c000, frontC); // Bottom
            renderPolygonFace(ctx, v.c010, v.c110, v.c111, v.c011, topC);   // Top
        });

        // Draw First-Person targeting center crosshair HUD layout tracking indicators lines
        if (E.isGameplayActive) {
            ctx.fillStyle = "rgba(255,255,255,0.55)";
            ctx.fillRect(canvas.width / 2 - 6, canvas.height / 2 - 1, 12, 2);
            ctx.fillRect(canvas.width / 2 - 1, canvas.height / 2 - 6, 2, 12);
        }

        requestAnimationFrame(window.globalRenderPipelineLoop);
    };

    /**
     * Boots a selected world session data model up into the first person engine pipeline loops.
     */
    window.loadAndBootEngineSession = function(targetWorldProfile) {
        E.isGameplayActive = true;
        E.activeWorldMap = targetWorldProfile;
        
        const selectionMenu = document.getElementById('screen-worlds-selector');
        if (selectionMenu) selectionMenu.classList.add('hidden');
        
        const chatPanel = document.getElementById('chat-panel');
        const chatLogs = document.getElementById('chat-logs');
        if (chatPanel) chatPanel.style.display = 'flex';
        if (chatLogs) {
            chatLogs.innerHTML = `<div><b style="color:#facc15;">SYSTEM:</b> <span style="color:#fff;">First-Person engine initiated on "${targetWorldProfile.name}". Move around with WASD / Move mouse cursor to look around.</span></div>`;
        }
        
        // Reset player spawn coordinates parameters directly inside the world layout slice matrix footprint
        E.player.x = 0.0; E.player.y = 0.7; E.player.z = -2.0;
        E.player.yaw = 0.0; E.player.pitch = 0.0;
    };

    // Auto-initialize background rendering pipeline instantly on script load event trace tracking loop
    window.globalRenderPipelineLoop();

})();
