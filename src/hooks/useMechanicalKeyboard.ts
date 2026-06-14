import { useState, useCallback, useRef } from 'react';

export function useMechanicalKeyboard() {
  const [isMuted, setIsMuted] = useState(true); // Muted by default to follow browser policies
  const audioCtxRef = useRef<AudioContext | null>(null);

  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  }, []);

  const playKeypress = useCallback(() => {
    if (isMuted) return;
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const now = ctx.currentTime;
    
    // Friction click noise
    const bufferSize = ctx.sampleRate * 0.025;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1600 + Math.random() * 500;
    filter.Q.value = 3.5;
    
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(0.035 + Math.random() * 0.015, now + 0.002);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
    
    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Spring bottom out tone
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(750 + Math.random() * 150, now);
    oscGain.gain.setValueAtTime(0.012 + Math.random() * 0.008, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.012);
    
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    
    noise.start(now);
    noise.stop(now + 0.025);
    osc.start(now);
    osc.stop(now + 0.012);
  }, [isMuted, initAudio]);

  const playReturn = useCallback(() => {
    if (isMuted) return;
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const now = ctx.currentTime;
    
    // A heavier, lower pitch key clack for Enter
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.linearRampToValueAtTime(80, now + 0.045);
    
    gain.gain.setValueAtTime(0.035, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.045);
  }, [isMuted, initAudio]);

  const playSuccess = useCallback(() => {
    if (isMuted) return;
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(950, now);
    osc.frequency.setValueAtTime(1300, now + 0.07);

    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(0.015, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.22);
  }, [isMuted, initAudio]);

  const playClick = useCallback(() => {
    if (isMuted) return;
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(0.04, now + 0.003);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  }, [isMuted, initAudio]);

  const playHover = useCallback(() => {
    if (isMuted) return;
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1800, now);
    osc.frequency.exponentialRampToValueAtTime(1000, now + 0.02);

    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(0.012, now + 0.002);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.02);
  }, [isMuted, initAudio]);

  const playBootStep = useCallback(() => {
    if (isMuted) return;
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.015);

    gainNode.gain.setValueAtTime(0.008, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.015);
  }, [isMuted, initAudio]);

  const playAccessGranted = useCallback(() => {
    if (isMuted) return;
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const now = ctx.currentTime;
    
    // Laser Sweep Up
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.65);
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(3000, now + 0.65);

    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(0.04, now + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.65);

    // Cyber chords (C Major chord cascade)
    const chordFreqs = [523.25, 659.25, 783.99, 1046.50];
    chordFreqs.forEach((freq, index) => {
      const oscChime = ctx.createOscillator();
      const gainChime = ctx.createGain();
      oscChime.type = 'sine';
      oscChime.frequency.setValueAtTime(freq, now + 0.2 + index * 0.05);

      gainChime.gain.setValueAtTime(0.001, now + 0.2 + index * 0.05);
      gainChime.gain.linearRampToValueAtTime(0.015, now + 0.25 + index * 0.05);
      gainChime.gain.exponentialRampToValueAtTime(0.001, now + 0.7 + index * 0.05);

      oscChime.connect(gainChime);
      gainChime.connect(ctx.destination);
      oscChime.start(now + 0.2 + index * 0.05);
      oscChime.stop(now + 0.7 + index * 0.05);
    });
  }, [isMuted, initAudio]);

  const toggleMuteState = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  return {
    isMuted,
    playKeypress,
    playReturn,
    playSuccess,
    playClick,
    playHover,
    playBootStep,
    playAccessGranted,
    toggleMute: toggleMuteState
  };
}
