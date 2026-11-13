import { create } from 'zustand';

/** How many wireframe screens are in focus right now (the tag shows while it's above 0). */
type WireframeState = { open: number; enter: () => void; leave: () => void };

export const useWireframeStore = create<WireframeState>((set) => ({
  open: 0,
  enter: () => set((s) => ({ open: s.open + 1 })),
  leave: () => set((s) => ({ open: Math.max(0, s.open - 1) })),
}));
