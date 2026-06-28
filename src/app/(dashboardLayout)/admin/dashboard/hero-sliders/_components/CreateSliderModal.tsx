"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2, Plus } from "lucide-react";
import { createHeroSlider } from "@/services/heroSlider.services";

export default function CreateSliderModal({ onSuccess }: { onSuccess: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select an image first");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      await createHeroSlider(formData);
      toast.success("Slider added successfully");
      setIsOpen(false);
      setFile(null);
      setPreview(null);
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to upload slider");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Slider
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload New Slider Image</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Input id="picture" type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          
          {preview && (
            <div className="mt-4 rounded-xl overflow-hidden border">
              <img src={preview} alt="Preview" className="w-full h-auto object-cover max-h-64" />
            </div>
          )}

          <Button 
            className="w-full mt-4" 
            onClick={handleUpload} 
            disabled={!file || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload Slider"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
