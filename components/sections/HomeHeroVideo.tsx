"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

const DESKTOP_SRC = "/video/night-hero.mp4";
const MOBILE_SRC = "/video/night-hero-mobile.mp4";
const POSTER_SRC = "/video/night-hero-poster.jpg";

const GESTURE_EVENTS = ["touchstart", "pointerdown", "click", "scroll"] as const;

/**
 * Hero background video (Figma 1525:28266).
 *
 * The poster is the video's own first frame, so there is no visible swap
 * between the still and the moving footage. The <source media> pair keeps
 * phones on the lighter encode; browsers that ignore `media` fall back to the
 * first source, which still plays correctly.
 *
 * iOS Safari refuses to autoplay in Low Power Mode (and with some data-saver
 * settings) and paints its own play badge over the element. That badge is dead
 * here — the video is a decorative background layer sitting under the hero
 * copy, so taps never reach it. So we drive playback ourselves: fade the video
 * out whenever play() is rejected (revealing the CMS still behind it) and retry
 * on the first real user gesture, which is what iOS wants before it will start
 * a video.
 */
export function HomeHeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;

    function stopListening() {
      for (const event of GESTURE_EVENTS) {
        window.removeEventListener(event, attempt);
      }
    }

    function attempt() {
      if (cancelled || !videoRef.current) return;

      const started = videoRef.current.play();
      // Older Safari returns undefined instead of a promise.
      if (!started) return;

      started
        .then(() => {
          if (cancelled) return;
          setPlaying(true);
          stopListening();
        })
        .catch(() => {
          if (cancelled) return;
          setPlaying(false);
        });
    }

    attempt();
    for (const event of GESTURE_EVENTS) {
      window.addEventListener(event, attempt, { passive: true });
    }

    return () => {
      cancelled = true;
      stopListening();
    };
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      controls={false}
      disablePictureInPicture
      preload="auto"
      poster={POSTER_SRC}
      aria-hidden="true"
      tabIndex={-1}
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full object-cover object-center motion-reduce:hidden",
        "transition-opacity duration-500 ease-out motion-reduce:transition-none",
        playing ? "opacity-100" : "opacity-0",
      )}
    >
      <source src={DESKTOP_SRC} media="(min-width: 768px)" type="video/mp4" />
      <source src={MOBILE_SRC} type="video/mp4" />
    </video>
  );
}
