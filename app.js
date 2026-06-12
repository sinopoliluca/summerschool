const steps = [
  {
    type: "quiz",
    cycle: "Missione 1 - Carboidrati",
    title: "Modalità matricola attivata",
    prompt: "Dove vanno gli studenti universitari quando hanno fame?",
    options: [
      "casa della nonna",
      "segreteria studenti",
      "mensa universitaria",
      "segreteria didattica",
      "aula studio"
    ],
    answer: "mensa universitaria",
    success: "Corretto, è la mensa universitaria.\n\nOra trovatela. La mappa può aiutarvi!"
  },
  {
    type: "password",
    cycle: "Missione 1 - Carboidrati",
    title: "Password",
    prompt: "Inserite la password trovata alla mensa universitaria.",
    answer: "DSU"
  },
  {
    type: "quizSequence",
    cycle: "Missione 1 - Carboidrati",
    title: "Pranzo stellare",
    finalBadge: true,
    questions: [
      { prompt: "Il prezzo del pranzo dipende dal voto che prendi agli esami.", answer: "Falso" },
      { prompt: "La mensa universitaria è solo pasta in bianco e tristezza.", answer: "Falso" },
      { prompt: "L'app MyDSU può valere più del portafoglio all'ora di pranzo.", answer: "Vero" },
      { prompt: "La parola ISEE può influenzare il prezzo del mio pranzo.", answer: "Vero" },
      { prompt: "Se sei intollerante al glutine, portati il pranzo da casa.", answer: "Falso" },
      { prompt: "Alla mensa universitaria puoi mangiare gratis solo se conosci il cuoco.", answer: "Falso" },
      { prompt: "Per avere uno sconto maggiore devo dimostrare alla cassiera che sono disperatamente affamato.", answer: "Falso" }
    ],
    success: "Complimenti! Avete dimostrato di saper sopravvivere all'ora di pranzo e avete sbloccato il badge “Pranzo stellare“. Mostratelo al tutor e se siete stati abbastanza veloci ritirate il vostro premio."
  },
  {
    type: "password",
    cycle: "Missione 1 - Carboidrati",
    title: "Password",
    prompt: "Inserite la password del badge Pranzo stellare.",
    answer: "SPAGHETTI"
  },
  {
    type: "message",
    cycle: "Missione 2 - Nessuno escluso",
    title: "Nuova destinazione",
    message: "Raggiungete il nuovo luogo: Unifi Include.\n\nTrovatelo, la mappa può aiutarvi!"
  },
  {
    type: "password",
    cycle: "Missione 2 - Nessuno escluso",
    title: "Password",
    prompt: "Inserite la password trovata da Unifi Include.",
    answer: "INCLUSIONE"
  },
  {
    type: "chaosGame",
    cycle: "Missione 2 - Nessuno escluso",
    title: "Il Caos della Matricola",
    intro: "Siete i nuovi assistenti di Unifi Include. Dovete aiutare le matricole a trovare il servizio giusto prima che vadano nel panico.",
    timeLimit: 10,
    options: [
      "🏃 Carriera Duale Studente-Atleta",
      "🪪 Carriera Alias",
      "📚 Piano Individuale di Supporto allo Studio"
    ],
    scenarios: [
      {
        prompt: "Ho un DSA e avrei bisogno di più tempo durante il TOLC.",
        answer: "📚 Piano Individuale di Supporto allo Studio"
      },
      {
        prompt: "La settimana prossima ho i Campionati Italiani e un esame.",
        answer: "🏃 Carriera Duale Studente-Atleta"
      },
      {
        prompt: "Vorrei usare all'università un nome diverso da quello anagrafico.",
        answer: "🪪 Carriera Alias"
      },
      {
        prompt: "Avrei bisogno di un tutor che mi aiuti a organizzare lo studio.",
        answer: "📚 Piano Individuale di Supporto allo Studio"
      }
    ],
    success: "Siete sopravvissuti al caos. Nessuna matricola è stata lasciata indietro."
  },
  {
    type: "fillBlank",
    cycle: "Missione 3 - La corona d'alloro",
    title: "Manuale introvabile",
    prompt: "Sei una matricola. Hai appena speso quasi tutti i tuoi soldi per l'abbonamento dei mezzi, qualche pranzo alla mensa universitaria e il concerto di TonyPitony. Scopri che per preparare un esame ti serve un manuale di 800 pagine che costa 72 euro. Dove puoi leggerlo gratis?",
    placeholder: "",
    answer: "BIBLIOTECA",
    success: "Esatto! Trovate la biblioteca. La mappa può aiutarvi!"
  },
  {
    type: "password",
    cycle: "Missione 3 - La corona d'alloro",
    title: "Codice orario",
    prompt: "Inserite il codice a quattro cifre",
    placeholder: "__:__",
    answer: "23:30",
    normalize: value => value.replace(/\s+/g, "")
  },
  {
    type: "message",
    cycle: "Missione 4 - Il boss finale",
    title: "FIRST LAB",
    message: "Andate al FIRST LAB.\n\nTrovatelo. La mappa può aiutarvi!",
    buttonLabel: "Trovato!"
  },
  {
    type: "wordPuzzle",
    cycle: "Missione 4 - Il boss finale",
    title: "Orientamento scomposto",
    prompt: "Le lettere sono andate nel panico da open day. Rimettetele in ordine.",
    scrambled: ["M", "E", "T", "O", "R", "I", "N", "A", "T", "O", "E", "N"],
    answer: "ORIENTAMENTO"
  }
];

