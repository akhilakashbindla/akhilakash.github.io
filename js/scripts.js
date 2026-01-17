// scripts.js
// Contains: subtle glowing 3D background, improved theme toggle, resize handling

document.addEventListener('DOMContentLoaded', () => {
    // ── SUBTLE ANIMATED GLOW BACKGROUND ───────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent
    document.getElementById('bg-3d').appendChild(renderer.domElement);

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x00D4FF, 0.12);
    scene.add(ambientLight);

    // Pulsating point lights
    const light1 = new THREE.PointLight(0x00D4FF, 1.2, 120);
    const light2 = new THREE.PointLight(0xA777E5, 1.1, 120);
    light1.position.set(25, 25, 25);
    light2.position.set(-25, -25, 25);
    scene.add(light1);
    scene.add(light2);

    camera.position.z = 50;

    let time = 0;
    function animateGlow() {
        requestAnimationFrame(animateGlow);
        time += 0.008;

        light1.intensity = 1.0 + 0.4 * Math.sin(time * 1.8);
        light2.intensity = 0.9 + 0.35 * Math.cos(time * 1.4);

        light1.position.x = 25 + 12 * Math.sin(time * 0.6);
        light1.position.y = 25 + 12 * Math.cos(time * 0.5);
        light2.position.x = -25 + 12 * Math.sin(time * 0.7 + Math.PI);
        light2.position.y = -25 + 12 * Math.cos(time * 0.55 + Math.PI);

        renderer.render(scene, camera);
    }
    animateGlow();

    // ── IMPROVED THEME TOGGLE (Light/Dark mode) ───────────────────────────────────────
    const themeSwitch = document.getElementById('theme-switch');
    const body = document.body;

    // Load saved preference or default to dark
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        body.classList.remove('dark-mode');
        themeSwitch.checked = true;
    } else {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
        themeSwitch.checked = false;
    }

    // Toggle handler
    themeSwitch.addEventListener('change', () => {
        if (themeSwitch.checked) {
            body.classList.add('light-mode');
            body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.add('dark-mode');
            body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
        }
    });

    // ── RESIZE HANDLER ────────────────────────────────────────────────────────────────
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Optional: You can add more functionality here in the future
    console.log("Portfolio scripts loaded successfully");
});
