import { getDifficulty } from './difficulty';

describe('getDifficulty', () => {
  it.each([
    [0.1, 'Trivial', 0],
    [1, 'Easy', 1],
    [1.5, 'Medium', 2],
    [2, 'Hard', 3],
  ])('maps priority %p to %s with %p stars', (priority, label, stars) => {
    expect(getDifficulty(priority)).toEqual({ label, stars });
  });

  it('falls back to Easy for a priority Habitica does not use', () => {
    expect(getDifficulty(0.5)).toEqual({ label: 'Easy', stars: 1 });
  });
});
