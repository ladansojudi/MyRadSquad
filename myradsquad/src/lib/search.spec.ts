/// <reference types="jest" />
import { ALL_SQUADS } from './mock-data';
import { squadRooms } from './rooms';
import { searchAll, whereIs } from './search';
import { rankSquads } from './squads';

const squads = rankSquads(ALL_SQUADS, {});
const rooms = squads.flatMap((s) => squadRooms(s).map((r) => ({ ...r, squad: s.name })));

describe('searchAll', () => {
  it('finds nothing for an empty query', () => {
    expect(searchAll('  ', squads, rooms).rooms).toEqual([]);
  });

  it('finds rooms by vibe and squads, friends and messages by text', () => {
    const study = searchAll('study', squads, rooms);
    expect(
      study.rooms.every((r) => r.vibe === 'study' || /study/i.test(r.name + r.detail + r.idle)),
    ).toBe(true);
    expect(study.squads.map((s) => s.id)).toEqual(['study-hall']);
    expect(searchAll('pri', squads, rooms).friends).toEqual(['priya']);
    expect(searchAll('boba', squads, rooms).messages[0]).toMatchObject({
      squadId: 'lunch',
      author: 'jordan',
    });
  });
});

describe('whereIs', () => {
  it('names the live room a friend is in, or says away', () => {
    expect(whereIs('jordan', squads, rooms).line).toBe('In Hangout · Lunch Table Legends');
    expect(whereIs('nia', squads, rooms)).toEqual({ live: false, line: 'Away' });
  });
});
