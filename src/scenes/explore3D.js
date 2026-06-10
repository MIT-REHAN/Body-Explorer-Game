const Explore3D = {
  initialized: false,
  rendering: false,
  bodyAngle: 0,
  heartAngle: 0,
  brainAngle: 0,
  lungsAngle: 0,
  stomachAngle: 0,
  skeletonAngle: 0,
  bodyLayer: "skeletal", // skeletal, circulatory, digestive
  heartPulse: true,
  animationFrameId: null,

  init() {
    // Add canvas size fallback adjustments
    this.adjustCanvasSizes();

    if (this.initialized) {
      this.startRenderLoop();
      return;
    }
    this.initialized = true;
    
    this.setupListeners();
    this.startRenderLoop();
    this.showDetails("Interactive 3D Anatomy Lab", "Select different body layers, drag sliders to rotate, or click regions on the canvases to inspect anatomical hotspots and learn their scientific functions.");
  },

  adjustCanvasSizes() {
    // Make sure canvases are visible and have valid dimensions on init
    const canvases = ["body", "heart", "brain", "lungs", "stomach", "skeleton"];
    canvases.forEach(name => {
      const canvas = document.getElementById(`canvas-3d-${name}`);
      if (canvas && canvas.parentElement) {
        // Force fallback if clientWidth is reported as 0
        canvas.width = canvas.parentElement.clientWidth || 300;
        canvas.height = 200;
      }
    });
  },

  setupListeners() {
    // Sliders
    const sliders = [
      { id: "rotate-3d-body", prop: "bodyAngle" },
      { id: "rotate-3d-heart", prop: "heartAngle" },
      { id: "rotate-3d-brain", prop: "brainAngle" },
      { id: "rotate-3d-lungs", prop: "lungsAngle" },
      { id: "rotate-3d-stomach", prop: "stomachAngle" },
      { id: "rotate-3d-skeleton", prop: "skeletonAngle" }
    ];

    sliders.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) {
        el.addEventListener("input", (e) => {
          this[s.prop] = parseInt(e.target.value, 10) * (Math.PI / 180);
        });
      }
    });

    // Canvas clicks
    const canvases = ["body", "heart", "brain", "lungs", "stomach", "skeleton"];
    canvases.forEach(name => {
      const canvas = document.getElementById(`canvas-3d-${name}`);
      if (canvas) {
        canvas.onclick = (e) => this.handleCanvasClick(name, e, canvas);
      }
    });
  },

  setBodyLayer(layerName) {
    this.bodyLayer = layerName;
    window.SoundEffectPlayer.play("click");
    
    document.querySelectorAll("#screen-explore-3d .toggle-layers-3d button").forEach(btn => {
      btn.classList.remove("active");
    });
    const activeBtn = document.getElementById(`btn-layer-${layerName}`);
    if (activeBtn) activeBtn.classList.add("active");

    const layerTexts = {
      skeletal: "Skeleton Layer: Displays the 206 hard bones protecting organs and supporting movement.",
      circulatory: "Circulatory Layer: Highlights the network of heart, red arteries (rich oxygen), and blue veins (depleted oxygen).",
      digestive: "Digestive Layer: Traces the pathway from esophagus to stomach and intestines."
    };
    this.showDetails(`${layerName.toUpperCase()} SYSTEM`, layerTexts[layerName]);
  },

  toggleHeartPulse() {
    this.heartPulse = !this.heartPulse;
    window.SoundEffectPlayer.play("click");
    const btn = document.getElementById("btn-heart-pulse");
    if (btn) {
      btn.textContent = `❤️ Pulse Flow: ${this.heartPulse ? "On" : "Off"}`;
      btn.style.borderColor = this.heartPulse ? "var(--accent3)" : "rgba(255,255,255,0.15)";
    }
  },

  showDetails(title, text) {
    document.getElementById("anatomy-info-title").textContent = title;
    document.getElementById("anatomy-info-text").textContent = text;
    window.SpeechManager.speak(`${title}. ${text}`);
  },

  startRenderLoop() {
    if (this.rendering) return;
    this.rendering = true;

    const render = () => {
      if (window.currentScreen !== "explore-3d") {
        this.rendering = false;
        cancelAnimationFrame(this.animationFrameId);
        return;
      }
      this.drawBody();
      this.drawHeart();
      this.drawBrain();
      this.drawLungs();
      this.drawStomach();
      this.drawSkeleton();
      this.animationFrameId = requestAnimationFrame(render);
    };
    this.animationFrameId = requestAnimationFrame(render);
  },

  project(x, y, z, angle, cx, cy) {
    const cosVal = Math.cos(angle);
    const sinVal = Math.sin(angle);
    const rotX = x * cosVal - z * sinVal;
    const rotZ = x * sinVal + z * cosVal;
    return {
      x: cx + rotX,
      y: cy + y,
      z: rotZ
    };
  },

  /* --- 1. Draw Body --- */
  drawBody() {
    const canvas = document.getElementById("canvas-3d-body");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width = canvas.parentElement.clientWidth || 300;
    const height = canvas.height = 200;
    const cx = width / 2;
    const cy = 100;

    ctx.clearRect(0, 0, width, height);

    const nodes = {
      head: {x: 0, y: -60, z: 0},
      neck: {x: 0, y: -45, z: 0},
      shoulderL: {x: -20, y: -40, z: 0},
      shoulderR: {x: 20, y: -40, z: 0},
      elbowL: {x: -30, y: -15, z: -5},
      elbowR: {x: 30, y: -15, z: 5},
      handL: {x: -35, y: 10, z: -10},
      handR: {x: 35, y: 10, z: 10},
      pelvisL: {x: -12, y: 15, z: 0},
      pelvisR: {x: 12, y: 15, z: 0},
      kneeL: {x: -15, y: 50, z: -5},
      kneeR: {x: 15, y: 50, z: 5},
      footL: {x: -18, y: 85, z: -8},
      footR: {x: 18, y: 85, z: 8}
    };

    const p = {};
    for (let k in nodes) {
      p[k] = this.project(nodes[k].x, nodes[k].y, nodes[k].z, this.bodyAngle, cx, cy);
    }

    if (this.bodyLayer === "skeletal") {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
      ctx.lineWidth = 3;

      ctx.beginPath();
      ctx.arc(p.head.x, p.head.y, 10, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(p.neck.x, p.neck.y);
      ctx.lineTo(p.neck.x, p.pelvisL.y - 10);
      ctx.moveTo(p.shoulderL.x, p.shoulderL.y);
      ctx.lineTo(p.shoulderR.x, p.shoulderR.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(p.shoulderL.x, p.shoulderL.y);
      ctx.lineTo(p.elbowL.x, p.elbowL.y);
      ctx.lineTo(p.handL.x, p.handL.y);
      ctx.moveTo(p.shoulderR.x, p.shoulderR.y);
      ctx.lineTo(p.elbowR.x, p.elbowR.y);
      ctx.lineTo(p.handR.x, p.handR.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(p.pelvisL.x, p.pelvisL.y);
      ctx.lineTo(p.kneeL.x, p.kneeL.y);
      ctx.lineTo(p.footL.x, p.footL.y);
      ctx.moveTo(p.pelvisR.x, p.pelvisR.y);
      ctx.lineTo(p.kneeR.x, p.kneeR.y);
      ctx.lineTo(p.footR.x, p.footR.y);
      ctx.stroke();
    } else if (this.bodyLayer === "circulatory") {
      ctx.strokeStyle = "rgba(255, 107, 107, 0.8)";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy - 35); ctx.lineTo(cx - 10, cy + 20);
      ctx.lineTo(p.kneeL.x, p.kneeL.y);
      ctx.stroke();

      ctx.strokeStyle = "rgba(77, 150, 255, 0.8)";
      ctx.beginPath();
      ctx.moveTo(cx, cy - 35); ctx.lineTo(cx + 10, cy + 20);
      ctx.lineTo(p.kneeR.x, p.kneeR.y);
      ctx.stroke();

      ctx.fillStyle = "var(--accent1)";
      ctx.beginPath();
      ctx.arc(cx - 2, cy - 30, 6 + Math.sin(Date.now() / 150) * 1.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.bodyLayer === "digestive") {
      ctx.strokeStyle = "rgba(107, 203, 119, 0.8)";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy - 40);
      ctx.quadraticCurveTo(cx - 15, cy - 20, cx, cy - 10);
      ctx.stroke();

      ctx.strokeStyle = "rgba(255, 217, 61, 0.7)";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(cx, cy - 10);
      ctx.lineTo(cx + 8, cy); ctx.lineTo(cx - 8, cy + 10); ctx.lineTo(cx, cy + 18);
      ctx.stroke();
    }

    this.drawHotspot(ctx, cx, cy - 35, "Lungs/Heart", this.bodyLayer === "circulatory");
    this.drawHotspot(ctx, cx, cy - 60, "Brain", this.bodyLayer === "skeletal");
    this.drawHotspot(ctx, cx - 4, cy - 15, "Stomach", this.bodyLayer === "digestive");
  },

  /* --- 2. Draw Heart --- */
  drawHeart() {
    const canvas = document.getElementById("canvas-3d-heart");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width = canvas.parentElement.clientWidth || 300;
    const height = canvas.height = 200;
    const cx = width / 2;
    const cy = 100;

    ctx.clearRect(0, 0, width, height);

    const pulseScale = this.heartPulse ? 1.0 + Math.sin(Date.now() / 180) * 0.06 : 1.0;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(pulseScale, pulseScale);
    ctx.rotate(this.heartAngle);

    ctx.fillStyle = "rgba(255, 107, 107, 0.15)";
    ctx.strokeStyle = "var(--accent1)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, -35);
    ctx.bezierCurveTo(-45, -60, -45, 15, 0, 45);
    ctx.bezierCurveTo(45, 15, 45, -60, 0, -35);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = "rgba(255, 107, 107, 0.5)";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(0, -35); ctx.lineTo(0, 42);
    ctx.stroke();

    ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
    ctx.font = "bold 9px sans-serif";
    ctx.fillText("RA", -20, -10);
    ctx.fillText("LA", 12, -10);
    ctx.fillText("RV", -20, 20);
    ctx.fillText("LV", 12, 20);

    ctx.restore();

    this.drawHotspot(ctx, cx + 18, cy + 20, "Left Ventricle", true);
    this.drawHotspot(ctx, cx - 20, cy - 10, "Right Atrium", true);
  },

  /* --- 3. Draw Brain --- */
  drawBrain() {
    const canvas = document.getElementById("canvas-3d-brain");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width = canvas.parentElement.clientWidth || 300;
    const height = canvas.height = 200;
    const cx = width / 2;
    const cy = 100;

    ctx.clearRect(0, 0, width, height);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(this.brainAngle);

    ctx.fillStyle = "rgba(255, 159, 67, 0.6)";
    ctx.beginPath();
    ctx.arc(-10, -20, 25, Math.PI, Math.PI * 1.7);
    ctx.lineTo(0, 0);
    ctx.fill();

    ctx.fillStyle = "rgba(255, 107, 107, 0.6)";
    ctx.beginPath();
    ctx.arc(15, -20, 25, Math.PI * 1.7, Math.PI * 2);
    ctx.lineTo(0, 0);
    ctx.fill();

    ctx.fillStyle = "rgba(77, 150, 255, 0.6)";
    ctx.beginPath();
    ctx.arc(25, 5, 20, 0, Math.PI * 0.4);
    ctx.lineTo(0, 0);
    ctx.fill();

    ctx.fillStyle = "rgba(107, 203, 119, 0.6)";
    ctx.beginPath();
    ctx.arc(15, 30, 15, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    this.drawHotspot(ctx, cx - 25, cy - 25, "Frontal Lobe", true);
    this.drawHotspot(ctx, cx + 30, cy + 5, "Occipital Lobe", true);
    this.drawHotspot(ctx, cx + 15, cy + 30, "Cerebellum", true);
  },

  /* --- 4. Draw Lungs (New) --- */
  drawLungs() {
    const canvas = document.getElementById("canvas-3d-lungs");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width = canvas.parentElement.clientWidth || 300;
    const height = canvas.height = 200;
    const cx = width / 2;
    const cy = 100;

    ctx.clearRect(0, 0, width, height);

    const scale = 1.0 + Math.sin(Date.now() / 250) * 0.07; // Breathing motion
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);
    ctx.rotate(this.lungsAngle);

    // Trachea windpipe
    ctx.strokeStyle = "rgba(255,255,255,0.7)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, -50); ctx.lineTo(0, -15);
    ctx.stroke();

    // Bronchial splits
    ctx.beginPath();
    ctx.moveTo(0, -15); ctx.lineTo(-12, 0);
    ctx.moveTo(0, -15); ctx.lineTo(12, 0);
    ctx.stroke();

    // Lungs bags
    ctx.fillStyle = "rgba(77, 150, 255, 0.2)";
    ctx.strokeStyle = "var(--accent4)";
    ctx.lineWidth = 3;

    // Left Lung
    ctx.beginPath();
    ctx.arc(-22, 10, 20, Math.PI * 1.5, Math.PI * 0.5, true);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Right Lung
    ctx.beginPath();
    ctx.arc(22, 10, 20, Math.PI * 1.5, Math.PI * 0.5, false);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    ctx.restore();

    this.drawHotspot(ctx, cx, cy - 35, "Trachea", true);
    this.drawHotspot(ctx, cx - 22, cy + 10, "Left Lung", true);
  },

  /* --- 5. Draw Stomach (New) --- */
  drawStomach() {
    const canvas = document.getElementById("canvas-3d-stomach");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width = canvas.parentElement.clientWidth || 300;
    const height = canvas.height = 200;
    const cx = width / 2;
    const cy = 100;

    ctx.clearRect(0, 0, width, height);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(this.stomachAngle);

    // Stomach J pouch
    ctx.fillStyle = "rgba(107, 203, 119, 0.12)";
    ctx.strokeStyle = "var(--accent3)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-15, -45);
    ctx.bezierCurveTo(-40, -10, -35, 30, 0, 30);
    ctx.bezierCurveTo(30, 30, 25, 0, 5, -15);
    ctx.lineTo(5, -45);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Sloshing acid pool
    const acidHeight = 12 + Math.sin(Date.now() / 200) * 3;
    ctx.fillStyle = "rgba(255, 217, 61, 0.55)";
    ctx.beginPath();
    ctx.moveTo(-28, 5);
    ctx.bezierCurveTo(-15, 5 + acidHeight / 3, 10, 5 - acidHeight / 3, 20, 10);
    ctx.bezierCurveTo(24, 26, 8, 26, 0, 26);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    this.drawHotspot(ctx, cx - 5, cy - 35, "Sphincter", true);
    this.drawHotspot(ctx, cx - 8, cy + 16, "Acid", true);
  },

  /* --- 6. Draw Skeleton (New) --- */
  drawSkeleton() {
    const canvas = document.getElementById("canvas-3d-skeleton");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width = canvas.parentElement.clientWidth || 300;
    const height = canvas.height = 200;
    const cx = width / 2;
    const cy = 100;

    ctx.clearRect(0, 0, width, height);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(this.skeletonAngle);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
    ctx.lineWidth = 3.5;

    // Spine Backbone Column
    ctx.beginPath();
    ctx.moveTo(0, -60); ctx.lineTo(0, 50);
    ctx.stroke();

    // Vertebrae details (small horizontal ribs along spine)
    ctx.lineWidth = 2;
    for (let y = -45; y <= 45; y += 12) {
      ctx.beginPath();
      ctx.moveTo(-6, y); ctx.lineTo(6, y);
      ctx.stroke();
    }

    // Rib cage curves
    ctx.strokeStyle = "rgba(255,255,255,0.7)";
    ctx.lineWidth = 2.5;
    for (let ry = -30; ry <= 10; ry += 10) {
      ctx.beginPath();
      ctx.arc(-16, ry, 12, Math.PI * 1.5, Math.PI * 0.5);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(16, ry, 12, Math.PI * 1.5, Math.PI * 0.5, true);
      ctx.stroke();
    }

    ctx.restore();

    this.drawHotspot(ctx, cx, cy - 10, "Spine Vertebrae", true);
    this.drawHotspot(ctx, cx - 18, cy - 15, "Ribcage Cage", true);
  },

  drawHotspot(ctx, x, y, label, highlighted) {
    ctx.fillStyle = highlighted ? "var(--accent2)" : "rgba(255,255,255,0.4)";
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    if (highlighted) {
      ctx.strokeStyle = "rgba(255, 217, 61, 0.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, 9 + Math.sin(Date.now() / 100) * 3, 0, Math.PI * 2);
      ctx.stroke();
    }
  },

  handleCanvasClick(modelType, event, canvas) {
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const cx = canvas.width / 2;
    const cy = 100;

    let hotspots = [];

    if (modelType === "body") {
      hotspots = [
        { x: cx, y: cy - 60, title: "🧠 Brain Lobe Center", text: "The cerebrum coordinates voluntary activities, reasoning, and short/long-term memories." },
        { x: cx, y: cy - 35, title: "🫁 Circulatory Core", text: "Lungs pull oxygen into the alveoli while the heart pumps this rich oxygenated blood." },
        { x: cx - 4, y: cy - 15, title: "🥣 Digestive Stomach", text: "A J-shaped muscular reservoir that holds food and secretes stomach acid to dissolve it." }
      ];
    } else if (modelType === "heart") {
      hotspots = [
        { x: cx + 18, y: cy + 20, title: "🫀 Left Ventricle (LV)", text: "Pumps oxygenated blood with high pressure out to the body through the aortic valve." },
        { x: cx - 20, y: cy - 10, title: "🫀 Right Atrium (RA)", text: "Receives deoxygenated blood returning from body tissues before sending it to lungs." }
      ];
    } else if (modelType === "brain") {
      hotspots = [
        { x: cx - 25, y: cy - 25, title: "🧠 Frontal Lobe", text: "Responsible for higher thinking, emotional expression, voluntary movements, and problem-solving." },
        { x: cx + 30, y: cy + 5, title: "🧠 Occipital Lobe", text: "Acts as the visual processing center of the brain, analyzing color, shape, and spatial depth." },
        { x: cx + 15, y: cy + 30, title: "🧠 Cerebellum", text: "Coordinates skeletal muscle posture, balancing stance, and fine-tune motor reflexes." }
      ];
    } else if (modelType === "lungs") {
      hotspots = [
        { x: cx, y: cy - 35, title: "🫁 Trachea (Windpipe)", text: "Muscular tube supported by cartilage rings that filters and routes inhaled air into lungs." },
        { x: cx - 22, y: cy + 10, title: "🫁 Left Lung Lobe", text: "Slightly smaller than the right lung to make space for the cardiac indentation of the heart." }
      ];
    } else if (modelType === "stomach") {
      hotspots = [
        { x: cx - 5, y: cy - 35, title: "🥣 Esophageal Sphincter", text: "A circular muscle valve that closes the top of the stomach pouch to prevent acid reflux." },
        { x: cx - 8, y: cy + 16, title: "🧪 Gastric Acid", text: "Extremely strong acid (pH 1.5-2.0) that breaks down dense fibers and neutralizes food pathogens." }
      ];
    } else if (modelType === "skeleton") {
      hotspots = [
        { x: cx, y: cy - 10, title: "🦴 Spine Vertebrae", text: "A flexible stack of 33 vertebrae bones that protects the spinal cord and allows twisting." },
        { x: cx - 18, y: cy - 15, title: "🦴 Ribcage Protection", text: "Bony flat shields that cage chest organs and expand during respiratory breathing." }
      ];
    }

    let found = false;
    hotspots.forEach(h => {
      const dist = Math.sqrt((clickX - h.x) ** 2 + (clickY - h.y) ** 2);
      if (dist <= 14) {
        window.SoundEffectPlayer.play("correct");
        this.showDetails(h.title, h.text);
        found = true;
      }
    });

    if (!found) {
      window.SoundEffectPlayer.play("click");
    }
  }
};

window.Explore3D = Explore3D;
window.setBodyLayer = (layer) => window.Explore3D.setBodyLayer(layer);
window.toggleHeartPulse = () => window.Explore3D.toggleHeartPulse();
