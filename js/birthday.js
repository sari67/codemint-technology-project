/**
 * Professional, Lovable & Cutest Birthday Story Engine for Bharath
 * Target Date: October 31st
 */

document.addEventListener('DOMContentLoaded', () => {
  // Target October 31 Birthday
  const currentYear = new Date().getFullYear();
  let oct31Target = new Date(currentYear, 9, 31, 0, 0, 0); // Month 9 = October
  if (new Date() > oct31Target) {
    oct31Target = new Date(currentYear + 1, 9, 31, 0, 0, 0);
  }

  const defaultData = {
    boyfriendName: "Bharath",
    nickname: "My Handsome Prince",
    birthdayDate: oct31Target.toISOString(),
    letterTitle: "To The Love of My Life, Bharath ❤️",
    letterText: `My Dearest Bharath,

Happy Birthday to the most handsome, kind-hearted, and extraordinary man in my life!

Today is the most precious day in my world, because it's the day the universe gifted me YOU. From the moment you walked into my life, every ordinary day became brighter, sweeter, and infinitely happier. You are my safe haven, my loudest laughter, and my deepest peace.

Thank you for being your wonderful self—for the way you hold my hand, the way your eyes crinkle when you laugh, and how loved you make me feel every single second.

On your special day, I wish you all the happiness, good health, wild success, and dreams come true that your beautiful heart can hold. I promise to be by your side cheering for you through all of it!

Forever & Always Yours with all my love,`,
    signature: "Yours Forever & Always ❤️"
  };

  // State Management
  let appState = { ...defaultData };
  const savedState = localStorage.getItem('birthday_wish_state_bharath_v2');
  if (savedState) {
    try {
      appState = { ...defaultData, ...JSON.parse(savedState) };
      if (!appState.letterTitle || appState.letterTitle.includes("Human Being")) {
        appState.letterTitle = defaultData.letterTitle;
      }
    } catch (e) {
      console.warn("State parse error:", e);
    }
  }

  // DOM Elements
  const elBoyfriendName = document.getElementById('display-boyfriend-name');
  const elCakeBannerName = document.getElementById('cake-banner-name');
  const elCertName = document.getElementById('cert-boyfriend-name');
  const elLetterTitle = document.getElementById('display-letter-title');
  const elLetterContent = document.getElementById('display-letter-content');
  const elLetterSignature = document.getElementById('display-letter-signature');

  function renderApp() {
    if (elBoyfriendName) elBoyfriendName.textContent = `Happy Birthday ${appState.boyfriendName}! ❤️`;
    if (elCakeBannerName) elCakeBannerName.textContent = `✨ Happy Birthday ${appState.boyfriendName}! ✨`;
    if (elCertName) elCertName.textContent = appState.boyfriendName;
    if (elLetterTitle) elLetterTitle.textContent = appState.letterTitle;
    if (elLetterContent) elLetterContent.textContent = appState.letterText;
    if (elLetterSignature) elLetterSignature.textContent = appState.signature;
  }

  renderApp();

  /* =========================================================
   * 1. Audio Engine & Sound FX (Web Audio API)
   * ========================================================= */
  let audioCtx = null;
  let isPlayingAudio = false;
  let audioInterval = null;

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Chime Sound
  function playChime() {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.08 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 1.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 1.3);
    });
  }

  // Pop Sound
  function playPop() {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.frequency.setValueAtTime(380, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.1);
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  // Romantic Piano Chords (Sound Fallback)
  const romanticChords = [
    [261.63, 329.63, 392.00, 493.88], // Cmaj7
    [220.00, 261.63, 329.63, 392.00], // Am7
    [174.61, 220.00, 261.63, 329.63], // Fmaj7
    [196.00, 246.94, 293.66, 349.23]  // G7
  ];

  function playPianoChord() {
    if (!audioCtx || !isPlayingAudio) return;
    const chord = romanticChords[Math.floor(Math.random() * romanticChords.length)];
    const now = audioCtx.currentTime;

    chord.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.15);
      gain.gain.setValueAtTime(0, now + idx * 0.15);
      gain.gain.linearRampToValueAtTime(0.07, now + idx * 0.15 + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.15 + 2.5);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now + idx * 0.15);
      osc.stop(now + idx * 0.15 + 2.6);
    });
  }

  /* =========================================================
   * Dedicated Song Player: "Enadhuyire" (Bheema)
   * ========================================================= */
  let ytPlayer = null;
  let ytReady = false;

  const audioBtn = document.getElementById('btn-audio-toggle');
  const audioToggleText = document.getElementById('audio-toggle-text');
  const soundWave = document.getElementById('sound-wave-icon');
  const songCardPlayBtn = document.getElementById('song-card-play-btn');
  const songCardIcon = document.getElementById('song-card-icon');
  const songCardText = document.getElementById('song-card-text');
  const vinylDisc = document.getElementById('vinyl-disc');
  const localAudio = document.getElementById('local-audio-player');

  // Load YouTube IFrame API for "Enadhuyire" - Bheema
  const ytScriptTag = document.createElement('script');
  ytScriptTag.src = "https://www.youtube.com/iframe_api";
  const firstScript = document.getElementsByTagName('script')[0];
  if (firstScript && firstScript.parentNode) {
    firstScript.parentNode.insertBefore(ytScriptTag, firstScript);
  } else {
    document.head.appendChild(ytScriptTag);
  }

  window.onYouTubeIframeAPIReady = function () {
    try {
      ytPlayer = new YT.Player('yt-player-container', {
        height: '100',
        width: '100',
        videoId: 'BrMRNaIuU7A', // Official "Enadhuyire" Video Song (Bheema)
        playerVars: {
          autoplay: 0,
          loop: 1,
          playlist: 'BrMRNaIuU7A',
          controls: 0
        },
        events: {
          onReady: function () {
            ytReady = true;
          },
          onStateChange: function (event) {
            if (event.data === YT.PlayerState.PLAYING) {
              setPlayerUI(true);
            } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
              setPlayerUI(false);
            }
          }
        }
      });
    } catch (e) {
      console.warn("YouTube player init:", e);
    }
  };

  function setPlayerUI(playing) {
    isPlayingAudio = playing;
    if (playing) {
      if (soundWave) soundWave.classList.remove('muted');
      if (audioToggleText) audioToggleText.textContent = 'Music Playing ♪';
    } else {
      if (soundWave) soundWave.classList.add('muted');
      if (audioToggleText) audioToggleText.textContent = 'Play Music 🎵';
    }
  }

  // Sync UI with audio events directly
  if (localAudio) {
    localAudio.addEventListener('play', () => setPlayerUI(true));
    localAudio.addEventListener('pause', () => setPlayerUI(false));
    localAudio.addEventListener('ended', () => setPlayerUI(false));
  }

  function toggleSongPlay() {
    initAudio();

    if (isPlayingAudio) {
      // Pause
      if (localAudio && !localAudio.paused) {
        localAudio.pause();
      }
      if (ytPlayer && ytReady && typeof ytPlayer.pauseVideo === 'function') {
        ytPlayer.pauseVideo();
      }
      if (audioInterval) clearInterval(audioInterval);
      setPlayerUI(false);
    } else {
      // Play Direct Song (Enadhuyire - Bheema)
      if (localAudio) {
        localAudio.play().then(() => {
          setPlayerUI(true);
        }).catch((err) => {
          console.warn("Direct audio play error:", err);
          if (ytPlayer && ytReady && typeof ytPlayer.playVideo === 'function') {
            try {
              ytPlayer.playVideo();
              setPlayerUI(true);
            } catch (e) {
              console.warn("YouTube playVideo failed:", e);
            }
          } else {
            setPlayerUI(true);
            playPianoChord();
            audioInterval = setInterval(playPianoChord, 3500);
          }
        });
      }
    }
  }

  if (audioBtn) audioBtn.addEventListener('click', toggleSongPlay);

  /* =========================================================
   * 2. Confetti System
   * ========================================================= */
  const confettiCanvas = document.getElementById('confetti-canvas');
  if (confettiCanvas) {
    const cctx = confettiCanvas.getContext('2d');
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    let confettiPieces = [];

    window.triggerConfetti = function () {
      initAudio();
      playChime();
      confettiCanvas.width = window.innerWidth;
      confettiCanvas.height = window.innerHeight;
      const colors = ['#ff436e', '#f7d070', '#2ed573', '#70a1ff', '#ff8da5'];
      for (let i = 0; i < 110; i++) {
        confettiPieces.push({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
          vx: (Math.random() - 0.5) * 16,
          vy: (Math.random() - 0.8) * 18,
          size: Math.random() * 10 + 5,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 12,
          opacity: 1
        });
      }
    };

    function renderConfetti() {
      cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      for (let i = confettiPieces.length - 1; i >= 0; i--) {
        const p = confettiPieces[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35;
        p.opacity -= 0.008;
        p.rotation += p.rotSpeed;

        cctx.save();
        cctx.translate(p.x, p.y);
        cctx.rotate((p.rotation * Math.PI) / 180);
        cctx.globalAlpha = Math.max(0, p.opacity);
        cctx.fillStyle = p.color;
        cctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        cctx.restore();

        if (p.opacity <= 0 || p.y > window.innerHeight) confettiPieces.splice(i, 1);
      }
      requestAnimationFrame(renderConfetti);
    }
    renderConfetti();
  }

  /* =========================================================
   * 3. Cutest & Most Unique Floating Hearts, Stars & Fairy Dust Background
   * ========================================================= */
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const heartColors = ['#ff436e', '#ff7096', '#ff8da5', '#f472b6', '#e879f9', '#ff5376'];
    const starColors = ['#f7d070', '#ffe699', '#ffffff', '#ffd166', '#fed7aa'];
    const bubbleColors = ['rgba(255, 182, 193, 0.5)', 'rgba(247, 208, 112, 0.45)', 'rgba(216, 180, 254, 0.5)'];

    class CuteParticle {
      constructor(initRandomY = false) {
        this.reset(initRandomY);
      }
      reset(initRandomY = false) {
        this.x = Math.random() * width;
        this.y = initRandomY ? Math.random() * height : height + Math.random() * 60;
        
        // 45% Hearts, 35% Stars, 20% Fairy Bubbles
        const rand = Math.random();
        if (rand < 0.45) {
          this.type = 'heart';
          this.size = Math.random() * 9 + 8; // Size 8 to 17px
          this.color = heartColors[Math.floor(Math.random() * heartColors.length)];
        } else if (rand < 0.8) {
          this.type = 'star';
          this.size = Math.random() * 7 + 5; // Size 5 to 12px
          this.color = starColors[Math.floor(Math.random() * starColors.length)];
        } else {
          this.type = 'bubble';
          this.size = Math.random() * 6 + 4; // Size 4 to 10px
          this.color = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
        }

        this.speedY = Math.random() * 0.7 + 0.35;
        this.swayAngle = Math.random() * Math.PI * 2;
        this.swaySpeed = Math.random() * 0.02 + 0.01;
        this.swayDist = Math.random() * 1.6 + 0.8;
        this.rotation = Math.random() * 360;
        this.rotSpeed = (Math.random() - 0.5) * 1.1;
        this.opacity = Math.random() * 0.55 + 0.35;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * 0.04 + 0.02;
      }

      update() {
        this.y -= this.speedY;
        this.swayAngle += this.swaySpeed;
        this.x += Math.sin(this.swayAngle) * this.swayDist;
        this.rotation += this.rotSpeed;
        this.pulse += this.pulseSpeed;

        if (this.y < -35) this.reset();
      }

      draw() {
        const currentOpacity = Math.max(0.18, this.opacity + Math.sin(this.pulse) * 0.18);
        const currentScale = 1 + Math.sin(this.pulse) * 0.14;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.scale(currentScale, currentScale);
        ctx.globalAlpha = currentOpacity;
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;

        if (this.type === 'heart') {
          // Romantic plump heart shape
          const s = this.size;
          ctx.beginPath();
          ctx.moveTo(0, -s * 0.25);
          ctx.bezierCurveTo(-s * 0.5, -s * 0.8, -s, -s * 0.2, 0, s * 0.85);
          ctx.bezierCurveTo(s, -s * 0.2, s * 0.5, -s * 0.8, 0, -s * 0.25);
          ctx.closePath();
          ctx.fill();
        } else if (this.type === 'star') {
          // Twinkling diamond 4-pointed star
          const rOuter = this.size;
          const rInner = this.size * 0.22;
          ctx.beginPath();
          for (let i = 0; i < 8; i++) {
            const r = i % 2 === 0 ? rOuter : rInner;
            const a = (i * Math.PI) / 4;
            const px = Math.cos(a) * r;
            const py = Math.sin(a) * r;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
        } else {
          // Cute glowing fairy bubble with highlight
          ctx.beginPath();
          ctx.arc(0, 0, this.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
          ctx.beginPath();
          ctx.arc(-this.size * 0.35, -this.size * 0.35, this.size * 0.28, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    const particleCount = 45;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new CuteParticle(true));
    }

    function animateCuteParticles() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateCuteParticles);
    }
    animateCuteParticles();
  }

  /* =========================================================
   * 4. Step Navigation Engine (Screen Transitions)
   * ========================================================= */
  let currentStep = 1;
  const totalSteps = 6;

  const stepScreens = document.querySelectorAll('.step-screen');

  function goToStep(stepNum) {
    if (stepNum < 1 || stepNum > totalSteps) return;

    stepScreens.forEach((screen) => screen.classList.remove('active'));

    currentStep = stepNum;
    const targetScreen = document.getElementById(`step-screen-${currentStep}`);
    if (targetScreen) targetScreen.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (currentStep === 6 && window.triggerConfetti) window.triggerConfetti();
  }

  document.querySelectorAll('[data-next-step]').forEach((btn) => {
    btn.addEventListener('click', () => goToStep(currentStep + 1));
  });

  document.querySelectorAll('[data-prev-step]').forEach((btn) => {
    btn.addEventListener('click', () => goToStep(currentStep - 1));
  });

  /* =========================================================
   * 5. Operation 2: Cutest Birthday Cake for Bharath
   * ========================================================= */
  const btnBlowCake = document.getElementById('btn-blow-candles-op');
  const btnNextAfterCake = document.getElementById('btn-next-after-cake');
  const flameGlows = document.querySelectorAll('.flame-glow');
  const cakeStatusText = document.getElementById('cake-status-text');

  let flamesBlownCount = 0;

  function blowOutAllCandles() {
    if (flamesBlownCount >= flameGlows.length) return;
    initAudio();
    playChime();

    flameGlows.forEach((flame, index) => {
      setTimeout(() => flame.classList.add('off'), index * 200);
    });

    flamesBlownCount = flameGlows.length;

    if (cakeStatusText) {
      setTimeout(() => {
        cakeStatusText.innerHTML = `✨ <strong>Happy Birthday Bharath!</strong> All candles blown! May every wish your heart whispers come true today & always! ❤️🎉`;
        if (window.triggerConfetti) window.triggerConfetti();
        if (btnNextAfterCake) btnNextAfterCake.disabled = false;
      }, 700);
    }
  }

  if (btnBlowCake) btnBlowCake.addEventListener('click', blowOutAllCandles);
  flameGlows.forEach(flame => flame.parentElement.addEventListener('click', blowOutAllCandles));

  /* =========================================================
   * 6. Operation 3: Balloon Pop Surprises
   * ========================================================= */
  const balloonItems = document.querySelectorAll('.balloon-item');
  const btnNextAfterBalloons = document.getElementById('btn-next-after-balloons');
  let poppedCount = 0;

  balloonItems.forEach((balloon) => {
    balloon.addEventListener('click', function () {
      if (!this.classList.contains('popped')) {
        initAudio();
        playPop();
        this.classList.add('popped');
        poppedCount++;

        if (window.triggerConfetti) window.triggerConfetti();
        if (poppedCount >= 2 && btnNextAfterBalloons) {
          btnNextAfterBalloons.disabled = false;
        }
      }
    });
  });

  /* =========================================================
   * 7. Operation 4: Secret Love Letter
   * ========================================================= */
  const envelopeBtn = document.getElementById('envelope-graphic');
  const letterPaper = document.getElementById('letter-paper');
  const btnNextAfterLetter = document.getElementById('btn-next-after-letter');

  if (envelopeBtn && letterPaper) {
    envelopeBtn.addEventListener('click', () => {
      initAudio();
      playChime();
      letterPaper.style.display = 'block';
      if (window.triggerConfetti) window.triggerConfetti();
      if (btnNextAfterLetter) btnNextAfterLetter.disabled = false;
    });
  }

  /* =========================================================
   * 8. Operation 5: Reasons Deck (Tap 3x Required)
   * ========================================================= */
  const reasonsList = [
    "The way your eyes crinkle with pure warmth whenever you laugh, Bharath.",
    "How patient, caring, and deeply understanding you always are with me.",
    "Your warm bear hugs that instantly make all the noise in the world fade away.",
    "That you are not just the love of my life, but my best friend and favorite company.",
    "How handsome and charming you look, especially when you smile softly.",
    "Your big heart, your inspiring dedication, and your gentle soul.",
    "Simply because being loved by you, Bharath, is the greatest gift of my life."
  ];

  let currentReasonIdx = 0;
  let reasonsTapCount = 0;
  const requiredTaps = 3;

  const reasonTextEl = document.getElementById('reason-card-text');
  const btnNextReason = document.getElementById('btn-next-reason');
  const btnNextAfterReasons = document.getElementById('btn-next-after-reasons');
  const reasonsTapBadge = document.getElementById('reasons-tap-badge');

  if (btnNextReason && reasonTextEl) {
    btnNextReason.addEventListener('click', () => {
      initAudio();
      playChime();
      reasonsTapCount++;

      if (reasonsTapBadge) {
        if (reasonsTapCount >= requiredTaps) {
          reasonsTapBadge.innerHTML = `✨ <strong>${requiredTaps} / ${requiredTaps} Reasons Unlocked!</strong> You can now proceed to the next step! 🎉`;
          reasonsTapBadge.style.color = '#f7d070';
        } else {
          reasonsTapBadge.textContent = `Tap count: ${reasonsTapCount} / ${requiredTaps} taps needed to unlock next step ✨`;
        }
      }

      if (reasonsTapCount >= requiredTaps && btnNextAfterReasons) {
        btnNextAfterReasons.disabled = false;
        if (window.triggerConfetti) window.triggerConfetti();
      }

      reasonTextEl.style.opacity = '0';
      setTimeout(() => {
        currentReasonIdx = (currentReasonIdx + 1) % reasonsList.length;
        reasonTextEl.textContent = `"${reasonsList[currentReasonIdx]}"`;
        reasonTextEl.style.opacity = '1';
      }, 200);
    });
  }



  /* =========================================================
   * 10. October 31 Countdown Timer
   * ========================================================= */
  const elHours = document.getElementById('count-hours');
  const elMins = document.getElementById('count-mins');
  const elSecs = document.getElementById('count-secs');

  function updateCountdown() {
    const target = new Date(appState.birthdayDate).getTime();
    const now = new Date().getTime();
    const diff = target - now;

    if (diff > 0) {
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      if (elHours) elHours.textContent = String(hours).padStart(2, '0');
      if (elMins) elMins.textContent = String(mins).padStart(2, '0');
      if (elSecs) elSecs.textContent = String(secs).padStart(2, '0');
    } else {
      if (elHours) elHours.textContent = '00';
      if (elMins) elMins.textContent = '00';
      if (elSecs) elSecs.textContent = '00';
    }
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  /* =========================================================
   * 11. Modal Customizer
   * ========================================================= */
  const btnCustomizer = document.getElementById('btn-open-customizer');
  const modalOverlay = document.getElementById('modal-customizer');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const formCustomizer = document.getElementById('form-customizer');

  if (btnCustomizer && modalOverlay) {
    btnCustomizer.addEventListener('click', () => {
      document.getElementById('input-bf-name').value = appState.boyfriendName;
      document.getElementById('input-nickname').value = appState.nickname;
      document.getElementById('input-letter-title').value = appState.letterTitle;
      document.getElementById('input-letter-text').value = appState.letterText;
      document.getElementById('input-signature').value = appState.signature;
      modalOverlay.classList.add('active');
    });
  }

  if (btnCloseModal && modalOverlay) {
    btnCloseModal.addEventListener('click', () => modalOverlay.classList.remove('active'));
  }

  if (formCustomizer) {
    formCustomizer.addEventListener('submit', (e) => {
      e.preventDefault();
      appState.boyfriendName = document.getElementById('input-bf-name').value || defaultData.boyfriendName;
      appState.nickname = document.getElementById('input-nickname').value || defaultData.nickname;
      appState.letterTitle = document.getElementById('input-letter-title').value || defaultData.letterTitle;
      appState.letterText = document.getElementById('input-letter-text').value || defaultData.letterText;
      appState.signature = document.getElementById('input-signature').value || defaultData.signature;

      localStorage.setItem('birthday_wish_state_bharath_v2', JSON.stringify(appState));
      renderApp();
      modalOverlay.classList.remove('active');
      if (window.triggerConfetti) window.triggerConfetti();
    });
  }
});
