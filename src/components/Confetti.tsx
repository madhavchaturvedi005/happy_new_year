import { useEffect, useState } from "react";

interface ConfettiPiece {
  id: number;
  left: string;
  color: string;
  size: number;
  delay: number;
  duration: number;
}

const Confetti = () => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  const colors = [
    "hsl(45 93% 58%)",
    "hsl(35 100% 70%)",
    "hsl(15 80% 70%)",
    "hsl(45 100% 85%)",
    "hsl(0 0% 100%)",
  ];

  useEffect(() => {
    const newPieces = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      delay: Math.random() * 10,
      duration: Math.random() * 5 + 8,
    }));
    setPieces(newPieces);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti"
          style={{
            left: piece.left,
            top: "-20px",
            width: piece.size,
            height: piece.size * 1.5,
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            borderRadius: "2px",
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
