"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { getHeroSliders, deleteHeroSlider } from "@/services/heroSlider.services";
import CreateSliderModal from "./_components/CreateSliderModal";

export default function HeroSlidersPage() {
  const [sliders, setSliders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSliders = async () => {
    setIsLoading(true);
    try {
      const res = await getHeroSliders();
      setSliders(res || []);
    } catch (error) {
      toast.error("Failed to load sliders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slider?")) return;
    
    try {
      await deleteHeroSlider(id);
      toast.success("Slider deleted successfully");
      fetchSliders();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete slider");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold">Hero Sliders</h3>
          <p className="text-muted-foreground">
            Manage the image sliders displayed on the homepage.
          </p>
        </div>
        <CreateSliderModal onSuccess={fetchSliders} />
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : sliders.length === 0 ? (
        <div className="flex h-64 items-center justify-center border border-dashed rounded-xl">
          <p className="text-muted-foreground">No sliders found. Add one to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sliders.map((slider) => (
            <div key={slider.id} className="relative group rounded-xl overflow-hidden border shadow-sm">
              <img 
                src={slider.image} 
                alt="Slider" 
                className="w-full h-48 object-cover transition-transform group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button 
                  variant="destructive" 
                  size="icon" 
                  onClick={() => handleDelete(slider.id)}
                  className="rounded-full"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
