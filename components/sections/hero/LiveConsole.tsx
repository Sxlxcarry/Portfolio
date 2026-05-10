'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/hooks';

const COMMANDS = [
  'nmap -sV 10.0.0.0/24',
  'wireguard up wg0',
  'docker compose up -d prometheus grafana',
  'kubectl get pods -n monitoring',
  'tcpdump -i eth0 port 443 -nn',
  'ssh -i ~/.ssh/id_ed25519 admin@bastion',
  'fail2ban-client status sshd',
  'curl -s vault.local/v1/sys/health',
];

export default function LiveConsole() {
  const reduceMotion = useReducedMotion();
  const [cmd, setCmd] = useState('');
  const [cpu, setCpu] = useState(42);
  const [net, setNet] = useState(128);
  const [cpuHist, setCpuHist] = useState<number[]>(Array(20).fill(40));
  const [netHist, setNetHist] = useState<number[]>(Array(20).fill(60));

  // Type-and-erase loop
  useEffect(() => {
    if (reduceMotion) {
      setCmd(COMMANDS[0]);
      return;
    }
    let cancelled = false;
    let i = 0;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

    async function loop() {
      while (!cancelled) {
        const txt = COMMANDS[i % COMMANDS.length];
        for (let k = 0; k <= txt.length; k++) {
          if (cancelled) return;
          setCmd(txt.slice(0, k));
          await wait(45 + Math.random() * 40);
        }
        await wait(1400);
        for (let k = txt.length; k >= 0; k--) {
          if (cancelled) return;
          setCmd(txt.slice(0, k));
          await wait(20);
        }
        await wait(300);
        i++;
      }
    }
    loop();
    return () => {
      cancelled = true;
    };
  }, [reduceMotion]);

  // Metrics
  useEffect(() => {
    const tick = () => {
      setCpu((v) => Math.max(15, Math.min(92, v + (Math.random() - 0.5) * 16)));
      setNet((v) => Math.max(20, Math.min(98, v + (Math.random() - 0.5) * 22)));
    };
    const id = setInterval(tick, 1400);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setCpuHist((h) => [...h.slice(1), cpu]);
  }, [cpu]);

  useEffect(() => {
    setNetHist((h) => [...h.slice(1), net]);
  }, [net]);

  const sparkPoints = (arr: number[]) =>
    arr.map((v, i) => `${(i / (arr.length - 1)) * 100},${30 - (v / 100) * 28}`).join(' ');

  return (
    <div
      className="relative rounded-3xl overflow-hidden border border-line bg-gradient-to-b from-[rgba(14,19,30,0.85)] to-[rgba(7,10,17,0.85)] backdrop-blur-md shadow-[0_24px_60px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.04)] flicker border-glow-spin"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* glare */}
      <div
        className="absolute inset-0 rounded-[inherit] pointer-events-none"
        style={{
          background:
            'linear-gradient(135deg, transparent 50%, rgba(125,211,252,0.07) 100%), radial-gradient(400px 200px at 100% 0%, rgba(165,243,208,0.05), transparent 60%)',
        }}
      />

      {/* head */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-line bg-[rgba(4,6,10,0.6)]">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-signal-coral" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-signal-mint" />
        </div>
        <div className="mono-label text-ink-muted flex items-center gap-2 text-[10px]">
          <span className="relative w-1.5 h-1.5 rounded-full bg-signal-mint">
            <span className="absolute inset-0 rounded-full bg-signal-mint animate-ping" />
          </span>
          NODE · MONITORING
        </div>
      </div>

      <div className="p-5 grid gap-5">
        {/* Topology */}
        <div className="relative h-44 rounded-xl border border-line bg-[radial-gradient(ellipse_at_center,_rgba(125,211,252,0.06),_transparent_70%)] bg-depth-1 overflow-hidden">
          <span className="absolute top-2 left-3 mono-label text-signal-primary text-[9px]">topology</span>
          <span className="absolute bottom-2 right-3 mono-label text-ink-muted text-[9px]">[ healthy ]</span>
          <svg viewBox="0 0 400 168" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            <defs>
              <radialGradient id="ng" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#7dd3fc" stopOpacity=".55" />
                <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="eg" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#7dd3fc" stopOpacity=".3" />
                <stop offset="1" stopColor="#a5f3d0" stopOpacity=".3" />
              </linearGradient>
            </defs>
            <g stroke="url(#eg)" strokeWidth="1" fill="none" strokeDasharray="4 6">
              <path d="M60 84 L160 36" id="e1" />
              <path d="M60 84 L160 132" id="e2" />
              <path d="M160 36 L260 84" id="e3" />
              <path d="M160 132 L260 84" id="e4" />
              <path d="M260 84 L340 84" id="e5" />
            </g>
            {[
              { id: 'e1', dur: '3s', delay: '0s', color: '#7dd3fc' },
              { id: 'e3', dur: '3.4s', delay: '0.5s', color: '#a5f3d0' },
              { id: 'e5', dur: '2.6s', delay: '1s', color: '#7dd3fc' },
              { id: 'e2', dur: '3.2s', delay: '1.5s', color: '#a5f3d0' },
              { id: 'e4', dur: '3s', delay: '2s', color: '#7dd3fc' },
            ].map((p, i) => (
              <circle
                key={i}
                r="3"
                fill={p.color}
                style={{ filter: `drop-shadow(0 0 4px ${p.color})` }}
              >
                <animateMotion dur={p.dur} repeatCount="indefinite" begin={p.delay}>
                  <mpath href={`#${p.id}`} />
                </animateMotion>
              </circle>
            ))}
            {[
              { x: 60, y: 84, r: 22, ir: 9, c: '#7dd3fc' },
              { x: 160, y: 36, r: 20, ir: 8, c: '#7dd3fc' },
              { x: 160, y: 132, r: 20, ir: 8, c: '#7dd3fc' },
              { x: 260, y: 84, r: 22, ir: 10, c: '#a5f3d0' },
              { x: 340, y: 84, r: 18, ir: 7, c: '#7dd3fc' },
            ].map((n, i) => (
              <g key={i} transform={`translate(${n.x} ${n.y})`}>
                <circle r={n.r} fill="url(#ng)" />
                <circle r={n.ir} fill="#0a0e16" stroke={n.c} strokeWidth="1.5" />
                <circle r="2.5" fill={n.c}>
                  <animate
                    attributeName="opacity"
                    values="1;.3;1"
                    dur={`${1.8 + i * 0.2}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            ))}
          </svg>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <Metric label="CPU LOAD" val={`${Math.round(cpu)}%`} pct={cpu} sparkColor="#7dd3fc" points={sparkPoints(cpuHist)} />
          <Metric
            label="NETWORK I/O"
            val={`${Math.round(net * 2)} Mbps`}
            pct={net}
            sparkColor="#a5f3d0"
            points={sparkPoints(netHist)}
          />
        </div>

        {/* Terminal type-and-erase */}
        <div className="rounded-xl border border-line bg-depth-0 px-3.5 py-2.5 flex items-center gap-2.5 font-mono text-[12px] text-signal-mint overflow-hidden">
          <span className="text-ink-muted select-none">$</span>
          <span className="flex-1 whitespace-nowrap overflow-hidden">{cmd}</span>
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'steps(2)' }}
            className="inline-block w-[7px] h-3.5 bg-signal-mint align-middle"
          />
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  val,
  pct,
  sparkColor,
  points,
}: {
  label: string;
  val: string;
  pct: number;
  sparkColor: string;
  points: string;
}) {
  return (
    <div className="rounded-xl border border-line bg-depth-1 p-3">
      <div className="flex justify-between items-center mb-2 mono-label text-ink-muted text-[10px]">
        <span>{label}</span>
        <span className="text-signal-primary font-semibold tracking-wide">{val}</span>
      </div>
      <div className="h-1 rounded-full bg-depth-3 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, #7dd3fc, #a5f3d0)',
            boxShadow: '0 0 8px rgba(125,211,252,0.6)',
          }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <svg viewBox="0 0 100 30" className="w-full h-7 mt-2" preserveAspectRatio="none">
        <polyline fill="none" stroke={sparkColor} strokeWidth="1.5" points={points} />
      </svg>
    </div>
  );
}
