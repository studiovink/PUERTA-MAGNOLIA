'use client';
import { useEffect, useRef } from 'react';
import { initMotion } from '../native/vink-motion.mjs';
import { initControls } from '../native/vink-controls.mjs';

/** Attach returned ref to a static decorative subtree, not the whole app. */
export function useVinkMotion(profile = 'editorial') {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const motion = initMotion(ref.current, { profile });
    return () => motion.destroy();
  }, [profile]);
  return ref;
}

/** Use ONLY for static markup not managed by React state. */
export function useStaticVinkControls() {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const controls = initControls(ref.current);
    return () => controls.destroy();
  }, []);
  return ref;
}
