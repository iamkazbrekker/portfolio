"use client";

import { useEffect, useState, useRef } from "react";
import { supplyMono, supplySans } from "./fonts";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import Link from "next/link";

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

const projects = [
  { number: 1, name: "Weave", year: 2026, tech: "NextJS, MongoDB, Flutter", type: "Hybrid(App / Website)", description: "A full-stack, multi-platform system built for NGOs and social organizations to manage volunteer deployment, collect field data, track community impact, and respond to emerging crises, all orchestrated by a suite of AI agents.", link: "https://weave-seven-flax.vercel.app/", img: "/projects/weave.png" },
  { number: 2, name: "Tsukumo", year: 2026, tech: "NextJS, MongoDB, Flask", type: "Web Application", description: "A full-stack autonomous health intelligence platform built to demonstrate the convergence of IoT telemetry, multi-organ ML prediction, agentic AI reasoning, and real-time clinical dispatch.", link: "https://github.com/iamkazbrekker/tsukumo", img: "/projects/tsukumo.png" },
  { number: 3, name: "DPHRS", year: 2026, tech: "Solidity, NextJS, Hardhat", type: "Web Application", description: "A secure, blockchain-based web application designed to give patients complete ownership and control over their medical data.", link: "https://github.com/iamkazbrekker/dphrs", img: "/projects/dphrs.png" },
  { number: 4, name: "CitySync", year: 2026, tech: "NextJS, Supabase DB, Baileys", type: "Web Application", description: "A full-stack, AI-augmented civic platform built specifically for Nagpur, India, enabling citizens to report municipal issues (roads, water, electricity) and track their resolution in real time.", link: "https://city-sync-ivory.vercel.app/", img: "/projects/citySync.png" },
  { number: 5, name: "IRC", year: 2026, tech: "NextJS, WebSockets, MongoDB", type: "Web Application", description: "A modern, real-time chat application built with Next.js, WebSockets, and MongoDB.", link: "https://github.com/iamkazbrekker/irc", img: "/projects/irc.png" }
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
  const [contactOpen, setContactOpen] = useState(false);
  const [readMoreOpen, setReadMoreOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<typeof projects[0] | null>(null);
  const [lastSyncedTime, setLastSyncedTime] = useState("");
  const [workType, setWorkType] = useState<"CONTRACT" | "FULL TIME">("CONTRACT");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactStatus, setContactStatus] = useState("AWAITING_INPUT");


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
          overwrite: "auto"
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
    const duration = 0.5;

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
      .fromTo(
        ".menu-image",
        {
          scale: 0.65,
          opacity: 0,
          transformOrigin: "center center"
        },
        {
          scale: 1,
          opacity: 1,
          duration: 0.2,
          ease: "power1.in"
        }
      )
    gsap.to(".custom-cursor", {
      rotate: 45,
      duration: 0.5,
      ease: "power2.out"
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
      .to(".custom-cursor", {
        rotate: 0,
        duration: 1,
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
      duration: 1.2,
      ease: "power2.out",
    })
      .fromTo(".work-showcase-1", {
        scaleX: "0%",
        opacity: 0,
        transformOrigin: "left center"
      }, {
        opacity: 1,
        scaleX: "100%",
        duration: 1,
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
      .to(".custom-cursor", {
        rotate: 45,
        duration: 0.8,
        ease: "power4.out"
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
      .to(".custom-cursor", {
        rotate: 0,
        duration: 0.6,
        ease: "power3.in"
      }, "<")
  };

  const submitContactForm = async () => {
    if (!contactEmail || !contactMessage) {
      setContactStatus("ERROR: MISSING_INPUT");
      return;
    }
    
    setContactStatus("TRANSMITTING...");
    
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: contactEmail,
          message: contactMessage,
          type: workType
        })
      });
      
      if (res.ok) {
        setContactStatus("TRANSMITTED_SUCCESSFULLY");
        setContactEmail("");
        setContactMessage("");
        setTimeout(() => setContactStatus("AWAITING_INPUT"), 3000);
      } else {
        setContactStatus("ERROR: TRANSMISSION_FAILED");
      }
    } catch (error) {
      setContactStatus("ERROR: TRANSMISSION_FAILED");
    }
  };

  const openContact = () => {
    if (contactOpen) return;
    setContactOpen(true);
    setLastSyncedTime(new Date().toLocaleTimeString('en-US', { hour12: false }));

    let tw1 = gsap.timeline();

    tw1.to(".contact-div", {
      scaleY: "100%",
      duration: 1.2,
      ease: "power2.out",
    })
      .fromTo(".contactme-1", {
        opacity: 0,
      }, {
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        onComplete: () => {
          triggerScramble(".contact-text-scramble-1", "LET'S COOK");
          triggerScramble(".contact-text-scramble-2", "SOMETHING");
        }
      })
      .fromTo(".contactme-2", {
        y: "100%",
        opacity: 0,
      }, {
        y: "0%",
        opacity: 1,
        duration: 0.8,
        ease: "power4.out",
      }, "<")
      .to(".custom-cursor", {
        rotate: 45,
        duration: 0.8,
        ease: "power4.out"
      }, "<")
      .to(".contact-div", {
        scaleY: "0%",
        duration: 0.4,
        ease: "power2.in",
      });
  };

  const closeContact = () => {
    if (!contactOpen) return;

    let tw2 = gsap.timeline({
      onComplete: () => {
        setContactOpen(false)
      }
    })

    tw2.to(".contactme-1", {
      opacity: 0,
      duration: 0.6,
      ease: "power3.in"
    })
      .to(".contactme-2", {
        y: "100%",
        opacity: 0,
        duration: 0.6,
        ease: "power3.in"
      }, "<")
      .to(".custom-cursor", {
        rotate: 0,
        duration: 0.6,
        ease: "power3.in"
      }, "<")
  };

  const scanXAnimationEnter = () => {
    gsap.to(".scan-close-icon", {
      scale: 1.2,
      stroke: "#ff3b3b",
      duration: 0.4,
      ease: "power2.out"
    })

    gsap.to(".scan-close-x", {
      rotate: 90,
      transformOrigin: "center center",
      duration: 0.4,
      ease: "power2.out"
    });
  }
  const scanXAnimationLeave = () => {
    gsap.to(".scan-close-icon", {
      scale: 1,
      stroke: "#b8b8b8",
      duration: 0.4,
      ease: "power2.out"
    })
    gsap.to(".scan-close-x", {
      rotate: -90,
      transformOrigin: "center center",
      duration: 0.4,
      ease: "power2.out"
    })
  }

  // const openReadMore = () => {
  //   setReadMoreOpen(true);
  //   gsap.fromTo(".read-more-div", {
  //     scaleX: "0%",
  //     opacity: 0,
  //     transformOrigin: "right center"
  //   }, {
  //     opacity: 1,
  //     scaleX: "100%",
  //     duration: 0.8,
  //     ease: "power4.out",
  //   })
  // }

  // const closeReadMore = () => {
  //   gsap.to(".read-more-div", {
  //     scaleX: "0%",
  //     opacity: 0,
  //     duration: 0.6,
  //     transformOrigin: "right center",
  //     ease: "power3.in",
  //     onComplete: () => {
  //       setReadMoreOpen(false);
  //     }
  //   })
  // }


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
                  className={`${cellClass} border border-white/25 col-span-2 relative items-start justify-start pointer-events-auto overflow-hidden`}
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
                  onMouseEnter={() => {
                    openWork()
                    triggerScramble(".work-trigger-text", "WORK")
                  }}
                >
                  <div className="work-div absolute inset-0 bg-white scale-y-0 origin-bottom pointer-events-none" />
                  <span className="work-trigger-text relative z-10 mix-blend-difference">Work</span>
                </div>
              )
            }


            if (i == 28) {
              return (
                <div
                  key={i}
                  className={`contact-trigger-cell ${cellClass} border border-white/25 flex items-center justify-center text-[15px] uppercase tracking-widest pointer-events-auto cursor-pointer relative overflow-hidden`}
                  onMouseEnter={() => {
                    openContact()
                    triggerScramble(".contact-trigger-text", "CONTACT")
                  }}
                >
                  <div className="contact-div absolute inset-0 bg-white scale-y-0 origin-bottom pointer-events-none" />
                  <span className="contact-trigger-text relative z-10 mix-blend-difference">Contact</span>
                </div>
              )
            }

            return (
              <div
                key={i}
                className={`${cellClass} border border-white/25 flex items-center justify-center text-[15px] uppercase tracking-widest ${isMergedCell ? "col-span-2" : ""} pointer-events-auto`}
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
          <div className={`menu-div opacity-0 absolute inset-0 col-start-1 col-end-3 row-start-2 row-end-6 bg-white border text-black z-30 overflow-y-auto scrollbar-hide ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
            <div className=" w-full">
              <div className="flex flex-row justify-between pl-6 pr-2 pt-5">
                <div className="img-div relative p-1">
                  <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-black" />
                  <div className="absolute top-0 right-0 w-1 h-1 border-t border-r border-black" />
                  <div className="absolute bottom-0 left-0 w-1 h-1 border-b border-l border-black" />
                  <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-black" />
                  <div className="w-full h-full flex items-center justify-center relative">
                    <img src="./Samarth pfp.jpeg" className="menu-image w-80 h-45 object-cover" />
                  </div>
                </div>
                <div className="relative p-1">
                  <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-black" />
                  <div className="absolute top-0 right-0 w-1 h-1 border-t border-r border-black" />
                  <div className="absolute bottom-0 left-0 w-1 h-1 border-b border-l border-black" />
                  <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-black" />
                  <div className="flex flex-col bg-[#363434] text-white px-3 py-3 gap-1 tracking-widest h-full">
                    <span>S</span><span>C</span><span>R</span><span>O</span><span>L</span><span>L</span>
                  </div>
                </div>
              </div>
              <div className="font-mono py-6 uppercase text-[12px] pl-6 pr-6 w-full">
                <div>Hey! I'm Samarth, a creative developer who dibble dabbles in a little bit of...everything.</div>
                {/* <button onClick={() => { openReadMore() }} className="mt-2"><div className="text-[#ff0000] text-[12px] font-mono uppercase hover:underline cursor-pointer">[Read More]</div></button>*/}
              </div>
            </div>

            {/* Section 01 */}
            <div className="sticky top-0 z-20 bg-white " >
              <div className=" py-3 pt-5 px-4 border-t border-gray-900 flex flex-row justify-between items-center h-14">
                <div className="h-4 w-4 bg-black " />
                <p className="text-[18px] uppercase">[01 - Expertise]</p>
              </div>
              <div className="border-b border-gray-900 w-full flex flex-row justify-between pt-9 pb-10 font-sans tracking-widest text-[15px] px-4">
                <div className="flex flex-col gap-2">
                  <span>/Blockchain</span>
                  <span>/UI-UX Design</span>
                  <span>/AI-ML</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span>/Open CV</span>
                  <span>/Web Animations</span>
                  <span>/Data Structures</span>
                </div>
              </div>
            </div>

            {/* Section 02 */}
            <div className="sticky top-14 z-20 bg-white " >
              <div className="  py-3 pt-5 px-4 border-t border-gray-900 flex flex-row justify-between items-center h-14">
                <div className="h-4 w-4 bg-black " />
                <p className="text-[18px] uppercase">[02 - Tech Stack]</p>
              </div>
              <div className="border-b border-gray-900 w-full flex flex-row justify-between pt-9 pb-10 font-sans tracking-widest text-[15px] px-4">
                <div className="flex flex-col gap-2">
                  <span>/TypeScript</span>
                  <span>/HTML-CSS</span>
                  <span>/Python</span>
                  <span>/Javascript</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span>/Solidity</span>
                  <span>/Next.js</span>
                  <span>/GSAP</span>
                  <span>/MongoDB</span>
                </div>
              </div>
            </div>

            {/* Section 03 */}
            <div className="sticky top-28 bg-white z-20">
              <div className=" py-3 pt-5 px-4 border-t border-gray-900 flex flex-row justify-between items-center h-14">
                <div className="h-4 w-4 bg-black " />
                <p className="text-[18px] uppercase">[03 - Achievements]</p>
              </div>
              <div className="border-b border-gray-900 w-full flex flex-col pt-9 pb-10 font-sans tracking-widest text-[14px] px-4 gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] opacity-40 mb-1">2026 / VNIT Nagpur</span>
                  <span>Ranked 1st at Insomia - 24 hour hackathon</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] opacity-40 mb-1">2026 / VIT Pune</span>
                  <span>Ranked 1st at Breaking Enigma - 24 hour hackathon</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] opacity-40 mb-1">2026 / NIT Karnataka</span>
                  <span>Ranked 3rd at Hack-ula - 24 hour hackathon</span>
                </div>
              </div>
            </div>
            <div className="py-3 pt-32 relative z-30 w-full bg-black text-white">
              <div className="flex flex-row justify-between">
                <div className="pb-32 font-mono font-bold text-3xl text-center uppercase flex justify-center w-full px-10 border-b border-white">
                  <h1>Building anything and everything that fancies me</h1>
                </div>
              </div>
              <div className="py-8 px-4 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div className="h-4.5 w-4.5 bg-white" />
                  <div className="flex flex-row gap-5 text-[15px] justify-between">
                    <Link href={'https://github.com/iamkazbrekker'} target="_blank" rel="noopener noreferrer"><span className="github-contactme" onMouseEnter={() => { triggerScramble(".github-contactme", "GITHUB") }}>GITHUB</span></Link>
                    <Link href={'https://www.linkedin.com/in/ahamsamartha'} target="_blank" rel="noopener noreferrer"><span className="linkdein-contactme" onMouseEnter={() => { triggerScramble(".linkdein-contactme", "LINKDEIN") }}>LINKDEIN</span></Link>
                  </div>
                  <div className="h-4.5 w-4.5 bg-white" />
                </div>
              </div>
            </div>
          </div>
          {/* <div className={`read-more-div opacity-0 absolute inset-0 col-start-3 col-end-8 row-start-1 row-end-6 bg-[#090909] text-white border border-white/10 z-45 ${readMoreOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
            <button
              onClick={() => {closeReadMore()}}
              onMouseEnter={() => { scanXAnimationEnter() }}
              onMouseLeave={() => { scanXAnimationLeave() }}
              className="absolute top-10 right-10 p-2 group"
            >
              <svg
                className="scan-close-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#b8b8b8"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 6V3a1 1 0 0 1 1-1h3" />
                <path d="M18 2h3a1 1 0 0 1 1 1v3" />
                <path d="M22 18v3a1 1 0 0 1-1 1h-3" />
                <path d="M6 22H3a1 1 0 0 1-1-1v-3" />

                <g className="scan-close-x">
                  <path d="M15 9L9 15" />
                  <path d="M9 9L15 15" />
                </g>
              </svg>
            </button>
          </div> */}

          <div className={`work-showcase work-showcase-1 absolute inset-0 col-start-1 col-end-3 row-start-1 row-end-6 bg-[#010101] opacity-0 text-white border border-white/10 z-50 flex flex-col justify-center p-10 overflow-hidden ${workOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
            <div className="flex justify-between items-start w-full absolute top-20">
              <h3 className="text-4xl font-bold tracking-tighter uppercase leading-none">Projects</h3>
            </div>
            <div
              className="mt-10 flex flex-col gap-6 overflow-y-auto pr-4"
              onMouseLeave={() => {
                setActiveProject(null);
                triggerScramble(`.project-detail-name`, "—");
                triggerScramble(`.project-detail-year`, "—");
                triggerScramble(`.project-detail-type`, "—");
                triggerScramble(`.project-detail-tech`, "—");
                triggerScramble(`.project-detail-desc`, "Hover a project to see preview and details.");
                triggerScramble(`.project-detail-number`, "00");
              }}
            >
              {projects.map((proj) => (
                <Link key={proj.number} href={proj.link} target="_blank" rel="noopener noreferrer">
                  <div
                    className="border-b border-white/10 pb-4 group cursor-pointer hover:pl-2 transition-all"
                    onMouseEnter={() => {
                      setActiveProject(proj);
                      triggerScramble(`.project-name-${proj.number}`, proj.name);
                      triggerScramble(`.project-detail-name`, proj.name);
                      triggerScramble(`.project-detail-year`, proj.year.toString());
                      triggerScramble(`.project-detail-type`, proj.type);
                      triggerScramble(`.project-detail-tech`, proj.tech);
                      triggerScramble(`.project-detail-desc`, proj.description);
                      triggerScramble(`.project-detail-number`, `0${proj.number}`);
                    }}
                    onMouseLeave={() => {
                      triggerScramble(`.project-name-${proj.number}`, proj.name);
                    }}
                  >
                    <h4 className={`project-name-${proj.number} text-2xl font-bold uppercase tracking-tighter group-hover:text-white/70 transition-colors`}>{proj.name}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className={`work-showcase work-showcase-2 absolute inset-0 col-start-3 col-end-8 row-start-1 row-end-6 bg-black opacity-0 text-white border border-white/10 z-50 overflow-hidden ${workOpen ? "pointer-events-auto" : "pointer-events-none"}`}
          >
            {/* Close Button */}
            <button
              onClick={closeWork}
              onMouseEnter={() => { scanXAnimationEnter() }}
              onMouseLeave={() => { scanXAnimationLeave() }}
              className="absolute top-8 right-8 p-2 z-10"
            >
              <svg
                className="scan-close-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#b8b8b8"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 6V3a1 1 0 0 1 1-1h3" />
                <path d="M18 2h3a1 1 0 0 1 1 1v3" />
                <path d="M22 18v3a1 1 0 0 1-1 1h-3" />
                <path d="M6 22H3a1 1 0 0 1-1-1v-3" />
                <g className="scan-close-x">
                  <path d="M15 9L9 15" />
                  <path d="M9 9L15 15" />
                </g>
              </svg>
            </button>

            {/* Top Header Bar */}
            <div className="absolute top-20 left-0 right-0 flex items-center px-8 py-5 z-10">
              <div className="flex items-center gap-3 shrink-0">
                <span className="font-mono text-[10px] text-white/30 tracking-[0.4em] uppercase">Project</span>
                <span className="font-mono text-[10px] text-white/30">—</span>
                <span className="font-mono text-[10px] text-white/30">/</span>
                <span className="project-detail-number font-mono text-[10px] text-white/50">00</span>
              </div>
              <div className="flex-1 mx-6 h-px bg-white/10" />
              <div className="flex gap-1 shrink-0">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div key={num} className={`h-2.5 w-2.5 transition-colors duration-300 ${activeProject && activeProject.number >= num ? "bg-white" : "bg-white/20"}`} />
                ))}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="absolute inset-0 flex flex-col" style={{ top: "140px", bottom: "180px" }}>
              <div className="flex-1 flex items-center justify-center relative">


                {/* Preview Frame */}
                <div className="relative inline-block">
                  {/* Corner brackets */}
                  <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-white/40 z-10" />
                  <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-white/40 z-10" />
                  <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-white/40 z-10" />
                  <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-white/40 z-10" />

                  {/* Preview content */}
                  <div className="bg-[#0d0d0d] flex items-center justify-center p-2">
                    {activeProject ? (
                      <img src={activeProject.img} alt={activeProject.name} className="block object-contain max-h-[50vh] max-w-[40vw]" />
                    ) : (
                      <div className="w-[380px] h-[280px] flex items-center justify-center">
                        <span className="font-mono text-[10px] text-white/15 tracking-[0.5em] uppercase">Preview</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Metadata Grid */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-white/10">
              {/* 4-column metadata */}
              <div className="grid grid-cols-4 border-b border-white/10">
                <div className="px-6 py-4 border-r border-white/10">
                  <p className="font-mono text-[8px] text-white/25 tracking-[0.4em] uppercase mb-2">Project</p>
                  <p className="project-detail-name font-mono text-[11px] text-white/40">—</p>
                </div>
                <div className="px-6 py-4 border-r border-white/10">
                  <p className="font-mono text-[8px] text-white/25 tracking-[0.4em] uppercase mb-2">Year</p>
                  <p className="project-detail-year font-mono text-[11px] text-white/40">—</p>
                </div>
                <div className="px-6 py-4 border-r border-white/10">
                  <p className="font-mono text-[8px] text-white/25 tracking-[0.4em] uppercase mb-2">Type</p>
                  <p className="project-detail-type font-mono text-[11px] text-white/40">—</p>
                </div>
                <div className="px-6 py-4">
                  <p className="font-mono text-[8px] text-white/25 tracking-[0.4em] uppercase mb-2">Tech</p>
                  <p className="project-detail-tech font-mono text-[11px] text-white/40">—</p>
                </div>
              </div>
              {/* Description */}
              <div className="px-6 py-4">
                <p className="font-mono text-[8px] text-white/25 tracking-[0.4em] uppercase mb-2">Description</p>
                <p className="project-detail-desc font-mono text-[11px] text-white/35">Hover a project to see preview and details.</p>
              </div>
            </div>

          </div>

          <div className={`contactme-1 opacity-0 col-start-1 col-end-8 row-start-1 row-end-4 absolute inset-0 bg-black  z-50 flex flex-col justify-center pl-20 overflow-hidden ${contactOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
            <div className="absolute top-10 left-10 flex flex-col font-mono text-[10px] text-white/50 tracking-[0.2em] gap-1 z-10">
              <p>LAST SYNCED: {lastSyncedTime || "00:00:00"}</p>
              <div className="flex gap-2 text-white/40 mt-1">
                <a href="https://www.linkedin.com/in/ahamsamartha" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">[LINKEDIN]</a>
                <span>|</span>
                <a href="https://github.com/iamkazbrekker" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">[GITHUB]</a>

              </div>
            </div>

            <div className="flex flex-col z-10 relative mt-10">
              <h2 className="contact-text-scramble-1 text-[120px] font-bold uppercase leading-[0.9] tracking-tighter"></h2>
              <h2 className="contact-text-scramble-2 text-[120px] font-bold uppercase leading-[0.9] tracking-tighter"></h2>
            </div>

            <button
              onClick={closeContact}
              onMouseEnter={() => { scanXAnimationEnter() }}
              onMouseLeave={() => { scanXAnimationLeave() }}
              className="absolute top-8 right-8 p-2 z-10"
            >
              <svg
                className="scan-close-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#b8b8b8"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 6V3a1 1 0 0 1 1-1h3" />
                <path d="M18 2h3a1 1 0 0 1 1 1v3" />
                <path d="M22 18v3a1 1 0 0 1-1 1h-3" />
                <path d="M6 22H3a1 1 0 0 1-1-1v-3" />
                <g className="scan-close-x">
                  <path d="M15 9L9 15" />
                  <path d="M9 9L15 15" />
                </g>
              </svg>
            </button>

            <div className="absolute right-[25%] top-[40%] text-white/20 z-0">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M20 0v15M20 25v15M0 20h15M25 20h15" />
                <circle cx="20" cy="20" r="4" />
              </svg>
            </div>
          </div>

          <div className={`contactme-2 opacity-0 col-start-1 col-end-8 row-start-4 row-end-6 absolute inset-0 bg-[#0d0d0d] border-t border-white/10 z-50 flex flex-col p-8 font-mono text-[11px] text-white/50 tracking-widest ${contactOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
            <div className="flex gap-12 mb-6">
              <span className="text-white/30">[ TYPE OF WORK ]</span>
              <button
                className="hover:text-white transition-colors group flex items-center gap-2"
                onClick={() => setWorkType("CONTRACT")}
                onMouseEnter={() => triggerScramble(".type-contract-scramble", "CONTRACT")}
              >
                <span>[ <span className={workType === "CONTRACT" ? "text-[#5cffa3]" : "text-transparent"}>■</span> ]</span>
                <span className="type-contract-scramble text-white group-hover:text-[#5cffa3]">CONTRACT</span>
              </button>
              <button
                className="hover:text-white transition-colors group flex items-center gap-2"
                onClick={() => setWorkType("FULL TIME")}
                onMouseEnter={() => triggerScramble(".type-fulltime-scramble", "FULL TIME")}
              >
                <span>[ <span className={workType === "FULL TIME" ? "text-[#5cffa3]" : "text-transparent"}>■</span> ]</span>
                <span className="type-fulltime-scramble text-white group-hover:text-[#5cffa3]">FULL TIME</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6 flex-1">
              <div className="border border-white/10 focus-within:border-[#5cffa3] transition-colors flex">
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="> ENTER_EMAIL_ADDRESS..."
                  className="w-full bg-transparent p-4 outline-none text-white placeholder-white/20"
                />
              </div>
              <div className="border border-white/10 focus-within:border-[#5cffa3] transition-colors flex">
                <input
                  type="text"
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="> TYPE_YOUR_MESSAGE_HERE..."
                  className="w-full bg-transparent p-4 outline-none text-white placeholder-white/20"
                />
              </div>
              <div className="border border-white/10 flex flex-col">
                <div className="p-4 flex-1 flex flex-col gap-2">
                  <p>TYPE: <span className="text-white/30">{workType}</span></p>
                  <p>STATUS: <span className="text-white/30">{contactStatus}</span></p>
                </div>
                <button
                  className="border-t border-white/10 p-4 text-center hover:bg-[#5cffa3] hover:text-white transition-colors w-full uppercase"
                  onMouseEnter={() => triggerScramble(".transmit-scramble", "TRANSMIT")}
                  onClick={submitContactForm}
                >
                  <span className="transmit-scramble">TRANSMIT</span>
                </button>
              </div>
            </div>
          </div>


        </div>
      </div>

      <div ref={cursorRef} className="custom-cursor" />
    </main >
  );
}