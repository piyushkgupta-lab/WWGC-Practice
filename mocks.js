/* ==========================================================================
   Official-format mock quizzes.
   Matches the real WWGC classroom-level format the student reported:
     4 quizzes | 15 MCQs each | 8 minutes per quiz | cumulative scoring
   Each Round 1 mock quiz draws a balanced mix of questions across all 6
   original chapters (about 10 questions per chapter used across the 4
   mocks combined), so no single quiz is skewed toward one chapter.

   ROUND 2 ADDITION: after the student advanced past Round 1, the real
   Stage Assessment turned out to be far harder and more reasoning-based -
   named conventions (OSPAR, Barcelona, BBNJ), ocean monitoring technology
   (Argo floats, AIS, ROVs), specific species facts (kitefin shark,
   leatherback papillae, totoaba swim bladder trade), and two-scenario
   "which is more likely / which is correct and why" comparison questions.
   Chapters 7-9 and mocks 5-7 were added specifically to drill that style.
   ========================================================================== */

const MOCK_QUIZZES = [
  {
    id: "mock1",
    title: "Official-Format Mock Quiz 1",
    tier: "round1",
    durationSec: 8 * 60,
    questionIds: [
      "c1-01","c1-02","c1-03",
      "c2-01","c2-02","c2-03",
      "c3-01","c3-02","c3-03",
      "c4-01","c4-02",
      "c5-01","c5-02",
      "c6-01","c6-02"
    ]
  },
  {
    id: "mock2",
    title: "Official-Format Mock Quiz 2",
    tier: "round1",
    durationSec: 8 * 60,
    questionIds: [
      "c1-04","c1-05",
      "c2-04","c2-05",
      "c3-04","c3-05",
      "c4-03","c4-04","c4-05",
      "c5-03","c5-04","c5-05",
      "c6-03","c6-04","c6-05"
    ]
  },
  {
    id: "mock3",
    title: "Official-Format Mock Quiz 3",
    tier: "round1",
    durationSec: 8 * 60,
    questionIds: [
      "c1-06","c1-07","c1-08",
      "c2-06","c2-07",
      "c3-06","c3-07",
      "c4-06","c4-07","c4-08",
      "c5-06","c5-07",
      "c6-06","c6-07","c6-08"
    ]
  },
  {
    id: "mock4",
    title: "Official-Format Mock Quiz 4",
    tier: "round1",
    durationSec: 8 * 60,
    questionIds: [
      "c1-09","c1-10",
      "c2-08","c2-09","c2-10",
      "c3-08","c3-09","c3-10",
      "c4-09","c4-10",
      "c5-08","c5-09","c5-10",
      "c6-09","c6-10"
    ]
  },

  /* ---------------- ROUND 2 ADVANCED PREP (new) ---------------- */
  {
    id: "mock5",
    title: "Round 2 Prep — Global Governance & Conventions",
    tier: "round2",
    durationSec: 8 * 60,
    questionIds: [
      "c7-01","c7-02","c7-03","c7-04","c7-05","c7-06","c7-07","c7-08",
      "c9-01","c9-02","c9-03","c9-04",
      "c1-27","c5-18","c6-20"
    ]
  },
  {
    id: "mock6",
    title: "Round 2 Prep — Technology, Science & Species Facts",
    tier: "round2",
    durationSec: 8 * 60,
    questionIds: [
      "c8-01","c8-02","c8-03","c8-04","c8-05","c8-06","c8-07","c8-08",
      "c9-05","c9-06","c9-07","c9-08",
      "c2-23","c3-22","c4-22"
    ]
  },
  {
    id: "mock7",
    title: "Round 2 Prep — Applied Reasoning & Case Studies",
    tier: "round2",
    durationSec: 8 * 60,
    questionIds: [
      "c9-09","c9-10","c9-11","c9-12","c9-13","c9-14","c9-15","c9-16","c9-17","c9-18","c9-19","c9-20",
      "c5-19","c6-19","c6-25"
    ]
  }
];

const CHAPTER_INFO = {
  1: { name: "Marine Diversity & Distribution", tag: "Ch. 1" },
  2: { name: "Ocean Ecosystems & Habitats",      tag: "Ch. 2" },
  3: { name: "Life Functions Underwater",        tag: "Ch. 3" },
  4: { name: "Adaptations & Behaviour",           tag: "Ch. 4" },
  5: { name: "Challenges to Ocean Health",        tag: "Ch. 5" },
  6: { name: "Human-Ocean Interactions & Conservation", tag: "Ch. 6" },
  7: { name: "Global Ocean Governance & Conventions", tag: "Ch. 7" },
  8: { name: "Ocean Monitoring Technology & Science", tag: "Ch. 8" },
  9: { name: "Applied Reasoning & Case Studies", tag: "Ch. 9" }
};

if (typeof window !== "undefined") {
  window.MOCK_QUIZZES = MOCK_QUIZZES;
  window.CHAPTER_INFO = CHAPTER_INFO;
}
