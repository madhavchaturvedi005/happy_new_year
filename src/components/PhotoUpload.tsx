import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Upload, X, Camera } from "lucide-react";

interface PhotoUploadProps {
  onPhotoSelect: (file: File) => void;
  selectedPhoto: File | null;
  onRemove: () => void;
}

const PhotoUpload = ({ onPhotoSelect, selectedPhoto, onRemove }: PhotoUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Image must be less than 5MB");
        return;
      }
      onPhotoSelect(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {!preview ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex flex-col items-center justify-center gap-3 p-6 border-2 border-dashed border-border rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-all duration-300 cursor-pointer group"
        >
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
            <Camera className="w-8 h-8 text-primary" />
          </div>
          <div className="text-center">
            <p className="text-foreground font-medium">Add Your Photo</p>
            <p className="text-sm text-muted-foreground mt-1">
              Upload a photo to get a personalized New Year card
            </p>
          </div>
        </button>
      ) : (
        <div className="relative">
          <div className="relative w-full aspect-square max-w-[200px] mx-auto rounded-xl overflow-hidden border-2 border-primary">
            <img
              src={preview}
              alt="Selected photo"
              className="w-full h-full object-cover"
            />
            {/* Preview overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
            <div className="absolute top-2 left-0 right-0 text-center">
              <p className="text-xs font-bold text-white/80">Happy New Year</p>
            </div>
            <div className="absolute bottom-2 left-0 right-0 text-center">
              <p className="text-2xl font-display font-bold text-primary">2026</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 w-8 h-8 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <p className="text-center text-sm text-muted-foreground mt-2">
            Your photo will have a festive overlay!
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default PhotoUpload;
