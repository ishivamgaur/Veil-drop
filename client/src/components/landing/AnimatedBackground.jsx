import React, { useMemo } from 'react';
import Particles, { ParticlesProvider } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

export default function AnimatedBackground() {
  const init = async (engine) => {
    await loadSlim(engine);
  };

  const options = useMemo(
    () => ({
      background: {
        color: {
          value: "transparent",
        },
      },
      fullScreen: { enable: false },
      fpsLimit: 60,
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: "repulse",
          },
        },
        modes: {
          repulse: {
            distance: 100,
            duration: 0.4,
          },
        },
      },
      particles: {
        color: {
          value: "#ded1b6",
        },
        links: {
          color: "#ffffff",
          distance: 150,
          enable: true,
          opacity: 0.05,
          width: 1,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "bounce",
          },
          random: true,
          speed: 0.4,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            width: 1000,
            height: 1000,
          },
          value: 60,
        },
        opacity: {
          value: 0.2,
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 2 },
        },
      },
      detectRetina: true,
    }),
    [],
  );

  return (
    <div className="absolute top-0 left-0 w-full h-[90vh] pointer-events-none z-0 opacity-80 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#13151a] via-[#070708] to-[#070708] -z-20"></div>
      <ParticlesProvider init={init}>
        <Particles
          id="tsparticles"
          options={options}
          className="w-full h-full"
        />
      </ParticlesProvider>
      {/* Top mask so it fades out smoothly before the bento grid */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#070708] to-transparent pointer-events-none"></div>
    </div>
  );
}