const appShell = document.querySelector("#appShell");
const introScreen = document.querySelector("#introScreen");
const gameScreen = document.querySelector("#gameScreen");
const contentPanel = document.querySelector("#contentPanel");
const stepLabel = document.querySelector("#stepLabel");
const stepTitle = document.querySelector("#stepTitle");
const progressFill = document.querySelector("#progressFill");
const startButton = document.querySelector("#startButton");
const backButton = document.querySelector("#backButton");
const fullscreenButton = document.querySelector("#fullscreenButton");
const fullscreenIcon = document.querySelector("#fullscreenIcon");

let currentStep = 0;
let sequenceIndex = 0;
let chaosIndex = 0;
let timerId = null;
let timerStartedAt = 0;
let correctAnswers = 0;
let wrongAnswers = 0;
let historyStack = [];
let currentView = null;

startButton.addEventListener("click", () => {
  historyStack = [{ view: { kind: "intro" } }];
  correctAnswers = 0;
  wrongAnswers = 0;
  currentStep = 0;
  sequenceIndex = 0;
  chaosIndex = 0;
  introScreen.classList.add("is-hidden");
  gameScreen.classList.remove("is-hidden");
  renderStep();
});

backButton.addEventListener("click", goBack);
fullscreenButton.addEventListener("click", toggleFullscreen);
document.addEventListener("fullscreenchange", updateFullscreenButton);
window.addEventListener("resize", updateAppHeight);
if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", updateAppHeight);
}

function resetRuntimeState() {
  clearInterval(timerId);
  timerId = null;
  appShell.classList.remove("shake-low", "shake-mid", "shake-high");
  closeBadgeZoom();
}

function renderStep(resetLocalState = true) {
  resetRuntimeState();
  if (resetLocalState) {
    sequenceIndex = 0;
    chaosIndex = 0;
  }
  const step = steps[currentStep];
  stepLabel.textContent = step.cycle;
  stepTitle.textContent = step.title;
  progressFill.style.width = `${(currentStep / (steps.length - 1)) * 100}%`;

  if (step.type === "quiz") renderQuiz(step);
  if (step.type === "quizSequence") renderQuizSequence(step);
  if (step.type === "password") renderPassword(step);
  if (step.type === "message") renderMessage(step);
  if (step.type === "chaosGame") renderChaosIntro(step);
  if (step.type === "fillBlank") renderFillBlank(step);
  if (step.type === "wordPuzzle") renderWordPuzzle(step);
  updateBackButton();
}

