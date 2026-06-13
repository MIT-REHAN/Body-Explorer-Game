// Global State
let currentScreen = "home";
let activeZoneId = null;
let currentScore = 0;
let currentStars = 0;

// Screen history stack for navigation
const navigationStack = [];

// Screen Navigation Functions
function navigateTo(screenId) {
  // Push old screen to stack if we are moving forward and not going to home
  if (screenId === "home") {
    navigationStack.length = 0; // Clear stack
  } else {
    const activeScreen = document.querySelector(".screen.active");
    if (activeScreen) {
      const activeId = activeScreen.id.replace("screen-", "");
      if (navigationStack[navigationStack.length - 1] !== activeId) {
        navigationStack.push(activeId);
      }
    }
  }

  // Update active screen class
  document.querySelectorAll(".screen").forEach(s => {
    s.classList.remove("active");
  });
  
  const targetScreen = document.getElementById(`screen-${screenId}`);
  if (targetScreen) {
    targetScreen.classList.add("active");
  }

  currentScreen = screenId;
  window.currentScreen = screenId;
  updateNavbarUI();
}


function goBack() {
  window.SpeechManager.stop();
  window.SoundEffectPlayer.play("click");

  if (currentScreen === "home" || currentScreen === "explore-3d") {
    showLanding();
  } else if (currentScreen === "intro") {
    showHome();
  } else if (currentScreen === "game") {
    showZoneIntro(activeZoneId);
  } else if (currentScreen === "quiz") {
    startMiniGame();
  } else if (currentScreen === "result") {
    showHome();
  } else {
    showLanding();
  }
}


function updateNavbarUI() {
  const backBtn = document.getElementById("global-btn-back");
  const navTitle = document.getElementById("nav-screen-title");

  if (currentScreen === "landing") {
    if (backBtn) backBtn.classList.add("hidden");
    if (navTitle) navTitle.textContent = "Body Explorer";
  } else {
    if (backBtn) backBtn.classList.remove("hidden");
    if (currentScreen === "home") {
      if (navTitle) navTitle.textContent = "Adventure Map";
    } else if (currentScreen === "explore-3d") {
      if (navTitle) navTitle.textContent = "3D Anatomy Lab";
    }
  }
}

// Scene Transitions
function showLanding() {
  window.SpeechManager.stop();
  navigateTo("landing");
  if (window.Landing3D) {
    window.Landing3D.init();
  }
}

function showHome() {
  window.SpeechManager.stop();
  navigateTo("home");
  window.HomeScene.init();
}

function showExplore3D() {
  window.SpeechManager.stop();
  navigateTo("explore-3d");
  window.Explore3D.init();
}


function showZoneIntro(zoneId) {
  activeZoneId = zoneId;
  navigateTo("intro");
  window.IntroScene.init(zoneId);
}

function startMiniGame() {
  window.SpeechManager.stop();
  navigateTo("game");
  window.GameScene.init(activeZoneId);
}

function startQuiz() {
  window.SpeechManager.stop();
  navigateTo("quiz");
  window.QuizScene.init(activeZoneId);
}

function showResult(zoneId, score, stars) {
  window.SpeechManager.stop();
  activeZoneId = zoneId;
  currentScore = score;
  currentStars = stars;
  navigateTo("result");
  window.ResultScene.init(zoneId, score, stars);
}

function retryZone() {
  window.SpeechManager.stop();
  startMiniGame();
}

// Global Quiz Wrappers to resolve inline HTML ReferenceErrors
function nextQuestion() {
  if (window.QuizScene) {
    window.QuizScene.nextQuestion();
  }
}

function useQuizHint() {
  if (window.QuizScene) {
    window.QuizScene.useQuizHint();
  }
}

// Developer helper to unlock all zones immediately
function unlockAllZones() {
  const progress = window.StorageManager.getProgress();
  progress.unlockedZone = 7;
  window.StorageManager.saveProgress(progress);
  
  // Close modal and refresh map
  const modal = document.getElementById("settings-modal");
  if (modal) modal.classList.add("hidden");
  
  showHome();
  window.SoundEffectPlayer.play("level_up");
  window.SpeechManager.speak("All 7 learning zones have been unlocked for testing!");
}


// Settings & Accessibility Modal Handlers
function toggleSettingsModal() {
  window.SoundEffectPlayer.play("click");
  const modal = document.getElementById("settings-modal");
  if (modal) {
    modal.classList.toggle("hidden");
    // Pre-fill inputs with stored values
    const progress = window.StorageManager.getProgress();
    document.getElementById("setting-sound").checked = progress.settings.sound;
    if (document.getElementById("setting-read-tts")) {
      document.getElementById("setting-read-tts").checked = progress.settings.readQuestionsAnswers !== false;
    }
    document.getElementById("setting-text-size").value = progress.settings.textSize;
  }
}

function closeSettingsOnOverlay(e) {
  if (e.target.id === "settings-modal") {
    toggleSettingsModal();
  }
}

function handleSoundToggle(checked) {
  window.StorageManager.updateSettings("sound", checked);
  if (checked) {
    // Brief test chime
    window.SoundEffectPlayer.play("click");
  }
}

function handleTtsToggle(checked) {
  window.StorageManager.updateSettings("readQuestionsAnswers", checked);
  if (checked) {
    window.SoundEffectPlayer.play("click");
    window.SpeechManager.speak("Auto-read is enabled.");
  } else {
    window.SpeechManager.stop();
  }
}

function handleTextSizeChange(size) {
  window.StorageManager.updateSettings("textSize", size);
  applyTextSize(size);
}

function applyTextSize(size) {
  document.body.className = `text-size-${size}`;
}

// Read aloud active text using SpeechManager
function readActiveText() {
  window.SoundEffectPlayer.play("click");
  
  // Find all elements marked for TTS in the current screen
  const activeScreen = document.querySelector(".screen.active");
  if (!activeScreen) return;

  const ttsTargets = activeScreen.querySelectorAll(".tts-target");
  let fullText = "";

  if (ttsTargets.length > 0) {
    ttsTargets.forEach(el => {
      fullText += el.textContent + " ";
    });
  } else {
    // Backup: read headers or paragraphs
    const headers = activeScreen.querySelectorAll("h1, h2, h3, p");
    headers.forEach(el => {
      if (!el.closest(".modal-overlay") && !el.closest(".global-navbar")) {
        fullText += el.textContent + " ";
      }
    });
  }

  if (fullText.trim()) {
    window.SpeechManager.speak(fullText);
  }
}

// Certificate / Badge Modal Handlers
function closeBadgeModal() {
  window.SoundEffectPlayer.play("click");
  const badgeModal = document.getElementById("badge-modal");
  if (badgeModal) {
    badgeModal.classList.add("hidden");
  }
}

function resetGameProgress() {
  if (confirm("Are you sure you want to clear all scores and start over?")) {
    window.StorageManager.resetProgress();
    localStorage.removeItem("body_explorer_badge_shown");
    closeBadgeModal();
    showHome();
  }
}

// Initialize Application on Load
window.addEventListener("DOMContentLoaded", () => {
  // Load settings and apply text size
  const progress = window.StorageManager.getProgress();
  applyTextSize(progress.settings.textSize);

  // Keyboard navigation support - trap focus in active modals
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const settingsModal = document.getElementById("settings-modal");
      if (settingsModal && !settingsModal.classList.contains("hidden")) {
        toggleSettingsModal();
      }
    }
  });

  // Render main landing dashboard
  showLanding();
});
