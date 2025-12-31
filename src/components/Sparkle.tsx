import { useEffect, useState } from "react";

interface SparkleProps {
  count?: number;
}

interface SparkleItem {
  id: number;
  left: string;
  top: string;
  size: number;
  delay: number;
  duration: number;
}

const Sparkle = ({ count = 50 }: SparkleProps) => {
  const [sparkles, setSparkles] = useState<SparkleItem[]>([]);

  useEffect(() => {
    const newSparkles = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
    }));
    setSparkles(newSparkles);
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute rounded-full bg-primary animate-sparkle"
          style={{
            left: sparkle.left,
            top: sparkle.top,
            width: sparkle.size,
            height: sparkle.size,
            animationDelay: `${sparkle.delay}s`,
            animationDuration: `${sparkle.duration}s`,
            boxShadow: `0 0 ${sparkle.size * 2}px hsl(var(--primary))`,
          }}
        />
      ))}
    </div>
  );
};

export default Sparkle;
