const ResultScene = {
  zoneId: null,
  score: 0,
  stars: 0,

  init(zoneId, score, stars) {
    this.zoneId = zoneId;
    this.score = score;
    this.stars = stars;
    this.render();
  },

  render() {
    const zone = window.zonesData.find(z => z.id === this.zoneId);
    if (!zone) return;

    // Set page title
    const navTitle = document.getElementById("nav-screen-title");
    if (navTitle) {
      navTitle.textContent = `${zone.title} Complete`;
    }

    // Title & description based on star performance
    const titleEl = document.getElementById("result-title");
    const textEl = document.getElementById("result-score-text");
    const starsEl = document.getElementById("result-stars");

    let resultTitle = "Mission Complete!";
    let praiseText = `You scored ${this.score} points and unlocked the next zone!`;

    if (this.stars === 3) {
      resultTitle = "Perfect Score! 🌟";
      praiseText = `Outstanding! You scored ${this.score} points and earned 3 Stars! You are now a certified Organ Expert for the ${zone.title}!`;
    } else if (this.stars === 2) {
      resultTitle = "Great Job! 👍";
      praiseText = `Excellent effort! You scored ${this.score} points and earned 2 Stars! Can you retry and get 3 stars?`;
    } else {
      resultTitle = "Mission Completed!";
      praiseText = `Well done! You completed the quiz with ${this.score} points and earned 1 Star. Keep practicing to become a master explorer!`;
    }

    if (titleEl) titleEl.textContent = resultTitle;
    if (textEl) textEl.textContent = praiseText;

    // Render stars SVG with stagger pop-in animation
    if (starsEl) {
      window.StarsComponent.render(starsEl, this.stars, true);
    }

    // Play fanfare
    window.SoundEffectPlayer.play("level_up");

    // Speak results
    setTimeout(() => {
      window.SpeechManager.speak(`${resultTitle}. ${praiseText}`);
    }, 450);
  }
};

window.ResultScene = ResultScene;