function renderQuiz(step) {
  currentView = { kind: "quiz" };
  contentPanel.innerHTML = panel(`
    <h3 class="prompt">${escapeHtml(step.prompt)}</h3>
    <div class="choices">
      ${step.options.map(option => `<button class="choice-button" type="button" data-answer="${escapeHtml(option)}">${escapeHtml(option)}</button>`).join("")}
    </div>
    <p class="feedback" id="feedback"></p>
  `);

  contentPanel.querySelectorAll(".choice-button").forEach(button => {
    button.addEventListener("click", () => {
      const isCorrect = sameAnswer(button.dataset.answer, step.answer);
      handleChoice(button, isCorrect, step.success);
    });
  });
}

function renderQuizSequence(step) {
  currentView = { kind: "quizSequence" };
  const question = step.questions[sequenceIndex];
  contentPanel.innerHTML = panel(`
    <p class="support-text">Domanda ${sequenceIndex + 1} di ${step.questions.length}</p>
    <h3 class="prompt">${escapeHtml(question.prompt)}</h3>
    <div class="choices">
      <button class="choice-button" type="button" data-answer="Vero">Vero</button>
      <button class="choice-button" type="button" data-answer="Falso">Falso</button>
    </div>
    <p class="feedback" id="feedback"></p>
  `);

  contentPanel.querySelectorAll(".choice-button").forEach(button => {
    button.addEventListener("click", () => {
      const isCorrect = sameAnswer(button.dataset.answer, question.answer);
      if (!isCorrect) {
        handleWrongChoice(button);
        return;
      }
      pushHistory();
      disableCurrentChoices();
      button.classList.add("is-correct");
      recordCorrectAnswer();
      sequenceIndex += 1;
      setTimeout(() => {
        if (sequenceIndex < step.questions.length) {
          renderQuizSequence(step);
        } else {
          renderSuccess(step.success, () => advance(), step.finalBadge);
        }
      }, 420);
    });
  });
}

function renderPassword(step) {
  currentView = { kind: "password" };
  const placeholder = step.placeholder || "Password";
  contentPanel.innerHTML = panel(`
    <h3 class="prompt">${escapeHtml(step.prompt)}</h3>
    <form class="text-form" id="textForm">
      <input class="text-input" id="textInput" type="text" inputmode="text" autocomplete="off" placeholder="${escapeHtml(placeholder)}" aria-label="${escapeHtml(placeholder)}">
      <button class="text-submit" type="submit">Sblocca</button>
    </form>
    <p class="feedback" id="feedback"></p>
  `);
  setupTextAnswer(step);
}

function renderFillBlank(step) {
  currentView = { kind: "fillBlank" };
  contentPanel.innerHTML = panel(`
    <h3 class="prompt">${escapeHtml(step.prompt)}</h3>
    <p class="support-text">${escapeHtml(step.placeholder)}</p>
    <form class="text-form" id="textForm">
      <input class="text-input" id="textInput" type="text" autocomplete="off" placeholder="Scrivi la risposta" aria-label="Risposta">
      <button class="text-submit" type="submit">Conferma</button>
    </form>
    <p class="feedback" id="feedback"></p>
  `);
  setupTextAnswer(step, step.success);
}

function setupTextAnswer(step, successMessage = null) {
  const form = contentPanel.querySelector("#textForm");
  const input = contentPanel.querySelector("#textInput");
  const feedback = contentPanel.querySelector("#feedback");
  input.focus();
  form.addEventListener("submit", event => {
    event.preventDefault();
    const normalize = step.normalize || normalizeAnswer;
    const submitted = normalize(input.value);
    const expected = normalize(step.answer);
    if (submitted === expected) {
      pushHistory();
      recordCorrectAnswer();
      if (successMessage) {
        renderSuccess(successMessage, () => advance());
      } else {
        advance(false);
      }
    } else {
      recordWrongAnswer();
      feedback.textContent = "Ops, ritenta!";
      input.select();
      form.animate(
        [
          { transform: "translateX(0)" },
          { transform: "translateX(-8px)" },
          { transform: "translateX(8px)" },
          { transform: "translateX(0)" }
        ],
        { duration: 240 }
      );
    }
  });
}

