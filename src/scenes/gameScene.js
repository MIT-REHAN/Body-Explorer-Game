const GameScene = {
  zoneId: null,
  score: 0,
  gameState: {},

  init(zoneId) {
    this.zoneId = zoneId;
    this.score = 0;
    this.gameState = {
      timerInterval: null,
      cycleInterval: null
    };

    // Clean any running intervals
    this.clearAllIntervals();

    const navTitle = document.getElementById("nav-screen-title");
    if (navTitle) {
      const zone = window.zonesData.find(z => z.id === zoneId);
      navTitle.textContent = `${zone ? zone.title : "Zone"} Mission`;
    }

    document.getElementById("game-score").textContent = "0";
    document.getElementById("btn-next-quiz").style.display = "none";

    this.loadGame();
  },

  clearAllIntervals() {
    if (this.gameState) {
      if (this.gameState.timerInterval) clearInterval(this.gameState.timerInterval);
      if (this.gameState.cycleInterval) clearInterval(this.gameState.cycleInterval);
    }
  },

  updateScore(pts) {
    this.score += pts;
    document.getElementById("game-score").textContent = this.score;
  },

  completeGame() {
    this.clearAllIntervals();
    window.SoundEffectPlayer.play("level_up");
    document.getElementById("btn-next-quiz").style.display = "block";
    
    const gameArea = document.getElementById("game-area");
    
    // Add success feedback
    const completionBanner = document.createElement("div");
    completionBanner.className = "quiz-feedback correct-fb animate-fadeInUp";
    completionBanner.style.marginTop = "20px";
    completionBanner.innerHTML = "<strong>🏆 Mission Accomplished!</strong> Click the button below to take the quiz and earn your stars!";
    gameArea.appendChild(completionBanner);

    window.SpeechManager.speak("Mission Accomplished! You did it! Now, take the quiz to test your knowledge.");
  },

  failGame(message) {
    this.clearAllIntervals();
    window.SoundEffectPlayer.play("wrong");
    
    const card = document.querySelector(".game-card-wrapper");
    if (card) {
      card.innerHTML = `
        <div class="result-card animate-shake" style="margin-top:20px; box-shadow:none; background:transparent; border:none; padding:0;">
          <div style="font-size:5rem; margin-bottom:16px;">⏳</div>
          <h2 style="color:var(--accent1); font-family:'Baloo 2', cursive; font-size:2rem;">Mission Failed!</h2>
          <p style="color:var(--text-muted); margin-bottom:24px; line-height:1.6;">${message}</p>
          <div class="result-actions" style="justify-content:center;">
            <button class="btn-primary" onclick="retryZone()" style="background:linear-gradient(135deg, var(--accent1), #c0392b); box-shadow:0 4px 20px rgba(231,76,60,0.4);">🔄 Try Again</button>
            <button class="btn-secondary" onclick="showHome()">🗺 Map Dashboard</button>
          </div>
        </div>
      `;
    }
    window.SpeechManager.speak(`Mission failed. ${message} Try again.`);
  },

  loadGame() {
    const area = document.getElementById("game-area");
    area.innerHTML = ""; // Clear game area

    const card = document.createElement("div");
    card.className = "game-card-wrapper animate-fadeInUp";
    area.appendChild(card);

    switch (this.zoneId) {
      case 1:
        this.initOrganAtlas(card);
        break;
      case 2:
        this.initDigestionTrail(card);
        break;
      case 3:
        this.initFoodLab(card);
        break;
      case 4:
        this.initSkeletonStudio(card);
        break;
      case 5:
        this.initMuscleGym(card);
        break;
      case 6:
        this.initBreathLab(card);
        break;
      case 7:
        this.initFitnessPark(card);
        break;
    }
  },

  /* ==========================================================================
     ZONE 1: ORGAN ATLAS (6 organs, 3-minute countdown)
     ========================================================================== */
  initOrganAtlas(container) {
    container.innerHTML = `
      <div class="game-header-sub" style="display:flex; justify-content:space-between; margin-bottom:12px; font-weight:700;">
        <span style="color:var(--accent1);" id="zone1-timer">⏳ Time Left: 03:00</span>
        <span id="zone1-progress">Organs: 0 / 6</span>
      </div>
      <div class="game-instructions">
        <strong>How to Play:</strong> Drag each organ to the correct spot on the body outline, OR click an organ and click its target. Place all 6 organs before the 3-minute timer runs out!
      </div>
      <div class="organ-atlas-grid">
        <!-- Body Silhouette Canvas -->
        <div class="body-silhouette-canvas">
          <svg class="body-outline-svg" viewBox="0 0 100 200" xmlns="http://www.w3.org/2000/svg">
            <path d="M50,15 A12,12 0 1,0 50,39 A12,12 0 1,0 50,15 M30,55 C30,39 70,39 70,55 L70,110 L62,110 L62,190 L52,190 L52,130 L48,130 L48,190 L38,190 L38,110 L30,110 Z" fill="#ffffff" opacity="0.12" stroke="#ffffff" stroke-width="2"/>
          </svg>
          
          <!-- Drop Targets (6 total) -->
          <div class="organ-drop-zone" data-organ="brain" style="top: 8%; left: 45%;" title="Brain Target">
            🧠<span class="organ-drop-label">Brain</span>
          </div>
          <div class="organ-drop-zone" data-organ="lungs" style="top: 25%; left: 45%;" title="Lungs Target">
            🫁<span class="organ-drop-label">Lungs</span>
          </div>
          <div class="organ-drop-zone" data-organ="heart" style="top: 31%; left: 34%;" title="Heart Target">
            🫀<span class="organ-drop-label">Heart</span>
          </div>
          <div class="organ-drop-zone" data-organ="liver" style="top: 42%; left: 34%;" title="Liver Target">
            🫘<span class="organ-drop-label">Liver</span>
          </div>
          <div class="organ-drop-zone" data-organ="stomach" style="top: 46%; left: 54%;" title="Stomach Target">
            🥣<span class="organ-drop-label">Stomach</span>
          </div>
          <div class="organ-drop-zone" data-organ="kidneys" style="top: 58%; left: 45%;" title="Kidneys Target">
            🥜<span class="organ-drop-label">Kidneys</span>
          </div>
        </div>

        <!-- Organs Tray -->
        <div class="organ-tray">
          <div class="organ-item" draggable="true" data-organ="brain" tabindex="0">
            <span class="organ-item-emoji">🧠</span>
            <div class="organ-item-text"><strong>Brain</strong></div>
          </div>
          <div class="organ-item" draggable="true" data-organ="lungs" tabindex="0">
            <span class="organ-item-emoji">🫁</span>
            <div class="organ-item-text"><strong>Lungs</strong></div>
          </div>
          <div class="organ-item" draggable="true" data-organ="heart" tabindex="0">
            <span class="organ-item-emoji">🫀</span>
            <div class="organ-item-text"><strong>Heart</strong></div>
          </div>
          <div class="organ-item" draggable="true" data-organ="liver" tabindex="0">
            <span class="organ-item-emoji">🫘</span>
            <div class="organ-item-text"><strong>Liver</strong></div>
          </div>
          <div class="organ-item" draggable="true" data-organ="stomach" tabindex="0">
            <span class="organ-item-emoji">🥣</span>
            <div class="organ-item-text"><strong>Stomach</strong></div>
          </div>
          <div class="organ-item" draggable="true" data-organ="kidneys" tabindex="0">
            <span class="organ-item-emoji">🥜</span>
            <div class="organ-item-text"><strong>Kidneys</strong></div>
          </div>
        </div>
      </div>
      <div id="zone1-feedback" class="quiz-feedback hidden" style="margin-top:16px;"></div>
    `;

    const state = this.gameState;
    state.placedCount = 0;
    state.selectedOrgan = null;
    state.timeLeft = 180; // 3 minutes in seconds

    const timerEl = container.querySelector("#zone1-timer");
    const progressEl = container.querySelector("#zone1-progress");
    const feedbackEl = container.querySelector("#zone1-feedback");

    // Start 3 minute timer
    state.timerInterval = setInterval(() => {
      state.timeLeft--;
      const mins = Math.floor(state.timeLeft / 60).toString().padStart(2, '0');
      const secs = (state.timeLeft % 60).toString().padStart(2, '0');
      timerEl.textContent = `⏳ Time Left: ${mins}:${secs}`;

      if (state.timeLeft <= 0) {
        this.clearAllIntervals();
        this.failGame("You ran out of time! Try again and place the organs faster.");
      }
    }, 1000);

    const items = container.querySelectorAll(".organ-item");
    const targets = container.querySelectorAll(".organ-drop-zone");

    items.forEach(item => {
      item.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", item.getAttribute("data-organ"));
        item.classList.add("dragging");
        window.SoundEffectPlayer.play("tick");
      });

      item.addEventListener("dragend", () => {
        item.classList.remove("dragging");
      });

      item.addEventListener("click", () => {
        items.forEach(i => i.style.outline = "none");
        if (state.selectedOrgan === item) {
          state.selectedOrgan = null;
        } else {
          state.selectedOrgan = item;
          item.style.outline = "3px solid var(--accent2)";
          window.SoundEffectPlayer.play("click");
        }
      });
    });

    targets.forEach(target => {
      target.addEventListener("dragover", (e) => {
        e.preventDefault();
        target.classList.add("drag-over");
      });

      target.addEventListener("dragleave", () => {
        target.classList.remove("drag-over");
      });

      target.addEventListener("drop", (e) => {
        e.preventDefault();
        target.classList.remove("drag-over");
        const organName = e.dataTransfer.setData ? e.dataTransfer.getData("text/plain") : "";
        handleDropAction(organName, target);
      });

      target.addEventListener("click", () => {
        if (state.selectedOrgan) {
          const organName = state.selectedOrgan.getAttribute("data-organ");
          handleDropAction(organName, target);
        }
      });
    });

    const handleDropAction = (organName, dropTarget) => {
      if (!organName) return;
      const targetOrganName = dropTarget.getAttribute("data-organ");
      
      if (organName === targetOrganName) {
        dropTarget.classList.add("occupied", "correct-drop");
        dropTarget.style.pointerEvents = "none";
        
        const organItem = container.querySelector(`.organ-item[data-organ="${organName}"]`);
        if (organItem) {
          organItem.classList.add("placed-correctly");
          organItem.style.outline = "none";
        }
        
        state.placedCount++;
        state.selectedOrgan = null;
        this.updateScore(16);
        progressEl.textContent = `Organs: ${state.placedCount} / 6`;
        window.SoundEffectPlayer.play("correct");

        feedbackEl.className = "quiz-feedback correct-fb animate-fadeIn";
        feedbackEl.innerHTML = `<strong>Correct!</strong> The <strong>${targetOrganName.toUpperCase()}</strong> has snapped into place!`;
        feedbackEl.classList.remove("hidden");
        window.SpeechManager.speak(`Correct! The ${targetOrganName} is placed.`);

        if (state.placedCount === 6) {
          this.updateScore(4); // Bonus to reach 100 max
          this.completeGame();
        }
      } else {
        window.SoundEffectPlayer.play("wrong");
        dropTarget.classList.add("wrong-drop");
        setTimeout(() => dropTarget.classList.remove("wrong-drop"), 400);

        feedbackEl.className = "quiz-feedback wrong-fb animate-fadeIn";
        feedbackEl.innerHTML = `<strong>Try again!</strong> That is not the correct location for the ${organName}.`;
        feedbackEl.classList.remove("hidden");
        window.SpeechManager.speak(`Not quite. Try again.`);
      }
    };
  },

  /* ==========================================================================
     ZONE 2: DIGESTION TRAIL (Scrolling path + 3 lives + 3 hazards)
     ========================================================================== */
  initDigestionTrail(container) {
    container.innerHTML = `
      <div class="game-header-sub" style="display:flex; justify-content:space-between; margin-bottom:12px; font-weight:700;">
        <span style="color:var(--accent1);" id="trail-lives">❤️ Lives: 3 / 3</span>
        <span id="trail-prog-label">Swallowed: 🍎</span>
      </div>
      <div class="game-instructions">
        <strong>How to Play:</strong> Swallow the food and guide it sequentially (Mouth &rarr; Esophagus &rarr; Stomach &rarr; Small Intestine &rarr; Large Intestine). Avoid the 3 flashing hazard items, and don't skip sequence order!
      </div>
      
      <div class="digestion-trail-container">
        <div class="digestion-canvas-wrapper" style="height:340px;">
          <!-- Trail connectors -->
          <svg class="digestion-svg-bg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <line x1="50" y1="10" x2="50" y2="28" stroke="rgba(255, 107, 107, 0.4)" stroke-width="3"/>
            <line x1="50" y1="28" x2="50" y2="48" stroke="rgba(255, 107, 107, 0.4)" stroke-width="3"/>
            <line x1="50" y1="48" x2="50" y2="68" stroke="rgba(255, 107, 107, 0.4)" stroke-width="3"/>
            <line x1="50" y1="68" x2="50" y2="88" stroke="rgba(255, 107, 107, 0.4)" stroke-width="3"/>
          </svg>
          
          <div class="digestion-food-particle" id="trail-food" style="top: 10%; left: 50%;">🍎</div>

          <!-- Sequential Checkpoints -->
          <button class="digestion-checkpoint active-node" data-step="0" style="top: 10%; left: 50%;">👄 Mouth</button>
          <button class="digestion-checkpoint" data-step="1" style="top: 28%; left: 50%;">🥤 Esophagus</button>
          <button class="digestion-checkpoint" data-step="2" style="top: 48%; left: 50%;">🥣 Stomach</button>
          <button class="digestion-checkpoint" data-step="3" style="top: 68%; left: 50%;">➰ Small Intestine</button>
          <button class="digestion-checkpoint" data-step="4" style="top: 88%; left: 50%;">🪱 Large Intestine</button>

          <!-- 3 Hazards -->
          <button class="digestion-checkpoint hazard-node" data-hazard="fast" style="top: 20%; left: 20%; background:var(--accent1); border-color:#fff; color:#fff;">⚠️ Eat Fast</button>
          <button class="digestion-checkpoint hazard-node" data-hazard="swallow" style="top: 40%; left: 78%; background:var(--accent1); border-color:#fff; color:#fff;">⚠️ Skip Chewing</button>
          <button class="digestion-checkpoint hazard-node" data-hazard="soda" style="top: 60%; left: 18%; background:var(--accent1); border-color:#fff; color:#fff;">⚠️ Soda Gulp</button>
        </div>

        <div class="digestion-info-panel" id="trail-info">
          Swallowed food. Click <strong>Mouth</strong> to start chewing!
        </div>
      </div>
    `;

    const state = this.gameState;
    state.currentStep = 0;
    state.lives = 3;

    const livesEl = container.querySelector("#trail-lives");
    const info = container.querySelector("#trail-info");
    const food = container.querySelector("#trail-food");
    const checkpoints = container.querySelectorAll(".digestion-checkpoint:not(.hazard-node)");
    const hazards = container.querySelectorAll(".hazard-node");

    const stepsData = [
      { name: "Mouth", desc: "Chewing breaks food down and saliva starts digestion!" },
      { name: "Esophagus", desc: "The muscular pipe carries the food to the stomach." },
      { name: "Stomach", desc: "Food is mixed and dissolved in powerful stomach acid!" },
      { name: "Small Intestine", desc: "Chemical digestion finishes and nutrients are absorbed." },
      { name: "Large Intestine", desc: "Water is reabsorbed from waste to complete the cycle." }
    ];

    const deductLife = (message) => {
      state.lives--;
      livesEl.textContent = `❤️ Lives: ${state.lives} / 3`;
      window.SoundEffectPlayer.play("wrong");
      
      const canvas = container.querySelector(".digestion-canvas-wrapper");
      canvas.classList.add("animate-shake");
      setTimeout(() => canvas.classList.remove("animate-shake"), 400);

      info.innerHTML = `💥 <strong>Hazard!</strong> ${message} Lost 1 life.`;
      window.SpeechManager.speak(`Hazard! ${message}.`);

      if (state.lives <= 0) {
        this.failGame("You lost all 3 lives! Remember to follow the exact digestive sequence and avoid the hazards.");
      }
    };

    // Checkpoint interaction
    checkpoints.forEach(btn => {
      btn.addEventListener("click", () => {
        const step = parseInt(btn.getAttribute("data-step"), 10);

        if (step === state.currentStep) {
          // Correct node
          window.SoundEffectPlayer.play("correct");
          btn.classList.remove("active-node");
          btn.classList.add("passed-node");

          this.updateScore(20);
          food.style.top = btn.style.top;
          food.style.left = btn.style.left;

          const data = stepsData[step];
          info.innerHTML = `<strong>${data.name}:</strong> ${data.desc}`;
          window.SpeechManager.speak(`${data.name}. ${data.desc}`);

          state.currentStep++;

          const nextBtn = container.querySelector(`.digestion-checkpoint[data-step="${state.currentStep}"]`);
          if (nextBtn) {
            nextBtn.classList.add("active-node");
          } else {
            setTimeout(() => this.completeGame(), 1000);
          }
        } else {
          // Wrong node clicked
          deductLife(`You skipped a step! Food must travel in order. Next destination is: ${stepsData[state.currentStep].name}.`);
        }
      });
    });

    // Hazard interaction
    hazards.forEach(hazard => {
      hazard.addEventListener("click", () => {
        const type = hazard.getAttribute("data-hazard");
        let msg = "You did something bad!";
        if (type === "fast") msg = "Eating too fast causes choking in the esophagus!";
        if (type === "swallow") msg = "Swallowing whole causes severe stomach aches!";
        if (type === "soda") msg = "Acidic soda gulp interferes with absorption in the intestines!";

        deductLife(msg);
      });
    });
  },

  /* ==========================================================================
     ZONE 3: FOOD LAB (10 items, 8/10 win threshold)
     ========================================================================== */
  initFoodLab(container) {
    container.innerHTML = `
      <div class="game-header-sub" style="display:flex; justify-content:space-between; margin-bottom:12px; font-weight:700;">
        <span style="color:var(--accent3);" id="food-score-label">Correct: 0 / 10</span>
        <span id="food-remaining-label">Item: 1 / 10</span>
      </div>
      <div class="game-instructions">
        <strong>How to Play:</strong> Place each food card into the correct food group sector on the MyPlate diagram! Score at least <strong>8 out of 10</strong> correct to pass!
      </div>
      <div class="food-lab-wrapper">
        <div class="nutrition-plate-container">
          <svg class="nutrition-plate-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="#152236" stroke="#4d96ff" stroke-width="2"/>
            
            <path class="plate-sector" data-group="fruits" d="M50,50 L50,8 A42,42 0 0,0 8,50 Z" fill="#ff6b6b" opacity="0.75" stroke="#152236" stroke-width="1.5"/>
            <path class="plate-sector" data-group="vegetables" d="M50,50 L8,50 A42,42 0 0,0 50,92 Z" fill="#6bcb77" opacity="0.75" stroke="#152236" stroke-width="1.5"/>
            <path class="plate-sector" data-group="grains" d="M50,50 L50,8 A42,42 0 0,1 92,50 Z" fill="#ff9f43" opacity="0.75" stroke="#152236" stroke-width="1.5"/>
            <path class="plate-sector" data-group="protein" d="M50,50 L92,50 A42,42 0 0,1 50,92 Z" fill="#b983ff" opacity="0.75" stroke="#152236" stroke-width="1.5"/>
            
            <circle cx="50" cy="50" r="10" fill="#152236" stroke="#fff" stroke-width="1"/>
            <text x="50" y="52" fill="#fff" font-size="5" text-anchor="middle" font-weight="bold">Plate</text>
            
            <circle class="plate-sector" data-group="dairy" cx="88" cy="15" r="10" fill="#4d96ff" opacity="0.75" stroke="#152236" stroke-width="1"/>
            <text x="88" y="17" fill="#fff" font-size="4" text-anchor="middle" font-weight="bold">Dairy</text>
            
            <text x="30" y="30" fill="#fff" font-size="5" text-anchor="middle" font-weight="bold" pointer-events="none">Fruits</text>
            <text x="30" y="70" fill="#fff" font-size="5" text-anchor="middle" font-weight="bold" pointer-events="none">Veggies</text>
            <text x="70" y="30" fill="#fff" font-size="5" text-anchor="middle" font-weight="bold" pointer-events="none">Grains</text>
            <text x="70" y="70" fill="#fff" font-size="5" text-anchor="middle" font-weight="bold" pointer-events="none">Protein</text>
          </svg>
        </div>

        <div class="food-lab-feedback" id="food-feedback" style="min-height:50px;">
          Sorting active...
        </div>

        <div class="food-items-deck" style="min-height:70px; justify-content:center;">
          <!-- Dynamically spawned single card -->
          <div class="food-card-item animate-popIn" id="current-food-card" style="font-size:1.4rem; padding:12px 28px; cursor:pointer; outline: 2px dashed var(--accent2);">
            Loading food...
          </div>
        </div>
      </div>
    `;

    const state = this.gameState;
    state.currentIndex = 0;
    state.correctCount = 0;
    state.selectedGroup = null;

    state.itemsList = [
      { name: "🥦 Broccoli", group: "vegetables" },
      { name: "🍎 Apple", group: "fruits" },
      { name: "🍞 Bread", group: "grains" },
      { name: "🍗 Chicken", group: "protein" },
      { name: "🥛 Milk", group: "dairy" },
      { name: "🥕 Carrot", group: "vegetables" },
      { name: "🍌 Banana", group: "fruits" },
      { name: "🍚 Rice", group: "grains" },
      { name: "🐟 Fish", group: "protein" },
      { name: "🧀 Cheese", group: "dairy" }
    ];

    const card = container.querySelector("#current-food-card");
    const feedback = container.querySelector("#food-feedback");
    const scoreLabel = container.querySelector("#food-score-label");
    const remainingLabel = container.querySelector("#food-remaining-label");
    const sectors = container.querySelectorAll(".plate-sector");

    const loadNextFoodCard = () => {
      if (state.currentIndex < 10) {
        remainingLabel.textContent = `Item: ${state.currentIndex + 1} / 10`;
        const item = state.itemsList[state.currentIndex];
        card.textContent = item.name;
        card.setAttribute("data-group", item.group);
        feedback.innerHTML = `Sort <strong>${item.name}</strong> by clicking the correct plate segment!`;
        window.SpeechManager.speak(`Sort ${item.name.replace(/[^a-zA-Z]/g, '')}`);
      } else {
        // Evaluate Win/Fail
        if (state.correctCount >= 8) {
          this.updateScore(20); // Completion bonus
          this.completeGame();
        } else {
          this.failGame(`You sorted ${state.correctCount} out of 10 foods correctly. You need at least 8 correct to build a balanced plate!`);
        }
      }
    };

    // Click on plate sectors
    sectors.forEach(sector => {
      sector.addEventListener("click", () => {
        if (state.currentIndex >= 10) return;
        const currentGroup = state.itemsList[state.currentIndex].group;
        const sectorGroup = sector.getAttribute("data-group");

        // Flash correct green / red feedback
        if (currentGroup === sectorGroup) {
          state.correctCount++;
          this.updateScore(8);
          window.SoundEffectPlayer.play("correct");
          feedback.innerHTML = `<span style="color:var(--accent3); font-weight:800;">Yum! Correctly added to ${sectorGroup.toUpperCase()}!</span>`;
          scoreLabel.textContent = `Correct: ${state.correctCount} / 10`;
        } else {
          window.SoundEffectPlayer.play("wrong");
          feedback.innerHTML = `<span style="color:var(--accent1); font-weight:800;">Oops! That belongs in the ${currentGroup.toUpperCase()} group.</span>`;
        }

        state.currentIndex++;
        setTimeout(loadNextFoodCard, 1500);
      });
    });

    loadNextFoodCard();
  },

  /* ==========================================================================
     ZONE 4: SKELETON STUDIO (5 bones, 3 joints flex click)
     ========================================================================== */
  initSkeletonStudio(container) {
    container.innerHTML = `
      <div class="game-instructions" id="skele-instructions">
        <strong>Step 1: Assembly!</strong> Click on each bone in the tray and then click its target outline on the body silhouette! (5 bones missing)
      </div>
      <div class="skeleton-studio-layout">
        <div class="skeleton-workspace">
          <svg class="skeleton-silhouette-svg" viewBox="0 0 100 200" xmlns="http://www.w3.org/2000/svg">
            <path d="M50,15 A12,12 0 1,0 50,39 A12,12 0 1,0 50,15 M30,55 C30,39 70,39 70,55 L70,110 L62,110 L62,190 L52,190 L52,130 L48,130 L48,190 L38,190 L38,110 L30,110 Z" fill="#ffffff" opacity="0.1" stroke="#ffffff" stroke-width="2"/>
          </svg>

          <!-- 5 targets -->
          <div class="bone-drop-target" data-bone="skull" style="top: 8%; left: 42%; width: 16%; height: 12%;" title="Skull Target"></div>
          <div class="bone-drop-target" data-bone="ribs" style="top: 25%; left: 34%; width: 32%; height: 20%;" title="Ribcage Target"></div>
          <div class="bone-drop-target" data-bone="spine" style="top: 45%; left: 46%; width: 8%; height: 20%;" title="Spine Target"></div>
          <div class="bone-drop-target" data-bone="arm" style="top: 27%; left: 18%; width: 15%; height: 30%;" title="Arm Target"></div>
          <div class="bone-drop-target" data-bone="leg" style="top: 65%; left: 36%; width: 28%; height: 32%;" title="Legs Target"></div>

          <!-- 3 Joint Click targets -->
          <div class="skeleton-joint-anchor" id="joint-elbow" style="top: 38%; left: 24%;" title="Elbow Joint"></div>
          <div class="skeleton-joint-anchor" id="joint-shoulder" style="top: 24%; left: 33%;" title="Shoulder Joint"></div>
          <div class="skeleton-joint-anchor" id="joint-knee" style="top: 78%; left: 36%;" title="Knee Joint"></div>
        </div>

        <div class="bone-parts-tray" id="skele-tray">
          <div class="bone-part-item" data-bone="skull" tabindex="0">💀 Skull</div>
          <div class="bone-part-item" data-bone="ribs" tabindex="0">🩻 Ribcage</div>
          <div class="bone-part-item" data-bone="spine" tabindex="0">🦴 Spine</div>
          <div class="bone-part-item" data-bone="arm" tabindex="0">💪 Arm Bones</div>
          <div class="bone-part-item" data-bone="leg" tabindex="0">🦵 Leg Bones</div>
        </div>
      </div>
      <div id="skele-feedback" class="quiz-feedback hidden" style="margin-top:16px;"></div>
    `;

    const state = this.gameState;
    state.placedCount = 0;
    state.testedJoints = new Set();
    state.selectedBone = null;

    const items = container.querySelectorAll(".bone-part-item");
    const targets = container.querySelectorAll(".bone-drop-target");
    const feedback = container.querySelector("#skele-feedback");

    items.forEach(item => {
      item.addEventListener("click", () => {
        items.forEach(i => i.style.outline = "none");
        if (state.selectedBone === item) {
          state.selectedBone = null;
        } else {
          state.selectedBone = item;
          item.style.outline = "3px solid var(--accent2)";
          window.SoundEffectPlayer.play("click");
        }
      });
    });

    targets.forEach(target => {
      target.addEventListener("click", () => {
        if (!state.selectedBone) return;
        const boneType = state.selectedBone.getAttribute("data-bone");
        const targetBone = target.getAttribute("data-bone");

        if (boneType === targetBone) {
          target.classList.add("occupied");
          target.style.pointerEvents = "none";
          
          let emoji = "🦴";
          if (boneType === "skull") emoji = "💀";
          if (boneType === "ribs") emoji = "🩻";
          if (boneType === "arm") emoji = "🦾";
          if (boneType === "leg") emoji = "🦵";

          target.innerHTML = `<span style="font-size:1.8rem;">${emoji}</span>`;
          state.selectedBone.classList.add("placed");
          state.selectedBone = null;
          state.placedCount++;
          
          this.updateScore(15);
          window.SoundEffectPlayer.play("correct");
          feedback.className = "quiz-feedback correct-fb animate-fadeIn";
          feedback.innerHTML = `<strong>Snap!</strong> The ${boneType.toUpperCase()} is assembled!`;
          feedback.classList.remove("hidden");
          window.SpeechManager.speak(`Snap! ${boneType} placed.`);

          if (state.placedCount === 5) {
            transitionToJoints();
          }
        } else {
          window.SoundEffectPlayer.play("wrong");
          target.classList.add("wrong-drop");
          setTimeout(() => target.classList.remove("wrong-drop"), 400);
          feedback.className = "quiz-feedback wrong-fb animate-fadeIn";
          feedback.innerHTML = `Incorrect spot! Choose the correct outline for ${boneType}.`;
          feedback.classList.remove("hidden");
        }
      });
    });

    const transitionToJoints = () => {
      document.getElementById("skele-instructions").innerHTML = `
        <strong>Step 2: Flex the Joints!</strong> Click on all 3 golden joints (Elbow, Shoulder, Knee) to see how they move!
      `;

      const tray = document.getElementById("skele-tray");
      tray.innerHTML = `
        <div style="background:rgba(13,27,42,0.5); padding:16px; border-radius:12px; height:100%;">
          <h4 style="color:var(--accent2); margin-bottom:8px; font-family:'Baloo 2', cursive;">Joint Simulator</h4>
          <p id="joint-desc" style="font-size:0.9rem; color:var(--text-muted);">Click any golden joint to flex it!</p>
        </div>
      `;

      container.querySelectorAll(".skeleton-joint-anchor").forEach(joint => {
        joint.style.display = "block";
      });

      const elbow = container.querySelector("#joint-elbow");
      const shoulder = container.querySelector("#joint-shoulder");
      const knee = container.querySelector("#joint-knee");
      const desc = container.querySelector("#joint-desc");

      const animateJoint = (el, typeName, text) => {
        window.SoundEffectPlayer.play("flex");
        el.style.transform = "rotate(30deg) scale(1.3)";
        setTimeout(() => {
          el.style.transform = "rotate(0deg) scale(1)";
        }, 400);

        desc.innerHTML = `<strong>${typeName}:</strong><br/>${text}`;
        window.SpeechManager.speak(`${typeName}. ${text}`);

        state.testedJoints.add(typeName);
        if (state.testedJoints.size === 3) {
          this.updateScore(25);
          setTimeout(() => this.completeGame(), 1500);
        }
      };

      elbow.addEventListener("click", () => {
        animateJoint(elbow, "Elbow Hinge Joint", "Bends back and forth like a door hinge, allowing forearm movements.");
      });
      shoulder.addEventListener("click", () => {
        animateJoint(shoulder, "Shoulder Ball & Socket", "Enables full circular rotation, giving the arm maximum flexibility.");
      });
      knee.addEventListener("click", () => {
        animateJoint(knee, "Knee Hinge Joint", "Acts as a primary hinge supporting your body weight during steps.");
      });
    };
  },

  /* ==========================================================================
     ZONE 5: MUSCLE GYM (Alternating Flash Flex/Relax, Fail at 3 errors)
     ========================================================================== */
  initMuscleGym(container) {
    container.innerHTML = `
      <div class="game-header-sub" style="display:flex; justify-content:space-between; margin-bottom:12px; font-weight:700;">
        <span style="color:var(--accent5);" id="gym-cycles">Cycles: 0 / 5</span>
        <span style="color:var(--accent1);" id="gym-errors">Strikes: 0 / 3</span>
      </div>
      <div class="game-instructions">
        <strong>How to Play:</strong> Watch the flashing panels. Click the <strong>LIFT 💪</strong> button only when the <strong>BICEP panel flashes (contracts)</strong>, and DO NOT click when the <strong>TRICEP flashes (lowers)</strong>!
      </div>
      <div class="muscle-gym-container">
        <div style="display:flex; gap:16px; width:100%; max-width:440px;">
          <!-- Flashing panels -->
          <div id="panel-bicep" class="fitness-scenario-card" style="flex:1; border:2px solid transparent; font-weight:800; font-size:1.1rem; padding:12px;">
            🔴 BICEP<br/>(Contracts)
          </div>
          <div id="panel-tricep" class="fitness-scenario-card" style="flex:1; border:2px solid transparent; font-weight:800; font-size:1.1rem; padding:12px;">
            ⚪ TRICEP<br/>(Relaxes)
          </div>
        </div>

        <div class="gym-visuals-area">
          <div class="weight-lift-track" style="height:150px; width:80px; margin:0 auto;">
            <div class="dumbbell-lift-item" id="gym-dumbbell" style="bottom: 0px;">🏋️</div>
          </div>
        </div>

        <button class="btn-primary" id="btn-gym-flex" style="padding: 16px 40px; font-size: 1.25rem; width:100%;">LIFT! 💪</button>
      </div>
    `;

    const state = this.gameState;
    state.cycles = 0;
    state.errors = 0;
    state.currentFlash = "bicep"; // toggles back & forth

    const pBicep = container.querySelector("#panel-bicep");
    const pTricep = container.querySelector("#panel-tricep");
    const dumbbell = container.querySelector("#gym-dumbbell");
    const cyclesEl = container.querySelector("#gym-cycles");
    const errorsEl = container.querySelector("#gym-errors");
    const liftBtn = container.querySelector("#btn-gym-flex");

    window.SpeechManager.speak("Lift dumbbells. Tap when bicep flashes, wait on tricep.");

    const runFlashingCycle = () => {
      if (this.zoneId !== 5 || state.cycles >= 5 || state.errors >= 3) return;

      // Swap flashes
      if (state.currentFlash === "bicep") {
        state.currentFlash = "tricep";
        pBicep.style.borderColor = "transparent";
        pBicep.style.background = "rgba(13,27,42,0.6)";
        pTricep.style.borderColor = "var(--accent5)";
        pTricep.style.background = "rgba(255, 159, 67, 0.2)";
      } else {
        state.currentFlash = "bicep";
        pTricep.style.borderColor = "transparent";
        pTricep.style.background = "rgba(13,27,42,0.6)";
        pBicep.style.borderColor = "var(--accent1)";
        pBicep.style.background = "rgba(255, 107, 107, 0.2)";
      }

      window.SoundEffectPlayer.play("tick");
    };

    // Cycle flash every 1.5 seconds
    runFlashingCycle(); // initial call
    state.cycleInterval = setInterval(runFlashingCycle, 1500);

    liftBtn.addEventListener("click", () => {
      if (state.cycles >= 5 || state.errors >= 3) return;

      if (state.currentFlash === "bicep") {
        // Success
        state.cycles++;
        this.updateScore(20);
        window.SoundEffectPlayer.play("flex");

        cyclesEl.textContent = `Cycles: ${state.cycles} / 5`;
        dumbbell.style.bottom = `${(state.cycles / 5) * 110}px`;

        if (state.cycles === 5) {
          this.completeGame();
        }
      } else {
        // Error click
        state.errors++;
        window.SoundEffectPlayer.play("wrong");
        errorsEl.textContent = `Strikes: ${state.errors} / 3`;

        // Progress drops by 1 cycle
        state.cycles = Math.max(0, state.cycles - 1);
        cyclesEl.textContent = `Cycles: ${state.cycles} / 5`;
        dumbbell.style.bottom = `${(state.cycles / 5) * 110}px`;

        dumbbell.classList.add("animate-shake");
        setTimeout(() => dumbbell.classList.remove("animate-shake"), 400);

        if (state.errors >= 3) {
          this.failGame("You made 3 mistakes in a row! Watch the panels and only click LIFT when the Bicep contracts.");
        }
      }
    });
  },

  /* ==========================================================================
     ZONE 6: BREATH LAB (3s horizontal rhythm bar, 5 cycles, 3 misses fail)
     ========================================================================== */
  initBreathLab(container) {
    container.innerHTML = `
      <div class="game-header-sub" style="display:flex; justify-content:space-between; margin-bottom:12px; font-weight:700;">
        <span style="color:var(--accent2);" id="breath-cycles">Cycles: 0 / 5</span>
        <span style="color:var(--accent1);" id="breath-misses">Misses: 0 / 3</span>
      </div>
      <div class="game-instructions">
        <strong>How to Play:</strong> Hold down the <strong>BREATHE</strong> button during the <strong>Inhale</strong> phase (rhythm bar grows right), and release during <strong>Exhale</strong> (rhythm bar shrinks left)! Complete 5 cycles.
      </div>
      <div class="breath-lab-container">
        <!-- Horizontal Rhythm Track -->
        <div style="width:100%; background:var(--bg-deep); height:24px; border-radius:12px; overflow:hidden; border:2px solid rgba(255,255,255,0.08); position:relative;">
          <div id="rhythm-bar-fill" style="width:0%; height:100%; background:linear-gradient(90deg, var(--accent4), var(--accent2)); transition:none;"></div>
        </div>
        
        <div class="breath-rhythm-prompt" id="breath-prompt" style="font-size:1.4rem;">
          Inhaling... HOLD BUTTON!
        </div>

        <button class="breath-control-btn" id="btn-breath" style="width:120px; height:120px;">BREATHE</button>
      </div>
    `;

    const state = this.gameState;
    state.cycles = 0;
    state.misses = 0;
    state.isHolding = false;
    
    // Bar movement variable
    state.progress = 0;
    state.direction = 1; // 1 = inhale/growing, -1 = exhale/shrinking

    const rBar = container.querySelector("#rhythm-bar-fill");
    const prompt = container.querySelector("#breath-prompt");
    const btn = container.querySelector("#btn-breath");
    const cyclesEl = container.querySelector("#breath-cycles");
    const missesEl = container.querySelector("#breath-misses");

    window.SpeechManager.speak("Breathe rhythm game. Hold on inhale, release on exhale.");

    const runRhythmLoop = () => {
      if (this.zoneId !== 6 || state.cycles >= 5 || state.misses >= 3) return;

      // Rhythm increments: over 3 seconds = 180 frames. 100/180 = ~0.55 per frame
      state.progress += 0.6 * state.direction;

      if (state.progress >= 100) {
        state.progress = 100;
        state.direction = -1;
        prompt.textContent = "Exhaling... RELEASE BUTTON!";
      } else if (state.progress <= 0) {
        state.progress = 0;
        state.direction = 1;
        prompt.textContent = "Inhaling... HOLD BUTTON!";
      }

      rBar.style.width = `${state.progress}%`;

      // Verify alignment
      // Inhale phase: direction is 1. Player should be holding.
      // Exhale phase: direction is -1. Player should be releasing.
      const shouldHold = state.direction === 1;
      
      // We check compliance at periodic intervals (e.g. at peaks or mid-points)
      // If player violates (e.g. holds when should release, or releases when should hold)
      // we can check if they maintain the correct state. To make it forgiving for kids:
      // We track if they are in the wrong state for too long.
      
      requestAnimationFrame(runRhythmLoop);
    };

    requestAnimationFrame(runRhythmLoop);

    const handleInputStart = (e) => {
      e.preventDefault();
      state.isHolding = true;
      btn.classList.add("active");

      // Check if clicked in correct phase
      if (state.direction !== 1) {
        // Holding during exhale! Miss
        state.misses++;
        missesEl.textContent = `Misses: ${state.misses} / 3`;
        window.SoundEffectPlayer.play("wrong");
        
        if (state.misses >= 3) {
          this.failGame("You missed 3 beats! Release the button when the bar contracts left.");
        }
      } else {
        window.SoundEffectPlayer.play("breathe");
      }
    };

    const handleInputEnd = (e) => {
      e.preventDefault();
      state.isHolding = false;
      btn.classList.remove("active");

      if (state.direction !== -1) {
        // Released during inhale! Miss
        state.misses++;
        missesEl.textContent = `Misses: ${state.misses} / 3`;
        window.SoundEffectPlayer.play("wrong");

        if (state.misses >= 3) {
          this.failGame("You missed 3 beats! Hold the button down when the bar expands right.");
        }
      } else {
        // Successful cycle!
        state.cycles++;
        this.updateScore(20);
        cyclesEl.textContent = `Cycles: ${state.cycles} / 5`;
        window.SoundEffectPlayer.play("correct");

        if (state.cycles === 5) {
          this.completeGame();
        }
      }
    };

    btn.addEventListener("mousedown", handleInputStart);
    btn.addEventListener("mouseup", handleInputEnd);
    btn.addEventListener("touchstart", handleInputStart);
    btn.addEventListener("touchend", handleInputEnd);
  },

  /* ==========================================================================
     ZONE 7: FITNESS PARK (3 Questions character quiz)
     ========================================================================== */
  initFitnessPark(container) {
    container.innerHTML = `
      <div class="game-header-sub" style="display:flex; justify-content:space-between; margin-bottom:12px; font-weight:700;">
        <span style="color:var(--accent3);">Score: 3/3 Target</span>
        <span id="fit-q-num">Challenge: 1 / 3</span>
      </div>
      <div class="game-instructions">
        <strong>How to Play:</strong> Answer all 3 scenarios correctly by clicking on the character doing the correct exercise style! One mistake fails the challenge (can retry).
      </div>
      <div class="fitness-park-wrapper">
        <div class="fitness-scenario-card" style="margin-bottom:16px;">
          <div class="fitness-scenario-text" id="fit-scenario" style="font-size:1.15rem; line-height:1.6;">
            Loading character challenge...
          </div>
        </div>

        <div class="fitness-options-grid" id="fit-options">
          <!-- Character cards rendered dynamically -->
        </div>
      </div>
    `;

    const state = this.gameState;
    state.currentQuestion = 0;
    state.challenges = [
      {
        text: "Leo wants to strengthen his heart and increase running endurance. Who should he follow?",
        options: [
          { label: "🏃 Jogging Jack", correct: true, action: "running" },
          { label: "🧘 Sitting Sam", correct: false, action: "sitting" },
          { label: "🏋️ Stretching Sarah", correct: false, action: "stretching" }
        ],
        explanation: "Jogging Jack is doing cardio, which strengthens the heart and lungs!"
      },
      {
        text: "Maya wants to make her bones denser and stronger to prevent soccer injury. Who is best?",
        options: [
          { label: "🛌 Sleeping Maya", correct: false, action: "sleeping" },
          { label: "🦘 Jumping Jenny", correct: true, action: "jumping" },
          { label: "🧘 Stretching Sarah", correct: false, action: "stretching" }
        ],
        explanation: "Jumping Jenny is performing a weight-bearing activity that stimulates bone density!"
      },
      {
        text: "Sam wants to stretch his muscles and bend down to tie his shoes easily. Who can help?",
        options: [
          { label: "🧘 Stretching Sarah", correct: true, action: "stretching" },
          { label: "🏃 Jogging Jack", correct: false, action: "running" },
          { label: "🎮 Gaming Greg", correct: false, action: "gaming" }
        ],
        explanation: "Stretching Sarah improves range of motion and muscle flexibility!"
      }
    ];

    this.showFitnessChallenge();
  },

  showFitnessChallenge() {
    const state = this.gameState;
    const chal = state.challenges[state.currentQuestion];

    document.getElementById("fit-q-num").textContent = `Challenge: ${state.currentQuestion + 1} / 3`;
    document.getElementById("fit-scenario").textContent = chal.text;

    const optionsBox = document.getElementById("fit-options");
    optionsBox.innerHTML = "";

    chal.options.forEach(opt => {
      const btn = document.createElement("button");
      btn.className = "fitness-option-btn";
      
      let characterEmoji = "🧍";
      if (opt.action === "running") characterEmoji = "🏃";
      if (opt.action === "stretching") characterEmoji = "🧘";
      if (opt.action === "sitting") characterEmoji = "🚶";
      if (opt.action === "jumping") characterEmoji = "🦘";
      if (opt.action === "sleeping") characterEmoji = "🛌";
      if (opt.action === "gaming") characterEmoji = "🎮";

      btn.innerHTML = `
        <span class="fitness-option-emoji" style="font-size:2.5rem; display:block; margin-bottom:8px;">${characterEmoji}</span>
        <strong style="color:var(--text-light);">${opt.label}</strong>
      `;

      btn.onclick = () => {
        const btns = optionsBox.querySelectorAll(".fitness-option-btn");
        btns.forEach(b => b.style.pointerEvents = "none");

        if (opt.correct) {
          window.SoundEffectPlayer.play("correct");
          this.updateScore(30);

          btn.style.borderColor = "var(--accent3)";
          btn.style.background = "rgba(107,203,119,0.15)";
          
          document.getElementById("fit-scenario").innerHTML = `
            <span style="color:var(--accent3); font-weight:800;">Correct Choice!</span><br/>
            ${chal.explanation}
          `;
          window.SpeechManager.speak(`Correct! ${chal.explanation}`);

          state.currentQuestion++;

          setTimeout(() => {
            if (state.currentQuestion < 3) {
              this.showFitnessChallenge();
            } else {
              this.updateScore(10); // reaches 100
              this.completeGame();
            }
          }, 3500);
        } else {
          // Mistake ends game immediately (must retry)
          window.SoundEffectPlayer.play("wrong");
          btn.style.borderColor = "var(--accent1)";
          btn.style.background = "rgba(255,107,107,0.15)";
          
          document.getElementById("fit-scenario").innerHTML = `
            <span style="color:var(--accent1); font-weight:800;">Wrong choice!</span><br/>
            ${chal.explanation}
          `;
          window.SpeechManager.speak(`Incorrect. ${chal.explanation}`);

          setTimeout(() => {
            this.failGame(`You made a mistake on Challenge ${state.currentQuestion + 1}. Try again to achieve 3/3 score!`);
          }, 3500);
        }
      };

      optionsBox.appendChild(btn);
    });

    window.SpeechManager.speak(chal.text);
  }
};

window.GameScene = GameScene;
