// Grades a submitted review against the planted issues of an exercise.
// A comment "finds" an issue when it is on one of the issue's lines.
// "Good practice" comments are never counted as unnecessary.

export function grade(exercise, review) {
  const found = [];
  const missed = [];
  const foundBy = {};
  const usedComments = new Set();

  for (const issue of exercise.issues) {
    const match = review.comments.find((c) => c.type !== 'good' && issue.lines.includes(c.line));
    if (match) {
      found.push(issue.id);
      foundBy[issue.id] = match.id;
      review.comments
        .filter((c) => issue.lines.includes(c.line))
        .forEach((c) => usedComments.add(c.id));
    } else {
      missed.push(issue.id);
    }
  }

  const unnecessary = review.comments
    .filter((c) => c.type !== 'good' && !usedComments.has(c.id))
    .map((c) => c.id);

  const decisionCorrect = review.decision === exercise.expectedDecision;
  // Passed = every issue found and the right decision. Only a passed lesson earns points
  // and counts as completed; otherwise the student is asked to redo it.
  const passed = missed.length === 0 && decisionCorrect;
  const points = passed ? found.length * 10 + 10 + 10 : 0;

  return { found, missed, foundBy, unnecessary, decisionCorrect, passed, points, total: exercise.issues.length };
}

/** Marks for <app-code>: which lines were found, missed or flagged without need. */
export function resultMarks(exercise, review) {
  const marks = {};
  const { result } = review;
  review.comments
    .filter((c) => result.unnecessary.includes(c.id))
    .forEach((c) => { marks[c.line] = 'unnecessary'; });
  exercise.issues.forEach((issue) => {
    if (result.found.includes(issue.id)) {
      const comment = review.comments.find((c) => c.id === result.foundBy[issue.id]);
      marks[comment.line] = 'found';
    } else {
      marks[issue.lines[0]] = 'missed';
    }
  });
  return marks;
}