function renderMessage(step) {
  currentView = { kind: "message" };
  renderSuccess(step.message, () => advance(), false, step.buttonLabel || "Avanti");
}

function renderWordPuzzle(step) {
  currentView = { kind: "wordPuzzle" };
  contentPanel.innerHTML = panel(`
    <p class="support-text">Boss finale</p>
    <h3 class="prompt">${escapeHtml(step.prompt)}</h3>
    <div class="letter-board" aria-label="Lettere scombinate">
      ${step.scrambled.map(letter => `<span class="letter-tile">${escapeHtml(letter)}</span>`).join("")}
    </div>
    <form class="text-form" id="textForm">
      <input class="text-input" id="textInput" type="text" inputmode="text" autocomplete="off" placeholder="Scrivi la parola" aria-label="Parola ricomposta">
      <button class="text-submit" type="submit">Conferma</button>
    </form>
    <p class="feedback" id="feedback"></p>
  `);

  const form = contentPanel.querySelector("#textForm");
  const input = contentPanel.querySelector("#textInput");
  const feedback = contentPanel.querySelector("#feedback");
  input.focus();
  form.addEventListener("submit", event => {
    event.preventDefault();
    if (sameAnswer(input.value, step.answer)) {
      pushHistory();
      recordCorrectAnswer();
      renderFinalTrophy();
    } else {
      recordWrongAnswer();
      feedback.textContent = "Quasi, ma l'orientamento è ancora disorientato.";
      input.select();
      form.animate(
        [
          { transform: "translateX(0)" },
          { transform: "translateX(-8px)" },
          { transform: "translateX(8px)" },
          { transform: "translateX(0)" }
        ],
        { duration: 240 }
      );
    }
  });
}

function renderChaosIntro(step) {
  currentView = { kind: "chaosIntro" };
  contentPanel.innerHTML = panel(`
    <h3 class="prompt">${escapeHtml(step.intro)}</h3>
    <p class="support-text">Ogni matricola ha 10 secondi prima che lo stress arrivi al massimo.</p>
    <button class="next-button" type="button" id="startChaos">Avvia il gioco</button>
  `);
  contentPanel.querySelector("#startChaos").addEventListener("click", () => {
    pushHistory();
    renderChaosScenario(step);
  });
}

function renderChaosScenario(step) {
  clearInterval(timerId);
  appShell.classList.remove("shake-low", "shake-mid", "shake-high");
  currentView = { kind: "chaosScenario" };
  const scenario = step.scenarios[chaosIndex];
  contentPanel.innerHTML = panel(`
    <div class="stress-head">
      <span>Stress matricola</span>
      <span id="stressPercent">0%</span>
    </div>
    <div class="stress-track" aria-hidden="true"><div class="stress-fill" id="stressFill"></div></div>
    <div class="student-zone">
      <div class="student-avatar" aria-hidden="true"></div>
      <h3 class="prompt">${escapeHtml(scenario.prompt)}</h3>
    </div>
    <div class="chaos-actions">
      ${step.options.map(option => `<button class="choice-button" type="button" data-answer="${escapeHtml(option)}">${escapeHtml(option)}</button>`).join("")}
    </div>
    <p class="feedback" id="feedback"></p>
  `);

  timerStartedAt = Date.now();
  timerId = setInterval(() => updateStress(step), 100);
  updateStress(step);

  contentPanel.querySelectorAll(".choice-button").forEach(button => {
    button.addEventListener("click", () => {
      if (!sameAnswer(button.dataset.answer, scenario.answer)) {
        handleWrongChoice(button);
        return;
      }
      pushHistory();
      disableCurrentChoices();
      clearInterval(timerId);
      timerId = null;
      appShell.classList.remove("shake-low", "shake-mid", "shake-high");
      button.classList.add("is-correct");
      recordCorrectAnswer();
      chaosIndex += 1;
      setTimeout(() => {
        if (chaosIndex < step.scenarios.length) {
          renderChaosScenario(step);
        } else {
          renderSuccess(step.success, () => advance(), false, "Avanti");
        }
      }, 450);
    });
  });
}

