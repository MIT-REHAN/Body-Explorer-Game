const QuizScene = {
  zoneId: null,
  questions: [],
  currentQuestionIndex: 0,
  score: 0, // out of 100
  correctCount: 0,
  hintsUsedCount: 0, // max 2 per zone
  questionHintsUsed: 0, // hints used for the current question

  init(zoneId) {
    this.zoneId = zoneId;
    this.questions = window.helpers.shuffleArray(window.quizData[zoneId]).slice(0, 5); // 5 random questions
    this.currentQuestionIndex = 0;
    this.correctCount = 0;
    this.hintsUsedCount = 0;
    this.questionHintsUsed = 0;
    this.score = 100; // start at 100, deduct for wrong answers and hints

    // Set page title
    const navTitle = document.getElementById("nav-screen-title");
    if (navTitle) {
      const zone = window.zonesData.find(z => z.id === zoneId);
      navTitle.textContent = `${zone ? zone.title : "Zone"} Quiz`;
    }

    this.showQuestion();
  },

  showQuestion() {
    const question = this.questions[this.currentQuestionIndex];
    if (!question) return;

    this.questionHintsUsed = 0;

    // Reset UI
    document.getElementById("quiz-zone-label").textContent = `Zone ${this.zoneId}`;
    document.getElementById("quiz-progress-label").textContent = `Q ${this.currentQuestionIndex + 1} / 5`;
    document.getElementById("quiz-prog-bar").style.width = `${((this.currentQuestionIndex + 1) / 5) * 100}%`;

    const questionEl = document.getElementById("quiz-question");
    questionEl.textContent = question.question;

    const optionsEl = document.getElementById("quiz-options");
    optionsEl.innerHTML = "";

    question.options.forEach((opt, idx) => {
      const button = document.createElement("button");
      button.className = "quiz-option";
      button.textContent = opt;
      button.setAttribute("tabindex", "0");
      button.onclick = () => this.handleAnswerSelect(idx);
      optionsEl.appendChild(button);
    });

    // Reset feedback
    const feedbackEl = document.getElementById("quiz-feedback");
    feedbackEl.className = "quiz-feedback hidden";
    feedbackEl.innerHTML = "";

    // Reset buttons
    document.getElementById("btn-next-q").style.display = "none";
    this.updateHintButtonState();

    // Text to Speech
    setTimeout(() => {
      const progress = window.StorageManager.getProgress();
      if (progress.settings.readQuestionsAnswers !== false) {
        window.SpeechManager.speak(question.question);
      }
    }, 400);
  },

  updateHintButtonState() {
    const btnHint = document.getElementById("btn-hint");
    const hintsLabel = document.getElementById("quiz-hints-used-label");
    
    if (hintsLabel) {
      hintsLabel.textContent = `Hints Used: ${this.hintsUsedCount} / 2`;
    }

    if (!btnHint) return;

    const question = this.questions[this.currentQuestionIndex];
    const hasHintsLeftForQuestion = this.questionHintsUsed < question.hints.length;
    const hasHintsLeftForZone = this.hintsUsedCount < 2;

    if (hasHintsLeftForZone && hasHintsLeftForQuestion) {
      btnHint.removeAttribute("disabled");
      btnHint.style.opacity = "1";
      btnHint.style.cursor = "pointer";
    } else {
      btnHint.setAttribute("disabled", "true");
      btnHint.style.opacity = "0.5";
      btnHint.style.cursor = "not-allowed";
    }
  },

  useQuizHint() {
    if (this.hintsUsedCount >= 2) return;
    
    const question = this.questions[this.currentQuestionIndex];
    if (this.questionHintsUsed >= question.hints.length) return;

    // Deduct 10 points
    this.score = Math.max(0, this.score - 10);
    
    const hintText = question.hints[this.questionHintsUsed];
    this.hintsUsedCount++;
    this.questionHintsUsed++;

    window.SoundEffectPlayer.play("click");

    const feedbackEl = document.getElementById("quiz-feedback");
    feedbackEl.className = "quiz-feedback correct-fb"; // Styled as info
    feedbackEl.innerHTML = `<strong>💡 Hint:</strong> ${hintText}`;
    feedbackEl.classList.remove("hidden");

    this.updateHintButtonState();
    const progress = window.StorageManager.getProgress();
    if (progress.settings.readQuestionsAnswers !== false) {
      window.SpeechManager.speak(`Hint: ${hintText}`);
    }
  },

  handleAnswerSelect(selectedIndex) {
    const question = this.questions[this.currentQuestionIndex];
    const correctIndex = question.answerIndex;

    // Disable all options
    const optionButtons = document.querySelectorAll(".quiz-option");
    optionButtons.forEach(btn => btn.setAttribute("disabled", "true"));

    // Disable hint button during feedback
    document.getElementById("btn-hint").setAttribute("disabled", "true");

    const feedbackEl = document.getElementById("quiz-feedback");
    feedbackEl.classList.remove("hidden");

    const isCorrect = selectedIndex === correctIndex;

    if (isCorrect) {
      optionButtons[selectedIndex].classList.add("correct");
      feedbackEl.className = "quiz-feedback correct-fb";
      feedbackEl.innerHTML = `<strong>🎉 Correct!</strong> ${question.explanation}`;
      window.SoundEffectPlayer.play("correct");
      this.correctCount++;
      const progress = window.StorageManager.getProgress();
      if (progress.settings.readQuestionsAnswers !== false) {
        window.SpeechManager.speak(`Correct! ${question.explanation}`);
      }
    } else {
      optionButtons[selectedIndex].classList.add("wrong");
      optionButtons[correctIndex].classList.add("correct");
      feedbackEl.className = "quiz-feedback wrong-fb";
      feedbackEl.innerHTML = `<strong>💡 Science Fact:</strong> ${question.explanation}`;
      window.SoundEffectPlayer.play("wrong");
      
      // Deduct points for incorrect answer: 20 points per question, so a wrong answer costs 20 points
      this.score = Math.max(0, this.score - 20);
      const progress = window.StorageManager.getProgress();
      if (progress.settings.readQuestionsAnswers !== false) {
        window.SpeechManager.speak(`Incorrect. Here is the fact: ${question.explanation}`);
      }
    }

    document.getElementById("btn-next-q").style.display = "block";
  },

  nextQuestion() {
    window.SoundEffectPlayer.play("click");
    this.currentQuestionIndex++;

    if (this.currentQuestionIndex < 5) {
      this.showQuestion();
    } else {
      this.finishQuiz();
    }
  },

  finishQuiz() {
    // Determine stars
    // 80-100 -> 3 stars
    // 60-79 -> 2 stars
    // below 60 -> 1 star
    let stars = 1;
    if (this.score >= 80) {
      stars = 3;
    } else if (this.score >= 60) {
      stars = 2;
    }

    // Save score and progress
    window.StorageManager.completeZone(this.zoneId, this.score, stars);

    // Navigate to Results Screen
    window.showResult(this.zoneId, this.score, stars);
  }
};

window.QuizScene = QuizScene;
