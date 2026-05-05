"use client";

import { useEffect, useState, useRef } from "react";
import { supplyMono, supplySans } from "./fonts";

const ASSETS = [
  { key: "first_video", url: "/first.mp4" },
  { key: "loop_video", url: "/gif.mp4" },
  { key: "first_audio", url: "/first audio.m4a" },
  { key: "loop_audio", url: "/2 audio.m4a" },
];

export default function Page() {
  const [progress, setProgress] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isAssetsLoaded, setIsAssetsLoaded] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isIntroEnded, setIsIntroEnded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [assetUrls, setAssetUrls] = useState<Record<string, string>>({});

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioIntroRef = useRef<HTMLAudioElement>(null);
  const audioLoopRef = useRef<HTMLAudioElement>(null);

  // Smooth Progress Logic
  useEffect(() => {
    if (displayProgress < progress) {
      const timer = setTimeout(() => {
        setDisplayProgress(prev => Math.min(prev + 1, progress));
      }, 30); // Speed of the increment
      return () => clearTimeout(timer);
    }
  }, [displayProgress, progress]);

  // Asset Loading Logic
  useEffect(() => {
    let loadedCount = 0;
    const results: Record<string, string> = {};

    const loadAsset = async (key: string, url: string) => {
      try {
        const response = await fetch(encodeURI(url));
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        results[key] = blobUrl;

        loadedCount++;
        const targetProgress = Math.round((loadedCount / ASSETS.length) * 100);
        setProgress(targetProgress);

        if (loadedCount === ASSETS.length) {
          setAssetUrls(results);
          setIsAssetsLoaded(true);
        }
      } catch (error) {
        console.error(`Failed to load ${url}:`, error);
        loadedCount++;
        if (loadedCount === ASSETS.length) setIsAssetsLoaded(true);
      }
    };

    ASSETS.forEach((asset) => loadAsset(asset.key, asset.url));

    return () => {
      Object.values(results).forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const handleStart = () => {
    if (displayProgress < 100) return;
    setHasInteracted(true);
    setTimeout(() => {
      if (videoRef.current) videoRef.current.play().catch(console.error);
      if (audioIntroRef.current) audioIntroRef.current.play().catch(console.error);
    }, 100);
  };

  const handleIntroEnd = () => {
    setIsIntroEnded(true);
    setTimeout(() => {
      if (audioLoopRef.current) audioLoopRef.current.play().catch(console.error);
    }, 50);
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (audioIntroRef.current) audioIntroRef.current.muted = newMuted;
    if (audioLoopRef.current) audioLoopRef.current.muted = newMuted;
  };

  return (
    <main className={`${supplySans.className} h-screen w-full text-white overflow-hidden`}>
      {/* Preloader & Interaction Screen */}
      <div 
        className={`preloader ${hasInteracted ? "hidden" : ""} ${displayProgress === 100 ? "cursor-pointer" : "cursor-wait"}`}
        onClick={handleStart}
      >
        <div className="loader-top">
          <span>SYS.INIT</span>
          <span>v2.0</span>
        </div>

        <div className="loader-horizontal-line" />

        <div className="loader-center-wrapper">
          <div className="loader-corners" />
          <div className="loader-text">
            {displayProgress.toString().padStart(3, "0")}
          </div>
          <div className="loader-bar-container">
            <div className="loader-bar" style={{ width: `${displayProgress}%` }} />
          </div>
        </div>

        <div className={`enter-prompt transition-opacity duration-500 ${displayProgress < 100 ? "opacity-30" : "opacity-100"}`}>
          {displayProgress < 100 ? "Setting up..." : "Click anywhere to Continue"}
        </div>

        <div className="loader-bottom">
          <span>Loading...</span>
          <span>Please Wait</span>
        </div>
      </div>

      {/* Background Media */}
      <div className="video-container">
        {hasInteracted && (
          <>
            <video
              ref={videoRef}
              src={assetUrls.first_video}
              className={`video-background transition-opacity duration-[1500ms] ${hasInteracted && !isIntroEnded ? "opacity-100" : "opacity-0"}`}
              onEnded={handleIntroEnd}
              playsInline
              muted
              autoPlay
              preload="auto"
            />
            <video
              src={assetUrls.loop_video}
              className={`video-background absolute inset-0 transition-opacity duration-[2000ms] ${isIntroEnded ? "opacity-100" : "opacity-0"}`}
              autoPlay
              loop
              playsInline
              muted
              preload="auto"
            />
          </>
        )}
      </div>

      {/* Audio elements */}
      {hasInteracted && (
        <>
          <audio ref={audioIntroRef} src={assetUrls.first_audio} preload="auto" />
          <audio ref={audioLoopRef} src={assetUrls.loop_audio} loop preload="auto" />
        </>
      )}

      {/* UX Content */}
      <div className={`ux-content h-full flex flex-col items-start justify-start pt-40 pl-20 pointer-events-none ${isIntroEnded ? "visible" : ""}`}>
        <h1 className={`${supplyMono.className} text-7xl md:text-9xl font-bold tracking-tighter uppercase leading-none`}>
          SAMMY
        </h1>
        <p className="mt-6 text-sm opacity-40 max-w-xs text-center uppercase tracking-[0.3em] font-mono">
          Portfolio under construction...
        </p>
      </div>

      {/* Mute Toggle */}
      {hasInteracted && (
        <button className="mute-button" onClick={toggleMute}>
          {isMuted ? "Audio Off" : "Audio On"}
        </button>
      )}
    </main>
  );
}