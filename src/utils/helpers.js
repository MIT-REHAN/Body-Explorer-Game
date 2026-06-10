// Audio Synthesizer using Web Audio API
const SoundEffectPlayer = {
  ctx: null,

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  },

  play(type) {
    // Check user settings for sound
    const progress = window.StorageManager ? window.StorageManager.getProgress() : { settings: { sound: true } };
    if (!progress.settings.sound) return;

    try {
      this.init();
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      const now = this.ctx.currentTime;

      if (type === "click") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.08);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === "correct") {
        // High-pitched happy rising chime
        osc.type = "triangle";
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
        osc.frequency.setValueAtTime(1046.50, now + 0.24); // C6
        
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.setValueAtTime(0.15, now + 0.24);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === "wrong") {
        // Low buzzing descending buzzer
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.linearRampToValueAtTime(120, now + 0.3);
        
        // Add a bandpass filter to make it sound like a buzzer
        const filter = this.ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = 300;
        osc.disconnect(gain);
        osc.connect(filter);
        filter.connect(gain);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
        
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === "tick") {
        // Woodblock / drumstick tap
        osc.type = "sine";
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        osc.start(now);
        osc.stop(now + 0.03);
      } else if (type === "level_up") {
        // High, happy level completion fanfare
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(this.ctx.destination);

        osc.type = "triangle";
        osc.frequency.setValueAtTime(392.00, now); // G4
        osc.frequency.setValueAtTime(523.25, now + 0.1); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.2); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.3); // G5
        osc.frequency.setValueAtTime(1046.50, now + 0.4); // C6

        osc2.type = "sine";
        osc2.frequency.setValueAtTime(261.63, now); // C4
        osc2.frequency.setValueAtTime(329.63, now + 0.1); // E4
        osc2.frequency.setValueAtTime(392.00, now + 0.2); // G4
        osc2.frequency.setValueAtTime(523.25, now + 0.3); // C5
        osc2.frequency.setValueAtTime(783.99, now + 0.4); // G5

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.setValueAtTime(0.12, now + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

        gain2.gain.setValueAtTime(0.1, now);
        gain2.gain.setValueAtTime(0.1, now + 0.4);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

        osc.start(now);
        osc.stop(now + 0.9);
        osc2.start(now);
        osc2.stop(now + 0.9);
      } else if (type === "flex") {
        // Muscle flexing pitch slide
        osc.type = "sine";
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(440, now + 0.15);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === "breathe") {
        // Wind-like breathing whoosh noise
        // Create noise buffer
        const bufferSize = this.ctx.sampleRate * 0.4;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        
        const noiseNode = this.ctx.createBufferSource();
        noiseNode.buffer = buffer;

        // Bandpass filter to make it sound like air rushing
        const filter = this.ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.Q.value = 2.0;
        filter.frequency.setValueAtTime(600, now);
        filter.frequency.exponentialRampToValueAtTime(1000, now + 0.35);

        noiseNode.connect(filter);
        filter.connect(gain);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

        noiseNode.start(now);
        noiseNode.stop(now + 0.4);
      }
    } catch (e) {
      console.warn("Audio Context error:", e);
    }
  },

  // Synthesize background space hum (optional ambient tone)
  playAmbient() {
    // We keep it simple without auto-looping ambient noise to avoid annoying the user.
  }
};

// Speech Synthesis wrapper for TTS Accessibility
const SpeechManager = {
  currentUtterance: null,

  speak(text) {
    if ("speechSynthesis" in window) {
      this.stop(); // Stop any current speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95; // Slightly slower for Grade 5 level clarity
      utterance.pitch = 1.05; // Slightly high and friendly
      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    }
  },

  stop() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }
};

// Export to window
window.SoundEffectPlayer = SoundEffectPlayer;
window.SpeechManager = SpeechManager;
window.helpers = {
  // Helper to dynamically position/render items
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  shuffleArray(array) {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  }
};
