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
    cycle: "Missione 2 - ",
    title: "Nuova destinazione",
    message: "Raggiungete il nuovo luogo: Unifi Include.\n\nTrovatelo, la mappa può aiutarvi!"
  },
  {
    type: "password",
    cycle: "Ciclo 3 - Fase 2",
    title: "Password",
    prompt: "Inserite la password trovata da Unifi Include.",
    answer: "INCLUSIONE"
  },
  {
    type: "chaosGame",
    cycle: "Ciclo 4 - Fase 1",
    title: "Il Caos della Matricola",
    intro: "Siete i nuovi assistenti di Unifi Include. Dovete aiutare le matricole a trovare il servizio giusto prima che vadano nel panico.",
    timeLimit: 10,
    options: [
      "📚 Piano Individuale di Supporto allo Studio",
      "🏃 Carriera Duale Studente-Atleta",
      "🪪 Carriera Alias"
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
    cycle: "Ciclo 4 - Fase 1",
    title: "Manuale introvabile",
    prompt: "Sei una matricola. Hai appena speso quasi tutti i tuoi soldi per l'abbonamento dei mezzi, qualche pranzo alla mensa universitaria e il concerto di TonyPitony. Scopri che per preparare un esame ti serve un manuale di 800 pagine che costa 72 euro. Dove puoi leggerlo gratis?",
    placeholder: "",
    answer: "BIBLIOTECA",
    success: "Trovatela. La mappa può aiutarvi!"
  },
  {
    type: "password",
    cycle: "Ciclo 4 - Fase 2",
    title: "Codice orario",
    prompt: "Inserite il codice a quattro cifre",
    placeholder: "__:__",
    answer: "23:30",
    normalize: value => value.replace(/\s+/g, "")
  },
  {
    type: "message",
    cycle: "Missione finale",
    title: "FIRST LAB",
    message: "Andate al FIRST LAB.\n\nTrovatelo. La mappa può aiutarvi!",
    final: true
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
const resetButton = document.querySelector("#resetButton");

let currentStep = 0;
let sequenceIndex = 0;
let chaosIndex = 0;
let timerId = null;
let timerStartedAt = 0;

startButton.addEventListener("click", () => {
  introScreen.classList.add("is-hidden");
  gameScreen.classList.remove("is-hidden");
  renderStep();
});

resetButton.addEventListener("click", () => {
  resetRuntimeState();
  currentStep = 0;
  introScreen.classList.remove("is-hidden");
  gameScreen.classList.add("is-hidden");
});

function resetRuntimeState() {
  clearInterval(timerId);
  timerId = null;
  sequenceIndex = 0;
  chaosIndex = 0;
  appShell.classList.remove("shake-low", "shake-mid", "shake-high");
}

function renderStep() {
  resetRuntimeState();
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
}

function renderQuiz(step) {
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
      disableCurrentChoices();
      button.classList.add("is-correct");
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
      if (successMessage) {
        renderSuccess(successMessage, () => advance());
      } else {
        advance();
      }
    } else {
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
  const buttonLabel = step.final ? "Ricomincia" : "Avanti";
  const action = step.final
    ? () => {
        resetRuntimeState();
        currentStep = 0;
        introScreen.classList.remove("is-hidden");
        gameScreen.classList.add("is-hidden");
      }
    : () => advance();
  renderSuccess(step.message, action, false, buttonLabel);
}

function renderChaosIntro(step) {
  contentPanel.innerHTML = panel(`
    <h3 class="prompt">${escapeHtml(step.intro)}</h3>
    <p class="support-text">Ogni matricola ha 10 secondi prima che lo stress arrivi al massimo.</p>
    <button class="next-button" type="button" id="startChaos">Avvia il gioco</button>
  `);
  contentPanel.querySelector("#startChaos").addEventListener("click", () => renderChaosScenario(step));
}

function renderChaosScenario(step) {
  clearInterval(timerId);
  appShell.classList.remove("shake-low", "shake-mid", "shake-high");
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
      disableCurrentChoices();
      clearInterval(timerId);
      timerId = null;
      appShell.classList.remove("shake-low", "shake-mid", "shake-high");
      button.classList.add("is-correct");
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
    window.alert("Ops! La matricola è stata assalita dallo stress. Ritenta");
    renderChaosScenario(step);
  }
}

function handleChoice(button, isCorrect, successMessage) {
  if (!isCorrect) {
    handleWrongChoice(button);
    return;
  }
  button.classList.add("is-correct");
  disableCurrentChoices();
  setTimeout(() => renderSuccess(successMessage, () => advance()), 360);
}

function handleWrongChoice(button) {
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
  const badgeMarkup = badge ? document.querySelector("#spaghettiBadgeTemplate").innerHTML : "";
  contentPanel.innerHTML = panel(`
    <div class="success-box">
      ${badgeMarkup}
      <p class="message">${escapeHtml(message).replace(/\n/g, "<br>")}</p>
      <button class="next-button" type="button" id="nextButton">${escapeHtml(label)}</button>
    </div>
  `);
  contentPanel.querySelector("#nextButton").addEventListener("click", onNext);
}

function advance() {
  currentStep = Math.min(currentStep + 1, steps.length - 1);
  renderStep();
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
