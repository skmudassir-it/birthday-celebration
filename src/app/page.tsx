"use client";

import { useState, useCallback, useEffect, useRef } from "react";

const BALLOON_COLORS = [
  "#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF",
  "#FF8DC7", "#C084FC", "#FB923C", "#2DD4BF",
];
const TOTAL_BALLOONS = 8;
const SPAWN_INTERVAL = 600; // ms between balloon appearances
const BALLOON_LIFETIME = 5000; // ms each balloon lives

// ─── Balloon SVG ────────────────────────────────────────────────
function BalloonSVG({ color }: { color: string }) {
  const id = `g-${color.replace("#", "")}`;
  return (
    <svg viewBox="0 0 100 140" className="w-full h-full" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <path d="M50 135 Q48 120 46 110 Q40 90 50 70" fill="none" stroke="#888" strokeWidth="1.5" />
      <ellipse cx="50" cy="68" rx="4" ry="3" fill={color} />
      <ellipse cx="50" cy="35" rx="32" ry="38" fill={`url(#${id})`} />
      <ellipse cx="40" cy="22" rx="10" ry="14" fill="white" opacity="0.25" transform="rotate(-20 40 22)" />
    </svg>
  );
}

// ─── Pop particles ──────────────────────────────────────────────
function PopParticles({ color, x, y, size }: { color: string; x: number; y: number; size: number }) {
  const particles = useRef(
    Array.from({ length: 12 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 12;
      const dist = size * 0.4 + Math.random() * size * 0.6;
      return { id: i, dx: Math.cos(angle) * dist, dy: Math.sin(angle) * dist, delay: Math.random() * 0.15, scale: 0.5 + Math.random() * 0.5 };
    })
  );
  return (
    <>
      {particles.current.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: size * 0.15, height: size * 0.15, background: color, left: x, top: y,
            animation: `popParticle 0.8s ease-out ${p.delay}s forwards`,
            "--dx": `${p.dx}px`, "--dy": `${p.dy}px`, "--scale": p.scale,
          } as React.CSSProperties}
        />
      ))}
    </>
  );
}

