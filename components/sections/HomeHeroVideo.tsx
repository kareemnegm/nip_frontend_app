const DESKTOP_SRC = "/video/night-hero.mp4";
const MOBILE_SRC = "/video/night-hero-mobile.mp4";
const POSTER_SRC = "/video/night-hero-poster.jpg";

/**
 * Hero background video (Figma 1525:28266).
 *
 * Rendered server-side rather than mounted after hydration so the browser
 * starts fetching it with the document and playback begins on first paint —
 * the files are encoded with faststart, so playing does not wait for the full
 * download. The poster is the video's own first frame, which means there is no
 * visible swap between the still and the moving footage.
 *
 * The <source media> pair keeps phones on the lighter encode. Browsers that
 * ignore `media` fall back to the first source, which still plays correctly.
 */
export function HomeHeroVideo() {
  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={POSTER_SRC}
      aria-hidden="true"
      tabIndex={-1}
      className="absolute inset-0 h-full w-full object-cover object-center motion-reduce:hidden"
    >
      <source src={DESKTOP_SRC} media="(min-width: 768px)" type="video/mp4" />
      <source src={MOBILE_SRC} type="video/mp4" />
    </video>
  );
}
