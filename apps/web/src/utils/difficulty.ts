export type Difficulty = {
  label: 'Easy' | 'Hard' | 'Medium' | 'Trivial';
  stars: 0 | 1 | 2 | 3;
};

/**
 * Habitica's difficulty for a task priority, with the stars Habitica shows.
 */
export const getDifficulty = (priority: number): Difficulty => {
  if (priority <= 0.1) {
    return { label: 'Trivial', stars: 0 };
  }

  if (priority === 1.5) {
    return { label: 'Medium', stars: 2 };
  }

  if (priority >= 2) {
    return { label: 'Hard', stars: 3 };
  }

  return { label: 'Easy', stars: 1 };
};
