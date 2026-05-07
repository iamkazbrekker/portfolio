"use client";

import { useEffect, useState, useRef } from "react";
import { supplyMono, supplySans } from "./fonts";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Menu } from "lucide-react";

const ASSETS = [
  { key: "first_video", url: "/first.mp4" },
  { key: "loop_video", url: "/gif.mp4" },
  { key: "first_audio", url: "/first audio.m4a" },
  { key: "loop_audio", url: "/2 audio.m4a" },
];

const cells = [
  { key: 0, string: "sAMMY" },
  { key: 5, string: "Work" },
  { key: 6, string: "Mute" },
  { key: 28, string: "Contact" }
]

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
  const cathodeRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

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

  useGSAP(() => {
    if (cathodeRef.current) {
      gsap.fromTo(cathodeRef.current,
        { yPercent: -100 },
        {
          y: window.innerHeight,
          duration: 2.5,
          ease: 'none',
          repeat: -1,
        }
      );
    }

    const onMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          x: e.clientX,
          y: e.clientY,
          xPercent: -50,
          yPercent: -50,
          duration: 0.1,
          ease: "power2.out",
          overwrite: true
        });
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  const triggerScramble = (query: string, finalText: string) => {
    const target = document.querySelector(query);
    if (!target) return;

    const scrambleChars = "5?QA.?!@#*()_+=-{}[]|\\;:/?.><,1234567890";
    const duration = 0.9;

    let obj = { value: 0 };
    gsap.to(obj, {
      value: 1,
      duration: duration,
      ease: "none",
      onUpdate: () => {
        const progress = obj.value;
        const currentText = finalText.split('').map((char, i) => {
          if (progress > (i / finalText.length)) return char;
          return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        }).join('');
        target.textContent = currentText;
      }
    });
  };

  useGSAP(() => {
    if (isIntroEnded) {
      triggerScramble('.head-name', 'SAMMY');
    }
  }, [isIntroEnded]);

  return (
    <main className={`${supplySans.className} h-screen w-full text-white overflow-hidden`}>
      {/* Preloader & Interaction Screen */}
      <div
        className={`preloader ${hasInteracted ? "hidden" : ""} min-h-screen`}
        onClick={handleStart}
      >
        <div ref={cathodeRef} className="cathode absolute top-0 left-0 w-full h-px z-100 pointer-events-none" />
        <div className="loader-top">
          <span>SYS.INIT</span>
          <span>v1.0</span>
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
              className={`video-background transition-opacity duration-2000 ${hasInteracted && !isIntroEnded ? "opacity-100" : "opacity-0"}`}
              onEnded={handleIntroEnd}
              playsInline
              muted
              autoPlay
              preload="auto"
            />
            <video
              src={assetUrls.loop_video}
              className={`video-background absolute inset-0 transition-opacity duration-2000 ${isIntroEnded ? "opacity-100" : "opacity-0"}`}
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
      <div className={`cursor-custom ux-content h-full w-full items-start justify-start pt-40 pointer-events-none ${isIntroEnded ? "visible" : ""}`}>
        <div className="absolute inset-0 grid grid-cols-7 grid-rows-5">
          {Array.from({ length: 35 }).map((_, i) => {
            if (i === 1) return null;

            // First cell spans 2 columns
            const isMergedCell = i === 0;

            const cellData = cells.find(c => c.key === i);
            const cellClass = `cell-${i}`;

            if (i === 0) {
              return (
                <div
                  key={i}
                  className={`
                    ${cellClass}
                    border border-white/25
                    col-span-2 relative
                    flex flex-row items-start justify-start
                    pointer-events-auto overflow-hidden`}
                  onMouseEnter={() => {
                    if (cellData) triggerScramble(`.${cellClass}-name`, cellData.string);
                  }}>
                  <div className="w-full pt-8 px-8">
                    <div className="flex justify-between items-center text-[8px] opacity-40 font-mono tracking-[0.4em]">
                      <span>HOVER TO EXPLORE</span>
                      <span>[000]</span>
                    </div>

                    {/* Main Name */}
                    <h2 className={`font-sans ${cellClass}-name text-3xl md:text-5xl font-bold tracking-[0.3em] uppercase mt-8 leading-none`}>
                      {cellData ? cellData.string : "SAMMY"}
                    </h2>

                    {/* Bottom Line decoration */}
                    <div className="w-4/5 flex items-center gap-4 opacity-20">
                      <div className="h-px bg-white flex-grow" />
                      <span className="text-[10px] tracking-[0.5em]">....</span>
                    </div>
                  </div>
                  <div className="ml-auto p-8 border-l border-white/25 h-full flex items-center justify-center">
                    <Menu />
                  </div>
                </div>

              );
            }

            return (
              <div
                key={i}
                className={`
          ${cellClass}
          border border-white/25
          flex items-center justify-center text-[15px] uppercase tracking-widest
          ${isMergedCell ? "col-span-2" : ""}
          pointer-events-auto
        `}
                onMouseOver={() => {
                  if (cellData) triggerScramble(`.${cellClass}`, cellData.string);
                }}
                onMouseLeave={() => {
                  if (cellData) triggerScramble(`.${cellClass}`, cellData.string);
                }}
              >
                {cellData ? cellData.string : ""}
              </div>
            );
          })}
        </div>

        {/* Optional dark vignette */}
        {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,black_100%)]" /> */}
        {/* <h1
          onMouseEnter={() => triggerScramble('.head-name', 'SAMMY')}
          className={`${supplyMono.className} head-name text-7xl md:text-9xl font-bold tracking-tighter uppercase leading-none pointer-events-auto`}
        >
          SAMMY
        </h1>
        <p
          className="mt-6 text-sm opacity-40 description-max max-w-xs text-center uppercase tracking-[0.3em] font-mono pointer-events-auto"
        >
          Portfolio under construction...
        </p> */}
      </div>

      {/* Mute Toggle */}
      {hasInteracted && (
        <button className="mute-button" onClick={toggleMute}>
          {isMuted ? "Audio Off" : "Audio On"}
        </button>
      )}

      <div ref={cursorRef} className="custom-cursor" />
    </main>
  );
}