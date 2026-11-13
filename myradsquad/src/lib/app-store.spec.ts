/// <reference types="jest" />
import { useAppStore } from './app-store';

const initial = useAppStore.getState();

beforeEach(() => {
  jest.useFakeTimers();
  useAppStore.setState(initial, true);
});

afterEach(() => {
  jest.useRealTimers();
});

describe('sendMessage', () => {
  it('adds your message, then a friend types and replies in the same thread', () => {
    useAppStore.getState().sendMessage('study', 'quiz me');
    expect(useAppStore.getState().threads.study!.map((m) => m.author)).toEqual(['you']);

    jest.advanceTimersByTime(800);
    expect(useAppStore.getState().typing.study).toBe('jordan');

    jest.advanceTimersByTime(1500);
    const study = useAppStore.getState().threads.study ?? [];
    expect(study.map((m) => m.author)).toEqual(['you', 'jordan']);
    expect(useAppStore.getState().typing.study).toBeUndefined();
    expect(useAppStore.getState().threads.squad).toEqual([]);
  });

  it('cycles through different replies', () => {
    const send = useAppStore.getState().sendMessage;
    send('squad', 'one');
    jest.advanceTimersByTime(2300);
    send('squad', 'two');
    jest.advanceTimersByTime(2300);
    const replies = (useAppStore.getState().threads.squad ?? []).filter((m) => m.author !== 'you');
    expect(replies).toHaveLength(2);
    expect(replies[0].text).not.toBe(replies[1].text);
  });
});

describe('answerSpark', () => {
  it('sets your answer and Maya answers a moment later', () => {
    useAppStore.getState().answerSpark('a frozen grape');
    const you = useAppStore.getState().sparkAnswers.find((a) => a.author === 'you');
    expect(you?.text).toBe('a frozen grape');
    expect(useAppStore.getState().sparkAnswers.find((a) => a.author === 'maya')?.text).toBeNull();

    jest.advanceTimersByTime(3000);
    expect(useAppStore.getState().sparkAnswers.find((a) => a.author === 'maya')?.text).toBeTruthy();
  });
});

describe('setReaction', () => {
  it('remembers your pick per row and can clear it', () => {
    useAppStore.getState().setReaction('row', 'lol');
    expect(useAppStore.getState().reactions.row).toBe('lol');
    useAppStore.getState().setReaction('row', '');
    expect(useAppStore.getState().reactions.row).toBe('');
  });
});

describe('daily question', () => {
  it('keeps your answer so it shows next to the squad’s', () => {
    useAppStore.getState().answerQuestion('the vending machine ate my dollar');
    expect(useAppStore.getState().questionAnswered).toBe(true);
    expect(useAppStore.getState().myAnswer).toBe('the vending machine ate my dollar');
  });
});

describe('resetDemo', () => {
  it('returns to a fresh install', () => {
    const s = useAppStore.getState();
    s.setPlus('trial');
    s.addSpark('chaotic', 'you');
    s.sendMessage('squad', 'hi');
    s.resetDemo();
    const fresh = useAppStore.getState();
    expect(fresh.plus).toBe('free');
    expect(fresh.sparkAdded).toBe(true);
    expect(fresh.sparkAddedBy).toBe('maya');
    expect(fresh.threads.squad).toEqual([]);
  });
});

describe('showToast', () => {
  it('shows one message and clears it after a moment', () => {
    useAppStore.getState().showToast('Invite link copied');
    expect(useAppStore.getState().toast?.text).toBe('Invite link copied');
    jest.advanceTimersByTime(2500);
    expect(useAppStore.getState().toast).toBeNull();
  });
});

describe('other squads', () => {
  it('keeps a separate thread per squad, answered by that squad', () => {
    useAppStore.getState().sendMessage('squad-study-hall', 'in for 7');
    jest.advanceTimersByTime(2300);
    const thread = useAppStore.getState().threads['squad-study-hall'] ?? [];
    expect(thread.map((m) => m.author)).toEqual(['you', 'sam']);
    expect(useAppStore.getState().threads.squad).toEqual([]);
  });
});

describe('live event', () => {
  it('moves presence and shows the banner, only once', () => {
    useAppStore.getState().triggerLiveEvent();
    const first = useAppStore.getState();
    expect(first.presence['study-hall']).toEqual(['sam', 'priya', 'jordan']);
    expect(first.liveAlert?.squadId).toBe('study-hall');
    first.dismissLiveAlert();
    useAppStore.getState().triggerLiveEvent();
    expect(useAppStore.getState().liveAlert).toBeNull();
  });
});

describe('Spark control', () => {
  it('can be added by one member and removed by anyone', () => {
    useAppStore.getState().addSpark('chill', 'maya');
    expect(useAppStore.getState().sparkAddedBy).toBe('maya');
    useAppStore.getState().removeSpark();
    expect(useAppStore.getState().sparkAdded).toBe(false);
  });
});
