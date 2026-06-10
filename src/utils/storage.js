const STORAGE_KEY = "body_explorer_progress";

const defaultProgress = {
  unlockedZone: 7, // All 7 zones are unlocked by default
  scores: {},      // zoneId -> highest score (e.g. 1 -> 100)

  stars: {},       // zoneId -> stars earned (e.g. 1 -> 3)
  settings: {
    sound: true,
    textSize: "medium" // small, medium, large
  }
};

const StorageManager = {
  getProgress() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error("Failed to load progress from localStorage:", e);
    }
    return JSON.parse(JSON.stringify(defaultProgress));
  },

  saveProgress(progress) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error("Failed to save progress to localStorage:", e);
    }
  },

  completeZone(zoneId, score, stars) {
    const progress = this.getProgress();
    
    // Save highest score and stars
    const currentScore = progress.scores[zoneId] || 0;
    if (score > currentScore) {
      progress.scores[zoneId] = score;
    }
    const currentStars = progress.stars[zoneId] || 0;
    if (stars > currentStars) {
      progress.stars[zoneId] = stars;
    }

    // Unlock next zone (zones are 1 to 7)
    if (zoneId === progress.unlockedZone && zoneId < 7) {
      progress.unlockedZone = zoneId + 1;
    }

    this.saveProgress(progress);
    return progress;
  },

  updateSettings(key, value) {
    const progress = this.getProgress();
    progress.settings[key] = value;
    this.saveProgress(progress);
    return progress;
  },

  resetProgress() {
    const progress = JSON.parse(JSON.stringify(defaultProgress));
    this.saveProgress(progress);
    return progress;
  }
};

// Share globally
window.StorageManager = StorageManager;
