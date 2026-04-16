import React, { useEffect, useState, useRef, useMemo } from 'react';

interface Interaction {
  id: number;
  x: number;
  y: number;
  type: 'SEAL' | 'PACKET';
}

interface FloatingLabel {
  id: number;
  x: number;
  y: number;
  text: string;
}

interface BackgroundPoint {
  id: number;
  r: number;
  startX: number;
  endX: number;
  startY: number;
  endY: number;
  duration: number;
  opacity: number;
}

const HeroAnimation: React.FC = () => {
  const [variant, setVariant] = useState<'ALCHEMIST' | 'STREAM' | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [floatingLabels, setFloatingLabels] = useState<FloatingLabel[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);

  const labelTexts = [
    "EPU (Elektroniczne Postępowanie Upominawcze)",
    "POZEW",
    "WEZWANIE DO ZAPŁATY",
    "PIECZĘĆ KANCELARII",
    "EGZEKUCJA",
    "RAPORT SPŁATY"
  ];

  const staticBackgroundPoints = useMemo<BackgroundPoint[]>(() => {
    return [...Array(15)].map((_, i) => ({
      id: i,
      r: Math.random() * 3 + 1,
      startX: Math.random() * 800,
      endX: Math.random() * 800,
      startY: Math.random() * 600,
      endY: Math.random() * 600,
      duration: 15 + Math.random() * 10,
      opacity: 0.1 + Math.random() * 0.4
    }));
  }, []);

  useEffect(() => {
    const selectedVariant = Math.random() > 0.5 ? 'ALCHEMIST' : 'STREAM';
    setVariant(selectedVariant);

    if (selectedVariant === 'STREAM') {
      const interval = setInterval(() => {
        const labelWidth = 180;
        const labelHeight = 45;
        
        const newLabel: FloatingLabel = {
          id: Date.now() + Math.random(),
          x: 20 + Math.random() * (800 - labelWidth - 40),
          y: 50 + Math.random() * (600 - labelHeight - 100),
          text: labelTexts[Math.floor(Math.random() * labelTexts.length)]
        };
        
        setFloatingLabels(prev => [...prev.slice(-6), newLabel]);
        
        setTimeout(() => {
          setFloatingLabels(prev => prev.filter(l => l.id !== newLabel.id));
        }, 4000);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, []);

  const handleInteraction = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    
    const rect = svgRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (600 / rect.width) + 100;
    const y = (e.clientY - rect.top) * (500 / rect.height) + 50;

    const newInteraction: Interaction = {
      id: Date.now() + Math.random(),
      x,
      y,
      type: variant === 'ALCHEMIST' ? 'SEAL' : 'PACKET'
    };

    setInteractions(prev => [...prev, newInteraction]);
    setTimeout(() => {
      setInteractions(prev => prev.filter(i => i.id !== newInteraction.id));
    }, 2000);
  };

  if (!variant) return <div className="w-full h-full bg-slate-50 animate-pulse" />;

  return (
    <div className="relative w-full h-full overflow-hidden bg-white flex items-center justify-center cursor-crosshair">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#0a2e5c 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <svg 
        ref={svgRef}
        viewBox="100 50 600 500" 
        className="w-full h-full max-w-2xl drop-shadow-2xl select-none touch-none"
        onPointerDown={handleInteraction}
      >
        <defs>
          <linearGradient id="gradBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#137fec" />
            <stop offset="100%" stopColor="#0a2e5c" />
          </linearGradient>
          
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          <filter id="subtleGlow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {variant === 'ALCHEMIST' ? (
          <g pointerEvents="none">
            <rect x="250" y="100" width="300" height="400" rx="20" fill="white" stroke="#e2e8f0" strokeWidth="2" className="animate-intro-pop" />
            
            <g>
              <rect x="280" y="130" width="100" height="12" rx="4" fill="#0a2e5c" opacity="0.1" />
              <rect x="420" y="130" width="100" height="12" rx="4" fill="#0a2e5c" opacity="0.1" />
              <rect x="280" y="160" width="140" height="6" rx="3" fill="#0a2e5c" opacity="0.08" />
              <rect x="280" y="172" width="100" height="6" rx="3" fill="#0a2e5c" opacity="0.08" />
              <rect x="280" y="210" width="140" height="6" rx="3" fill="#0a2e5c" opacity="0.08" />

              {[280, 310, 340, 370].map((y) => (
                <g key={`bg-${y}`}>
                  <rect x="280" y={y} width="160" height="8" rx="2" fill="#0a2e5c" opacity="0.1" />
                  <rect x="460" y={y} width="60" height="8" rx="2" fill="#0a2e5c" opacity="0.1" />
                </g>
              ))}
              
              <rect x="400" y="420" width="120" height="15" rx="4" fill="#0a2e5c" opacity="0.1" />
            </g>

            {/* Podświetlenia: Obniżone wartości opacity dla efektu jasności (0.35 max) */}
            <g filter="url(#subtleGlow)">
              <rect x="280" y="130" width="100" height="12" rx="4" fill="#137fec" opacity="0">
                <animate attributeName="opacity" values="0;0.35;0;0;0.35;0;0" keyTimes="0;0.015;0.045;0.33;0.36;0.375;1" dur="8s" repeatCount="indefinite" />
              </rect>
              <rect x="420" y="130" width="100" height="12" rx="4" fill="#137fec" opacity="0">
                <animate attributeName="opacity" values="0;0.35;0;0;0.35;0;0" keyTimes="0;0.015;0.045;0.33;0.36;0.375;1" dur="8s" repeatCount="indefinite" />
              </rect>

              {[280, 310, 340, 370].map((y) => {
                const progress = (y - 100) / 400; 
                const tDown = (progress * 1.5) / 8;
                const tUp = (3.0 - progress * 1.5) / 8;
                const offset = 0.015;

                return (
                  <g key={`sync-${y}`}>
                    <rect x="280" y={y} width="160" height="8" rx="2" fill="#137fec" opacity="0">
                      <animate attributeName="opacity" values="0;0.35;0;0;0.35;0;0" keyTimes={`0;${tDown};${tDown+offset};${tUp-offset};${tUp};${tUp+offset};1`} dur="8s" repeatCount="indefinite" />
                    </rect>
                    <rect x="460" y={y} width="60" height="8" rx="2" fill="#137fec" opacity="0">
                      <animate attributeName="opacity" values="0;0.35;0;0;0.35;0;0" keyTimes={`0;${tDown};${tDown+offset};${tUp-offset};${tUp};${tUp+offset};1`} dur="8s" repeatCount="indefinite" />
                    </rect>
                  </g>
                );
              })}

              <rect x="400" y="420" width="120" height="15" rx="4" fill="#137fec" opacity="0">
                <animate attributeName="opacity" values="0;0;0.35;0;0;0.35;0;0" keyTimes="0;0.13;0.16;0.20;0.21;0.24;0.27;1" dur="8s" repeatCount="indefinite" />
              </rect>
            </g>

            <path d="M400 230 L450 255 V315 L400 345 L350 315 V255 Z" 
                  fill="none" stroke="#137fec" strokeWidth="2" 
                  strokeDasharray="300" strokeDashoffset="0" opacity="0.1" />

            <rect x="230" y="100" width="340" height="3" fill="#137fec" filter="url(#glow)" opacity="0">
              <animate 
                attributeName="y" 
                values="100;500;100;100" 
                keyTimes="0;0.1875;0.375;1"
                dur="8s" 
                repeatCount="indefinite" 
                calcMode="spline" 
                keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0 0 1 1"
              />
              <animate 
                attributeName="opacity" 
                values="0;0.6;0.6;0;0" 
                keyTimes="0;0.04;0.33;0.375;1"
                dur="8s" 
                repeatCount="indefinite"
              />
            </rect>
          </g>
        ) : (
          <g pointerEvents="none">
            <g filter="url(#glow)">
              <path d="M100 300 Q 250 100, 400 300 T 700 300" 
                    fill="none" stroke="url(#gradBlue)" strokeWidth="3" strokeDasharray="10 10" className="animate-flow-path" />
              <circle cx="400" cy="300" r="60" fill="white" stroke="#137fec" strokeWidth="2" className="animate-node-pulse" />
              <text x="400" y="312" textAnchor="middle" fill="#137fec" className="text-[24px] font-[800] tracking-tighter" style={{ fontFamily: 'Manrope, sans-serif' }}>
                RPMS
              </text>
              {staticBackgroundPoints.map((pt) => (
                <circle key={pt.id} r={pt.r} fill="#137fec" opacity={pt.opacity}>
                  <animate attributeName="cx" values={`${pt.startX};${pt.endX};${pt.startX}`} dur={`${pt.duration}s`} repeatCount="indefinite" />
                  <animate attributeName="cy" values={`${pt.startY};${pt.endY};${pt.startY}`} dur={`${pt.duration}s`} repeatCount="indefinite" />
                </circle>
              ))}
            </g>

            {floatingLabels.map(label => (
              <foreignObject key={label.id} x={label.x} y={label.y} width="180" height="45" className="animate-float-label overflow-visible pointer-events-none">
                <div className="bg-white/85 backdrop-blur-md border border-brand-blue/15 rounded-[var(--radius-brand-input)] px-3 py-1.5 shadow-xl flex items-center justify-center"
                     style={{ transform: 'translate3d(0,0,0)', backfaceVisibility: 'hidden', WebkitFontSmoothing: 'subpixel-antialiased', willChange: 'transform, opacity' }}>
                  <span className="text-brand-navy font-black text-[8px] md:text-[9px] uppercase tracking-wider text-center leading-tight">{label.text}</span>
                </div>
              </foreignObject>
            ))}
          </g>
        )}

        <g pointerEvents="none">
          {interactions.map(i => (
            i.type === 'SEAL' ? (
              <g key={i.id} className="animate-seal-pop" style={{ transformOrigin: `${i.x}px ${i.y}px` }}>
                <circle cx={i.x} cy={i.y} r="20" fill="none" stroke="#137fec" strokeWidth="2" filter="url(#glow)" />
                <path d={`M${i.x - 8} ${i.y} L${i.x - 2} ${i.y + 6} L${i.x + 8} ${i.y - 6}`} fill="none" stroke="#137fec" strokeWidth="3" strokeLinecap="round" />
              </g>
            ) : (
              <rect key={i.id} x={i.x - 4} y={i.y - 4} width="8" height="8" fill="#137fec" rx="2" className="animate-packet-travel">
                <animate attributeName="x" from={i.x} to="400" dur="0.6s" fill="freeze" />
                <animate attributeName="y" from={i.y} to="300" dur="0.6s" fill="freeze" />
                <animate attributeName="opacity" values="1;0.8;0" dur="0.6s" fill="freeze" />
              </rect>
            )
          ))}
        </g>
      </svg>

      <style>{`
        @keyframes flow-path { from { stroke-dashoffset: 200; } to { stroke-dashoffset: 0; } }
        .animate-flow-path { stroke-dasharray: 200; animation: flow-path 10s linear infinite; }
        
        @keyframes node-pulse { 0%, 100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.05); opacity: 1; } }
        .animate-node-pulse { transform-origin: center; animation: node-pulse 4s ease-in-out infinite; }

        @keyframes intro-pop { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-intro-pop { transform-origin: center; animation: intro-pop 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }

        @keyframes seal-pop { 0% { transform: scale(0.5); opacity: 0; } 20% { transform: scale(1.2); opacity: 1; } 100% { transform: scale(1); opacity: 0; } }
        .animate-seal-pop { animation: seal-pop 1.5s ease-out forwards; }

        @keyframes packet-travel { 0% { transform: scale(1); } 100% { transform: scale(0.2); } }
        .animate-packet-travel { animation: packet-travel 0.6s ease-in forwards; }

        @keyframes float-label {
          0% { transform: translate3d(0, 15px, 0); opacity: 0; }
          12% { transform: translate3d(0, 0, 0); opacity: 1; }
          88% { transform: translate3d(0, -10px, 0); opacity: 1; }
          100% { transform: translate3d(0, -25px, 0); opacity: 0; }
        }
        .animate-float-label { animation: float-label 4s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
      `}</style>
    </div>
  );
};

export default HeroAnimation;
