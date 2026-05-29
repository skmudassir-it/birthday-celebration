"use client";

import { useState, useCallback, useEffect, useRef } from "react";

// --- Balloon SVG (inline to avoid external deps) ---
function BalloonSVG({ color }: { color: string }) {
  const id = `balloon-grad-${color}`;
  return (
    <svg viewBox="0 0 100 140" className="w-full h-full" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.5" />
        </linearGradient>
      </defs>
      {/* String */}
      <path
        d="M50 135 Q48 120 46 110 Q40 90 50 70"
        fill="none"
        stroke="#888"
        strokeWidth="1.5"
      />
      {/* Knot */}
      <ellipse cx="50" cy="68" rx="4" ry="3" fill={color} />
      {/* Balloon body */}
      <ellipse cx="50" cy="35" rx="32" ry="38" fill={`url(#${id})`} />
      {/* Shine */}
      <ellipse
        cx="40"
        cy="22"
        rx="10"
        ry="14"
        fill="white"
        opacity="0.25"
        transform="rotate(-20 40 22)"
      />
    </svg>
  );
}

const BALLOON_COLORS = [
  "#FF6B6B", // red
  "#FFD93D", // yellow
  "#6BCB77", // green
  "#4D96FF", // blue
  "#FF8DC7", // pink
  "#C084FC", // purple
  "#FB923C", // orange
  "#2DD4BF", // teal
];

interface BalloonData {
  id: number;
  color: string;
  x: number; // % horizontal position
  size: number; // px
  delay: number; // entrance animation delay
}

function generateBalloons(count: number): BalloonData[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    color: BALLOON_COLORS[i % BALLOON_COLORS.length],
    x: 5 + Math.random() * 90, // 5-95%
    size: 80 + Math.random() * 60, // 80-140px
    delay: Math.random() * 0.5,
  }));
}

// --- "Pop" particle burst ---
function PopParticles({
  color,
  x,
  y,
  size,
}: {
  color: string;
  x: number;
  y: number;
  size: number;
}) {
  const particles = useRef(
    Array.from({ length: 12 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 12;
      const distance = size * 0.4 + Math.random() * size * 0.6;
      return {
        id: i,
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance,
        delay: Math.random() * 0.2,
        scale: 0.5 + Math.random() * 0.5,
      };
    })
  );

  return (
    <>
      {particles.current.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: size * 0.15,
            height: size * 0.15,
            background: color,
            left: x,
            top: y,
            pointerEvents: "none",
            animation: `popParticle 0.8s ease-out ${p.delay}s forwards`,
            // @ts-expect-error custom properties
            "--dx": `${p.dx}px`,
            "--dy": `${p.dy}px`,
            "--scale": p.scale,
          }}
        />
      ))}
    </>
  );
}

// --- Single balloon ---
function Balloon({
  data,
  onPop,
}: {
  data: BalloonData;
  onPop: (id: number) => void;
}) {
  const [popped, setPopped] = useState(false);
  const [gone, setGone] = useState(false);
  const [popPos, setPopPos] = useState({ x: 0, y: 0 });

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (popped) return;
      const rect = e.currentTarget.getBoundingClientRect();
      setPopPos({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
      setPopped(true);
      // Wait 5 seconds before disappearing
      setTimeout(() => {
        setGone(true);
        onPop(data.id);
      }, 5000);
    },
    [popped, data.id, onPop]
  );

  if (gone) return null;

  return (
    <div
      onClick={handleClick}
      className="absolute cursor-pointer select-none"
      style={{
        left: `${data.x}%`,
        bottom: popped
          ? `${Math.random() * 20 + 10}%`
          : `${Math.random() * 15 + 5}%`,
        width: data.size,
        height: data.size * 1.4,
        transform: popped ? "scale(0)" : "scale(1)",
        opacity: popped ? 0 : 1,
        transition: popped
          ? "transform 0.3s ease-in, opacity 0.3s ease-in"
          : "opacity 1s ease-in",
        animation: popped
          ? "none"
          : `float 3s ease-in-out ${data.delay}s infinite, bob 2s ease-in-out ${data.delay + 0.3}s infinite`,
        zIndex: popped ? 10 : 1,
      }}
    >
      {popped && (
        <PopParticles
          color={data.color}
          x={popPos.x}
          y={popPos.y}
          size={data.size}
        />
      )}
      {!popped && <BalloonSVG color={data.color} />}
      {popped && (
        <div
          className="absolute text-2xl font-bold text-gray-600 animate-ping"
          style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
        >
          POP!
        </div>
      )}
    </div>
  );
}

