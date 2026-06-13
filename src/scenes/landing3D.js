// 3D Antigravity Landing Page Controller using Three.js and GSAP
const Landing3D = {
  scene: null,
  camera: null,
  renderer: null,
  mesh: null,
  dnaMesh: null,
  floatingObjects: [],
  animationId: null,

  init() {
    this.initHero3D();
    this.setupScrollTrigger();
  },

  initHero3D() {
    const container = document.getElementById("landing-3d-canvas-container");
    if (!container) return;

    // Clear previous canvas if any
    container.innerHTML = "";

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    // Create scene, camera, renderer
    this.scene = new THREE.Scene();
    
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.z = 8;

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(this.renderer.domElement);

    // Create lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 5, 5);
    this.scene.add(dirLight);

    // Create a 3D wireframe floating organ / model (Humanoid grid representation)
    const geometry = new THREE.IcosahedronGeometry(2, 2);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.8
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);

    // Add a DNA-like helix structure wrapping around it
    const dnaGroup = new THREE.Group();
    const curvePoints = [];
    for (let i = 0; i < 40; i++) {
      const angle = (i / 10) * Math.PI * 2;
      const x = Math.sin(angle) * 2.8;
      const z = Math.cos(angle) * 2.8;
      const y = (i / 40) * 8 - 4;
      curvePoints.push(new THREE.Vector3(x, y, z));
      
      // Draw sphere nodes on DNA
      const sphereGeo = new THREE.SphereGeometry(0.12, 8, 8);
      const sphereMat = new THREE.MeshBasicMaterial({ color: 0xcccccc, wireframe: false });
      const sphereMesh1 = new THREE.Mesh(sphereGeo, sphereMat);
      sphereMesh1.position.set(x, y, z);
      dnaGroup.add(sphereMesh1);

      // Complementary strand node
      const sphereMesh2 = new THREE.Mesh(sphereGeo, sphereMat);
      sphereMesh2.position.set(-x, y, -z);
      dnaGroup.add(sphereMesh2);

      // Connecting rungs
      if (i % 2 === 0) {
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(x, y, z),
          new THREE.Vector3(-x, y, -z)
        ]);
        const lineMat = new THREE.LineBasicMaterial({ color: 0x888888, transparent: true, opacity: 0.5 });
        const line = new THREE.Line(lineGeo, lineMat);
        dnaGroup.add(line);
      }
    }
    this.dnaMesh = dnaGroup;
    this.scene.add(this.dnaMesh);

    // Track resize
    window.addEventListener("resize", () => this.onWindowResize());

    // Start render loop
    this.animate();
  },

  animate() {
    if (window.currentScreen !== "landing") {
      if (this.animationId) cancelAnimationFrame(this.animationId);
      return;
    }

    this.animationId = requestAnimationFrame(() => this.animate());

    const elapsedTime = Date.now() * 0.001;

    // Slow rotation
    if (this.mesh) {
      this.mesh.rotation.y = elapsedTime * 0.25;
      this.mesh.rotation.x = elapsedTime * 0.15;
      // Antigravity bobbing motion
      this.mesh.position.y = Math.sin(elapsedTime * 1.5) * 0.25;
    }

    if (this.dnaMesh) {
      this.dnaMesh.rotation.y = -elapsedTime * 0.35;
      this.dnaMesh.position.y = Math.cos(elapsedTime * 1.5) * 0.15;
    }

    this.renderer.render(this.scene, this.camera);
  },

  onWindowResize() {
    const container = document.getElementById("landing-3d-canvas-container");
    if (!container || !this.camera || !this.renderer) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  },

  setupScrollTrigger() {
    // GSAP Scroll Animations
    if (typeof gsap !== "undefined") {
      gsap.from(".animate-hero-fade", {
        opacity: 0,
        y: 40,
        duration: 1.2,
        stagger: 0.2,
        ease: "power3.out"
      });

      gsap.from("#landing-3d-canvas-container", {
        opacity: 0,
        scale: 0.8,
        duration: 1.5,
        ease: "power2.out"
      });

      // Simple scroll observer for sections
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("opacity-0", "translate-y-10");
            entry.target.classList.add("opacity-100", "translate-y-0");
          }
        });
      }, { threshold: 0.1 });

      document.querySelectorAll(".scroll-anim").forEach(el => {
        observer.observe(el);
      });
    }
  }
};

window.Landing3D = Landing3D;
