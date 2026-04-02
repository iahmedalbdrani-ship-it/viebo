"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { createStory } from "@/lib/firestore";
import { getFilterCSSString, filterPresets } from "@/lib/effects";
import toast from "react-hot-toast";
import { HiXMark, HiArrowLeft } from "react-icons/hi2";
import type { FilterPreset } from "@/lib/effects";

interface StoryCreationProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function StoryCreation({
  isOpen,
  onClose,
  onSuccess,
}: StoryCreationProps) {
  const { user } = useAuthStore();
  const [step, setStep] = useState<"capture" | "filter" | "preview">("capture");
  const [mediaPreview, setMediaPreview] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<FilterPreset>("none");
  const [isLoading, setIsLoading] = useState(false);
  const [caption, setCaption] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setMediaPreview(event.target?.result as string);
      setStep("filter");
    };
    reader.readAsDataURL(file);
  };

  const handleCreateStory = async () => {
    if (!mediaPreview) {
      toast.error("Please select an image or video");
      return;
    }

    setIsLoading(true);
    try {
      await createStory({
        userId: user.userId,
        mediaUrl: mediaPreview,
        caption,
        views: [],
        viewCount: 0,
        reactions: {},
        isHighlight: false,
      });

      toast.success("Story posted!");
      setMediaPreview("");
      setCaption("");
      setSelectedFilter("none");
      setStep("capture");
      onClose();
      onSuccess?.();
    } catch (error) {
      console.error("Error creating story:", error);
      toast.error("Failed to create story");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredImageStyle = {
    filter: getFilterCSSString(filterPresets[selectedFilter].effects),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="glass glass-dark rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="sticky top-0 glass glass-dark border-b border-white/10 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-text-primary">
                  {step === "capture" && "Create Story"}
                  {step === "filter" && "Add Effects"}
                  {step === "preview" && "Preview"}
                </h2>
                {step !== "capture" && (
                  <button
                    onClick={() => setStep("capture")}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <HiArrowLeft className="w-6 h-6 text-text-secondary" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <HiXMark className="w-6 h-6 text-text-secondary" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {step === "capture" && (
                  <div className="space-y-4">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full p-6 border-2 border-dashed border-primary/50 rounded-xl hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center gap-2"
                    >
                      <svg
                        className="w-12 h-12 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      <span className="text-text-primary font-semibold">
                        Choose Image or Video
                      </span>
                      <span className="text-sm text-text-secondary">
                        Max 60 seconds
                      </span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleMediaSelect}
                      className="hidden"
                    />
                  </div>
                )}

                {step === "filter" && mediaPreview && (
                  <div className="space-y-4">
                    {/* Preview */}
                    <div className="relative rounded-xl overflow-hidden aspect-square bg-dark">
                      <Image
                        src={mediaPreview}
                        alt="Story preview"
                        fill
                        className="object-cover"
                        style={filteredImageStyle}
                      />
                    </div>

                    {/* Filter Grid */}
                    <div className="space-y-2">
                      <p className="text-sm text-text-secondary font-medium">
                        Effects
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {(Object.keys(filterPresets) as FilterPreset[]).map(
                          (preset) => (
                            <button
                              key={preset}
                              onClick={() => setSelectedFilter(preset)}
                              className={`p-3 rounded-lg border-2 transition-all text-center ${
                                selectedFilter === preset
                                  ? "border-primary bg-primary/10"
                                  : "border-white/10 bg-surface/50 hover:border-white/20"
                              }`}
                            >
                              <div className="text-2xl mb-1">
                                {filterPresets[preset].emoji}
                              </div>
                              <div className="text-xs text-text-primary">
                                {filterPresets[preset].label}
                              </div>
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    {/* Caption */}
                    <div className="space-y-2">
                      <label className="text-sm text-text-secondary font-medium">
                        Caption (Optional)
                      </label>
                      <input
                        type="text"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder="Add a caption..."
                        maxLength={150}
                        className="w-full bg-surface/50 border border-white/10 rounded-lg p-3 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  </div>
                )}

                {step === "preview" && mediaPreview && (
                  <div className="space-y-4">
                    <div className="rounded-xl overflow-hidden aspect-square bg-dark">
                      <Image
                        src={mediaPreview}
                        alt="Story"
                        width={400}
                        height={400}
                        className="w-full h-full object-cover"
                        style={filteredImageStyle}
                      />
                    </div>
                    {caption && (
                      <p className="text-text-primary text-sm">{caption}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 glass glass-dark border-t border-white/10 px-6 py-4 flex gap-3 justify-end">
                {step === "capture" && (
                  <button
                    onClick={onClose}
                    className="px-6 py-2 rounded-lg bg-surface/50 hover:bg-surface border border-white/10 text-text-primary transition-colors"
                  >
                    Cancel
                  </button>
                )}

                {step === "filter" && (
                  <button
                    onClick={() => setStep("preview")}
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/50 text-white font-semibold transition-all"
                  >
                    Next
                  </button>
                )}

                {step === "preview" && (
                  <>
                    <button
                      onClick={() => setStep("filter")}
                      className="px-6 py-2 rounded-lg bg-surface/50 hover:bg-surface border border-white/10 text-text-primary transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleCreateStory}
                      disabled={isLoading}
                      className="px-6 py-2 rounded-lg bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/50 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all"
                    >
                      {isLoading ? "Posting..." : "Share Story"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