function updateStress(step) {
  const elapsed = (Date.now() - timerStartedAt) / 1000;
  const percent = Math.min(100, (elapsed / step.timeLimit) * 100);
  const fill = contentPanel.querySelector("#stressFill");
  const label = contentPanel.querySelector("#stressPercent");
  if (fill) fill.style.width = `${percent}%`;
  if (label) label.textContent = `${Math.round(percent)}%`;

  appShell.classList.toggle("shake-low", percent >= 10 && percent < 30);
  appShell.classList.toggle("shake-mid", percent >= 30 && percent < 60);
  appShell.classList.toggle("shake-high", percent >= 60);

  if (percent >= 100) {
    clearInterval(timerId);
    timerId = null;
    appShell.classList.remove("shake-low", "shake-mid", "shake-high");
    pushHistory();
    recordWrongAnswer(2);
    renderStressRetry(step);
  }
}

function renderStressRetry(step) {
  currentView = { kind: "stressRetry" };
  contentPanel.innerHTML = panel(`
    <div class="stress-retry">
      <div class="student-avatar is-stressed" aria-hidden="true"></div>
      <p class="eyebrow">Stress al massimo</p>
      <h3 class="prompt">Ops! La matricola è stata assalita dallo stress.</h3>
      <p class="support-text">Riprovate la stessa situazione e scegliete il servizio giusto prima che la barra si riempia.</p>
      <button class="next-button" type="button" id="retryStress">Ritenta</button>
    </div>
  `);
  contentPanel.querySelector("#retryStress").addEventListener("click", () => {
    pushHistory();
    renderChaosScenario(step);
  });
}

function handleChoice(button, isCorrect, successMessage) {
  if (!isCorrect) {
    handleWrongChoice(button);
    return;
  }
  pushHistory();
  recordCorrectAnswer();
  button.classList.add("is-correct");
  disableCurrentChoices();
  setTimeout(() => renderSuccess(successMessage, () => advance()), 360);
}

function handleWrongChoice(button) {
  recordWrongAnswer();
  const feedback = contentPanel.querySelector("#feedback");
  button.classList.add("is-wrong");
  if (feedback) feedback.textContent = "Ops, ritenta!";
  setTimeout(() => button.classList.remove("is-wrong"), 520);
}

function disableCurrentChoices() {
  contentPanel.querySelectorAll("button").forEach(button => {
    button.disabled = true;
  });
}

function renderSuccess(message, onNext, badge = false, label = "Avanti") {
  currentView = { kind: "success", message, badge, label };
  const badgeMarkup = badge ? document.querySelector("#spaghettiBadgeTemplate").innerHTML : "";
  contentPanel.innerHTML = panel(`
    <div class="success-box">
      ${badgeMarkup}
      <p class="message">${escapeHtml(message).replace(/\n/g, "<br>")}</p>
      <button class="next-button" type="button" id="nextButton">${escapeHtml(label)}</button>
    </div>
  `);
  contentPanel.querySelector("#nextButton").addEventListener("click", onNext);
  if (badge) setupBadgeZoom();
}

