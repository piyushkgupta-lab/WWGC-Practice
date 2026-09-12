/* Wild Wisdom Global Challenge — Mock Exam app logic */
(function () {
  "use strict";

  const app = document.getElementById("app");

  // ---------- Safe storage wrapper (works even if localStorage is blocked) ----------
  const memoryStore = {};
  const storage = {
    get(key, fallback) {
      try {
        const raw = window.localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (e) {
        return key in memoryStore ? memoryStore[key] : fallback;
      }
    },
    set(key, value) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        memoryStore[key] = value;
      }
    }
  };

  const PROGRESS_KEY = "wwgc_mock_progress_v1";
  function getProgress() {
    return storage.get(PROGRESS_KEY, {});
  }
  function saveProgress(quizId, result) {
    const p = getProgress();
    const prev = p[quizId];
    if (!prev || result.score > prev.bestScore ||
        (result.score === prev.bestScore && result.timeUsedSec < prev.bestTimeSec)) {
      p[quizId] = {
        bestScore: result.score,
        total: result.total,
        bestTimeSec: result.timeUsedSec,
        attempts: (prev ? prev.attempts : 0) + 1
      };
    } else {
      p[quizId].attempts = (prev.attempts || 0) + 1;
    }
    storage.set(PROGRESS_KEY, p);
  }

  // ---------- Helpers ----------
  function byId(id) { return QUESTION_BANK.find(q => q.id === id); }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Build a runnable question: shuffles option order, tracks new correct index
  function prepareQuestion(qDef) {
    const idxArr = qDef.options.map((_, i) => i);
    const shuffledIdx = shuffle(idxArr);
    const options = shuffledIdx.map(i => qDef.options[i]);
    const correctIndex = shuffledIdx.indexOf(qDef.correct);
    return {
      id: qDef.id,
      chapter: qDef.chapter,
      qText: qDef.q,
      options,
      correctIndex,
      explain: qDef.explain
    };
  }

  function fmtTime(sec) {
    sec = Math.max(0, Math.round(sec));
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return m + ":" + String(s).padStart(2, "0");
  }

  // ---------- App state ----------
  let session = null; // active quiz session
  let timerHandle = null;

  function startQuiz(kind, quizId) {
    let title, questionDefs, timed, durationSec;

    if (kind === "chapter") {
      const chapterNum = Number(quizId.replace("chapter", ""));
      const pool = QUESTION_BANK.filter(q => q.chapter === chapterNum);
      const count = Math.min(15, pool.length);
      questionDefs = shuffle(pool).slice(0, count);
      title = "Practice: " + CHAPTER_INFO[chapterNum].name;
      timed = false;
      durationSec = null;
    } else {
      const mock = MOCK_QUIZZES.find(m => m.id === quizId);
      questionDefs = mock.questionIds.map(byId);
      title = mock.title;
      timed = true;
      durationSec = mock.durationSec;
    }

    session = {
      kind, quizId, title, timed,
      questions: questionDefs.map(prepareQuestion),
      answers: new Array(questionDefs.length).fill(null),
      current: 0,
      remainingSec: durationSec,
      startedAt: Date.now(),
      finished: false
    };

    if (timed) startTimer();
    render();
  }

  function startTimer() {
    clearInterval(timerHandle);
    timerHandle = setInterval(() => {
      if (!session || session.finished) { clearInterval(timerHandle); return; }
      session.remainingSec -= 1;
      if (session.remainingSec <= 0) {
        session.remainingSec = 0;
        clearInterval(timerHandle);
        finishQuiz();
        return;
      }
      updateTimerDisplay();
    }, 1000);
  }

  function updateTimerDisplay() {
    const el = document.getElementById("timerDisplay");
    if (!el) return;
    el.textContent = "⏱ " + fmtTime(session.remainingSec);
    el.classList.toggle("low", session.remainingSec <= 60);
  }

  function selectAnswer(optionIndex) {
    if (session.finished) return;
    session.answers[session.current] = optionIndex;
    render();
  }

  function goNext() {
    if (session.current < session.questions.length - 1) {
      session.current += 1;
      render();
    } else {
      finishQuiz();
    }
  }

  function goPrev() {
    if (session.kind === "chapter" && session.current > 0) {
      session.current -= 1;
      render();
    }
  }

  function finishQuiz() {
    if (session.finished) return;
    session.finished = true;
    clearInterval(timerHandle);
    const timeUsedSec = session.timed
      ? (session.questions.length ? (MOCK_QUIZZES.find(m => m.id === session.quizId).durationSec - session.remainingSec) : 0)
      : Math.round((Date.now() - session.startedAt) / 1000);

    let score = 0;
    session.questions.forEach((q, i) => {
      if (session.answers[i] === q.correctIndex) score += 1;
    });

    session.result = { score, total: session.questions.length, timeUsedSec };

    if (session.kind === "mock") {
      saveProgress(session.quizId, session.result);
    }
    render();
  }

  function exitToHome() {
    clearInterval(timerHandle);
    session = null;
    render();
  }

  // ---------- Rendering ----------
  function render() {
    if (!session) {
      renderHome();
    } else if (!session.finished) {
      renderQuiz();
    } else {
      renderResults();
    }
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }

  function renderHome() {
    const progress = getProgress();
    let mockCumulative = 0;
    let mockDone = 0;
    MOCK_QUIZZES.forEach(m => {
      const p = progress[m.id];
      if (p) { mockCumulative += p.bestScore; mockDone += 1; }
    });

    const mockTiles = MOCK_QUIZZES.map(m => {
      const p = progress[m.id];
      const bestLine = p
        ? `Best: ${p.bestScore}/${p.total} · ${fmtTime(p.bestTimeSec)} · ${p.attempts} attempt${p.attempts > 1 ? "s" : ""}`
        : "Not attempted yet";
      return `
        <button class="quiz-tile" data-kind="mock" data-id="${m.id}">
          <span class="tile-title">${m.title}</span>
          <span class="tile-meta"><span class="badge timed">⏱ 8 min · 15 Qs</span></span>
          <span class="tile-best">${bestLine}</span>
        </button>`;
    }).join("");

    const chapterTiles = Object.keys(CHAPTER_INFO).map(num => {
      const info = CHAPTER_INFO[num];
      const count = QUESTION_BANK.filter(q => q.chapter === Number(num)).length;
      return `
        <button class="quiz-tile" data-kind="chapter" data-id="chapter${num}">
          <span class="tile-title">${info.tag}: ${info.name}</span>
          <span class="tile-meta"><span class="badge">Untimed · up to ${Math.min(15,count)} Qs · explanations shown</span></span>
        </button>`;
    }).join("");

    app.innerHTML = `
      <header class="top">
        <div class="wave">🌊🐢🐠</div>
        <h1>Wild Wisdom Global Challenge — Ocean Odyssey Mock Exams</h1>
        <p class="sub">Practice for the 2026 theme: "From Coastline to the Seafloor"</p>
      </header>

      <div class="notice">
        <b>About the real quiz:</b> the WWGC classroom-level round is <b>4 quizzes of 15 MCQs each, 8 minutes per quiz, one attempt per quiz</b>, with scores adding up across all 4 for state-level qualification. These mock quizzes copy that exact format so you can rehearse under real time pressure — but you can retake them as often as you like here, since this is just practice, not the real thing. Never use this site (or any AI tool) during the actual competition quiz — only beforehand, to prepare.
      </div>

      <div class="card cumulative">
        <div>
          <div class="score-label">Your best cumulative mock score (${mockDone}/4 quizzes attempted)</div>
          <div class="score-big">${mockCumulative} / 60</div>
        </div>
        <button class="secondary" id="resetProgressBtn">Reset my scores</button>
      </div>

      <div class="section-title">🏁 Official-Format Mock Quizzes</div>
      <p class="sub" style="margin-top:-4px;color:var(--ink-soft);font-size:0.88rem;">15 questions, 8-minute timer, mixed across all 6 chapters — just like the real thing.</p>
      <div class="grid">${mockTiles}</div>

      <div class="section-title">📖 Learn &amp; Practice by Chapter</div>
      <p class="sub" style="margin-top:-4px;color:var(--ink-soft);font-size:0.88rem;">No timer. See the correct answer and a short explanation right after each question — great for first-time learning and revision.</p>
      <div class="grid">${chapterTiles}</div>

      <footer class="site-footer">Built from the official WWGC 2026 "Ocean Odyssey" learning material, for personal practice only.</footer>
    `;

    app.querySelectorAll(".quiz-tile").forEach(btn => {
      btn.addEventListener("click", () => startQuiz(btn.dataset.kind, btn.dataset.id));
    });
    const resetBtn = document.getElementById("resetProgressBtn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (confirm("Clear all saved mock quiz scores on this device?")) {
          storage.set(PROGRESS_KEY, {});
          render();
        }
      });
    }
  }

  function renderQuiz() {
    const q = session.questions[session.current];
    const total = session.questions.length;
    const answered = session.answers[session.current];
    const pct = Math.round(((session.current) / total) * 100);
    const info = CHAPTER_INFO[q.chapter];

    // Practice (chapter) quizzes reveal correctness + explanation immediately.
    // Official-format mock quizzes stay silent until the end, like the real quiz.
    const revealNow = session.kind === "chapter" && answered !== null;

    const optionsHtml = q.options.map((opt, i) => {
      let cls = "";
      if (revealNow) {
        if (i === q.correctIndex) cls = "correct";
        else if (i === answered) cls = "incorrect";
      } else if (answered === i) {
        cls = "selected";
      }
      const disabledAttr = revealNow ? "disabled" : "";
      return `<button class="option ${cls}" data-idx="${i}" ${disabledAttr}>${opt}</button>`;
    }).join("");

    const explainHtml = revealNow
      ? `<div class="explain">${answered === q.correctIndex ? "✔ Correct! " : "✘ Not quite. "}${q.explain}</div>`
      : "";

    app.innerHTML = `
      <div class="card">
        <div class="quiz-header">
          <span class="quiz-title">${session.title}</span>
          ${session.timed ? `<span class="timer" id="timerDisplay">⏱ ${fmtTime(session.remainingSec)}</span>` : `<button class="ghost" id="exitBtn">Exit to home</button>`}
        </div>
        <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
        <div class="q-count">Question ${session.current + 1} of ${total}</div>
        <div class="q-chapter">${info.tag} · ${info.name}</div>
        <div class="q-text">${q.qText}</div>
        <div class="options">${optionsHtml}</div>
        ${explainHtml}
        <div class="nav-row">
          <button class="secondary" id="prevBtn" ${session.kind !== "chapter" || session.current === 0 ? "disabled" : ""}>← Previous</button>
          <button id="nextBtn" ${answered === null ? "disabled" : ""}>${session.current === total - 1 ? "Finish" : "Next →"}</button>
        </div>
      </div>
      ${session.timed ? `<div style="text-align:center;"><button class="ghost" id="exitBtn2">Exit without saving</button></div>` : ""}
    `;

    app.querySelectorAll(".option").forEach(btn => {
      btn.addEventListener("click", () => {
        if (revealNow) return; // already answered & revealed in practice mode
        selectAnswer(Number(btn.dataset.idx));
      });
    });
    document.getElementById("nextBtn").addEventListener("click", goNext);
    const prevBtn = document.getElementById("prevBtn");
    if (prevBtn) prevBtn.addEventListener("click", goPrev);
    const exitBtn = document.getElementById("exitBtn");
    if (exitBtn) exitBtn.addEventListener("click", exitToHome);
    const exitBtn2 = document.getElementById("exitBtn2");
    if (exitBtn2) exitBtn2.addEventListener("click", () => {
      if (confirm("Exit this mock quiz? Your progress on this attempt will not be saved.")) exitToHome();
    });
  }

  function renderResults() {
    const { score, total, timeUsedSec } = session.result;
    const pct = Math.round((score / total) * 100);
    let verdict;
    if (pct >= 90) verdict = "Outstanding — you're exam-ready! 🏆";
    else if (pct >= 75) verdict = "Great work — just a little more revision. 🌟";
    else if (pct >= 50) verdict = "Good effort — review the explanations below and try again. 💪";
    else verdict = "Keep practising — go back to the chapter quizzes and revisit the material. 🌊";

    const reviewHtml = session.questions.map((q, i) => {
      const userIdx = session.answers[i];
      const wasRight = userIdx === q.correctIndex;
      const userText = userIdx === null ? "No answer selected" : q.options[userIdx];
      return `
        <div class="review-item">
          <div class="q-chapter">${CHAPTER_INFO[q.chapter].tag}</div>
          <div class="review-q">${i + 1}. ${q.qText}</div>
          <div class="review-answer ${wasRight ? "right" : "wrong"}">${wasRight ? "✔ Your answer: " : "✘ Your answer: "}${userText}</div>
          ${!wasRight ? `<div class="review-answer right">✔ Correct answer: ${q.options[q.correctIndex]}</div>` : ""}
          <div class="review-explain">${q.explain}</div>
        </div>`;
    }).join("");

    app.innerHTML = `
      <div class="card">
        <div class="quiz-header"><span class="quiz-title">${session.title} — Results</span></div>
        <div class="results-score">
          <div class="big">${score} / ${total}</div>
          <div class="small">${session.timed ? "Time used: " + fmtTime(timeUsedSec) : "Untimed practice"}</div>
          <div class="small" style="margin-top:8px;font-weight:600;color:var(--brand-dark);">${verdict}</div>
        </div>
      </div>
      <div class="card">
        <div class="section-title" style="margin-top:0;">Answer Review</div>
        ${reviewHtml}
      </div>
      <div class="nav-row">
        <button class="secondary" id="homeBtn">← Back to home</button>
        <button id="retryBtn">Try this quiz again</button>
      </div>
    `;

    document.getElementById("homeBtn").addEventListener("click", exitToHome);
    document.getElementById("retryBtn").addEventListener("click", () => startQuiz(session.kind, session.quizId));
  }

  // Kick off
  render();
})();
