import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Cpu, Shield, Zap, ChevronRight, Lock, Mail, MessageSquare, Key } from 'lucide-react';

// --- DATA PAYLOAD ---
const CV_DATA = {
  identity: {
    target: "Luca Apetri",
    alias: "bogroj",
    contact: "lucaapetri123@gmail.com",
    discord: "@bogroj",
    location: "Romania",
    status: "ACTIVE",
    clearance: "Level 9"
  },
  education: [
    {
      degree: "M.Sc. Computer Engineering (Cybersecurity Specialization)",
      facility: "“Stefan cel Mare” University of Suceava",
      status: "Executing (ETA: June 2026)",
      modules: ["CLOUD/GRID Security", "WEB App Security", "Cryptography", "Cyber-Attacks/Protection"]
    },
    {
      degree: "B.Sc. Computer Engineering",
      facility: "“Stefan cel Mare” University of Suceava",
      status: "Completed (June 2024)",
      modules: ["Microcontrollers", "OOP", "Computer Architectures", "Networks"],
      gpa: "3.0"
    }
  ],
  experience: [
    {
      role: "Front-End Web Developer Intern",
      corp: "PENTALOG ROMANIA",
      cycle: "Apr 2022 - Jun 2022",
      logs: [
        "Deployed responsive web app using HTML, CSS, JS, Firebase.",
        "Engineered component-based state management via React.js."
      ]
    },
    {
      role: "Embedded Systems Software Developer",
      sector: "Automotive Industry",
      corp: "POWERTRACE",
      cycle: "Jun 2023 - Sep 2023",
      logs: [
        "Built hardware/software integrations for EV engine control modules.",
        "Debugged on-core apps using Lauterbach, CANoe, CANdb++.",
        "Hardened on-board comms with encryption algorithms, boosting reverse-engineering resilience by 40%."
      ]
    },
    {
      role: "Software Tester Intern",
      sector: "Automotive Industry",
      corp: "AROBS TRANSILVANIA SOFTWARE",
      cycle: "Sep 2023 - Dec 2023",
      logs: [
        "Executed testing vectors on embedded code using Matlab, Simulink, Stateflow.",
        "Audited embedded code safety architectures."
      ]
    },
    {
      role: "Embedded Systems Software Developer",
      sector: "Automotive Industry",
      corp: "GLOBALLOGIC ROMANIA",
      cycle: "Spring 2024 - Fall 2024",
      logs: [
        "Injected optimizations into embedded software/hardware for vehicle control modules.",
        "Enforced ISO 26262 compliance protocols for functional safety.",
        "Increased system reliability and performance metrics by 10% through iterative prototyping."
      ]
    }
  ],
  skills: {
    languages: ["C", "C++", "Python", "Assembly", "HTML/CSS/JS"],
    tools: ["Linux (Gentoo)", "RDP", "Altium Designer", "Eagle", "STM32", "ESP32", "NRF", "Burpsuite", "Nmap", "Metasploit"],
    hardware: ["Circuit Design", "PCB Fabrication", "Microcontrollers", "Automotive Electronics"]
  },
  projects: [
    {
      title: "Custom Ray Tracing Engine (MCU)",
      tech: ["C++", "Assembly", "STM32"],
      desc: "Engineered a bare-metal ray tracing graphics engine on a resource-constrained microcontroller. Bypassed computational bottlenecks to achieve real-time rendering without a GPU."
    },
    {
      title: "Gentoo Linux on Legacy Hardware",
      tech: ["Linux Admin", "Kernel Compilation", "Network Protocols"],
      desc: "Deployed optimized Gentoo distribution on severely underpowered hardware. Configured secure RDP. Resurrected obsolete tech into a functional dev environment."
    },
    {
      title: "Custom PCB Gaming Peripheral",
      tech: ["Altium", "AutoCAD", "Soldering", "Firmware"],
      desc: "Fabricated a bespoke PCB for high-performance input processing. Integrated custom circuitry and minimal signal interference architecture."
    },
    {
      title: "CTF & Network Architecture",
      tech: ["Offensive Security", "Network Engineering"],
      desc: "Architected complex, intentionally vulnerable networks for penetration testing and simulation during Capture the Flag (CTF) engagements."
    }
  ]
};

// --- COMPONENTS ---

