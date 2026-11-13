/// <reference types="jest" />
import { wakeCopy, wakeMode } from './wake';

describe('wakeMode', () => {
  it('nudges when the squad has no Spark', () => {
    expect(wakeMode(undefined)).toBe('nudge');
  });
  it('shows the question until two go unanswered, then pauses', () => {
    expect(wakeMode({ by: 'you', unanswered: 1 })).toBe('asked');
    expect(wakeMode({ by: 'you', unanswered: 2 })).toBe('paused');
  });
  it('falls back to a default opener for new squads', () => {
    expect(wakeCopy('new-squad-id').opener).toBe(wakeCopy('cousins').opener);
  });
});

describe('Spark drops', () => {
  it('gives every squad one question, vote or photo task', () => {
    for (const id of ['cousins', 'study-hall', 'lunch']) {
      expect(['question', 'vote', 'photo']).toContain(wakeCopy(id).drop.kind);
    }
    const vote = wakeCopy('cousins').drop;
    expect(vote.kind === 'vote' && vote.options.length).toBeGreaterThan(1);
  });
});
