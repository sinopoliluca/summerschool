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
    message: "Andate al First Lab.\n\nTrovatelo. La mappa può aiutarvi!",
    buttonLabel: "Trovato!"
  },
  {
    type: "password",
    cycle: "Missione 4 - Il boss finale",
    title: "Password",
    prompt: "Inserite la password del First Lab.",
    answer: "IMPRESA"
  },
  {
    type: "wordPuzzle",
    cycle: "Missione 4 - Il boss finale",
    title: "Immatricolazione scomposta",
    prompt: "Le lettere sono andate nel panico da summer school. Rimettetele in ordine.",
    scrambled: ["T", "I", "M", "A", "L", "I", "O", "T", "M", "R", "C", "A", "I"],
    answer: "IMMATRICOLATI"
  }
];

const SCORE_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwSBu0vvTWaAKgG-IBgyy2gjDt2vmLhilL7g095YIerbl-ZiDNws_O_miDGpxMq4qtZLw/exec";

const appShell = document.querySelector("#appShell");
const introScreen = document.querySelector("#introScreen");
const gameScreen = document.querySelector("#gameScreen");
const contentPanel = document.querySelector("#contentPanel");
const stepLabel = document.querySelector("#stepLabel");
const stepTitle = document.querySelector("#stepTitle");
const progressFill = document.querySelector("#progressFill");
const startButton = document.querySelector("#startButton");
const backButton = document.querySelector("#backButton");

let currentStep = 0;
let sequenceIndex = 0;
let chaosIndex = 0;
let timerId = null;
let timerStartedAt = 0;
let correctAnswers = 0;
let wrongAnswers = 0;
let firstTryCorrectAnswers = 0;
let currentAnswerHadError = false;
let historyStack = [];
let currentView = null;

startButton.addEventListener("click", () => {
  historyStack = [{ view: { kind: "intro" } }];
  correctAnswers = 0;
  wrongAnswers = 0;
  firstTryCorrectAnswers = 0;
  currentAnswerHadError = false;
  currentStep = 0;
  sequenceIndex = 0;
  chaosIndex = 0;
  introScreen.classList.add("is-hidden");
  gameScreen.classList.remove("is-hidden");
  renderStep();
});

backButton.addEventListener("click", goBack);

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
  if (step.placeholder === "__:__") {
    renderTimePassword(step);
    return;
  }
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

function renderTimePassword(step) {
  currentView = { kind: "password" };
  contentPanel.innerHTML = panel(`
    <h3 class="prompt">${escapeHtml(step.prompt)}</h3>
    <form class="text-form" id="textForm">
      <div class="time-code" aria-label="Codice orario">
        <input class="time-code-input" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="1" autocomplete="off" aria-label="Prima cifra ora">
        <input class="time-code-input" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="1" autocomplete="off" aria-label="Seconda cifra ora">
        <span class="time-code-separator" aria-hidden="true">:</span>
        <input class="time-code-input" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="1" autocomplete="off" aria-label="Prima cifra minuti">
        <input class="time-code-input" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="1" autocomplete="off" aria-label="Seconda cifra minuti">
      </div>
      <button class="text-submit" type="submit">Sblocca</button>
    </form>
    <p class="feedback" id="feedback"></p>
  `);
  setupTimeAnswer(step);
}

