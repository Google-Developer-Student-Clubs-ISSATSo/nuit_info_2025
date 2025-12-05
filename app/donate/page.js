"use client";

import { useState, useEffect, useRef } from "react";

// --- CONFIGURATION ---
const GRID_SIZE = 20;
const SPEED = 100;
const REVERSE_DURATION = 10;
const BLOCKER_ACTIVATE_MS = 300;
const BLOCKER_LIFETIME_MS = 4000;

// --- ASSETS & STYLES ---
const FACES = {
  normal: "😐",
  dead: "💀",
  troll: "🤪",
  scared: "😱",
  dizzy: "😵‍♫",
  cool: "😎",
};

// Food logos URLs (proprietary software)
const FOOD_LOGOS = {
  windows: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
  googlemeet: "https://upload.wikimedia.org/wikipedia/commons/9/9b/Google_Meet_icon_%282020%29.svg",
};

// Open source logos URLs
const OPENSOURCE_LOGOS = [
  {
    name: "Linux",

    
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Tux.svg/1200px-Tux.svg.png"
  },
  {
    name: "Firefox",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Firefox_logo%2C_2019.svg/1200px-Firefox_logo%2C_2019.svg.png"
  },
  
];

export default function TrollSnake() {
  // --- STATE ---
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ 
    x: 15, 
    y: 10, 
    type: "windows",
    dodgesLeft: 3,
    logoIdx: 0 
  });
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [face, setFace] = useState(FACES.normal);

  // Blocker state
  const [blocker, setBlocker] = useState(null);

  const [isReversed, setIsReversed] = useState(false);
  const [reverseTimer, setReverseTimer] = useState(0);
  const [screenShake, setScreenShake] = useState(false);
  const [uiMsg, setUiMsg] = useState("");

  // Conversion animation state: { x, y, logo, active }
  const [conversion, setConversion] = useState(null);

  // Refs
  const dirRef = useRef({ x: 1, y: 0 });
  const snakeRef = useRef([{ x: 10, y: 10 }]);
  const gameLoopRef = useRef(null);
  const inputLocked = useRef(false);

  const activationTimeoutRef = useRef(null);
  const lifetimeTimeoutRef = useRef(null);

  // --- HELPERS ---
  const getRandomPos = () => ({
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
  });

  const triggerShake = () => {
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 500);
  };

  const showMessage = (msg, duration = 1000) => {
    setUiMsg(msg);
    setTimeout(() => setUiMsg(""), duration);
  };

  // --- FOOD ---
  const spawnFood = () => {
    let newPos = getRandomPos();

    while (snakeRef.current.some(s => s.x === newPos.x && s.y === newPos.y)) {
      newPos = getRandomPos();
    }

    const rng = Math.random();
    let type = "windows";
    if (rng > 0.5) type = "googlemeet";
    if (rng > 0.8) type = "reverse";

    const logoIdx = Math.floor(Math.random() * OPENSOURCE_LOGOS.length);

    setFood({ 
      ...newPos, 
      type, 
      dodgesLeft: type === "moving" ? Math.floor(Math.random() * 3) + 1 : 0,
      logoIdx
    });
  };

  const clearBlockerTimeouts = () => {
    if (activationTimeoutRef.current) {
      clearTimeout(activationTimeoutRef.current);
      activationTimeoutRef.current = null;
    }
    if (lifetimeTimeoutRef.current) {
      clearTimeout(lifetimeTimeoutRef.current);
      lifetimeTimeoutRef.current = null;
    }
  };

  const resetGame = () => {
    clearBlockerTimeouts();
    setSnake([{ x: 10, y: 10 }]);
    snakeRef.current = [{ x: 10, y: 10 }];
    setDirection({ x: 1, y: 0 });
    dirRef.current = { x: 1, y: 0 };
    setGameOver(false);
    setScore(0);
    setFace(FACES.normal);
    setBlocker(null);
    setIsReversed(false);
    setReverseTimer(0);
    setConversion(null);
    spawnFood();
  };

  // --- TRAP 1: MOVING BAIT ---
  const handleMovingBait = (head, currentFood) => {
    const dist = Math.abs(head.x - currentFood.x) + Math.abs(head.y - currentFood.y);

    if (dist < 4 && currentFood.dodgesLeft > 0) {
      const rush = Math.random() < 0.1;

      let newX = currentFood.x;
      let newY = currentFood.y;

      if (rush) {
        newX -= Math.sign(newX - head.x);
        newY -= Math.sign(newY - head.y);
        setFace(FACES.scared);
        showMessage("WAIT NO!", 500);
      } else {
        const dodgeDir = Math.random() > 0.5 ? "x" : "y";
        if (dodgeDir === "x") newX = currentFood.x + (head.x < currentFood.x ? 1 : -1);
        else newY = currentFood.y + (head.y < currentFood.y ? 1 : -1);

        setFace(FACES.troll);
        showMessage("TOO SLOW!", 500);
      }

      newX = Math.max(0, Math.min(GRID_SIZE - 1, newX));
      newY = Math.max(0, Math.min(GRID_SIZE - 1, newY));

      setFood(prev => ({ ...prev, x: newX, y: newY, dodgesLeft: prev.dodgesLeft - 1 }));
      return true;
    }
    return false;
  };

  // --- TRAP 2: PATH BLOCKER ---
  const checkPathBlocker = (head) => {
    if (blocker) return false;

    const dx = food.x - head.x;
    const dy = food.y - head.y;
    const isAligned = (dx === 0 && dirRef.current.y !== 0) || (dy === 0 && dirRef.current.x !== 0);
    const dist = Math.abs(dx) + Math.abs(dy);

    if (isAligned && dist >= 3 && dist <= 9 && Math.random() > 0.55) {
      const spawnX = food.x;
      const spawnY = food.y;

      setBlocker({ x: spawnX, y: spawnY, active: false, dx: 0, dy: 0, spawnedAt: Date.now() });
      triggerShake();
      showMessage("⚠️ TRAP SPAWNED", 700);

      clearBlockerTimeouts();

      activationTimeoutRef.current = setTimeout(() => {
        const headNow = snakeRef.current[0];
        const dirX = Math.sign(headNow.x - spawnX);
        const dirY = Math.sign(headNow.y - spawnY);

        let dxStep = dirX;
        let dyStep = dirY;
        if (dxStep === 0 && dyStep === 0) {
          dxStep = dirRef.current.x;
          dyStep = dirRef.current.y;
        }

        setBlocker(prev => prev ? { ...prev, active: true, dx: dxStep, dy: dyStep } : null);
        activationTimeoutRef.current = null;

        lifetimeTimeoutRef.current = setTimeout(() => {
          setBlocker(null);
          lifetimeTimeoutRef.current = null;
        }, BLOCKER_LIFETIME_MS);
      }, BLOCKER_ACTIVATE_MS);

      return true;
    }

    return false;
  };

  // --- MAIN LOOP ---
  useEffect(() => {
    if (gameOver) return;

    gameLoopRef.current = setInterval(() => {
      const currentHead = snakeRef.current[0];

      if (food.type === "moving") {
        if (handleMovingBait(currentHead, food)) return;
      }

      checkPathBlocker(currentHead);

      if (blocker?.active) {
        const nextBx = blocker.x + (blocker.dx || 0);
        const nextBy = blocker.y + (blocker.dy || 0);

        if (nextBx < 0 || nextBx >= GRID_SIZE || nextBy < 0 || nextBy >= GRID_SIZE) {
          clearBlockerTimeouts();
          setBlocker(null);
        } else {
          setBlocker(prev => prev ? { ...prev, x: nextBx, y: nextBy } : null);

          if (nextBx === currentHead.x && nextBy === currentHead.y) {
            setGameOver(true);
            setFace(FACES.dizzy);
            showMessage("CRUSHED!", 1200);
            triggerShake();
            return;
          }

          if (snakeRef.current.some(s => s.x === nextBx && s.y === nextBy)) {
            setGameOver(true);
            setFace(FACES.dizzy);
            showMessage("BLOCKER SMASH!", 1200);
            triggerShake();
            return;
          }

          if (nextBx === food.x && nextBy === food.y) {
            spawnFood();
          }
        }
      }

      const newHead = {
        x: currentHead.x + dirRef.current.x,
        y: currentHead.y + dirRef.current.y,
      };

      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        setGameOver(true);
        setFace(FACES.dead);
        triggerShake();
        return;
      }

      if (blocker) {
        if (blocker.active && newHead.x === blocker.x && newHead.y === blocker.y) {
          setGameOver(true);
          setFace(FACES.dizzy);
          showMessage("BONK! BLOCKER", 1000);
          triggerShake();
          return;
        }
      }

      if (snakeRef.current.some(s => s.x === newHead.x && s.y === newHead.y)) {
        setGameOver(true);
        setFace(FACES.dead);
        triggerShake();
        return;
      }

      const newSnake = [newHead, ...snakeRef.current];

      // Eat food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 1);
        setFace(FACES.cool);

        // CONVERSION ANIMATION: Windows/Google Meet -> Open Source
        if (food.type === "windows" || food.type === "googlemeet") {
          const osLogo = OPENSOURCE_LOGOS[food.logoIdx];
          setConversion({ x: food.x, y: food.y, logo: osLogo, active: true });
          showMessage("SWITCHED TO OPEN SOURCE! 🚀", 2000);

          // Remove animation after 2 seconds
          setTimeout(() => {
            setConversion(null);
          }, 2000);
        }

        if (food.type === "reverse") {
          setIsReversed(true);
          setReverseTimer(REVERSE_DURATION);
          showMessage("BRAIN DAMAGE!", 2000);
          triggerShake();
        }

        spawnFood();
      } else {
        newSnake.pop();
      }

      snakeRef.current = newSnake;
      setSnake(newSnake);
      inputLocked.current = false;

      if (blocker && !blocker.active) {
        const distToBlocker = Math.abs(newHead.x - blocker.x) + Math.abs(newHead.y - blocker.y);
        if (distToBlocker > 8) {
          clearBlockerTimeouts();
          setBlocker(null);
        }
      }
    }, SPEED);

    return () => {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    };
  }, [gameOver, food, blocker]);

  // --- REVERSE TIMER ---
  useEffect(() => {
    if (reverseTimer > 0 && !gameOver) {
      const timer = setInterval(() => {
        setReverseTimer(prev => {
          if (prev <= 1) {
            setIsReversed(false);
            showMessage("CONTROLS RESTORED");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [reverseTimer, gameOver]);

  // --- INPUTS ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver || inputLocked.current) return;

      const keyMap = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
        w: { x: 0, y: -1 },
        s: { x: 0, y: 1 },
        a: { x: -1, y: 0 },
        d: { x: 1, y: 0 },
      };

      const move = keyMap[e.key];
      if (!move) return;

      let finalMove = move;

      if (isReversed) {
        finalMove = { x: -move.x, y: -move.y };
      }

      if (finalMove.x !== -dirRef.current.x || finalMove.y !== -dirRef.current.y) {
        dirRef.current = finalMove;
        setDirection(finalMove);
        inputLocked.current = true;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameOver, isReversed]);

  useEffect(() => {
    return () => {
      clearBlockerTimeouts();
    };
  }, []);

  // --- RENDER ---
  return (
    <div className={`h-full  text-white font-mono flex flex-col items-center justify-center p-12 overflow-hidden ${isReversed ? "hue-rotate-90 blur-[1px]" : ""}`}>

      <style jsx global>{`
        @keyframes shake {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          100% { transform: translate(-1px, -2px) rotate(-1deg); }
        }
        .shake-screen { animation: shake 0.5s; }
        .pop-in { animation: pop 0.2s ease-out; }
        @keyframes pop { from { transform: scale(0.85); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        
        @keyframes conversion {
          0% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: scale(1.3) rotate(180deg);
            opacity: 1;
          }
          100% {
            transform: scale(0) rotate(360deg);
            opacity: 0;
          }
        }
        .conversion-animation {
          animation: conversion 2s ease-out forwards;
        }
      `}</style>

      <div className="mb-4 flex gap-8 text-2xl font-black uppercase tracking-widest text-yellow-400">
        <div>Score: {score}</div>
        {isReversed && <div className="text-red-500 animate-pulse">REVERSED: {reverseTimer}s</div>}
      </div>

      <div className={`relative bg-neutral-800 border-4 border-neutral-600 rounded-lg shadow-2xl ${screenShake ? "shake-screen" : ""}`}
        style={{ width: GRID_SIZE * 20, height: GRID_SIZE * 20 }}>

        {/* snake */}
        {snake.map((segment, i) => (
          <div
            key={`${segment.x}-${segment.y}-${i}`}
            className={`absolute w-5 h-5 flex items-center justify-center text-sm ${i === 0 ? "z-20 scale-125" : "z-10"} transition-all duration-100`}
            style={{
              left: segment.x * 20,
              top: segment.y * 20,
              backgroundColor: i === 0 ? "#FACC15" : "#4ADE80",
              borderRadius: i === 0 ? "4px" : "2px",
            }}
          >
            {i === 0 && <span className="transform -rotate-90">😐</span>}
          </div>
        ))}

        {/* food */}
        <div
          className="absolute w-5 h-5 flex items-center justify-center transition-all duration-200 z-10"
          style={{ left: food.x * 20, top: food.y * 20 }}
        >
          {(food.type === "windows" || food.type === "googlemeet") && (
            <img 
              src={FOOD_LOGOS[food.type]} 
              alt={food.type}
              style={{ width: "20px", height: "20px", objectFit: "contain" }}
            />
          )}
          {food.type === "reverse" && "🍄"}
        </div>

        {/* conversion animation (Proprietary -> Open Source) */}
        {conversion?.active && (
          <div
            className="absolute w-5 h-5 flex items-center justify-center conversion-animation z-40"
            style={{
              left: conversion.x * 20,
              top: conversion.y * 20,
            }}
          >
            <img 
              src={conversion.logo.url} 
              alt={conversion.logo.name}
              style={{ width: "20px", height: "20px", objectFit: "contain" }}
            />
          </div>
        )}

        {/* blocker */}
        {blocker && (
          <div
            className={`absolute w-5 h-5 flex items-center justify-center text-sm pop-in z-30`}
            style={{
              left: blocker.x * 20,
              top: blocker.y * 20,
            }}
          >
            <div style={{
              width: 20,
              height: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 3,
              border: "1px solid rgba(255,255,255,0.6)",
              backgroundColor: blocker.active ? "rgb(220,38,38)" : "rgb(234,179,8)",
              opacity: blocker.active ? 1 : 0.95,
            }}>
              {blocker.active ? "🛑" : "⚠️"}
            </div>
          </div>
        )}

        {/* UI message */}
        {uiMsg && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
            <h1 className="text-4xl font-black text-white stroke-black drop-shadow-lg transform -rotate-12 bg-black/50 p-2 rounded">
              {uiMsg}
            </h1>
          </div>
        )}

      </div>

      {gameOver && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
          <h1 className="text-6xl font-black text-red-500 mb-4 animate-pulse">WASTED</h1>
          <p className="text-xl text-white mb-8">Score: {score}</p>
          <div className="flex gap-4">
            <button onClick={resetGame} className="bg-green-500 hover:bg-green-600 text-black font-bold py-3 px-8 rounded-full">
              RETRY 🔄
            </button>
          </div>
        </div>
      )}
    </div>
  );
}