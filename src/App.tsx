import { useState, useEffect } from 'react';
import { useMechanicalKeyboard } from './hooks/useMechanicalKeyboard';
import { TerminalConsole } from './components/TerminalConsole';
import { CanvasGrid } from './components/CanvasGrid';

function App() {
  const [decryptProgress, setDecryptProgress] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const {
    isMuted,
    playClick,
    playHover,
    playKeypress,
    playReturn,
    playSuccess,
    playBootStep,
    playAccessGranted,
    toggleMute
  } = useMechanicalKeyboard();

  useEffect(() => {
    // Start automated fast decrypt sequence
    const interval = setInterval(() => {
      setDecryptProgress(prev => {
        if (prev < 100) {
          playBootStep();
          return prev + 10;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setIsUnlocked(true);
            playAccessGranted();
          }, 150);
          return 100;
        }
      });
    }, 90);

    return () => clearInterval(interval);
  }, [playBootStep, playAccessGranted]);

  return (
    <>
      {!isUnlocked ? (
        <div className="fast-loader">
          <CanvasGrid />
          <div
            style={{
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '0.9rem',
              color: 'var(--color-cyan)',
              textShadow: '0 0 8px rgba(6, 182, 212, 0.4)',
              textAlign: 'center',
              userSelect: 'none'
            }}
          >
            <div>VEERAGOPINATH.DEV SECURE DEPLOYMENT ENGINE v1.0.3</div>
            <div style={{ marginTop: '12px', fontSize: '1.2rem', fontWeight: 'bold' }}>
              DECRYPTING PORTFOLIO DATA PACKETS... {decryptProgress}%
            </div>
            {/* Simple progress bar outline */}
            <div style={{ width: '220px', height: '6px', border: '1px solid var(--color-cyan)', borderRadius: '3px', marginTop: '15px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ width: `${decryptProgress}%`, height: '100%', backgroundColor: 'var(--color-cyan)', transition: 'width 0.08s ease' }}></div>
            </div>
          </div>
        </div>
      ) : (
        <TerminalConsole
          playClick={playClick}
          playHover={playHover}
          playKeypress={playKeypress}
          playReturn={playReturn}
          playSuccess={playSuccess}
          isMuted={isMuted}
          toggleMute={toggleMute}
        />
      )}
    </>
  );
}

export default App;
