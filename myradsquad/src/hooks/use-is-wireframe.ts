import { useUniwind } from 'uniwind';

/** True inside a <Wireframe> screen (the grey theme for screens outside the six solutions). */
export function useIsWireframe() {
  return useUniwind().theme === 'wireframe';
}
