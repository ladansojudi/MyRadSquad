/// <reference types="jest" />
import { MEMBERS, ROOMS } from './mock-data';
import { findRoom, roomsSummary, squadRooms, startedLine } from './rooms';

describe('squadRooms', () => {
  it('shows only open rooms (someone in them right now), busiest first', () => {
    const rooms = squadRooms({ id: 'lunch', here: ['maya', 'jordan', 'leo'] });
    expect(rooms.map((r) => r.id)).toEqual(['hangout', 'bio-focus']);
    expect(rooms[0].inside).toEqual(['jordan', 'leo']);
  });

  it('a quiet squad has no open rooms', () => {
    expect(squadRooms({ id: 'cousins', here: [] })).toEqual([]);
  });

  it('a room you just started is open with only you in it', () => {
    const mine = { ...ROOMS[0], id: 'mine', squadId: 'cousins', people: ['you' as const] };
    expect(squadRooms({ id: 'cousins', here: [] }, [mine]).map((r) => r.inside)).toEqual([['you']]);
  });
});

describe('room helpers', () => {
  it('summarises open rooms', () => {
    expect(roomsSummary(squadRooms({ id: 'lunch', here: ['jordan'] }))).toBe('1 open now');
    expect(roomsSummary([])).toBe('No rooms open');
  });

  it('says who started it', () => {
    expect(startedLine({ startedBy: 'sam' }, MEMBERS)).toBe('Sam started');
    expect(startedLine({ startedBy: 'you' }, MEMBERS)).toBe('You started');
  });

  it('falls back to the first room for an unknown id', () => {
    expect(findRoom('nope').id).toBe('hangout');
  });
});