const TypewriterText = ({ text, delay = 20, onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, delay, onComplete]);

  return <span>{displayText}</span>;
};

const BootSequence = ({ onComplete }) => {
  const [lines, setLines] = useState([]);
  const bootLogs = [
    "BIOS Check .............................. OK",
    "Loading custom kernel ................... OK",
    "Mounting file systems ................... OK",
    "Initializing neural net protocols ....... OK",
    "Bypassing firewall constraints .......... DONE",
    "Establishing secure shell ............... ACTIVE",
    "Decrypting payload: L_APETRI_PROFILE .... SUCCESS",
    "Executing terminal interface ............ "
  ];

  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < bootLogs.length) {
        setLines(prev => [...prev, bootLogs[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 800);
      }
    }, 150);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="w-full h-full flex flex-col justify-end p-4 font-mono text-green-500 text-sm md:text-base">
      {lines.map((line, i) => (
        <div key={i} className="mb-1">{`> ${line}`}</div>
      ))}
      <div className="animate-pulse">{`> _`}</div>
    </div>
  );
};

export default function App() {
  const [booting, setBooting] = useState(true);
  const [activeTab, setActiveTab] = useState('whoami');
  const [inputValue, setInputValue] = useState('');
  const [commandHistory, setCommandHistory] = useState([
    { cmd: './recon --target=L_APETRI --dump-identity', output: 'whoami', isTyping: false }
  ]);
  const [isTerminated, setIsTerminated] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const onDragStart = (e) => {
    if (typeof window === 'undefined' || window.innerWidth < 768) return;
    if (isMaximized) return;
    if (e.target.closest('button')) return;
    e.preventDefault();
    e.stopPropagation();
    const startMX = e.clientX;
    const startMY = e.clientY;
    const startOX = offset.x;
    const startOY = offset.y;
    const onMove = (ev) => {
      setOffset({
        x: startOX + (ev.clientX - startMX),
        y: startOY + (ev.clientY - startMY),
      });
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  // Inject Metadata and Favicon
  useEffect(() => {
    document.title = "L_APETRI // SYS_ROOT";

    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = "Terminal-based cybersecurity and engineering portfolio for Luca Apetri.";

    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23000"/><text x="10" y="75" font-family="monospace" font-size="65" font-weight="bold" fill="%2339ff14">%3E_</text></svg>`;
    link.href = `data:image/svg+xml,${svgIcon}`;
  }, []);

  useEffect(() => {
    if (bottomRef.current && !isTerminated) {
      bottomRef.current.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
    }
  }, [commandHistory, isTerminated]);

  const focusInput = () => {
    if (inputRef.current && !isTerminated) {
      inputRef.current.focus();
    }
  };

  const executeCommand = (cmd, tab, fromUser = false) => {
    if (commandHistory.some(entry => entry.isTyping) || isTerminated) return;
    setCommandHistory(prev => [...prev, { cmd, output: tab, isTyping: !fromUser }]);
    setActiveTab(tab);
  };

  const finishCommand = (index) => {
    setCommandHistory(prev => {
      const newHistory = [...prev];
      newHistory[index].isTyping = false;
      return newHistory;
    });
  };

  const handleUserInput = (e) => {
    e.preventDefault();
    if (isTerminated) return;

    const cmd = inputValue.trim();
    if (!cmd) return;

    if (commandHistory.some(entry => entry.isTyping)) return;

    setInputValue('');
    const lowerCmd = cmd.toLowerCase();

    // System navigation
    if (lowerCmd === 'whoami' || lowerCmd === './whoami' || lowerCmd.includes('recon')) {
      executeCommand(cmd, 'whoami', true);
      return;
    }
    if (lowerCmd === 'experience' || lowerCmd === './experience' || lowerCmd.includes('tail')) {
      executeCommand(cmd, 'experience', true);
      return;
    }
    if (lowerCmd === 'skills' || lowerCmd === './skills' || lowerCmd.includes('nmap')) {
      executeCommand(cmd, 'skills', true);
      return;
    }
    if (lowerCmd === 'projects' || lowerCmd === './projects' || lowerCmd.includes('git clone') || lowerCmd.includes('make run')) {
      executeCommand(cmd, 'projects', true);
      return;
    }
    if (lowerCmd === 'contact' || lowerCmd === './contact' || lowerCmd.includes('nc -vz')) {
      executeCommand(cmd, 'contact', true);
      return;
    }

    // Easter eggs
    let outputType = 'custom';
    let customText = '';

    switch(lowerCmd) {
      case 'clear':
        setCommandHistory([]);
        return;
      case 'help':
        customText = "Help is for the weak. Read the source code.";
        break;
      case 'sudo':
      case 'su':
        customText = "root privilege escalation attempt detected. Incident logged and reported to authorities.";
        break;
      case 'ls':
      case 'ls -la':
        customText = "drwx------  2 root root 4096 .\ndrwx------  4 root root 4096 ..\n-rwx------  1 root root  13K App.jsx\n-r--------  1 root root  24K L_APETRI_PROFILE.bin";
        break;
      case 'rm -rf /':
        customText = "Sandbox containment active. Destructive payload neutralized. Nice try.";
        break;
      case 'ping':
        customText = "ping: socket: Operation not permitted";
        break;
      case 'pwd':
        customText = "/var/www/classified/lapetri";
        break;
      case 'exit':
      case 'quit':
        setIsTerminated(true);
        return;
      default:
        customText = `bash: ${cmd}: command not found. Access denied.`;
        break;
    }

    setCommandHistory(prev => [...prev, { cmd, output: outputType, customText, isTyping: false }]);
  };

  if (booting) {
    return (
      <div className="min-h-screen bg-black overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-50 mix-blend-overlay"></div>
        <BootSequence onComplete={() => setBooting(false)} />
      </div>
    );
  }

  const renderContent = (cmdEntry) => {
    switch (cmdEntry.output) {
      case 'custom':
        return (
          <div className="text-gray-300 whitespace-pre-wrap animate-fade-in font-mono text-sm">
            {cmdEntry.customText}
          </div>
        );
      case 'whoami':
        return (
          <div className="space-y-4 animate-fade-in">
            <div className="border border-green-500/30 p-4 bg-green-950/20">
              <pre className="hidden sm:block text-xs md:text-sm text-green-400 overflow-x-auto leading-tight">
{`
    __                     ___                __       _
   / /_  ___________ _    /   |  ____  ___  / /______(_)
  / / / / / ___/ __ \`/   / /| | / __ \\/ _ \\/ __/ ___/ /
 / / /_/ / /__/ /_/ /   / ___ |/ /_/ /  __/ /_/ /  / /
/_/\\__,_/\\___/\\__,_/   /_/  |_/ .___/\\___/\\__/_/  /_/
                             /_/
`}
              </pre>
              <div className="sm:hidden text-green-400 font-bold tracking-widest text-center">
                L_APETRI // ROOT
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-green-500/30 p-4">
                <h3 className="text-green-300 mb-2 border-b border-green-500/30 pb-1 font-bold flex items-center"><Shield className="w-4 h-4 mr-2"/> IDENTITY_MATRIX</h3>
                <ul className="space-y-1">
                  <li><span className="text-gray-500">TARGET:</span> {CV_DATA.identity.target}</li>
                  <li><span className="text-gray-500">ALIAS:</span> {CV_DATA.identity.alias}</li>
                  <li><span className="text-gray-500">LOC:</span> {CV_DATA.identity.location}</li>
                  <li><span className="text-gray-500">STATUS:</span> <span className="text-green-400 animate-pulse">{CV_DATA.identity.status}</span></li>
                </ul>
              </div>
              <div className="border border-green-500/30 p-4">
                <h3 className="text-green-300 mb-2 border-b border-green-500/30 pb-1 font-bold flex items-center"><Cpu className="w-4 h-4 mr-2"/> SYS.EDUCATION</h3>
                {CV_DATA.education.map((edu, idx) => (
                  <div key={idx} className="mb-3 last:mb-0">
                    <div className="text-green-400 font-bold">{edu.degree}</div>
                    <div className="text-sm text-gray-400">{edu.facility}</div>
                    <div className="text-xs text-yellow-500">[{edu.status}]</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'experience':
        return (
          <div className="space-y-6 animate-fade-in relative before:absolute before:inset-y-0 before:left-[7px] before:w-[2px] before:bg-green-500/20">
            {CV_DATA.experience.map((exp, idx) => (
              <div key={idx} className="relative pl-6">
                <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-black border-2 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                <div className="border border-green-500/30 p-4 bg-green-950/10 hover:bg-green-900/20 transition-colors">
                  <div className="flex flex-wrap justify-between items-start mb-2">
                    <h3 className="text-green-300 font-bold text-lg">{exp.role}</h3>
                    <span className="text-xs font-mono text-gray-400 bg-black px-2 py-1 border border-green-500/30">{exp.cycle}</span>
                  </div>
                  <div className="text-green-500/80 text-sm mb-3 font-bold">@ {exp.corp} <span className="text-gray-500">[{exp.sector || 'Software'}]</span></div>
                  <ul className="space-y-2">
                    {exp.logs.map((log, lIdx) => (
                      <li key={lIdx} className="flex text-sm">
                        <ChevronRight className="w-4 h-4 text-green-500 mr-1 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{log}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        );
      case 'skills':
        return (
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(CV_DATA.skills).map(([category, items], idx) => (
                <div key={idx} className="border border-green-500/30">
                  <div className="bg-green-900/30 border-b border-green-500/30 p-2 uppercase font-bold text-green-300">
                    ./{category}.sh
                  </div>
                  <div className="p-4 flex flex-wrap gap-2">
                    {items.map((item, i) => (
                      <span key={i} className="text-xs bg-black text-green-400 border border-green-500/50 px-2 py-1 shadow-[0_0_5px_rgba(34,197,94,0.2)]">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border border-red-500/30 bg-red-950/10 p-4">
               <h3 className="text-red-400 mb-2 border-b border-red-500/30 pb-1 font-bold flex items-center"><Lock className="w-4 h-4 mr-2"/> SECURITY_PROTOCOLS_ENGAGED</h3>
               <p className="text-sm text-gray-400 font-mono">
                 [+] Reverse Engineering Resilience: +40%<br/>
                 [+] Encryption Algorithms: Deployed<br/>
                 [+] Penetration Testing: Active (Metasploit, Burpsuite)<br/>
                 [!] Warning: Unauthorized probing will be logged and traced.
               </p>
            </div>
          </div>
        );
      case 'projects':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
            {CV_DATA.projects.map((proj, idx) => (
              <div key={idx} className="border border-green-500/30 p-4 group hover:border-green-400 transition-colors bg-black">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-green-300 font-bold group-hover:text-green-400"><Zap className="w-4 h-4 inline mr-2 mb-1"/>{proj.title}</h3>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {proj.tech.map((t, i) => (
                    <span key={i} className="text-[10px] text-gray-400 bg-gray-900 px-1 border border-gray-700">[{t}]</span>
                  ))}
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {proj.desc}
                </p>
              </div>
            ))}
          </div>
        );
      case 'contact':
        return (
          <div className="animate-fade-in border border-green-500/30 p-6 bg-green-950/20 w-full">
            <h3 className="text-green-300 mb-4 border-b border-green-500/30 pb-2 font-bold flex items-center text-xl"><Key className="w-5 h-5 mr-2"/> SECURE_COMMS_LINK</h3>
            <div className="space-y-4 font-mono">
              <a href={`mailto:${CV_DATA.identity.contact}`} className="flex items-center p-3 border border-green-500/30 hover:bg-green-900/40 transition-colors cursor-pointer group no-underline block w-full">
                <Mail className="w-5 h-5 mr-4 text-green-500 group-hover:text-green-400" />
                <div>
                  <div className="text-xs text-gray-500">PACKET_ROUTING_ADDRESS</div>
                  <div className="text-green-400 group-hover:text-green-300">{CV_DATA.identity.contact}</div>
                </div>
              </a>
              <a href={`https://discord.com/users/bogroj`} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 border border-green-500/30 hover:bg-green-900/40 transition-colors cursor-pointer group no-underline block w-full">
                <MessageSquare className="w-5 h-5 mr-4 text-green-500 group-hover:text-green-400" />
                <div>
                  <div className="text-xs text-gray-500">DISCORD_USER_HASH</div>
                  <div className="text-green-400 group-hover:text-green-300">{CV_DATA.identity.discord}</div>
                </div>
              </a>
            </div>
            <div className="mt-6 text-xs text-gray-500 border-t border-green-500/30 pt-4">
              [!] Link establishment requires valid handshake. Expect delayed routing on unsecured channels.
            </div>
          </div>
        );
      default:
        return <div>Command not found.</div>;
    }
  };

  const isAnyCommandTyping = commandHistory.some(entry => entry.isTyping);

  if (isTerminated) {
    return (
      <div className="min-h-screen bg-black text-green-500 font-mono p-4 md:p-8 crt relative overflow-hidden">
        <style>{`
          ::selection { background: #39ff14; color: #000; }
          ::-moz-selection { background: #39ff14; color: #000; }
          .crt::before {
            content: " "; display: block; position: absolute; top: 0; left: 0; bottom: 0; right: 0;
            background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
            z-index: 50; background-size: 100% 2px, 3px 100%; pointer-events: none;
          }
        `}</style>
        <div className="w-2.5 h-5 bg-green-500 animate-pulse mt-2 ml-2"></div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        ::selection { background: #39ff14; color: #000; }
        ::-moz-selection { background: #39ff14; color: #000; }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .crt::before {
          content: " ";
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
          z-index: 50;
          background-size: 100% 2px, 3px 100%;
          pointer-events: none;
        }
        .crt::after {
          content: " ";
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          background: rgba(0, 255, 0, 0.03);
          opacity: 0;
          z-index: 50;
          pointer-events: none;
          animation: flicker 0.15s infinite;
        }
        .scanline {
          width: 100%;
          height: 100px;
          background: linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(34,197,94,0.1) 50%, rgba(0,0,0,0) 100%);
          opacity: 0.1;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 40;
          animation: scanline 8s linear infinite;
          pointer-events: none;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #000;
          border-left: 1px solid #003300;
        }
        ::-webkit-scrollbar-thumb {
          background: #004400;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #00ff00;
        }
      `}</style>

      <div
        className="min-h-screen bg-black text-green-500 font-mono p-0 md:p-4 lg:p-8 crt relative overflow-hidden flex flex-col items-center justify-center"
        onClick={focusInput}
      >
        <div className="scanline"></div>

        <div
          className={
            isMaximized
              ? "fixed inset-0 w-screen h-screen bg-black flex flex-col z-10 overflow-hidden"
              : `w-full ${isMinimized ? 'h-auto' : 'h-[100dvh] md:h-[90vh]'} md:max-w-5xl border-0 md:border-2 border-green-900 bg-black flex flex-col relative md:shadow-[0_0_30px_rgba(0,50,0,0.8)] md:rounded-sm overflow-hidden z-10`
          }
          style={!isMaximized ? { transform: `translate(${offset.x}px, ${offset.y}px)` } : undefined}
        >

          {/* Terminal Header */}
          <div
            className={`bg-green-950/50 border-b-2 border-green-900 px-4 py-2 flex items-center justify-between select-none shrink-0 ${isMaximized ? '' : 'md:cursor-grab active:md:cursor-grabbing'}`}
            onPointerDown={onDragStart}
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={(e) => { e.stopPropagation(); setIsMinimized(m => !m); }}
          >
            <div className="flex items-center space-x-2 text-sm text-green-400">
              <Terminal className="w-4 h-4" />
              <span>root@lapetri:~</span>
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                aria-label="close"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => { e.stopPropagation(); setIsTerminated(true); }}
                className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors cursor-pointer border-0 p-0"
              />
              <button
                type="button"
                aria-label="minimize"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => { e.stopPropagation(); setIsMinimized(m => !m); }}
                className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors cursor-pointer border-0 p-0"
              />
              <button
                type="button"
                aria-label="maximize"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => { e.stopPropagation(); setIsMaximized(m => !m); setIsMinimized(false); }}
                className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors animate-pulse cursor-pointer border-0 p-0"
              />
            </div>
          </div>

          {!isMinimized && (
          <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
            {/* Sidebar Navigation (Commands) */}
            <div className="w-full md:w-48 border-b md:border-b-0 md:border-r border-green-900 bg-black p-2 md:p-4 flex flex-row md:flex-col gap-2 select-none overflow-x-auto no-scrollbar shrink-0">
              <div className="hidden md:block text-xs text-gray-500 mb-2 border-b border-green-900 pb-1">AVAILABLE_MODULES</div>

              <button
                onClick={(e) => { e.stopPropagation(); executeCommand('./recon --target=L_APETRI --dump-identity', 'whoami'); }}
                className={`text-left px-2 py-1.5 md:py-1 hover:bg-green-900/40 hover:text-green-300 transition-colors flex items-center whitespace-nowrap flex-shrink-0 ${activeTab === 'whoami' ? 'bg-green-900/40 text-green-300 border-l-2 md:border-b-0 md:border-l-2 border-green-500' : 'text-gray-400'}`}
              >
                <ChevronRight className="w-3 h-3 mr-1" /> ./whoami
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); executeCommand('tail -f /var/log/syslog | grep "L_APETRI_CAREER_DAEMON" --decrypt', 'experience'); }}
                className={`text-left px-2 py-1.5 md:py-1 hover:bg-green-900/40 hover:text-green-300 transition-colors flex items-center whitespace-nowrap flex-shrink-0 ${activeTab === 'experience' ? 'bg-green-900/40 text-green-300 border-l-2 md:border-b-0 md:border-l-2 border-green-500' : 'text-gray-400'}`}
              >
                <ChevronRight className="w-3 h-3 mr-1" /> ./experience
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); executeCommand('nmap -sV --script=vuln local_assets.db --extract-skills', 'skills'); }}
                className={`text-left px-2 py-1.5 md:py-1 hover:bg-green-900/40 hover:text-green-300 transition-colors flex items-center whitespace-nowrap flex-shrink-0 ${activeTab === 'skills' ? 'bg-green-900/40 text-green-300 border-l-2 md:border-b-0 md:border-l-2 border-green-500' : 'text-gray-400'}`}
              >
                <ChevronRight className="w-3 h-3 mr-1" /> ./skills
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); executeCommand('git clone ssh://git@shadow-net.local/root/classified-ops.git && make run', 'projects'); }}
                className={`text-left px-2 py-1.5 md:py-1 hover:bg-green-900/40 hover:text-green-300 transition-colors flex items-center whitespace-nowrap flex-shrink-0 ${activeTab === 'projects' ? 'bg-green-900/40 text-green-300 border-l-2 md:border-b-0 md:border-l-2 border-green-500' : 'text-gray-400'}`}
              >
                <ChevronRight className="w-3 h-3 mr-1" /> ./projects
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); executeCommand('nc -vz secure.lapetri.net 443', 'contact'); }}
                className={`text-left px-2 py-1.5 md:py-1 hover:bg-green-900/40 hover:text-green-300 transition-colors flex items-center whitespace-nowrap flex-shrink-0 ${activeTab === 'contact' ? 'bg-green-900/40 text-green-300 border-l-2 md:border-b-0 md:border-l-2 border-green-500' : 'text-gray-400'}`}
              >
                <ChevronRight className="w-3 h-3 mr-1" /> ./contact
              </button>
            </div>

            {/* Main Terminal Output */}
            <div className="flex-1 p-3 md:p-6 overflow-y-auto bg-[#050505] flex flex-col relative text-sm md:text-base">
              {commandHistory.map((cmdEntry, index) => (
                <div key={index} className="mb-6">
                  <div className="text-gray-400 mb-4 flex items-center flex-wrap">
                    <span className="text-green-500 mr-2 whitespace-nowrap">root@lapetri:~$</span>
                    {cmdEntry.isTyping ? (
                      <span className="text-white">
                        <TypewriterText text={cmdEntry.cmd} delay={15} onComplete={() => finishCommand(index)} />
                      </span>
                    ) : (
                      <span className="text-gray-300">{cmdEntry.cmd}</span>
                    )}
                  </div>

                  {!cmdEntry.isTyping && (
                    <div className="mt-4 border-l-2 border-green-900 pl-4">
                      {renderContent(cmdEntry)}
                    </div>
                  )}
                </div>
              ))}

              {/* Interactive Input Line */}
              {!isAnyCommandTyping && (
                <form onSubmit={handleUserInput} className="flex items-center text-green-500 mt-2">
                  <span className="mr-2 whitespace-nowrap">root@lapetri:~$</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="bg-transparent border-none outline-none flex-1 text-white font-mono focus:ring-0 p-0 m-0"
                    spellCheck="false"
                    autoComplete="off"
                    autoFocus
                  />
                </form>
              )}

              <div ref={bottomRef} className="h-8 shrink-0" />
            </div>
          </div>
          )}
        </div>
      </div>
    </>
  );
}
