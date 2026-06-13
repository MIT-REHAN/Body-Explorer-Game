const IntroScene = {
  currentZoneId: null,

  init(zoneId) {
    this.currentZoneId = zoneId;
    this.render();
  },

  render() {
    const zones = window.zonesData;
    const zone = zones.find(z => z.id === this.currentZoneId);
    if (!zone) return;

    // Set page title for navbar
    const navTitle = document.getElementById("nav-screen-title");
    if (navTitle) {
      navTitle.textContent = `${zone.title} Intro`;
    }

    const iconEl = document.getElementById("intro-icon");
    const titleEl = document.getElementById("intro-title");
    const descEl = document.getElementById("intro-desc");
    const objectiveEl = document.getElementById("intro-objective");

    if (iconEl) iconEl.textContent = zone.icon;
    if (titleEl) titleEl.textContent = zone.title;
    if (descEl) descEl.textContent = zone.desc;
    if (objectiveEl) objectiveEl.textContent = zone.objective;

    // Speak description automatically if settings allow, but wait a moment
    setTimeout(() => {
      const progress = window.StorageManager.getProgress();
      if (progress.settings.readQuestionsAnswers !== false) {
        window.SpeechManager.speak(`${zone.title}. ${zone.desc} Your objective is to ${zone.objective}.`);
      }
    }, 400);
  }
};

window.IntroScene = IntroScene;
