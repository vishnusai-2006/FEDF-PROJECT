// tsParticles/particles.js config for animated particles background
window.onload = function() {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/tsparticles@2.11.1/tsparticles.bundle.min.js';
  script.onload = function() {
    tsParticles.load('tsparticles', {
      fullScreen: { enable: true, zIndex: -2 },
      particles: {
        number: { value: 60 },
        color: { value: ['#ff6bcb', '#6a89cc', '#38ada9', '#fbc2eb'] },
        shape: { type: 'circle' },
        opacity: { value: 0.5 },
        size: { value: 6, random: { enable: true, minimumValue: 2 } },
        move: { enable: true, speed: 2, direction: 'none', outModes: { default: 'bounce' } }
      },
      background: { color: 'transparent' }
    });
  };
  document.body.appendChild(script);
};
