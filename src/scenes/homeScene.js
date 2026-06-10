const HomeScene = {
  init() {
    this.render();
  },

  render() {
    const progress = window.StorageManager.getProgress();
    const zones = window.zonesData;

    // 1. Update the zone buttons state on the body map silhouette
    const zoneButtons = document.querySelectorAll(".zone-btn");
    zoneButtons.forEach(btn => {
      const zoneId = parseInt(btn.getAttribute("data-zone"), 10);
      const isCompleted = progress.stars[zoneId] !== undefined;
      const isUnlocked = true; // All levels unlocked by default so user can select any zone to play


      // Clean classes
      btn.className = "zone-btn";

      if (isCompleted) {
        btn.classList.add("completed");
      }
      
      if (isUnlocked) {
        btn.classList.add("unlocked");
        if (zoneId === progress.unlockedZone && !isCompleted) {
          btn.classList.add("active-current");
        }
        btn.setAttribute("tabindex", "0");
        btn.setAttribute("aria-disabled", "false");
        
        // Remove click listener and add new one to avoid duplicates
        btn.onclick = (e) => {
          e.preventDefault();
          window.SoundEffectPlayer.play("click");
          window.showZoneIntro(zoneId);
        };
        
        // Keyboard support
        btn.onkeydown = (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            window.SoundEffectPlayer.play("click");
            window.showZoneIntro(zoneId);
          }
        };
      } else {
        btn.classList.add("locked");
        btn.setAttribute("tabindex", "-1");
        btn.setAttribute("aria-disabled", "true");
        btn.onclick = null;
        btn.onkeydown = null;
      }
    });

    // 2. Update home progress bar
    const completedCount = Object.keys(progress.stars).length;
    const homeProgressFill = document.getElementById("home-progress");
    const progText = document.getElementById("prog-text");
    if (homeProgressFill) {
      const percentage = (completedCount / 7) * 100;
      homeProgressFill.style.width = `${percentage}%`;
    }
    if (progText) {
      progText.textContent = `${completedCount} / 7 Zones`;
    }

    // 3. Update total stars count
    let totalStars = 0;
    for (let i = 1; i <= 7; i++) {
      totalStars += progress.stars[i] || 0;
    }
    const starsSummaryText = document.getElementById("stars-summary-text");
    if (starsSummaryText) {
      starsSummaryText.textContent = `Total Stars: ⭐ ${totalStars} / 21`;
    }

    // 4. Check if all 7 zones completed to show Badge Modal
    const completedAll = completedCount === 7;
    const badgeShownKey = "body_explorer_badge_shown";
    const badgeShown = localStorage.getItem(badgeShownKey);

    if (completedAll && !badgeShown) {
      // Calculate total score
      let totalScore = 0;
      for (let i = 1; i <= 7; i++) {
        totalScore += progress.scores[i] || 0;
      }

      setTimeout(() => {
        this.showFinalBadge(totalScore, totalStars);
        localStorage.setItem(badgeShownKey, "true");
      }, 1000);
    }
  },

  showFinalBadge(score, stars) {
    const badgeModal = document.getElementById("badge-modal");
    const totalScoreEl = document.getElementById("badge-total-score");
    const totalStarsEl = document.getElementById("badge-total-stars");

    if (totalScoreEl) totalScoreEl.textContent = score;
    if (totalStarsEl) totalStarsEl.textContent = stars;

    if (badgeModal) {
      badgeModal.classList.remove("hidden");
      window.SoundEffectPlayer.play("level_up");
      window.SpeechManager.speak("Congratulations! You have completed all 7 missions and earned your Grand Champion Certificate!");
    }
  }
};

window.HomeScene = HomeScene;
