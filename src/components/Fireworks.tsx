import { useEffect, useState } from "react";

interface Firework {
  id: number;
  x: number;
  y: number;
  color: string;
  particles: Particle[];
}

interface Particle {
  id: number;
  angle: number;
  velocity: number;
  color: string;
  size: number;
}

const colors = [
  "#d4a853", // gold
  "#f0d78c", // light gold
  "#ff6b6b", // red
  "#4ecdc4", // teal
  "#a855f7", // purple
  "#f97316", // orange
  "#22c55e", // green
];

const Fireworks = () => {
  const [fireworks, setFireworks] = useState<Firework[]>([]);

  useEffect(() => {
    const createFirework = () => {
      const id = Date.now() + Math.random();
      const x = 10 + Math.random() * 80; // 10-90% of screen width
      const y = 10 + Math.random() * 40; // 10-50% of screen height
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      const particles: Particle[] = [];
      const particleCount = 12 + Math.floor(Math.random() * 8);
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          id: i,
          angle: (360 / particleCount) * i,
          velocity: 50 + Math.random() * 50,
          color: Math.random() > 0.3 ? color : colors[Math.floor(Math.random() * colors.length)],
          size: 2 + Math.random() * 3,
        });
      }

      setFireworks((prev) => [...prev, { id, x, y, color, particles }]);

      // Remove firework after animation
      setTimeout(() => {
        setFireworks((prev) => prev.filter((f) => f.id !== id));
      }, 1500);
    };

    // Create initial fireworks
    for (let i = 0; i < 3; i++) {
      setTimeout(createFirework, i * 400);
    }

    // Create new fireworks periodically
    const interval = setInterval(() => {
      if (Math.random() > 0.3) {
        createFirework();
      }
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-20">
      {fireworks.map((firework) => (
        <div
          key={firework.id}
          className="absolute"
          style={{
            left: `${firework.x}%`,
            top: `${firework.y}%`,
          }}
        >
          {/* Center burst */}
          <div
            className="absolute w-2 h-2 rounded-full animate-ping"
            style={{
              backgroundColor: firework.color,
              boxShadow: `0 0 20px ${firework.color}`,
              transform: "translate(-50%, -50%)",
            }}
          />
          
          {/* Particles */}
          {firework.particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color,
                boxShadow: `0 0 6px ${particle.color}`,
                transform: "translate(-50%, -50%)",
                animation: `firework-particle 1.2s ease-out forwards`,
                ["--angle" as string]: `${particle.angle}deg`,
                ["--velocity" as string]: `${particle.velocity}px`,
              }}
            />
          ))}
        </div>
      ))}
      
      <style>{`
        @keyframes firework-particle {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) rotate(var(--angle)) translateY(0);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) rotate(var(--angle)) translateY(calc(var(--velocity) * -1));
          }
        }
      `}</style>
    </div>
  );
};

export default Fireworks;
