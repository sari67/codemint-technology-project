/**
 * Professional, Lovable & Emotional Birthday Story Engine for Amma
 */

document.addEventListener('DOMContentLoaded', () => {
  // Current or next birthday target (Defaults to today/upcoming)
  const today = new Date();
  let bdayTarget = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0);

  const defaultData = {
    ammaName: "Amma",
    nickname: "My Guiding Angel",
    birthdayDate: bdayTarget.toISOString(),
    letterTitle: "To My First Home, My Forever Hero — Amma 🌸❤️",
    letterText: `Dearest Amma,

Happy Birthday to the most selfless, loving, and beautiful mother in the entire universe!

Words will never be enough to thank you for everything you have silently done for me. You woke up before the world stirred, sacrificed your own comfort, and poured your whole heart into making our lives happy, safe, and fulfilled.

Whenever life felt heavy, just hearing your reassuring voice or resting my head upon your lap was enough to heal everything. You are my first teacher, my best friend, my shield against every trouble, and my biggest blessing from God.

On this special day, my deepest prayer is for your sound health, peaceful mind, long life, and endless reasons to smile. May your days ahead be filled with as much happiness as you have selflessly showered upon our family.

With endless love, gratitude, and devotion,`,
    signature: "Yours Forever & Always with Infinite Love, Your Child ❤️"
  };

  // State Management
  let appState = { ...defaultData };
  const savedState = localStorage.getItem('birthday_wish_state_amma_v1');
  if (savedState) {
    try {
      appState = { ...defaultData, ...JSON.parse(savedState) };
    } catch (e) {
      console.warn("State parse error:", e);
    }
  }

  // DOM Elements
  const elAmmaName = document.getElementById('display-amma-name');
  const elCakeBannerName = document.getElementById('cake-banner-name');
  const elCertName = document.getElementById('cert-amma-name');
  const elLetterTitle = document.getElementById('display-letter-title');
  const elLetterContent = document.getElementById('display-letter-content');
  const elLetterSignature = document.getElementById('display-letter-signature');

  function renderApp() {
    if (elAmmaName) elAmmaName.textContent = `Happy Birthday ${appState.ammaName}! 🌸❤️`;
    if (elCakeBannerName) elCakeBannerName.textContent = `✨ Happy Birthday Dearest ${appState.ammaName}! ✨`;
    if (elCertName) elCertName.textContent = `${appState.ammaName} (World's Best Mother)`;
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

  // Soft Chime Sound
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

  // Motherly Gentle Piano Harmony (Sound Fallback)
  const gentleChords = [
    [261.63, 329.63, 392.00, 523.25], // C Major
    [220.00, 261.63, 329.63, 440.00], // A Minor
    [174.61, 220.00, 261.63, 349.23], // F Major
    [196.00, 246.94, 293.66, 392.00]  // G Major
  ];

  function playPianoChord() {
    if (!audioCtx || !isPlayingAudio) return;
    const chord = gentleChords[Math.floor(Math.random() * gentleChords.length)];
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

  const audioBtn = document.getElementById('btn-audio-toggle');
  const audioToggleText = document.getElementById('audio-toggle-text');
  const soundWave = document.getElementById('sound-wave-icon');
  const localAudio = document.getElementById('local-audio-player');
  let ytPlayer = null;
  let ytReady = false;

  const SONG_START_TIME = 172; // Starts at 2 minutes 52 seconds
  const YT_VIDEO_ID = 'YbbLBUTwLHM'; // Think Music Official "Neeye Neeye" - M. Kumaran Son of Mahalakshmi

  // Load YouTube IFrame API as fallback for "Neeye Neeye"
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
        videoId: YT_VIDEO_ID,
        playerVars: {
          start: SONG_START_TIME,
          autoplay: 0,
          loop: 1,
          playlist: YT_VIDEO_ID,
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
      if (audioToggleText) audioToggleText.textContent = 'Playing Music ♪';
    } else {
      if (soundWave) soundWave.classList.add('muted');
      if (audioToggleText) audioToggleText.textContent = 'Play Music 🎵';
    }
  }

  if (localAudio) {
    localAudio.addEventListener('play', () => setPlayerUI(true));
    localAudio.addEventListener('pause', () => setPlayerUI(false));
    localAudio.addEventListener('ended', () => {
      localAudio.currentTime = 0;
      localAudio.play();
    });
  }

  function toggleSongPlay() {
    initAudio();

    if (isPlayingAudio) {
      if (localAudio && !localAudio.paused) {
        localAudio.pause();
      }
      if (ytPlayer && ytReady && typeof ytPlayer.pauseVideo === 'function') {
        ytPlayer.pauseVideo();
      }
      if (audioInterval) clearInterval(audioInterval);
      setPlayerUI(false);
    } else {
      if (localAudio) {
        localAudio.play().then(() => {
          setPlayerUI(true);
        }).catch((err) => {
          console.warn("Local audio play failed, falling back to YouTube:", err);
          if (ytPlayer && ytReady && typeof ytPlayer.playVideo === 'function') {
            try {
              ytPlayer.seekTo(SONG_START_TIME, true);
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
      const colors = ['#ff6b8b', '#f7d070', '#ffd166', '#ff8da5', '#e879f9', '#ffffff'];
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
   * 3. Floating Hearts, Floral Sparkles & Fairy Dust Background
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
    const heartColors = ['#ff758c', '#ff7eb3', '#ff8da5', '#f472b6', '#e879f9'];
    const starColors = ['#f7d070', '#ffe699', '#ffffff', '#ffd166'];
    const petalColors = ['rgba(255, 192, 203, 0.65)', 'rgba(255, 182, 193, 0.55)', 'rgba(247, 208, 112, 0.5)'];

    class CuteParticle {
      constructor(initRandomY = false) {
        this.reset(initRandomY);
      }
      reset(initRandomY = false) {
        this.x = Math.random() * width;
        this.y = initRandomY ? Math.random() * height : height + Math.random() * 60;
        
        const rand = Math.random();
        if (rand < 0.45) {
          this.type = 'heart';
          this.size = Math.random() * 9 + 8;
          this.color = heartColors[Math.floor(Math.random() * heartColors.length)];
        } else if (rand < 0.8) {
          this.type = 'star';
          this.size = Math.random() * 7 + 5;
          this.color = starColors[Math.floor(Math.random() * starColors.length)];
        } else {
          this.type = 'petal';
          this.size = Math.random() * 7 + 4;
          this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
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
          const s = this.size;
          ctx.beginPath();
          ctx.moveTo(0, -s * 0.25);
          ctx.bezierCurveTo(-s * 0.5, -s * 0.8, -s, -s * 0.2, 0, s * 0.85);
          ctx.bezierCurveTo(s, -s * 0.2, s * 0.5, -s * 0.8, 0, -s * 0.25);
          ctx.closePath();
          ctx.fill();
        } else if (this.type === 'star') {
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
          // Soft flower petal
          ctx.beginPath();
          ctx.ellipse(0, 0, this.size, this.size * 0.6, Math.PI / 4, 0, 2 * Math.PI);
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
   * 5. Step 2: Birthday Cake Candle Blowing for Amma
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
        cakeStatusText.innerHTML = `✨ <strong>Happy Birthday Amma!</strong> All candles blown! May God bless you with endless health, inner peace, long life, and boundless happiness today & always! 🌸🙏🎉`;
        if (window.triggerConfetti) window.triggerConfetti();
        if (btnNextAfterCake) btnNextAfterCake.disabled = false;
      }, 700);
    }
  }

  if (btnBlowCake) btnBlowCake.addEventListener('click', blowOutAllCandles);
  flameGlows.forEach(flame => flame.parentElement.addEventListener('click', blowOutAllCandles));

  /* =========================================================
   * 6. Step 3: Balloon Pop Surprises
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
   * 7. Step 4: Secret Love Letter to Amma
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
   * 8. Step 5: Reasons Why Amma is the Greatest (Tap 3x Required)
   * ========================================================= */
  const reasonsList = [
    "The way you look into my eyes and instantly understand my feelings without me uttering a single word.",
    "Your quiet, selfless sacrifices that put our happiness, safety, and health first every single day.",
    "The magical aroma of your cooking and how your warm kitchen always feels like home and heaven.",
    "Your constant prayers and blessings that form an unbreakable shield around me wherever I go.",
    "Your gentle lap and warm embrace that make even the hardest days instantly melt away.",
    "How proudly your eyes shine with joy whenever I achieve even the smallest victory in life.",
    "Your boundless patience and resilience, teaching us how to live with love, honesty, and grace.",
    "Because God couldn't be everywhere in person, so He blessed our lives with YOU as our Amma. 🌸"
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
          reasonsTapBadge.innerHTML = `✨ <strong>${requiredTaps} / ${requiredTaps} Reasons Unlocked!</strong> You can now proceed to Amma's Grand Award! 🏆`;
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
   * 9. Live Celebration Pulse Timer
   * ========================================================= */
  const elHours = document.getElementById('count-hours');
  const elMins = document.getElementById('count-mins');
  const elSecs = document.getElementById('count-secs');

  function updateCelebrationTimer() {
    const now = new Date();
    if (elHours) elHours.textContent = String(now.getHours()).padStart(2, '0');
    if (elMins) elMins.textContent = String(now.getMinutes()).padStart(2, '0');
    if (elSecs) elSecs.textContent = String(now.getSeconds()).padStart(2, '0');
  }

  setInterval(updateCelebrationTimer, 1000);
  updateCelebrationTimer();
});