function renderFinalTrophy() {
  currentView = { kind: "finalTrophy" };
  const grade = calculateFinalGrade();
  const trophy = getTrophy(grade);
  stepLabel.textContent = "Risultato finale";
  stepTitle.textContent = "Libretto dell'escape room";
  progressFill.style.width = "100%";
  contentPanel.innerHTML = panel(`
    <div class="trophy-box">
      <div class="trophy-medal ${trophy.className}" aria-hidden="true">${trophy.icon}</div>
      <p class="support-text">Esame finale verbalizzato</p>
      <h3 class="prompt">${escapeHtml(trophy.title)}</h3>
      <p class="score-value">${escapeHtml(grade.label)}${grade.hasLode ? "" : "<span>/30</span>"}</p>
      <p class="score-details">${correctAnswers}/${grade.maxCorrectAnswers} risposte corrette · ${wrongAnswers} malus</p>
      <p class="message">${escapeHtml(trophy.message)}</p>
    </div>
  `);
}

function calculateFinalGrade() {
  const maxCorrectAnswers = getMaxCorrectAnswers();
  const perfectRun = correctAnswers === maxCorrectAnswers && wrongAnswers === 0;
  const correctScore = maxCorrectAnswers ? (correctAnswers / maxCorrectAnswers) * 30 : 18;
  const score = Math.max(18, Math.min(30, Math.round(correctScore - wrongAnswers)));
  return {
    hasLode: perfectRun,
    label: perfectRun ? "30 e lode" : score.toString(),
    maxCorrectAnswers,
    score
  };
}

function getMaxCorrectAnswers() {
  return steps.reduce((total, step) => {
    if (step.type === "quiz" || step.type === "password" || step.type === "fillBlank" || step.type === "wordPuzzle") {
      return total + 1;
    }
    if (step.type === "quizSequence") {
      return total + step.questions.length;
    }
    if (step.type === "chaosGame") {
      return total + step.scenarios.length;
    }
    return total;
  }, 0);
}

function getTrophy(grade) {
  if (grade.hasLode) {
    return {
      className: "is-gold",
      icon: "★",
      title: "Trofeo 30 e lode",
      message: "La commissione si alza in piedi. Qualcuno propone di farvi direttamente tutor."
    };
  }
  if (grade.score >= 28) {
    return {
      className: "is-gold",
      icon: "★",
      title: "Trofeo quasi lode",
      message: "Prestazione brillante: avete perso la lode per un dettaglio, probabilmente colpa della burocrazia."
    };
  }
  if (grade.score >= 24) {
    return {
      className: "is-silver",
      icon: "◆",
      title: "Trofeo libretto felice",
      message: "Ottima media, passo deciso e panico sotto controllo. Il campus vi saluta con rispetto."
    };
  }
  if (grade.score >= 18) {
    return {
      className: "is-bronze",
      icon: "●",
      title: "Trofeo appello superato",
      message: "Non tutto elegante, ma verbalizzato. Si festeggia alla mensa, con dignità."
    };
  }
  return {
    className: "is-green",
    icon: "✓",
    title: "Trofeo ci ripenso a settembre",
    message: "Avete finito vivi, che è già un risultato amministrativamente valido."
  };
}

function recordCorrectAnswer() {
  correctAnswers += 1;
}

function recordWrongAnswer(amount = 1) {
  wrongAnswers += amount;
}

function setupBadgeZoom() {
  const badge = contentPanel.querySelector(".badge-card");
  if (!badge) return;
  badge.setAttribute("tabindex", "0");
  badge.setAttribute("role", "button");
  badge.setAttribute("aria-label", "Apri badge Pranzo stellare");
  badge.addEventListener("click", event => {
    event.stopPropagation();
    toggleBadgeZoom();
  });
  badge.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleBadgeZoom();
    }
  });
}

function toggleBadgeZoom() {
  const badge = contentPanel.querySelector(".badge-card");
  if (!badge) return;
  const isOpen = badge.classList.toggle("is-zoomed");
  gameScreen.classList.toggle("badge-zoom-active", isOpen);
  badge.setAttribute("aria-label", isOpen ? "Chiudi badge Pranzo stellare" : "Apri badge Pranzo stellare");
}

