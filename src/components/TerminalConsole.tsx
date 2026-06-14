import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Folder, 
  FolderOpen, 
  FileText, 
  Terminal, 
  ExternalLink,
  Info
} from 'lucide-react';
import { 
  AboutViewer,
  JSONViewer, 
  MarkdownViewer, 
  YAMLViewer, 
  XMLViewer, 
  ConfigFormViewer 
} from './TerminalHistory';

interface HistoryEntry {
  command: string;
  output: React.ReactNode;
}

interface TerminalConsoleProps {
  playClick: () => void;
  playHover: () => void;
  playKeypress: () => void;
  playReturn: () => void;
  playSuccess: () => void;
  isMuted: boolean;
  toggleMute: () => void;
  isMusicPlaying: boolean;
  toggleMusic: () => void;
}

const FILES = [
  'about.txt',
  'skills.json',
  'experience.md',
  'projects.yaml',
  'education.xml',
  'contact.cfg'
];

export const TerminalConsole: React.FC<TerminalConsoleProps> = ({
  playClick,
  playHover,
  playKeypress,
  playReturn,
  playSuccess,
  isMuted,
  toggleMute,
  isMusicPlaying,
  toggleMusic
}) => {
  const [input, setInput] = useState('');
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [isFolderOpen, setIsFolderOpen] = useState(true);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isAutotyping, setIsAutotyping] = useState(false);
  const [crtEffect, setCrtEffect] = useState(true);
  
  const [terminalLogs, setTerminalLogs] = useState<HistoryEntry[]>([
    {
      command: 'system init',
      output: null
    }
  ]);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const typingTimerRef = useRef<number | null>(null);

  // Auto-scroll terminal viewport to bottom
  const scrollToBottom = useCallback(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [terminalLogs, scrollToBottom]);

  // Keep input focused unless text selection is happening
  const focusInput = () => {
    if (!isAutotyping && inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    focusInput();
  }, [isAutotyping]);

  // Command executor
  const executeCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) {
      setTerminalLogs(prev => [...prev, { command: '', output: null }]);
      return;
    }

    // Save in command history
    setCommandHistory(prev => {
      const filtered = prev.filter(x => x !== trimmed);
      return [...filtered, trimmed];
    });
    setHistoryIndex(-1);

    const tokens = trimmed.split(/\s+/);
    const commandName = tokens[0].toLowerCase();
    const args = tokens.slice(1);

    let outputNode: React.ReactNode = null;
    let success = true;

    switch (commandName) {
      case 'help':
        outputNode = (
          <div style={{ color: 'var(--text-secondary)' }}>
            <div style={{ color: 'var(--color-cyan)', fontWeight: 'bold', marginBottom: '4px' }}>SUPPORTED UTILITIES:</div>
            <div>- <span style={{ color: 'var(--color-green)' }}>ls</span>               : List available directory items</div>
            <div>- <span style={{ color: 'var(--color-green)' }}>cat [filename]</span>   : Print the contents of a specific file</div>
            <div>- <span style={{ color: 'var(--color-green)' }}>clear</span>            : Clear terminal screen log stream</div>
            <div>- <span style={{ color: 'var(--color-green)' }}>neofetch</span>         : Display current system metrics and specs</div>
            <div>- <span style={{ color: 'var(--color-green)' }}>theme</span>            : Toggle the retro CRT screen monitor scanline filter</div>
            <div>- <span style={{ color: 'var(--color-green)' }}>mute</span>             : Mute terminal sound clicks</div>
            <div>- <span style={{ color: 'var(--color-green)' }}>unmute</span>           : Unmute terminal sound clicks</div>
            <div>- <span style={{ color: 'var(--color-green)' }}>music</span>            : Toggle background ambient soundtrack</div>
            <div>- <span style={{ color: 'var(--color-green)' }}>help</span>             : Display this reference ledger</div>
          </div>
        );
        break;

      case 'ls':
        outputNode = (
          <div style={{ color: 'var(--color-cyan)', display: 'grid', gridTemplateColumns: 'repeat(3, 150px)', gap: '8px' }}>
            {FILES.map(file => (
              <span key={file} style={{ cursor: 'pointer' }} onClick={() => handleSidebarFileClick(file)}>
                {file}
              </span>
            ))}
          </div>
        );
        break;

      case 'cat':
        if (args.length === 0) {
          outputNode = <div style={{ color: 'var(--color-amber)' }}>usage: cat [file_name]</div>;
          success = false;
        } else {
          const filename = args[0].toLowerCase();
          if (filename === 'about.txt') {
            setActiveFile('about.txt');
            outputNode = <AboutViewer />;
          } else if (filename === 'skills.json') {
            setActiveFile('skills.json');
            outputNode = <JSONViewer />;
          } else if (filename === 'experience.md') {
            setActiveFile('experience.md');
            outputNode = <MarkdownViewer />;
          } else if (filename === 'projects.yaml') {
            setActiveFile('projects.yaml');
            outputNode = <YAMLViewer playHover={playHover} />;
          } else if (filename === 'education.xml') {
            setActiveFile('education.xml');
            outputNode = <XMLViewer />;
          } else if (filename === 'contact.cfg') {
            setActiveFile('contact.cfg');
            outputNode = (
              <ConfigFormViewer 
                playHover={playHover} 
                onSubmit={(status) => {
                  if (status === 'sending') {
                    setTerminalLogs(prev => [
                      ...prev,
                      {
                        command: 'system transmission',
                        output: (
                          <div style={{ color: 'var(--color-cyan)', borderLeft: '2px solid var(--color-cyan)', paddingLeft: '10px' }}>
                            [BROADCASTING] Transmitting contact packets to Web3Forms...
                          </div>
                        )
                      }
                    ]);
                  } else if (status === 'success') {
                    playSuccess();
                    setTerminalLogs(prev => [
                      ...prev,
                      {
                        command: 'system transmission',
                        output: (
                          <div style={{ color: 'var(--color-green)', borderLeft: '2px solid var(--color-green)', paddingLeft: '10px' }}>
                            [TRANSMISSION OK] Message sent successfully to Veeragopinath M.
                          </div>
                        )
                      }
                    ]);
                  } else if (status === 'error') {
                    setTerminalLogs(prev => [
                      ...prev,
                      {
                        command: 'system transmission',
                        output: (
                          <div style={{ color: 'var(--color-pink)', borderLeft: '2px solid var(--color-pink)', paddingLeft: '10px' }}>
                            [TRANSMISSION FAILED] Endpoint error. Please check your network connection.
                          </div>
                        )
                      }
                    ]);
                  }
                }} 
              />
            );
          } else {
            outputNode = <div style={{ color: 'var(--color-pink)' }}>cat: {args[0]}: No such file or directory</div>;
            success = false;
          }
        }
        break;

      case 'clear':
        setTerminalLogs([]);
        return;

      case 'neofetch':
        outputNode = (
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ color: 'var(--color-cyan)', fontWeight: 'bold', fontSize: '0.85rem', whiteSpace: 'pre', lineHeight: '1.2' }}>
{`   /\\_/\\
  ( o.o )
   > ^ <
  /     \\
  \\_/_\\_/
  `}
            </span>
            <div style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
              <span style={{ color: 'var(--color-cyan)', fontWeight: 'bold' }}>guest@veeragopinath.dev</span><br />
              -------------------------<br />
              <span style={{ color: 'var(--color-green)' }}>OS</span>: macOS x86_64 / React Dev OS<br />
              <span style={{ color: 'var(--color-green)' }}>Host</span>: CEG Guindy, Anna University (B.E.)<br />
              <span style={{ color: 'var(--color-green)' }}>Kernel</span>: SDE Portfolio v1.0.3<br />
              <span style={{ color: 'var(--color-green)' }}>Uptime</span>: 4+ Years SDE Experience<br />
              <span style={{ color: 'var(--color-green)' }}>Shell</span>: React TS Engine (Vite)<br />
              <span style={{ color: 'var(--color-green)' }}>Terminal</span>: Warp Emulator (Dark Core)<br />
              <span style={{ color: 'var(--color-green)' }}>CPU</span>: Fullstack Web Architecture
            </div>
          </div>
        );
        break;

      case 'theme':
        setCrtEffect(prev => {
          const next = !prev;
          if (next) {
            document.body.classList.remove('crt-disabled');
          } else {
            document.body.classList.add('crt-disabled');
          }
          return next;
        });
        outputNode = <div style={{ color: 'var(--color-cyan)' }}>CRT Screen overlay filter toggled.</div>;
        break;

      case 'mute':
        if (!isMuted) toggleMute();
        outputNode = <div style={{ color: 'var(--text-muted)' }}>Audio clicks deactivated.</div>;
        break;

      case 'unmute':
        if (isMuted) toggleMute();
        outputNode = <div style={{ color: 'var(--color-cyan)' }}>Audio clicks activated.</div>;
        break;

      case 'music':
        toggleMusic();
        outputNode = (
          <div style={{ color: 'var(--color-cyan)' }}>
            Background ambient music toggled. Currently: {!isMusicPlaying ? 'PLAYING' : 'STOPPED'}
          </div>
        );
        break;

      default:
        outputNode = (
          <div style={{ color: 'var(--text-secondary)' }}>
            command not found: '{commandName}'. Type <span style={{ color: 'var(--color-cyan)' }}>help</span> to see commands list.
          </div>
        );
        success = false;
    }

    if (success) {
      playSuccess();
    }
    setTerminalLogs(prev => [...prev, { command: trimmed, output: outputNode }]);
  };

  // Autotyping runner for sidebar clicks
  const triggerAutotype = (commandString: string) => {
    if (isAutotyping) {
      if (typingTimerRef.current) {
        window.clearTimeout(typingTimerRef.current);
      }
    }
    setIsAutotyping(true);
    setInput('');
    
    let index = 0;
    const typeChar = () => {
      if (index < commandString.length) {
        const nextChar = commandString[index];
        setInput(prev => prev + nextChar);
        playKeypress();
        index++;
        typingTimerRef.current = window.setTimeout(typeChar, 35);
      } else {
        // Complete typing
        typingTimerRef.current = window.setTimeout(() => {
          playReturn();
          executeCommand(commandString);
          setInput('');
          setIsAutotyping(false);
        }, 120);
      }
    };

    typeChar();
  };

  const handleSidebarFileClick = (filename: string) => {
    if (isAutotyping) return;
    playClick();
    triggerAutotype(`cat ${filename}`);
  };

  // Keyboard navigation / input handlers
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isAutotyping) {
      e.preventDefault();
      return;
    }

    // Sound for single keypress (excluding modifiers)
    if (e.key.length === 1) {
      playKeypress();
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      playReturn();
      executeCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIdx = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIdx);
        setInput(commandHistory[nextIdx]);
        playKeypress();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (commandHistory.length > 0 && historyIndex !== -1) {
        const nextIdx = historyIndex + 1;
        if (nextIdx >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(nextIdx);
          setInput(commandHistory[nextIdx]);
        }
        playKeypress();
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      playKeypress();
      
      const currentText = input.trim().toLowerCase();
      if (!currentText) return;

      // Handle simple cat autocomplete
      if (currentText.startsWith('cat ')) {
        const filePrefix = currentText.substring(4);
        const match = FILES.find(f => f.startsWith(filePrefix));
        if (match) {
          setInput(`cat ${match}`);
        }
      } else {
        // Command autocomplete or file autocomplete
        const commands = ['help', 'clear', 'ls', 'neofetch', 'theme', 'mute', 'unmute', 'music', 'cat'];
        const cmdMatch = commands.find(c => c.startsWith(currentText));
        if (cmdMatch) {
          setInput(cmdMatch + (cmdMatch === 'cat' ? ' ' : ''));
        } else {
          const fileMatch = FILES.find(f => f.startsWith(currentText));
          if (fileMatch) {
            setInput(`cat ${fileMatch}`);
          }
        }
      }
    }
  };

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        window.clearTimeout(typingTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="terminal-container">
      {/* 1. Sidebar - File Explorer */}
      <aside className="file-explorer">
        <div className="explorer-title">
          <Terminal size={16} className="highlight-val" />
          <span>Workspace FS</span>
        </div>

        <div className="explorer-tree">
          {/* Main folder tree node */}
          <div>
            <div 
              className="explorer-node" 
              onClick={() => { playClick(); setIsFolderOpen(!isFolderOpen); }}
              style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}
            >
              {isFolderOpen ? <FolderOpen size={16} className="highlight-key" /> : <Folder size={16} className="highlight-key" />}
              <span>veeragopinath-m</span>
            </div>

            {isFolderOpen && (
              <div style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                {FILES.map(file => {
                  const isActive = activeFile === file;
                  return (
                    <div 
                      key={file}
                      className={`explorer-node ${isActive ? 'active-file' : ''}`}
                      onClick={() => handleSidebarFileClick(file)}
                    >
                      <FileText size={14} style={{ opacity: 0.7 }} />
                      <span>{file}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Quick Help box */}
        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '16px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: 'var(--text-secondary)' }}>
            <Info size={12} className="highlight-key" />
            <span>Interactive Terminal</span>
          </div>
          <p style={{ lineHeight: '1.4' }}>
            Click files to execute read commands, or enter commands directly in the prompt line.
          </p>
        </div>
      </aside>

      {/* 2. Main Terminal Panel */}
      <section className="terminal-shell" onClick={focusInput}>
        {/* Terminal Header */}
        <header className="terminal-header">
          <div className="terminal-tab">
            <span className="terminal-tab-dot"></span>
            <span>guest@veeragopinath.dev: ~ (zsh)</span>
          </div>
          <div className="terminal-meta-info">
            SECURE SESSION // 127.0.0.1
          </div>
        </header>

        {/* Console view history */}
        <div className="terminal-viewport" ref={viewportRef}>
          {terminalLogs.map((entry, index) => (
            <div key={index}>
              {entry.command !== 'system init' && (
                <div className="terminal-prompt-row">
                  <span className="terminal-prompt">guest@veeragopinath:~$</span>
                  <span className="terminal-command">{entry.command}</span>
                </div>
              )}
              {entry.command === 'system init' ? (
                <div className="terminal-output" style={{ marginTop: 0 }}>
                  <div style={{ color: 'var(--text-secondary)' }}>
                    <div>VM-DEV Terminal Console [Version 1.0.3]</div>
                    <div>Authorized Connection established at {new Date().toLocaleDateString()}.</div>
                    <div style={{ marginTop: '6px' }}>
                      Type <span style={{ color: 'var(--color-cyan)' }}>help</span> to list available commands,
                      or click files in the explorer sidebar to view sections.
                    </div>
                    
                    {/* Quick-access click shortcuts (crucial for mobile/tablet where sidebar is collapsed) */}
                    <div style={{ marginTop: '16px' }}>
                      <div style={{ color: 'var(--text-muted)', marginBottom: '8px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                        AVAILABLE CHANNELS (TAP TO LOAD):
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {FILES.map(file => (
                          <button
                            key={file}
                            onClick={() => handleSidebarFileClick(file)}
                            style={{
                              background: 'rgba(6, 182, 212, 0.04)',
                              border: '1px solid rgba(6, 182, 212, 0.15)',
                              borderRadius: '4px',
                              color: 'var(--color-cyan)',
                              padding: '3px 8px',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              fontFamily: 'var(--font-mono)'
                            }}
                            onMouseEnter={playHover}
                          >
                            {file}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                entry.output && (
                  <div className="terminal-output" style={{ marginTop: '8px' }}>
                    {entry.output}
                  </div>
                )
              )}
            </div>
          ))}
        </div>

        {/* Command Input Prompt row */}
        <div className="terminal-input-row">
          <span className="terminal-prompt" style={{ userSelect: 'none' }}>guest@veeragopinath:~$</span>
          <input
            ref={inputRef}
            type="text"
            className="terminal-input-field"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isAutotyping}
            autoFocus
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
        </div>

        {/* Status Bar */}
        <footer className="terminal-status-bar">
          <div className="terminal-status-left">
            <span>STATUS: ONLINE</span>
            <span>ENCODING: UTF-8</span>
            <span>CRT: {crtEffect ? 'ON' : 'OFF'}</span>
          </div>
          <div className="terminal-status-right">
            {/* Mute Toggle */}
            <button 
              className="terminal-mute-btn" 
              onClick={(e) => { e.stopPropagation(); playClick(); toggleMute(); }}
              style={{ color: isMuted ? 'var(--text-muted)' : 'var(--color-green)' }}
              title={isMuted ? "Unmute terminal clicks" : "Mute terminal clicks"}
            >
              {isMuted ? 'MUTED' : 'SOUND'}
            </button>
            <span>|</span>
            <a 
              href="https://github.com/Veeragopinath" 
              target="_blank" 
              rel="noreferrer" 
              className="status-link"
              onClick={() => playClick()}
            >
              GitHub <ExternalLink size={10} style={{ display: 'inline' }} />
            </a>
            <a 
              href="https://www.linkedin.com/in/veeragopinath-m/" 
              target="_blank" 
              rel="noreferrer" 
              className="status-link"
              onClick={() => playClick()}
            >
              LinkedIn <ExternalLink size={10} style={{ display: 'inline' }} />
            </a>
          </div>
        </footer>
      </section>
    </div>
  );
};
