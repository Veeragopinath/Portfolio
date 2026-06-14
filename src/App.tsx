import { useState, useEffect } from 'react';
import { useMechanicalKeyboard } from './hooks/useMechanicalKeyboard';
import { TerminalConsole } from './components/TerminalConsole';
import { CanvasGrid } from './components/CanvasGrid';

function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [decryptProgress, setDecryptProgress] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const {
    isMuted,
    isMusicPlaying,
    playClick,
    playHover,
    playKeypress,
    playReturn,
    playSuccess,
    playBootStep,
    playAccessGranted,
    toggleMute,
    toggleMusic
  } = useMechanicalKeyboard();

  useEffect(() => {
    if (!isStarted) return;

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
  }, [isStarted, playBootStep, playAccessGranted]);

  const handleStart = () => {
    playReturn();
    setIsStarted(true);
  };

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
            <div>VEERAGOPINATH.DEV // TERMINAL WORKSPACE v1.0.3</div>
            
            {!isStarted ? (
              <button 
                onClick={handleStart} 
                className="terminal-start-btn"
                onMouseEnter={playHover}
                style={{
                  marginTop: '30px',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--color-cyan)',
                  color: 'var(--color-cyan)',
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: '0.95rem',
                  padding: '12px 24px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  boxShadow: '0 0 10px rgba(6, 182, 212, 0.15)',
                  transition: 'all 0.2s ease',
                  textTransform: 'uppercase'
                }}
              >
                [ CONNECT TO TERMINAL ]
              </button>
            ) : (
              <>
                <div style={{ marginTop: '24px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                  INITIALIZING WORKSPACE TERMINAL... {decryptProgress}%
                </div>
                {/* Simple progress bar outline */}
                <div style={{ width: '220px', height: '6px', border: '1px solid var(--color-cyan)', borderRadius: '3px', marginTop: '15px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ width: `${decryptProgress}%`, height: '100%', backgroundColor: 'var(--color-cyan)', transition: 'width 0.08s ease' }}></div>
                </div>
              </>
            )}
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
          isMusicPlaying={isMusicPlaying}
          toggleMusic={toggleMusic}
        />
      )}
    </>
  );
}

export default App;
