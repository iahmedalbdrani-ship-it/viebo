"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  HiCamera,
  HiArrowPath,
  HiBolt,
  HiPhoto,
  HiXMark,
  HiSparkles,
} from "react-icons/hi2";

export default function CameraPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1080 }, height: { ideal: 1920 } },
        audio: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
      }
    } catch {
      console.error("Camera access denied");
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setCameraActive(false);
    }
  }, []);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      setCapturedImage(canvas.toDataURL("image/jpeg", 0.9));
    }
  };

  const switchCamera = () => {
    stopCamera();
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  const discardCapture = () => {
    setCapturedImage(null);
  };

  return (
    <div className="fixed inset-0 bg-black z-30">
      {/* Camera View or Captured Image */}
      {capturedImage ? (
        <div className="relative w-full h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-6 left-6 right-6 flex justify-between">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={discardCapture}
              className="w-10 h-10 rounded-full glass flex items-center justify-center"
            >
              <HiXMark className="w-6 h-6 text-white" />
            </motion.button>
          </div>
          <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-full bg-primary text-white font-medium"
            >
              Post to Feed
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-full glass text-white font-medium"
            >
              Add to Story
            </motion.button>
          </div>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />

          {!cameraActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-dark">
              <div className="w-24 h-24 rounded-full bg-surface flex items-center justify-center mb-6">
                <HiCamera className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-text-primary text-xl font-semibold mb-2">
                Camera Access
              </h2>
              <p className="text-text-secondary text-sm mb-6 text-center px-8">
                Allow Vibeo to access your camera to take photos and videos
              </p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={startCamera}
                className="px-8 py-3 rounded-full bg-primary text-white font-medium"
              >
                Enable Camera
              </motion.button>
            </div>
          )}

          {/* Top Controls */}
          {cameraActive && (
            <div className="absolute top-6 left-6 right-6 flex justify-between">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setFlashOn(!flashOn)}
                className={`w-10 h-10 rounded-full glass flex items-center justify-center ${
                  flashOn ? "text-yellow-400" : "text-white"
                }`}
              >
                <HiBolt className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full glass flex items-center justify-center text-white"
              >
                <HiSparkles className="w-5 h-5" />
              </motion.button>
            </div>
          )}

          {/* Bottom Controls */}
          {cameraActive && (
            <div className="absolute bottom-10 left-0 right-0 flex items-center justify-center gap-8">
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 rounded-xl glass flex items-center justify-center"
              >
                <HiPhoto className="w-6 h-6 text-white" />
              </motion.button>

              {/* Capture Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={capturePhoto}
                onPointerDown={() => setIsRecording(true)}
                onPointerUp={() => setIsRecording(false)}
                className={`w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-all ${
                  isRecording ? "bg-accent scale-110" : "bg-transparent"
                }`}
              >
                <div className={`rounded-full bg-white transition-all ${
                  isRecording ? "w-8 h-8 rounded-md bg-accent" : "w-16 h-16"
                }`} />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={switchCamera}
                className="w-12 h-12 rounded-xl glass flex items-center justify-center"
              >
                <HiArrowPath className="w-6 h-6 text-white" />
              </motion.button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
