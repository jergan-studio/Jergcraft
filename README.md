# 🕹️ Jergcraft

Jergcraft is a lightweight, web-based platform designed to make browser-based Minecraft clients (Eaglercraft) instantly adaptive. With a simple configuration switch, it can dynamically route users between a standard desktop experience or a fully optimized mobile layout complete with touch controls.

---

## 📱 Previews

### Mobile Layout
Optimized for smartphones and tablets with on-screen virtual joysticks and touch mapping.

![Mobile Preview](https://github.com/jergan-studio/Jergcraft/blob/main/image_2026-06-30_144312846.png?raw=true)

### PC Layout
The clean, default interface tuned for traditional desktop keyboard and mouse inputs.

![PC Preview](https://github.com/jergan-studio/Jergcraft/blob/main/image_2026-06-30_144456851.png?raw=true)

---

## 🛠️ Project Structure

Your deployment directory (e.g., on Vercel or GitHub Pages) only requires two primary files:

* **`index.html`**: The core entry point that handles viewports, mobile scaling overrides, and embeds the client canvas.
* **`jergcraft.js`**: The control script containing the routing engine logic.

---

## 🚀 How to Create Your Own Knockoff (Using the Kit)

Want to make your own custom version? The fastest way is to **fork** this repository directly to your own GitHub account and connect it to Vercel.

![Kit Tutorial](https://github.com/jergan-studio/Jergcraft/blob/main/image_2026-06-30_144700393.png?raw=true)

### Step-by-Step Setup:

1. **Fork the Repository:**
   Click the **Fork** button at the top right of this page to create an identical copy of this project under your own GitHub profile.

2. **Configure Your Toggle:**
   Open your forked copy of `jergcraft.js` and locate the `knockoff` boolean at the top:
   ```javascript
   // Set to true to force mobile touch engine, or false for standard behavior
   const knockoff = true;
