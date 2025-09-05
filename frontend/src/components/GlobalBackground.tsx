import React from "react";
import { ParticleField, CloudEye, UFOIcon, SkullIcon, EyeIcon, CharacterIcon } from "@/components/grit-illustrations";

/**
 * GlobalBackground
 * - Fixed, pointer-events-none decorative layer for the whole app
 * - Reuses the same background elements from Hero (particles + subtle floating SVGs + glow circles)
 */
const GlobalBackground: React.FC = () => {
  return (
    <div aria-hidden className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Particle field */}
      <ParticleField />

      {/* Floating SVGs (lightweight, with glow pulse) */}
      <CloudEye
        data-parallax
        data-speed="0.045"
        data-amp="16"
        data-phase="0"
        className="svg-float absolute top-20 left-10 float glow-pulse opacity-80"
        style={{ animationDelay: "0s" }}
      />
      <UFOIcon
        data-parallax
        data-speed="-0.04"
        data-amp="22"
        data-phase="0.9"
        className="svg-float absolute top-32 right-20 float float-fast glow-pulse opacity-80"
        style={{ animationDelay: "2s" }}
      />
      <SkullIcon
        data-parallax
        data-speed="0.06"
        data-amp="12"
        data-phase="1.9"
        className="svg-float absolute top-60 right-10 float glow-pulse opacity-70"
        style={{ animationDelay: "4s" }}
      />
      <EyeIcon
        data-parallax
        data-speed="-0.03"
        data-amp="18"
        data-phase="0.4"
        className="svg-float absolute bottom-40 left-20 float float-fast glow-pulse opacity-80"
        style={{ animationDelay: "1s" }}
      />
      <CharacterIcon
        data-parallax
        data-speed="0.05"
        data-amp="14"
        data-phase="2.6"
        className="svg-float absolute bottom-20 right-32 float glow-pulse opacity-80"
        style={{ animationDelay: "3s" }}
      />
      <CloudEye
        data-parallax
        data-speed="-0.02"
        data-amp="26"
        data-phase="4.2"
        className="svg-float absolute top-[20rem] left-1/3 float glow-pulse opacity-70"
        style={{ animationDelay: "5s" }}
      />
      <UFOIcon
        data-parallax
        data-speed="0.03"
        data-amp="18"
        data-phase="3.1"
        className="svg-float absolute bottom-60 left-1/4 float float-fast glow-pulse opacity-80"
        style={{ animationDelay: "1.5s" }}
      />

      {/* Glow circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-32 left-20 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-float" style={{ animationDelay: "2s" }} />
      </div>
    </div>
  );
};

export default GlobalBackground;
