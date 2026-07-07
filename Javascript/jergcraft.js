/**
 * jergcraft.js
 * The Core Engine Driver Module for Jergcraft Voxel 3D Edition.
 * Handles World Slices, Player Physics, and True First-Person 3D Matrix Projection.
 */
(function() {
    'use strict';

    // --- GLOBAL STATE REGISTRY ---
    window.JergcraftEngine = {
        isGameplayActive: false,
        activeWorldMap: null,
        wsUplinkChannel: null,
        blockSize: 50, // Dimension scale size of voxel blocks in 3D canvas units
        
        // --- TRUE FIRST-PERSON CAMERA PROFILE ---
        player: {
            x: 0.0,
            y: 0.8,      // Eye height sitting squarely inside the camera head box
            z: -2.5,     // Start position pushed backward to clearly face the map scene
            yaw: 0.0,    // Horizontal look rotation vector (Mouse X tracking value)
            pitch: 0.0,  // Vertical look tilt angle vector (Mouse Y tracking value)
            speed: 0.05
        },
        
        mouse: {
            currentX: 0,
            currentY: 0
        },
        
        keys: {}
    };

    const E = window.JergcraftEngine;

    // --- MOUSE TRACKING & MATRIX INTERPOLATION ---
    window.addEventListener('mousemove', (e) => {
        // Map cursor location to normalized coordinates (-1 to 1)
        const normX = (e.clientX / window.innerWidth) * 2 - 1;
        const normY = (e.clientY / window.innerHeight) * 2 - 1;
        
        // Multiply by physical radian boundaries to restrict maximum look limits
        E.mouse.currentX = normX * 2.5; 
        E.mouse.currentY = -normY * 1.5;
    });

    // --- KEYBOARD INPUT ENGINE LISTENERS ---
    window.addEventListener('keydown', (e) => { E.keys[e.key.toLowerCase()] = true; });
    window.addEventListener('keyup', (e) => { E.keys[e.key.toLowerCase()] = false; });

    /**
     * Calculates fluid forward, backward, and strafe vectors 
     * matching the exact angle the camera is currently looking.
     */
    function handleFirstPersonPhysics() {
        // Linear interpolation look mechanics
        E.player.yaw += (E.mouse.currentX - E.player.yaw) * 0.15;
        E.player.pitch += (E.mouse.currentY - E.player.pitch) * 0.15;
        
        // Stop player from twisting upside down over their head
        E.player.pitch = Math.max(-1.4, Math.min(1.4, E.player.pitch));

        let moveX = 0;
        let moveZ = 0;

        const sinYaw = Math.sin(E.player.yaw);
        const cosYaw = Math.cos(E.player.yaw);

        // Movement matrix calculations mapped off looking rotation
        if (E.keys['w'] || E.keys['arrowup']) {
            moveX += sinYaw * E.player.speed;
            moveZ += cosYaw * E.player.speed;
        }
        if (E.keys['s'] || E.keys['arrowdown']) {
            moveX -= sinYaw * E.player.speed;
            moveZ -= cosYaw * E.player.speed;
        }
        if (E.keys['a'] || E.keys['arrowleft']) {
            moveX -= cosYaw * E.player.speed;
            moveZ += sinYaw * E.player.speed;
        }
        if (E.keys['d'] || E.keys['arrowright']) {
            moveX += cosYaw * E.player.speed;
            moveZ -= sinYaw * E.player.speed;
        }

        E.player.x += moveX;
        E.player.z += moveZ;

        // Keep player enclosed within standard map limits footprint
        E.player.x = Math.max(-5, Math.min(5, E.player.x));
        E.player.z = Math.max(-5, Math.min(5, E.player.z));
    }

    /**
     * Core 3D Projection Equation: Translates, rotates, and projects a 
     * 3D space vertex coordinate onto your flat 2D viewport screen area.
     */
    function transform3DVertex(canvas, wx, wy, wz) {
        // 1. Shift world space position relative to the player's 1st-person eyes
        let x = wx * E.blockSize - E.player.x * E.blockSize;
        let y = wy * E.blockSize - E.player.y * E.blockSize;
        let z = wz * E.blockSize - E.player.z * E.blockSize;

        // 2. Head turn rotation matrix (Horizontal Yaw)
        let cosY = Math.cos(-E.player.yaw), sinY = Math.sin(-E.player.yaw);
        let x1 = x * cosY - z * sinY;
        let z1 = x * sinY + z * cosY;

        // 3. Head tilt rotation matrix (Vertical Pitch)
        let cosP = Math.cos(-E.player.pitch), sinP = Math.sin(-E.player.pitch);
        let y2 = y * cosP - z1 * sinP;
        let z2 = y * sinP + z1 * cosP;

        // Near-plane rendering wall safety clip limit
        if (z2 < 4) return null;

        // 4. Mathematical focal split division logic
        const fov = 480; 
        const sx = (canvas.width / 2) + (x1 * fov / z2);
        const sy = (canvas.height / 2) - (y2 * fov / z2);

        return { x: sx, y: sy, z: z2 };
    }

    /**
     * Processes independent flat geometric polygons 
     * and finishes them with uniform outline border grids.
     */
    function renderPolygonFace(ctx, v1, v2, v3, v4, color) {
        if (!v1 || !v2 || !v3 || !v4) return; // Discard cut faces gracefully

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(v1.x
