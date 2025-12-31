import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import PhotoUpload from "./PhotoUpload";

interface NameInputProps {
  onSubmit: (name: string, photo: File | null) => void;
  isLoading?: boolean;
}

const NameInput = ({ onSubmit, isLoading = false }: NameInputProps) => {
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && !isLoading) {
      onSubmit(name.trim(), photo);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="text-center space-y-8"
    >
      <div className="space-y-4">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-gradient glow">
          Happy New Year
        </h1>
        <p className="text-8xl md:text-9xl font-display font-bold text-foreground animate-float">
          2026
        </p>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-lg md:text-xl text-muted-foreground max-w-md mx-auto"
      >
        Enter your name and add your photo to receive personalized wishes with your name's special meaning from Madhav
      </motion.p>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        onSubmit={handleSubmit}
        className="space-y-6 max-w-md mx-auto"
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name..."
            disabled={isLoading}
            className="w-full sm:flex-1 px-6 py-4 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 text-lg disabled:opacity-50"
            maxLength={50}
          />
        </div>

        <PhotoUpload
          selectedPhoto={photo}
          onPhotoSelect={setPhoto}
          onRemove={() => setPhoto(null)}
        />

        <motion.button
          type="submit"
          disabled={isLoading || !name.trim()}
          whileHover={{ scale: isLoading ? 1 : 1.05 }}
          whileTap={{ scale: isLoading ? 1 : 0.95 }}
          className="w-full px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl animate-pulse-glow transition-all duration-300 hover:brightness-110 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating Your Wishes...
            </>
          ) : (
            <>Get Wishes ✨</>
          )}
        </motion.button>
      </motion.form>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-sm text-muted-foreground"
      >
        From Madhav with ❤️
      </motion.p>
    </motion.div>
  );
};

export default NameInput;
