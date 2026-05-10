"use client";

import { useEffect, useState, useRef } from "react";
import { supplyMono, supplySans } from "./fonts";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { Cross, CrossIcon, Menu, MenuIcon } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(MorphSVGPlugin);
  gsap.registerPlugin(ScrambleTextPlugin);
}

const ASSETS = [
  { key: "first_video", url: "/first.mp4" },
  { key: "loop_video", url: "/gif.mp4" },
  { key: "first_audio", url: "/first audio.m4a" },
  { key: "loop_audio", url: "/2 audio.m4a" },
];

const cells = [
  { key: 0, string: "Samarth Kapse" },
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [workOpen, setWorkOpen] = useState(false);


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

  const openMenu = () => {
    if (menuOpen) return;

    let t1 = gsap.timeline({
      onComplete: () => {
        setMenuOpen(true);
      }
    });
    t1.fromTo(".top-bottom", {
      opacity: 1
    }, {
      opacity: 0,
      duration: 1.5
    })
      .fromTo(".menu-div", {
        opacity: 0,
        scaleY: 0,
        transformOrigin: "top center"
      }, {
        opacity: 1,
        scaleY: 1,
        duration: 1,
        ease: "power3.out"
      })
    gsap.fromTo(
      ".top-overlay",
      {
        x: "-100%",
        opacity: 0,
      },
      {
        x: "0%",
        opacity: 1,
        duration: 1.5,
        ease: "power3.out",
      }
    );
    gsap.to("#menu-icon-path", {
      duration: 1.5,
      morphSVG: "#cross-icon-path"
    })
    gsap.to(".hover-text", {
      duration: 1.5,
      scrambleText: {
        text: "READ ABOUT ME",
        chars: "5?QA.?!@#*()_+=-{}[]|\\;:/?.><,1234567890",
      }
    })
    gsap.fromTo(
      ".lower-loading-bar",
      {
        width: "0%",
        opacity: 0
      },
      {
        duration: 1.5,
        width: "100%",
        opacity: 1,
        backgroundColor: "#ffffff",
        ease: "power3.out",
      }
    );
    gsap.to(".side-loading-bar span", {
      color: "rgba(255,255,255,1)",
      duration: 0.1,
      stagger: 0.1,
      ease: "power2.out",
    });
    const counter = { value: 0 };

    gsap.to(counter, {
      value: 100,
      duration: 1,
      ease: "power1.out",
      onUpdate: () => {
        const el = document.querySelector(".hover-percentage");
        if (el) {
          el.textContent = `[${Math.floor(counter.value).toString().padStart(3, "0")}]`;
        }
      }
    });

  };

  const closeMenu = () => {
    if (!menuOpen) return;
    const counter = { value: 100 };
    let t2 = gsap.timeline({
      onComplete: () => {
        setMenuOpen(false)
      }
    })
    t2.fromTo(".menu-div", {
      opacity: 1,
      scaleY: 1,
      transformOrigin: "top center"
    }, {
      opacity: 0,
      scaleY: 0,
      duration: 1,
      ease: "power3.out"
    })
      .fromTo(".top-bottom", {
        opacity: 0
      }, {
        opacity: 1,
        duration: 1.5
      })
      .fromTo(".top-overlay", {
        x: "0%",
        opacity: 1
      }, {
        x: "-100%",
        opacity: 0,
        duration: 1.5,
        ease: "power3.out"
      }, "<")
      .to("#menu-icon-path", {
        duration: 1.5,
        morphSVG: "#menu-icon-path-data"
      }, "<")
      .to(".hover-text", {
        duration: 1.5,
        scrambleText: {
          text: "HOVER TO EXPLORE",
          chars: "5?QA.?!@#*()_+=-{}[]|\\;:/?.><,1234567890",
        }
      }, "<")
      .to(".lower-loading-bar", {
        duration: 1.5,
        width: "0%",
        opacity: 0,
        ease: "power3.out",
      }, "<")
      .to(".side-loading-bar span", {
        color: "rgba(255,255,255,0.1)",
        duration: 0.1,
        stagger: {
          each: 0.05,
          from: "end"
        },
        ease: "power2.out",
      }, "<")
      .to(counter, {
        value: 0,
        duration: 1,
        ease: "power1.out",
        onUpdate: () => {
          const el = document.querySelector(".hover-percentage");
          if (el) {
            el.textContent = `[${Math.floor(counter.value).toString().padStart(3, "0")}]`;
          }
        }
      }, "<");
  }

  const openWork = () => {
    if (workOpen) return;
    setWorkOpen(true);

    let tw1 = gsap.timeline();
    
    tw1.to(".work-div", {
      scaleY: "100%",
      duration: 1,
      ease: "power2.out",
    })
      .fromTo(".work-showcase-1", {
        scaleX: "0%",
        opacity: 0,
        transformOrigin: "left center"
      }, {
        opacity: 1,
        scaleX: "100%",
        duration: 0.8,
        ease: "power4.out",
      })
      .fromTo(".work-showcase-2", {
        scaleX: "0%",
        opacity: 0,
        transformOrigin: "right center"
      }, {
        opacity: 1,
        scaleX: "100%",
        duration: 0.8,
        ease: "power4.out",
      }, "<")
      .to(".work-div", {
        scaleY: "0%",
        duration: 0.4,
        ease: "power2.in",
      });
  };

  const closeWork = () => {
    if (!workOpen) return;
    
    let tw2 = gsap.timeline({
      onComplete: () => {
        setWorkOpen(false)
      }
    })

    tw2.to(".work-showcase-1", {
      scaleX: "0%",
      opacity: 0,
      duration: 0.6,
      transformOrigin: "left center",
      ease: "power3.in"
    })
    .to(".work-showcase-2", {
      scaleX: "0%",
      opacity: 0,
      duration: 0.6,
      transformOrigin: "right center",
      ease: "power3.in"
    }, "<")
  };



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
                    items-start justify-start
                    pointer-events-auto overflow-hidden`}
                  onMouseEnter={() => {
                    if (cellData) openMenu();
                  }}>

                  <div style={{ zIndex: 20 }} className="w-full h-full p-8 pr-32 absolute top-0 left-0 flex flex-col justify-between pointer-events-none">
                    <div className="flex justify-between items-center text-[9px] opacity-40 font-mono tracking-[0.5em]">
                      <span className="hover-text">HOVER TO EXPLORE</span>
                      <span className="hover-percentage">[000]</span>
                    </div>

                    <div className="w-full pb-4">
                      <h2 className={`font-sans ${cellClass}-name text-2xl font-bold tracking-[0.15em] uppercase leading-[0.8] mt-8`}>
                        {cellData ? cellData.string : "Samarth"}
                      </h2>


                      <div className="w-full flex items-center gap-6 pointer-events-auto h-4">
                        <div className="h-0.5 bg-white/10 grow relative overflow-hidden">
                          <div className="lower-loading-bar absolute left-0 top-0 h-full bg-white opacity-0 w-0" />
                        </div>
                        <div className="side-loading-bar flex items-center gap-[0.35em] text-[18px] font-bold text-white/10 leading-none">
                          <span>.</span><span>.</span><span>.</span><span>.</span><span>.</span>
                        </div>
                      </div>
                    </div>
                  </div>


                  <div style={{ zIndex: 10 }} className="top-overlay absolute inset-0 opacity-0 bg-white/40 pointer-events-none"></div>
                  <div style={{ zIndex: 0 }} className="top-bottom absolute inset-0 pointer-events-none"></div>

                  <div style={{ zIndex: 30 }} className="absolute right-0 top-0 h-full w-28 border-l border-white/25 flex items-center justify-center pointer-events-auto">
                    <button onClick={closeMenu}>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path id="menu-icon-path" d="M3 12h18M3 6h18M3 18h18" />
                        <path id="cross-icon-path" d="M18 6L6 18M6 6l12 12" className="hidden" />
                        <path id="menu-icon-path-data" d="M3 12h18M3 6h18M3 18h18" className="hidden" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            }

            if (i == 6) {
              return (
                hasInteracted && (
                  <div
                    key={i}
                    className={`${cellClass} border border-white/25 flex items-center justify-center text-[15px] uppercase tracking-widest  pointer-events-auto`}
                    onClick={toggleMute}
                    onMouseOver={() => {
                      triggerScramble(`.${cellClass}`, `${isMuted ? "Audio Off" : "Audio On"}`);
                    }}
                    onMouseLeave={() => {
                      triggerScramble(`.${cellClass}`, `${isMuted ? "Audio Off" : "Audio On"}`);
                    }}
                  >
                    {isMuted ? "Audio Off" : "Audio On"}
                  </div>
                )
              )
            }

            if (i == 5) {
              return (
                <div
                  key={i}
                  className={`work-trigger-cell ${cellClass} border border-white/25 flex items-center justify-center text-[15px] uppercase tracking-widest pointer-events-auto cursor-pointer relative overflow-hidden`}
                  onMouseEnter={openWork}
                >
                  <div className="work-div absolute inset-0 bg-white scale-y-0 origin-bottom pointer-events-none" />
                  <span className="relative z-10 mix-blend-difference">Work</span>
                </div>
              )
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
          <div className="menu-div opacity-0 absolute inset-0 col-start-1 col-end-3 row-start-2 row-end-6 bg-white border border-white/25 z-30" />
          <div className={`work-showcase work-showcase-1 opacity-0 absolute inset-0 col-start-1 col-end-3 row-start-1 row-end-6 bg-white text-black border border-black/10 z-50 flex flex-col p-10 overflow-hidden ${workOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
            <div className="flex justify-between items-start w-full">
              <h3 className="text-4xl font-bold tracking-tighter uppercase leading-none">Projects</h3>
            </div>
            <div className="mt-10 flex flex-col gap-6 overflow-y-auto pr-4">
              <div className="border-b border-black/10 pb-4 group cursor-pointer hover:pl-2 transition-all">
                <span className="text-[10px] opacity-40 font-mono">[2024]</span>
                <h4 className="text-2xl font-bold uppercase tracking-tighter">Aura Studio</h4>
              </div>
              <div className="border-b border-black/10 pb-4 group cursor-pointer hover:pl-2 transition-all opacity-40">
                <span className="text-[10px] opacity-40 font-mono">[2023]</span>
                <h4 className="text-2xl font-bold uppercase tracking-tighter">Nexus Dashboard</h4>
              </div>
              <div className="border-b border-black/10 pb-4 group cursor-pointer hover:pl-2 transition-all opacity-40">
                <span className="text-[10px] opacity-40 font-mono">[2023]</span>
                <h4 className="text-2xl font-bold uppercase tracking-tighter">Vortex UI</h4>
              </div>
            </div>
          </div>
          <div className={`work-showcase work-showcase-2 opacity-0 absolute inset-0 col-start-3 col-end-8 row-start-1 row-end-6 bg-zinc-100 text-black border border-black/10 z-50 flex items-center justify-center overflow-hidden ${workOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
            <button 
              onClick={closeWork} 
              className="absolute top-10 right-10 p-2 hover:rotate-90 transition-all duration-500 group"
            >
              <img src="/x-scan.svg" alt="Close" className="w-10 h-10 opacity-60 group-hover:opacity-100 transition-opacity" />
            </button>
            <span className="text-[10px] opacity-20 font-mono uppercase tracking-[1em] rotate-90">Preview Interface</span>
          </div>

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


      <div ref={cursorRef} className="custom-cursor" />
    </main >
  );
}