// --- Fireworks (CSS-only) ---
function Fireworks() {
  const bursts = useRef(
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: 15 + Math.random() * 70, // % from left
      y: 10 + Math.random() * 50, // % from top
      color: BALLOON_COLORS[i % BALLOON_COLORS.length],
      delay: Math.random() * 2,
      size: 3 + Math.random() * 5,
    }))
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {bursts.current.map((b) => (
        <div
          key={b.id}
          className="absolute"
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`,
            width: `${b.size}px`,
            height: `${b.size}px`,
            animation: `fireworkBurst 1.5s ease-out ${b.delay}s infinite`,
          }}
        >
          {/* 8 spokes per burst */}
          {Array.from({ length: 8 }, (_, i) => {
            const angle = (Math.PI * 2 * i) / 8;
            const dist = 30 + Math.random() * 60;
            return (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: b.size,
                  height: b.size,
                  background: b.color,
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  animation: `fireworkSpoke 1.5s ease-out ${b.delay}s infinite`,
                  // @ts-expect-error custom property
                  "--angle": `${angle}rad`,
                  "--dist": `${dist}px`,
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

// --- Happy Birthday message ---
function HappyBirthday() {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
      <div className="text-center">
        <h1
          className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 drop-shadow-lg"
          style={{
            animation: "bounceIn 1s ease-out",
          }}
        >
          🎂 Happy Birthday! 🎂
        </h1>
        <p
          className="mt-4 text-xl md:text-2xl text-purple-600 font-semibold"
          style={{ animation: "fadeIn 1s ease-out 0.5s both" }}
        >
          Wishing you the most amazing day! ✨
        </p>
      </div>
    </div>
  );
}

// --- Main page ---
export default function Home() {
  const [balloons, setBalloons] = useState(() => generateBalloons(8));
  const [poppedCount, setPoppedCount] = useState(0);
  const [allGone, setAllGone] = useState(false);

  const handlePop = useCallback(
    (id: number) => {
      setPoppedCount((prev) => {
        const next = prev + 1;
        if (next >= balloons.length) {
          // Small extra delay so the last balloon finishes its "gone" transition
          setTimeout(() => setAllGone(true), 300);
        }
        return next;
      });
    },
    [balloons.length]
  );

  return (
    <main className="relative w-full min-h-screen overflow-hidden">
      {/* Background decorative shapes */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-10 left-10 w-64 h-64 bg-pink-300 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-300 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-blue-300 rounded-full blur-3xl" />
      </div>

      {/* Instructions */}
      {!allGone && (
        <p className="absolute top-4 left-1/2 -translate-x-1/2 text-lg font-medium text-purple-700 z-10 text-center px-4">
          Click each balloon to pop it! 🎈
        </p>
      )}

      {/* Balloons */}
      <div className="absolute inset-0">
        {balloons.map((b) => (
          <Balloon key={b.id} data={b} onPop={handlePop} />
        ))}
      </div>

      {/* Celebration */}
      {allGone && (
        <>
          <Fireworks />
          <HappyBirthday />
        </>
      )}

      {/* Keyframe animations injected as style tag (avoids Tailwind v3 config) */}
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
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(var(--dx), var(--dy)) scale(var(--scale));
          }
        }
        @keyframes fireworkBurst {
          0% { opacity: 0; transform: scale(0); }
          10% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1); }
        }
        @keyframes fireworkSpoke {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) rotate(var(--angle)) translateX(0);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) rotate(var(--angle)) translateX(var(--dist));
          }
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
      `}</style>
    </main>
  );
}