function closeBadgeZoom() {
  const badge = contentPanel.querySelector(".badge-card.is-zoomed");
  if (!badge) return;
  badge.classList.remove("is-zoomed");
  badge.setAttribute("aria-label", "Apri badge Pranzo stellare");
  gameScreen.classList.remove("badge-zoom-active");
}

gameScreen.addEventListener("click", event => {
  if (!gameScreen.classList.contains("badge-zoom-active")) return;
  if (event.target.closest(".badge-card")) return;
  closeBadgeZoom();
});

function advance(saveCurrentState = true) {
  if (saveCurrentState) pushHistory();
  currentStep = Math.min(currentStep + 1, steps.length - 1);
  renderStep();
}

function pushHistory() {
  if (!currentView) return;
  historyStack.push({
    currentStep,
    sequenceIndex,
    chaosIndex,
    correctAnswers,
    wrongAnswers,
    view: { ...currentView }
  });
  updateBackButton();
}

function goBack() {
  if (!historyStack.length) return;
  const previousState = historyStack.pop();
  if (previousState.view.kind === "intro") {
    resetRuntimeState();
    introScreen.classList.remove("is-hidden");
    gameScreen.classList.add("is-hidden");
    historyStack = [];
    updateBackButton();
    return;
  }
  restoreState(previousState);
}

function restoreState(state) {
  resetRuntimeState();
  currentStep = state.currentStep;
  sequenceIndex = state.sequenceIndex;
  chaosIndex = state.chaosIndex;
  correctAnswers = state.correctAnswers;
  wrongAnswers = state.wrongAnswers;

  const step = steps[currentStep];
  updateHeader(step);

  if (state.view.kind === "success") {
    renderSuccess(state.view.message, () => advance(), state.view.badge, state.view.label);
  } else if (state.view.kind === "finalTrophy") {
    renderFinalTrophy(state.view.message);
  } else if (state.view.kind === "stressRetry") {
    renderStressRetry(step);
  } else {
    renderStep(false);
  }
  updateBackButton();
}

function updateHeader(step) {
  stepLabel.textContent = step.cycle;
  stepTitle.textContent = step.title;
  progressFill.style.width = `${(currentStep / (steps.length - 1)) * 100}%`;
}

function updateBackButton() {
  backButton.disabled = historyStack.length === 0;
  backButton.classList.toggle("is-hidden-control", historyStack.length === 0);
}

async function toggleFullscreen() {
  const isFullscreen = document.fullscreenElement || appShell.classList.contains("is-window-fullscreen");
  try {
    if (isFullscreen) {
      if (document.fullscreenElement) await document.exitFullscreen();
      setAppFullscreen(false);
    } else {
      setAppFullscreen(true);
      if (appShell.requestFullscreen) await appShell.requestFullscreen();
    }
  } catch {
    setAppFullscreen(!isFullscreen);
  }
  updateFullscreenButton();
}

function updateFullscreenButton() {
  const isFullscreen = Boolean(document.fullscreenElement) || appShell.classList.contains("is-window-fullscreen");
  fullscreenIcon.textContent = isFullscreen ? "×" : "⛶";
  fullscreenButton.setAttribute("aria-label", isFullscreen ? "Esci da schermo intero" : "Schermo intero");
}

function setAppFullscreen(enabled) {
  updateAppHeight();
  appShell.classList.toggle("is-window-fullscreen", enabled);
  document.body.classList.toggle("is-app-fullscreen", enabled);
  if (enabled) {
    window.setTimeout(() => window.scrollTo(0, 1), 80);
  }
}

function updateAppHeight() {
  const height = window.visualViewport ? window.visualViewport.height : window.innerHeight;
  document.documentElement.style.setProperty("--app-height", `${height}px`);
}

function panel(markup) {
  return `<div class="panel-inner">${markup}</div>`;
}

function sameAnswer(a, b) {
  return normalizeAnswer(a) === normalizeAnswer(b);
}

function normalizeAnswer(value) {
  return value
    .toString()
    .trim()
    .toLocaleLowerCase("it-IT")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function escapeHtml(value) {
  return value
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
