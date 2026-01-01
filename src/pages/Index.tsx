import { useState } from "react";
import Sparkle from "@/components/Sparkle";
import Confetti from "@/components/Confetti";
import Fireworks from "@/components/Fireworks";
import NameInput from "@/components/NameInput";
import WishCard from "@/components/WishCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
interface WishData {
  name: string;
  nameMeaning: string;
  personalizedWish: string;
  photoUrl: string | null;
}

const createPhotoWithOverlay = (file: File, name: string): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      // Set canvas size (square for better social sharing)
      const size = Math.max(img.width, img.height);
      canvas.width = size;
      canvas.height = size;

      // Fill background
      ctx.fillStyle = "#0a0f1a";
      ctx.fillRect(0, 0, size, size);

      // Draw image centered
      const x = (size - img.width) / 2;
      const y = (size - img.height) / 2;
      ctx.drawImage(img, x, y);

      // Add gradient overlay at top
      const topGradient = ctx.createLinearGradient(0, 0, 0, size * 0.25);
      topGradient.addColorStop(0, "rgba(0, 0, 0, 0.7)");
      topGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = topGradient;
      ctx.fillRect(0, 0, size, size * 0.25);

      // Add gradient overlay at bottom
      const bottomGradient = ctx.createLinearGradient(0, size * 0.65, 0, size);
      bottomGradient.addColorStop(0, "rgba(0, 0, 0, 0)");
      bottomGradient.addColorStop(1, "rgba(0, 0, 0, 0.8)");
      ctx.fillStyle = bottomGradient;
      ctx.fillRect(0, size * 0.65, size, size * 0.35);

      // Add decorative border
      ctx.strokeStyle = "#d4a853";
      ctx.lineWidth = size * 0.02;
      ctx.strokeRect(size * 0.03, size * 0.03, size * 0.94, size * 0.94);

      // Add inner border
      ctx.strokeStyle = "rgba(212, 168, 83, 0.5)";
      ctx.lineWidth = size * 0.005;
      ctx.strokeRect(size * 0.05, size * 0.05, size * 0.9, size * 0.9);

      // Top text - "Happy New Year"
      ctx.fillStyle = "#ffffff";
      ctx.font = `bold ${size * 0.05}px 'Playfair Display', serif`;
      ctx.textAlign = "center";
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 10;
      ctx.fillText("Happy New Year", size / 2, size * 0.1);

      // Year text - "2026"
      const yearGradient = ctx.createLinearGradient(0, size * 0.12, 0, size * 0.22);
      yearGradient.addColorStop(0, "#d4a853");
      yearGradient.addColorStop(1, "#f0d78c");
      ctx.fillStyle = yearGradient;
      ctx.font = `bold ${size * 0.12}px 'Playfair Display', serif`;
      ctx.fillText("2026", size / 2, size * 0.22);

      // Sparkle decorations
      ctx.fillStyle = "#d4a853";
      const sparklePositions = [
        { x: size * 0.15, y: size * 0.08 },
        { x: size * 0.85, y: size * 0.08 },
        { x: size * 0.1, y: size * 0.18 },
        { x: size * 0.9, y: size * 0.18 },
      ];
      sparklePositions.forEach((pos) => {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, size * 0.008, 0, Math.PI * 2);
        ctx.fill();
      });

      // Bottom text - Name
      ctx.fillStyle = "#ffffff";
      ctx.font = `bold ${size * 0.045}px 'Playfair Display', serif`;
      ctx.shadowBlur = 10;
      ctx.fillText(`Dear ${name}`, size / 2, size * 0.88);

      // From text
      ctx.fillStyle = "#d4a853";
      ctx.font = `italic ${size * 0.03}px 'Inter', sans-serif`;
      ctx.fillText("With warm wishes from Abhilasha", size / 2, size * 0.94);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to create image blob"));
          }
        },
        "image/png",
        1.0
      );
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
};

const Index = () => {
  const [wishData, setWishData] = useState<WishData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleNameSubmit = async (name: string, photo: File | null) => {
    setIsLoading(true);
    let photoUrl: string | null = null;

    try {
      // Upload photo if provided
      if (photo) {
        try {
          const overlayBlob = await createPhotoWithOverlay(photo, name);
          const fileName = `${Date.now()}-${name.toLowerCase().replace(/\s+/g, "-")}.png`;
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("visitor-photos")
            .upload(fileName, overlayBlob, {
              contentType: "image/png",
            });

          if (uploadError) {
            console.error("Upload error:", uploadError);
          } else {
            const { data: urlData } = supabase.storage
              .from("visitor-photos")
              .getPublicUrl(uploadData.path);
            photoUrl = urlData.publicUrl;
          }
        } catch (photoError) {
          console.error("Photo processing error:", photoError);
        }
      }

      // Generate wish
      const { data, error } = await supabase.functions.invoke("generate-wish", {
        body: { name, photoUrl },
      });

      if (error) {
        console.error("Function error:", error);
        throw new Error(error.message || "Failed to generate wish");
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setWishData({
        name: data.name,
        nameMeaning: data.name_meaning,
        personalizedWish: data.personalized_wish,
        photoUrl: photoUrl,
      });
    } catch (error) {
      console.error("Error generating wish:", error);
      toast({
        title: "Oops!",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setWishData(null);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, hsl(222 47% 12%) 0%, hsl(222 47% 6%) 70%)",
        }}
      />
      
      {/* Decorative elements */}
      <Sparkle count={60} />
      {wishData && <Confetti />}
      {wishData && <Fireworks />}

      {/* Main content */}
      <main className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-3xl">
          {!wishData ? (
            <NameInput onSubmit={handleNameSubmit} isLoading={isLoading} />
          ) : (
            <WishCard 
              name={wishData.name}
              nameMeaning={wishData.nameMeaning}
              personalizedWish={wishData.personalizedWish}
              photoUrl={wishData.photoUrl}
              onReset={handleReset} 
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-4 left-0 right-0 text-center text-sm text-muted-foreground z-10">
        <p>Made with love by Abhilasha • New Year 2026</p>
      </footer>
    </div>
  );
};

export default Index;