function renderFillBlank(step) {
  currentView = { kind: "fillBlank" };
  contentPanel.innerHTML = panel(`
    <h3 class="prompt prompt-long">${escapeHtml(step.prompt)}</h3>
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
  form.addEventListener("submit", event => {
    event.preventDefault();
    const normalize = step.normalize || normalizeAnswer;
    const submitted = normalize(input.value);
    const expected = normalize(step.answer);
    if (submitted === expected) {
      pushHistory();
      recordCorrectAnswer();
      if (sameAnswer(step.answer, "SPAGHETTI")) {
        renderSpaghettiUnlock(() => advance(false));
        return;
      }
      if (sameAnswer(step.answer, "INCLUSIONE")) {
        renderUnlockAnimation("inclusion", "Inclusione sbloccata.", () => advance(false));
        return;
      }
      if (sameAnswer(step.answer, "BIBLIOTECA")) {
        renderUnlockAnimation("library", "Biblioteca localizzata.", () => renderSuccess(successMessage, () => advance()));
        return;
      }
      if (successMessage) {
        renderSuccess(successMessage, () => advance());
      } else {
        advance(false);
      }
    } else {
      recordWrongAnswer();
      feedback.textContent = "Ops, ritenta!";
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

function renderSpaghettiUnlock(onComplete) {
  currentView = { kind: "spaghettiUnlock" };
  contentPanel.innerHTML = panel(`
    <div class="spaghetti-unlock" aria-live="polite">
      <div class="spaghetti-stars" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div class="spaghetti-plate" aria-hidden="true">
        <div class="spaghetti-noodles">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div class="spaghetti-sauce"></div>
        <div class="spaghetti-fork"></div>
      </div>
      <p class="eyebrow">Password sbloccata</p>
      <h3 class="prompt">Spaghetti mode attivata.</h3>
    </div>
  `);
  window.setTimeout(onComplete, 1550);
}

function renderUnlockAnimation(type, title, onComplete) {
  currentView = { kind: "unlockAnimation", type, title };
  const titleText = escapeHtml(title);
  const animationMarkup = {
    inclusion: `
      <div class="mini-unlock-art inclusion-art" aria-hidden="true">
        <span class="inclusion-ring"></span>
        <span class="person person-a"></span>
        <span class="person person-b"></span>
        <span class="person person-c"></span>
        <span class="person-core"></span>
      </div>
    `,
    library: `
      <div class="mini-unlock-art library-art" aria-hidden="true">
        <span class="library-lamp"></span>
        <span class="book-page page-left"></span>
        <span class="book-page page-right"></span>
        <span class="book-line line-a"></span>
        <span class="book-line line-b"></span>
        <span class="book-line line-c"></span>
      </div>
    `,
    night: `
      <div class="mini-unlock-art night-art" aria-hidden="true">
        <span class="night-moon"></span>
        <span class="night-star star-a"></span>
        <span class="night-star star-b"></span>
        <span class="night-lamp"></span>
        <span class="night-book"></span>
        <span class="night-light"></span>
      </div>
    `
  }[type];

  contentPanel.innerHTML = panel(`
    <div class="mini-unlock ${type}-unlock" aria-live="polite">
      ${animationMarkup}
      <p class="eyebrow">Risposta sbloccata</p>
      <h3 class="prompt">${titleText}</h3>
    </div>
  `);
  window.setTimeout(onComplete, 1450);
}

function setupTimeAnswer(step) {
  const form = contentPanel.querySelector("#textForm");
  const inputs = [...contentPanel.querySelectorAll(".time-code-input")];
  const feedback = contentPanel.querySelector("#feedback");

  inputs.forEach((input, index) => {
    input.addEventListener("input", () => {
      input.value = input.value.replace(/\D/g, "").slice(0, 1);
      if (input.value && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
    });

    input.addEventListener("keydown", event => {
      if (event.key === "Backspace" && !input.value && index > 0) {
        inputs[index - 1].focus();
      }
    });
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    const submitted = `${inputs[0].value}${inputs[1].value}:${inputs[2].value}${inputs[3].value}`;
    if (submitted === step.answer) {
      pushHistory();
      recordCorrectAnswer();
      renderUnlockAnimation("night", "Sessione serale approvata.", () => advance(false));
    } else {
      recordWrongAnswer();
      feedback.textContent = "Ops, ritenta!";
      inputs.forEach(input => {
        input.value = "";
      });
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
  const letters = step.currentLetters || step.scrambled;
  const errorMessage = step.errorMessage || "";
  const hintMessage = step.hintMessage || "";
  contentPanel.innerHTML = panel(`
    <p class="support-text">Boss finale</p>
    <h3 class="prompt">${escapeHtml(step.prompt)}</h3>
    <p class="support-text">Cliccate le lettere una alla volta per comporre la parola.</p>
    <div class="word-slots" id="wordSlots" aria-label="Parola ricomposta">
      ${step.answer.split("").map(() => `<span class="word-slot"></span>`).join("")}
    </div>
    <div class="letter-board" aria-label="Lettere scombinate">
      ${letters.map((letter, index) => `<button class="letter-tile" type="button" data-index="${index}" data-letter="${escapeHtml(letter)}">${escapeHtml(letter)}</button>`).join("")}
    </div>
    <div class="feedback word-feedback" id="feedback">
      ${hintMessage ? `<p class="hint-message">${escapeHtml(hintMessage)}</p>` : ""}
      ${errorMessage ? `<p>${escapeHtml(errorMessage)}</p>` : ""}
    </div>
  `);

  const selectedLetters = [];
  const slots = contentPanel.querySelectorAll(".word-slot");
  const feedback = contentPanel.querySelector("#feedback");
  contentPanel.querySelectorAll(".letter-tile").forEach(button => {
    button.addEventListener("click", () => {
      const letter = button.dataset.letter;
      selectedLetters.push(letter);
      slots[selectedLetters.length - 1].textContent = letter;
      button.disabled = true;
      button.classList.add("is-used");

      if (selectedLetters.length < step.answer.length) return;

      if (sameAnswer(selectedLetters.join(""), step.answer)) {
        pushHistory();
        recordCorrectAnswer();
        renderFinalTrophy();
        return;
      }

      recordWrongAnswer();
      const failedAttempts = (step.failedAttempts || 0) + 1;
      const nextHintMessage = failedAttempts >= 3 ? "Suggerimento: un invito a iscriverti" : "";
      const nextErrorMessage = "Tentativo creativo, ma il portale studenti ha respinto la domanda. Riproviamo con nuove lettere!";
      feedback.innerHTML = `${nextHintMessage ? `<p class="hint-message">${escapeHtml(nextHintMessage)}</p>` : ""}<p>${escapeHtml(nextErrorMessage)}</p>`;
      const board = contentPanel.querySelector(".letter-board");
      slots.forEach(slot => {
        slot.textContent = "";
      });
      contentPanel.querySelectorAll(".letter-tile").forEach(tile => {
        tile.disabled = false;
        tile.classList.remove("is-used");
      });
      board.classList.add("is-shuffling");
      window.setTimeout(() => renderWordPuzzle({ ...step, currentLetters: shuffleLetters(step.answer), errorMessage: nextErrorMessage, hintMessage: nextHintMessage, failedAttempts }), 760);
    });
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

  appShell.classList.toggle("shake-low", percent >= 01 && percent < 20);
  appShell.classList.toggle("shake-mid", percent >= 20 && percent < 60);
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
  const messageClass = badge ? "message message-compact" : "message";
  contentPanel.innerHTML = panel(`
    <div class="success-box">
      ${badgeMarkup}
      <p class="${messageClass}">${escapeHtml(message).replace(/\n/g, "<br>")}</p>
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
      <p class="score-details">Risposte corrette al primo colpo: ${firstTryCorrectAnswers}/${grade.totalAnswers} · Tentativi errati: ${wrongAnswers}</p>
      <p class="message">${escapeHtml(trophy.message)}</p>
      <button class="next-button" type="button" id="showScoreForm">Invia il tuo punteggio</button>
      <form class="score-submit-form is-hidden" id="scoreSubmitForm">
        <input class="text-input" id="groupNameInput" type="text" autocomplete="off" placeholder="Nome del gruppo" aria-label="Nome del gruppo" required>
        <button class="text-submit" type="submit" id="scoreSubmitButton">Invia punteggio</button>
        <p class="score-submit-status" id="scoreSubmitStatus" aria-live="polite"></p>
      </form>
    </div>
  `);
  setupScoreSubmit(grade);
}

function setupScoreSubmit(grade) {
  const showButton = contentPanel.querySelector("#showScoreForm");
  const form = contentPanel.querySelector("#scoreSubmitForm");
  const input = contentPanel.querySelector("#groupNameInput");
  const submitButton = contentPanel.querySelector("#scoreSubmitButton");
  const status = contentPanel.querySelector("#scoreSubmitStatus");

  showButton.addEventListener("click", () => {
    showButton.classList.add("is-hidden");
    form.classList.remove("is-hidden");
  });

  form.addEventListener("submit", async event => {
    event.preventDefault();
    const groupName = input.value.trim();
    if (!groupName) return;

    if (!SCORE_WEB_APP_URL) {
      status.textContent = "Invio online non ancora configurato: manca l'URL della Web App Google.";
      return;
    }

    const payload = {
      groupName,
      finalGrade: `${grade.label}${grade.hasLode ? "" : "/30"}`,
      firstTryCorrectAnswers,
      totalAnswers: grade.totalAnswers,
      wrongAnswers
    };

    submitButton.disabled = true;
    submitButton.textContent = "Invio...";
    status.textContent = "";

    try {
      await fetch(SCORE_WEB_APP_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      });
      status.textContent = "Punteggio inviato. Mostrate questa schermata al tutor per conferma.";
      submitButton.textContent = "Inviato";
    } catch (error) {
      submitButton.disabled = false;
      submitButton.textContent = "Invia punteggio";
      status.textContent = "Invio non riuscito. Controllate la connessione e riprovate.";
    }
  });
}

function calculateFinalGrade() {
  const maxCorrectAnswers = getMaxCorrectAnswers();
  const perfectRun = correctAnswers === maxCorrectAnswers && wrongAnswers === 0;
  const missingAnswers = Math.max(0, maxCorrectAnswers - correctAnswers);
  const score = Math.max(18, Math.min(30, 30 - wrongAnswers - missingAnswers));
  return {
    hasLode: perfectRun,
    label: perfectRun ? "30 e lode" : score.toString(),
    totalAnswers: maxCorrectAnswers,
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
  if (grade.score === 30) {
    return {
      className: "is-gold",
      icon: "★",
      title: "Trofeo 30 pulito",
      message: "Niente lode, ma libretto splendente. La commissione annuisce con moderato entusiasmo."
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
  if (grade.score >= 25) {
    return {
      className: "is-silver",
      icon: "◆",
      title: "Trofeo libretto felice",
      message: "Ottima media, passo deciso e panico sotto controllo. Il campus vi saluta con rispetto."
    };
  }
  if (grade.score >= 21) {
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
    title: "Trofeo 18 politico",
    message: "Ok, il prof è stato buono: vi fa passare con 18. Non fate domande e firmate il verbale."
  };
}

function recordCorrectAnswer() {
  correctAnswers += 1;
  if (!currentAnswerHadError) {
    firstTryCorrectAnswers += 1;
  }
  currentAnswerHadError = false;
}

function recordWrongAnswer(amount = 1) {
  wrongAnswers += amount;
  currentAnswerHadError = true;
}

function shuffleLetters(word) {
  const letters = word.split("");
  for (let index = letters.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [letters[index], letters[randomIndex]] = [letters[randomIndex], letters[index]];
  }
  return sameAnswer(letters.join(""), word) ? shuffleLetters(word) : letters;
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
    firstTryCorrectAnswers,
    currentAnswerHadError,
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
    correctAnswers = 0;
    wrongAnswers = 0;
    firstTryCorrectAnswers = 0;
    currentAnswerHadError = false;
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
  firstTryCorrectAnswers = state.firstTryCorrectAnswers || 0;
  currentAnswerHadError = Boolean(state.currentAnswerHadError);

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
