import { motion } from "framer-motion";

interface WishCardProps {
  name: string;
  nameMeaning: string;
  personalizedWish: string;
  photoUrl: string | null;
  onReset: () => void;
}

const WishCard = ({ name, nameMeaning, personalizedWish, photoUrl, onReset }: WishCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="text-center space-y-6"
    >
      {/* Card Container */}
      <div
        style={{
          background: "linear-gradient(180deg, #0a0f1a 0%, #0f1525 50%, #0a0f1a 100%)",
          borderRadius: "16px",
          padding: "48px 32px",
          border: "2px solid rgba(212, 168, 83, 0.3)",
          boxShadow: "0 0 60px rgba(212, 168, 83, 0.2)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative corners */}
        <div style={{ position: "absolute", top: "16px", left: "16px", width: "48px", height: "48px", borderLeft: "2px solid rgba(212, 168, 83, 0.6)", borderTop: "2px solid rgba(212, 168, 83, 0.6)" }} />
        <div style={{ position: "absolute", top: "16px", right: "16px", width: "48px", height: "48px", borderRight: "2px solid rgba(212, 168, 83, 0.6)", borderTop: "2px solid rgba(212, 168, 83, 0.6)" }} />
        <div style={{ position: "absolute", bottom: "16px", left: "16px", width: "48px", height: "48px", borderLeft: "2px solid rgba(212, 168, 83, 0.6)", borderBottom: "2px solid rgba(212, 168, 83, 0.6)" }} />
        <div style={{ position: "absolute", bottom: "16px", right: "16px", width: "48px", height: "48px", borderRight: "2px solid rgba(212, 168, 83, 0.6)", borderBottom: "2px solid rgba(212, 168, 83, 0.6)" }} />

        {/* Sparkle decorations */}
        <div style={{ position: "absolute", top: "32px", left: "25%", width: "8px", height: "8px", backgroundColor: "#d4a853", borderRadius: "50%", opacity: 0.6 }} />
        <div style={{ position: "absolute", top: "48px", right: "25%", width: "6px", height: "6px", backgroundColor: "#d4a853", borderRadius: "50%", opacity: 0.4 }} />
        <div style={{ position: "absolute", bottom: "80px", left: "20%", width: "6px", height: "6px", backgroundColor: "#d4a853", borderRadius: "50%", opacity: 0.5 }} />
        <div style={{ position: "absolute", bottom: "64px", right: "20%", width: "8px", height: "8px", backgroundColor: "#d4a853", borderRadius: "50%", opacity: 0.6 }} />

        <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", gap: "24px", alignItems: "center" }}>
          {/* Header */}
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "18px", color: "rgba(212, 168, 83, 0.7)", marginBottom: "8px", fontFamily: "'Inter', sans-serif" }}>Dear</p>
            <h1 style={{ 
              fontSize: "48px", 
              fontWeight: "bold", 
              fontFamily: "'Playfair Display', serif",
              background: "linear-gradient(135deg, #d4a853, #f0d78c)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "0 0 30px rgba(212, 168, 83, 0.5)"
            }}>
              {name}
            </h1>
          </div>

          {/* Photo */}
          {photoUrl && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ 
                width: "200px", 
                height: "200px", 
                borderRadius: "12px", 
                overflow: "hidden", 
                border: "4px solid rgba(212, 168, 83, 0.5)",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)"
              }}>
                <img
                  src={photoUrl}
                  alt={`${name}'s photo`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  crossOrigin="anonymous"
                />
              </div>
            </div>
          )}

          {/* Main greeting */}
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "28px", fontFamily: "'Playfair Display', serif", color: "#fffaeb" }}>
              Happy New Year
            </p>
            <p style={{ 
              fontSize: "64px", 
              fontWeight: "bold", 
              fontFamily: "'Playfair Display', serif",
              background: "linear-gradient(135deg, #d4a853, #f0d78c)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "0 0 30px rgba(212, 168, 83, 0.5)"
            }}>
              2026
            </p>
          </div>

          {/* Decorative line */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px" }}>
            <div style={{ height: "1px", width: "64px", background: "linear-gradient(to right, transparent, rgba(212, 168, 83, 0.6))" }} />
            <span style={{ color: "#d4a853", fontSize: "24px" }}>✨</span>
            <div style={{ height: "1px", width: "64px", background: "linear-gradient(to left, transparent, rgba(212, 168, 83, 0.6))" }} />
          </div>

          {/* Name Meaning */}
          <div style={{ 
            backgroundColor: "rgba(30, 40, 60, 0.5)", 
            borderRadius: "12px", 
            padding: "20px 24px", 
            border: "1px solid rgba(212, 168, 83, 0.2)",
            width: "100%",
            maxWidth: "500px"
          }}>
            <h3 style={{ fontSize: "12px", fontFamily: "'Inter', sans-serif", color: "#d4a853", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "2px" }}>
              Your Name Means
            </h3>
            <p style={{ color: "rgba(212, 168, 83, 0.8)", fontSize: "16px", lineHeight: 1.6, fontFamily: "'Inter', sans-serif" }}>
              {nameMeaning}
            </p>
          </div>

          {/* Personalized Wish */}
          <div style={{ padding: "0 8px", maxWidth: "500px" }}>
            <p style={{ fontSize: "18px", color: "#fffaeb", lineHeight: 1.7, fontStyle: "italic", fontFamily: "'Inter', sans-serif" }}>
              "{personalizedWish}"
            </p>
          </div>

          {/* Signature */}
          <div style={{ paddingTop: "16px", textAlign: "center" }}>
            <p style={{ fontSize: "18px", color: "#d4a853", fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}>
              With warm wishes,
            </p>
            <p style={{ 
              fontSize: "28px", 
              fontWeight: "bold", 
              fontFamily: "'Playfair Display', serif",
              background: "linear-gradient(135deg, #d4a853, #f0d78c)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginTop: "4px"
            }}>
              Madhav
            </p>
          </div>
        </div>
      </div>

      {/* Create Another button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center pt-4"
      >
        <button
          onClick={onReset}
          className="px-6 py-3 bg-secondary text-foreground rounded-lg hover:bg-muted transition-colors duration-300 font-sans"
        >
          Create Another
        </button>
      </motion.div>
    </motion.div>
  );
};

export default WishCard;
