import { useState, useCallback, useRef, useEffect } from 'react';

export function useMechanicalKeyboard() {
  const [isMuted, setIsMuted] = useState(true); // Muted by default to follow browser policies
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const ambientNodesRef = useRef<{
    oscs: OscillatorNode[];
    gains: GainNode[];
    intervalId: number | null;
  } | null>(null);

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

  const startMusic = useCallback(() => {
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    if (ambientNodesRef.current) return; // Already playing

    const now = ctx.currentTime;
    const oscs: OscillatorNode[] = [];
    const gains: GainNode[] = [];

    // 1. Low drone pads
    const frequencies = [55, 110, 165, 220]; // A1, A2, E3, A3
    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      
      const baseGain = idx === 0 ? 0.008 : 0.004; // Very quiet base volume
      gain.gain.setValueAtTime(baseGain, now);
      
      // LFO modulation for breathing effect
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.07 + idx * 0.02;
      lfoGain.gain.value = baseGain * 0.35;
      
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);
      lfo.start(now);
      
      oscs.push(osc, lfo);
      gains.push(gain, lfoGain);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
    });

    // 2. Chime system: periodic soft arpeggio
    const pentatonic = [220.00, 261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // A3, C4, D4, E4, G4, A4, C5
    const playChime = () => {
      const chimeCtx = audioCtxRef.current;
      if (!chimeCtx) return;
      const chimeNow = chimeCtx.currentTime;
      
      const numNotes = Math.random() > 0.65 ? 2 : 1;
      for (let i = 0; i < numNotes; i++) {
        const noteFreq = pentatonic[Math.floor(Math.random() * pentatonic.length)];
        const osc = chimeCtx.createOscillator();
        const gain = chimeCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(noteFreq, chimeNow + i * 0.18);
        
        gain.gain.setValueAtTime(0, chimeNow + i * 0.18);
        gain.gain.linearRampToValueAtTime(0.006, chimeNow + 0.3 + i * 0.18);
        gain.gain.exponentialRampToValueAtTime(0.0001, chimeNow + 4.5 + i * 0.18);
        
        const filter = chimeCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(noteFreq, chimeNow);
        filter.Q.setValueAtTime(2.5, chimeNow);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(chimeCtx.destination);
        
        osc.start(chimeNow + i * 0.18);
        osc.stop(chimeNow + 5.0 + i * 0.18);
      }
    };

    playChime();
    const intervalId = window.setInterval(playChime, 5500);

    ambientNodesRef.current = {
      oscs,
      gains,
      intervalId
    };
  }, [initAudio]);

  const stopMusic = useCallback(() => {
    if (!ambientNodesRef.current) return;
    const { oscs, intervalId } = ambientNodesRef.current;
    
    oscs.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {}
    });

    if (intervalId) {
      window.clearInterval(intervalId);
    }

    ambientNodesRef.current = null;
  }, []);

  const toggleMusic = useCallback(() => {
    setIsMusicPlaying(prev => {
      const next = !prev;
      if (next) {
        startMusic();
      } else {
        stopMusic();
      }
      return next;
    });
  }, [startMusic, stopMusic]);

  const toggleMuteState = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  // Stop sound on unmount
  useEffect(() => {
    return () => {
      if (ambientNodesRef.current) {
        const { oscs, intervalId } = ambientNodesRef.current;
        oscs.forEach(osc => {
          try {
            osc.stop();
          } catch (e) {}
        });
        if (intervalId) {
          window.clearInterval(intervalId);
        }
      }
    };
  }, []);

  return {
    isMuted,
    isMusicPlaying,
    playKeypress,
    playReturn,
    playSuccess,
    playClick,
    playHover,
    playBootStep,
    playAccessGranted,
    toggleMute: toggleMuteState,
    toggleMusic
  };
}
