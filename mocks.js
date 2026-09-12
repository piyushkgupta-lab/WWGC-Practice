/* ==========================================================================
   Official-format mock quizzes.
   Matches the real WWGC classroom-level format the student reported:
     4 quizzes | 15 MCQs each | 8 minutes per quiz | cumulative scoring
   Each mock quiz draws a balanced mix of questions across all 6 chapters
   (about 10 questions per chapter are used across the 4 mocks combined),
   so no single quiz is skewed toward one chapter.
   ========================================================================== */

const MOCK_QUIZZES = [
  {
    id: "mock1",
    title: "Official-Format Mock Quiz 1",
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
    durationSec: 8 * 60,
    questionIds: [
      "c1-09","c1-10",
      "c2-08","c2-09","c2-10",
      "c3-08","c3-09","c3-10",
      "c4-09","c4-10",
      "c5-08","c5-09","c5-10",
      "c6-09","c6-10"
    ]
  }
];

const CHAPTER_INFO = {
  1: { name: "Marine Diversity & Distribution", tag: "Ch. 1" },
  2: { name: "Ocean Ecosystems & Habitats",      tag: "Ch. 2" },
  3: { name: "Life Functions Underwater",        tag: "Ch. 3" },
  4: { name: "Adaptations & Behaviour",           tag: "Ch. 4" },
  5: { name: "Challenges to Ocean Health",        tag: "Ch. 5" },
  6: { name: "Human-Ocean Interactions & Conservation", tag: "Ch. 6" }
};

if (typeof window !== "undefined") {
  window.MOCK_QUIZZES = MOCK_QUIZZES;
  window.CHAPTER_INFO = CHAPTER_INFO;
}