// ─── Fireworks ──────────────────────────────────────────────────
function Fireworks() {
  const bursts = useRef(
    Array.from({ length: 24 }, (_, i) => ({
      id: i, x: 10 + Math.random() * 80, y: 8 + Math.random() * 55,
      color: BALLOON_COLORS[i % BALLOON_COLORS.length], delay: Math.random() * 2.5, size: 3 + Math.random() * 6,
    }))
  );
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {bursts.current.map((b) => (
        <div key={b.id} className="absolute" style={{ left: `${b.x}%`, top: `${b.y}%`, width: b.size, height: b.size, animation: `fireworkBurst 1.8s ease-out ${b.delay}s infinite` }}>
          {Array.from({ length: 8 }, (_, i) => {
            const angle = (Math.PI * 2 * i) / 8;
            return (
              <div key={i} className="absolute rounded-full" style={{
                width: b.size, height: b.size, background: b.color, top: "50%", left: "50%",
                animation: `fireworkSpoke 1.8s ease-out ${b.delay}s infinite`,
                "--angle": `${angle}rad`, "--dist": `${35 + Math.random() * 70}px`,
              } as React.CSSProperties} />
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─── Happy Birthday ─────────────────────────────────────────────
function HappyBirthday({ name }: { name: string }) {
  const displayName = name.trim() || "You";
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none gap-4">
      <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-center px-4 leading-tight"
        style={{ animation: "bounceIn 1s ease-out" }}>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 drop-shadow-lg">
          🎂 Happy Birthday
        </span>
        <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 drop-shadow-lg"
          style={{ animation: "fadeIn 1s ease-out 0.3s both" }}>
          to you, {displayName}!
        </span>
      </h1>
      <p className="text-lg sm:text-xl md:text-2xl text-purple-600 font-semibold text-center px-4"
        style={{ animation: "fadeIn 1s ease-out 0.7s both" }}>
        Wishing you the most amazing day! ✨
      </p>
    </div>
  );
}

// ─── Welcome screen ─────────────────────────────────────────────
function WelcomeScreen({ onStart }: { onStart: (name: string) => void }) {
  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onStart(name.trim());
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center z-30">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 sm:p-10 max-w-md w-full mx-4 text-center"
        style={{ animation: "fadeInUp 0.6s ease-out" }}>
        <div className="text-5xl mb-4">🎈</div>
        <h2 className="text-2xl font-bold text-purple-700 mb-2">Let&apos;s Celebrate!</h2>
        <p className="text-gray-500 mb-6 text-sm">Balloons will appear — pop them quick before they float away!</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter the birthday person's name..."
            className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none text-gray-700 text-center text-lg placeholder:text-gray-300 transition-colors"
            maxLength={30}
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-3 rounded-xl font-bold text-white text-lg transition-all duration-200
              bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700
              disabled:opacity-40 disabled:cursor-not-allowed
              shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            🎉 Start the Party!
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Countdown overlay ──────────────────────────────────────────
function Countdown({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count <= 0) {
      onDone();
      return;
    }
    const t = setTimeout(() => setCount((c) => c - 1), 800);
    return () => clearTimeout(t);
  }, [count, onDone]);

  if (count <= 0) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center z-25 pointer-events-none">
      <div className="text-8xl font-extrabold text-purple-600 drop-shadow-lg"
        style={{ animation: `countPop 0.8s ease-out` }}>
        {count}
      </div>
    </div>
  );
}

// ─── Balloon data ───────────────────────────────────────────────
interface BalloonState {
  id: number;
  color: string;
  x: number;
  size: number;
  spawnedAt: number;
}

function generateBalloon(id: number): BalloonState {
  return {
    id,
    color: BALLOON_COLORS[id % BALLOON_COLORS.length],
    x: 5 + Math.random() * 90,
    size: 80 + Math.random() * 60,
    spawnedAt: 0,
  };
}

// ─── Main page ──────────────────────────────────────────────────
type Phase = "welcome" | "countdown" | "balloons" | "celebration";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("welcome");
  const [name, setName] = useState("");
  const [activeBalloons, setActiveBalloons] = useState<BalloonState[]>([]);
  const [goneIds, setGoneIds] = useState<Set<number>>(new Set());
  const nextSpawnRef = useRef(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const balloonCountRef = useRef(0);

  // Cleanup all timers
  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  useEffect(() => clearAllTimers, [clearAllTimers]);

  const handleStart = useCallback((enteredName: string) => {
    setName(enteredName);
    setPhase("countdown");
  }, []);

  const handleCountdownDone = useCallback(() => {
    setPhase("balloons");
    // Begin spawning
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i < TOTAL_BALLOONS; i++) {
      const spawnDelay = i * SPAWN_INTERVAL;
      const t1 = setTimeout(() => {
        const balloon = generateBalloon(i);
        setActiveBalloons((prev) => [...prev, balloon]);

        // Auto-disappear after BALLOON_LIFETIME
        const t2 = setTimeout(() => {
          setGoneIds((prev) => new Set(prev).add(i));
        }, BALLOON_LIFETIME);
        timers.push(t2);
      }, spawnDelay);
      timers.push(t1);
    }
    timersRef.current = timers;
  }, []);

  // Pop a balloon
  const handlePop = useCallback((id: number) => {
    setGoneIds((prev) => new Set(prev).add(id));
  }, []);

  // Transition to celebration when all gone
  useEffect(() => {
    if (phase !== "balloons") return;
    if (goneIds.size >= TOTAL_BALLOONS) {
      // Small delay for last balloon removal animation
      const t = setTimeout(() => setPhase("celebration"), 200);
      return () => clearTimeout(t);
    }
  }, [phase, goneIds.size]);

  // Visible balloons = active minus gone
  const visibleBalloons = activeBalloons.filter((b) => !goneIds.has(b.id));

  return (
    <main className="relative w-full min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-10 left-10 w-64 h-64 bg-pink-300 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-300 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-blue-300 rounded-full blur-3xl" />
      </div>

      {/* Welcome */}
      {phase === "welcome" && <WelcomeScreen onStart={handleStart} />}

      {/* Countdown */}
      {phase === "countdown" && <Countdown onDone={handleCountdownDone} />}

      {/* Balloons phase */}
      {phase === "balloons" && (
        <>
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
            <p className="text-base sm:text-lg font-semibold text-purple-700 text-center px-4">
              🎈 Pop the balloons before they float away!
            </p>
            <div className="flex gap-1.5">
              {Array.from({ length: TOTAL_BALLOONS }, (_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full transition-all duration-300"
                  style={{
                    background: goneIds.has(i)
                      ? BALLOON_COLORS[i % BALLOON_COLORS.length]
                      : "transparent",
                    border: goneIds.has(i)
                      ? "none"
                      : `2px solid ${BALLOON_COLORS[i % BALLOON_COLORS.length]}40`,
                    transform: goneIds.has(i) ? "scale(1.2)" : "scale(1)",
                  }}
                />
              ))}
            </div>
          </div>
          <div className="absolute inset-0">
            {activeBalloons.map((b) => {
              if (goneIds.has(b.id)) return null;
              return (
                <Balloon key={b.id} data={b} onPop={handlePop} />
              );
            })}
          </div>
        </>
      )}

      {/* Celebration */}
      {phase === "celebration" && (
        <>
          <Fireworks />
          <HappyBirthday name={name} />
        </>
      )}

      {/* Keyframes */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(2deg); }
        }
        @keyframes bob {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(6px); }
        }
        @keyframes popParticle {
          0% { opacity: 1; transform: translate(0,0) scale(1); }
          100% { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(var(--scale)); }
        }
        @keyframes fireworkBurst {
          0% { opacity: 0; transform: scale(0); }
          10% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1); }
        }
        @keyframes fireworkSpoke {
          0% { opacity: 1; transform: translate(-50%,-50%) rotate(var(--angle)) translateX(0); }
          100% { opacity: 0; transform: translate(-50%,-50%) rotate(var(--angle)) translateX(var(--dist)); }
        }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes countPop {
          0% { opacity: 0; transform: scale(0.5); }
          30% { opacity: 1; transform: scale(1.2); }
          100% { opacity: 0; transform: scale(1.5); }
        }
        @keyframes balloonFadeOut {
          0% { opacity: 1; transform: scale(1) translateY(0); }
          100% { opacity: 0; transform: scale(0.5) translateY(-40px); }
        }
        @keyframes balloonEnter {
          0% { opacity: 0; transform: scale(0) rotate(-15deg); }
          60% { opacity: 1; transform: scale(1.08) rotate(2deg); }
          80% { transform: scale(0.95) rotate(0deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
      `}</style>
    </main>
  );
}

// ─── Balloon component ──────────────────────────────────────────
function Balloon({ data, onPop }: { data: BalloonState; onPop: (id: number) => void }) {
  const [popped, setPopped] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const [popPos, setPopPos] = useState({ x: 0, y: 0 });
  const elRef = useRef<HTMLDivElement>(null);
  const floatDelay = useRef(Math.random() * 0.8);
  const enterDelay = useRef(Math.random() * 0.3);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (popped || fadingOut) return;
      const rect = e.currentTarget.getBoundingClientRect();
      setPopPos({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      setPopped(true);
      setTimeout(() => onPop(data.id), 300);
    },
    [popped, fadingOut, data.id, onPop]
  );

  if (fadingOut) return null;

  return (
    <div
      ref={elRef}
      onClick={handleClick}
      className="absolute cursor-pointer select-none group"
      style={{
        left: `${data.x}%`,
        bottom: `${5 + (data.id % 3) * 6}%`,
        width: data.size + 24,
        height: data.size * 1.4 + 24,
        transform: popped ? "scale(0)" : "scale(1)",
        opacity: popped ? 0 : 1,
        transition: popped ? "transform 0.25s ease-in, opacity 0.25s ease-in" : "none",
        animation: popped
          ? "none"
          : `float 3s ease-in-out ${floatDelay.current}s infinite, bob 2.5s ease-in-out ${floatDelay.current + 0.4}s infinite, balloonEnter 0.5s cubic-bezier(0.34,1.56,0.64,1) ${enterDelay.current}s both`,
        zIndex: popped ? 15 : 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="transition-transform duration-200 group-hover:scale-110 group-active:scale-90"
        style={{ width: data.size, height: data.size * 1.4 }}
      >
      {popped && <PopParticles color={data.color} x={popPos.x} y={popPos.y} size={data.size} />}
      {!popped && <BalloonSVG color={data.color} />}
      {popped && (
        <div className="absolute text-xl font-extrabold text-gray-500"
          style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)", animation: "countPop 0.6s ease-out" }}>
          POP!
        </div>
      )}
      </div>
    </div>
  );
}
