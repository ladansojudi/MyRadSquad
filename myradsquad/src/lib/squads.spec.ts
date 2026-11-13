/// <reference types="jest" />
import { ALL_SQUADS, LIVE_EVENT, LUNCH_SQUAD } from './mock-data';
import { activityLine, rankSquads } from './squads';

describe('rankSquads', () => {
  it('puts the squad with the most friends here first, quiet squads last', () => {
    const ranked = rankSquads(ALL_SQUADS, {});
    expect(ranked.map((s) => s.id)).toEqual(['lunch', 'study-hall', 'cousins']);
    expect(ranked[2].live).toBe(false);
  });

  it('moves a squad up when it comes alive', () => {
    const ranked = rankSquads(ALL_SQUADS, LIVE_EVENT.presence);
    expect(ranked[0].id).toBe('study-hall');
    expect(ranked[0].friendsHere).toHaveLength(3);
  });
});

describe('activityLine', () => {
  it('names only the people who are here, and hides when nobody is', () => {
    const voice = LUNCH_SQUAD.activities[0];
    expect(activityLine(voice, ['maya', 'jordan', 'leo'])).toBe('Jordan, Leo · music on');
    expect(activityLine(voice, ['maya', 'leo'])).toBe('Leo · music on');
    expect(activityLine(voice, ['maya'])).toBeNull();
  });
});
