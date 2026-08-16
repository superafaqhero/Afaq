/* -----------------------------------------------
/* How to use? : Check the GitHub README
/* ----------------------------------------------- */

/* To load a config file (particles.json) you need to host this demo (MAMP/WAMP/local)... */
/*
particlesJS.load('particles-js', 'particles.json', function() {
  console.log('particles.js loaded - callback');
});
*/

/* Otherwise just put the config content (json): */
window.addEventListener('DOMContentLoaded', () => {
  const particleHost = document.querySelector('#particles-js');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!particleHost || prefersReducedMotion || typeof window.particlesJS !== 'function') return;

  const compactViewport = window.matchMedia('(max-width: 820px)').matches;
  const limitedCpu = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
  const particleCount = compactViewport ? 22 : limitedCpu ? 30 : 42;
  const particleSpeed = compactViewport ? 1.1 : 1.8;
  const allowPointerEffects = !compactViewport && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  particlesJS('particles-js', {
    "particles": {
      "number": {
        "value": particleCount,
        "density": {
          "enable": true,
          "value_area": 950
        }
      },
      "color": {
        "value": "#ffffff"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#000000"
        },
        "polygon": {
          "nb_sides": 5
        },
        "image": {
          "src": "img/github.svg",
          "width": 100,
          "height": 100
        }
      },
      "opacity": {
        "value": 0.38,
        "random": false,
        "anim": {
          "enable": false,
          "speed": 1,
          "opacity_min": 0.1,
          "sync": false
        }
      },
      "size": {
        "value": 3.4,
        "random": true,
        "anim": {
          "enable": false,
          "speed": 40,
          "size_min": 0.1,
          "sync": false
        }
      },
      "line_linked": {
        "enable": true,
        "distance": 145,
        "color": "#ffffff",
        "opacity": 0.26,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": particleSpeed,
        "direction": "none",
        "random": false,
        "straight": false,
        "out_mode": "out",
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 1200
        }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": allowPointerEffects,
          "mode": "repulse"
        },
        "onclick": {
          "enable": false,
          "mode": "push"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 400,
          "line_linked": {
            "opacity": 1
          }
        },
        "bubble": {
          "distance": 400,
          "size": 40,
          "duration": 2,
          "opacity": 8,
          "speed": 3
        },
        "repulse": {
          "distance": 200
        },
        "push": {
          "particles_nb": 4
        },
        "remove": {
          "particles_nb": 2
        }
      }
    },
    "retina_detect": false,
    "config_demo": {
      "hide_card": false,
      "background_color": "#b61924",
      "background_image": "",
      "background_position": "50% 50%",
      "background_repeat": "no-repeat",
      "background_size": "cover"
    }
  });

  let heroVisible = true;
  const updateParticleActivity = () => {
    const particleInstance = window.pJSDom?.[0]?.pJS;
    if (!particleInstance) return;
    const shouldMove = heroVisible && !document.hidden;
    if (particleInstance.particles.move.enable === shouldMove) return;
    particleInstance.particles.move.enable = shouldMove;
    if (shouldMove) particleInstance.fn.vendors.draw();
  };

  if ('IntersectionObserver' in window) {
    const particleObserver = new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting;
      updateParticleActivity();
    }, { rootMargin: '120px 0px', threshold: 0 });
    particleObserver.observe(particleHost);
  }

  document.addEventListener('visibilitychange', updateParticleActivity);
});
