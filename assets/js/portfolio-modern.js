(() => {
  const doc = document;
  const body = doc.body;
  const header = doc.querySelector('#site-header');
  const menuButton = doc.querySelector('.menu-toggle');
  const navigation = doc.querySelector('#site-nav');
  const revealItems = [...doc.querySelectorAll('[data-reveal]')];
  const glowItems = [...doc.querySelectorAll('[data-glow]')];
  const year = doc.querySelector('#current-year');
  const radio = doc.querySelector('#portfolio-radio');
  const radioCard = doc.querySelector('.radio-card');
  const radioToggle = doc.querySelector('#radio-toggle');
  const radioStatus = doc.querySelector('#radio-status');
  const radioVolume = doc.querySelector('#radio-volume');
  const radioVolumeValue = doc.querySelector('#radio-volume-value');
  const buildStory = doc.querySelector('[data-build-story]');
  const buildFrame = doc.querySelector('[data-build-frame]');
  const buildFrameImage = doc.querySelector('.build-frame-image');
  const buildFrameCurrent = doc.querySelector('#build-frame-current');
  const buildFrameLabel = doc.querySelector('#build-frame-label');
  const buildSteps = [...doc.querySelectorAll('[data-build-step]')];

  if (year) year.textContent = String(new Date().getFullYear());

  if (radio && radioToggle && radioStatus && radioVolume && radioVolumeValue) {
    const setRadioState = (playing, message) => {
      radioToggle.classList.toggle('is-playing', playing);
      radioCard?.classList.toggle('is-playing', playing);
      radioToggle.setAttribute('aria-pressed', String(playing));
      radioToggle.setAttribute('aria-label', playing ? 'Pause radio' : 'Play radio');
      if (message) radioStatus.textContent = message;
    };

    radio.volume = Number(radioVolume.value) / 100;

    radioToggle.addEventListener('click', async () => {
      if (!radio.paused) {
        radio.pause();
        return;
      }

      radioStatus.textContent = 'Tuning in to the live stream…';
      radioToggle.disabled = true;

      try {
        await radio.play();
      } catch (error) {
        if (error.name !== 'AbortError') {
          setRadioState(false, 'The station is temporarily unavailable. Please try again.');
        }
      } finally {
        radioToggle.disabled = false;
      }
    });

    radio.addEventListener('playing', () => setRadioState(true, 'Live now · Best 90s'));
    radio.addEventListener('pause', () => setRadioState(false, 'Radio paused. Press play when you’re ready.'));
    radio.addEventListener('waiting', () => {
      if (!radio.paused) radioStatus.textContent = 'Reconnecting to the live stream…';
    });
    radio.addEventListener('error', () => setRadioState(false, 'The station is temporarily unavailable. Please try again.'));

    radioVolume.addEventListener('input', () => {
      const volume = Number(radioVolume.value);
      radio.volume = volume / 100;
      radioVolumeValue.textContent = `${volume}%`;
    });
  }

  const framePositions = [
    ['0%', '0%'], ['50%', '0%'], ['100%', '0%'],
    ['0%', '100%'], ['50%', '100%'], ['100%', '100%']
  ];
  let activeBuildFrame = -1;

  const setBuildFrame = (index) => {
    if (!buildFrame || !buildFrameImage || index === activeBuildFrame || !buildSteps[index]) return;

    activeBuildFrame = index;
    const step = buildSteps[index];
    const [frameX, frameY] = framePositions[index] || framePositions[0];

    buildFrameImage.style.setProperty('--frame-x', frameX);
    buildFrameImage.style.setProperty('--frame-y', frameY);
    buildFrameImage.setAttribute('aria-label', step.dataset.frameAlt || 'Website creation stage');
    buildFrame.style.setProperty('--story-progress', `${((index + 1) / buildSteps.length) * 100}%`);
    if (buildFrameCurrent) buildFrameCurrent.textContent = String(index + 1).padStart(2, '0');
    if (buildFrameLabel) buildFrameLabel.textContent = step.dataset.frameLabel || '';

    buildSteps.forEach((item, itemIndex) => item.classList.toggle('is-active', itemIndex === index));
    buildFrame.classList.remove('is-switching');
    void buildFrame.offsetWidth;
    buildFrame.classList.add('is-switching');
  };

  const updateBuildStory = () => {
    if (!buildStory || !buildSteps.length) return;

    const storyBounds = buildStory.getBoundingClientRect();
    if (storyBounds.top > window.innerHeight) {
      setBuildFrame(0);
      return;
    }
    if (storyBounds.bottom < 0) {
      setBuildFrame(buildSteps.length - 1);
      return;
    }

    const viewportFocus = window.innerHeight * 0.55;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    buildSteps.forEach((step, index) => {
      const bounds = step.getBoundingClientRect();
      const distance = Math.abs((bounds.top + bounds.height * 0.5) - viewportFocus);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setBuildFrame(closestIndex);
  };

  setBuildFrame(0);

  const closeMenu = () => {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
    body.classList.remove('menu-open');
  };

  if (menuButton && navigation) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!open));
      navigation.classList.toggle('is-open', !open);
      body.classList.toggle('menu-open', !open);
    });

    navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    doc.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  const updateScrollState = () => {
    const scrollTop = window.scrollY || doc.documentElement.scrollTop;
    const scrollable = doc.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(100, (scrollTop / scrollable) * 100) : 0;
    doc.documentElement.style.setProperty('--scroll-progress', progress.toFixed(2));
    header?.classList.toggle('is-scrolled', scrollTop > 18);
    updateBuildStory();
  };

  updateScrollState();
  window.addEventListener('scroll', updateScrollState, { passive: true });
  window.addEventListener('resize', updateBuildStory);

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -45px' });

    revealItems.forEach((item) => {
      item.style.setProperty('--reveal-delay', `${item.dataset.delay || 0}ms`);
      observer.observe(item);
    });
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    glowItems.forEach((item) => {
      item.addEventListener('pointermove', (event) => {
        const bounds = item.getBoundingClientRect();
        item.style.setProperty('--glow-x', `${event.clientX - bounds.left}px`);
        item.style.setProperty('--glow-y', `${event.clientY - bounds.top}px`);
      });
    });
  }
})();
