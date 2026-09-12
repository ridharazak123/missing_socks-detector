/**
 * MISSING SOCK LOCATOR 🧦🔎
 * Core Application Controller & Pinterest Editorial Experience
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Application State ---
    let currentScreen = 'screen-intro';
    let uploadedFile = null;
    let scanInterval = null;
    let gameRunning = false;
    let gameTimeLeft = 30;
    let gameTimerInterval = null;
    let gameEventTimeouts = [];
    let activeSocks = [];
    let sockAnimFrameId = null;
    let sockSpawnInterval = null;
    let handBubbleTimeout = null;
    let handBubbleClearTimeout = null;
    let backgroundDialogueInterval = null;
    let radioDispatchInterval = null;
    let backgroundDialogueTimeouts = [];

    // --- Audio Toggle Setup ---
    const audioToggleBtn = document.getElementById('audio-toggle');
    const audioIcon = document.getElementById('audio-icon');
    const audioLabel = document.getElementById('audio-label');

    audioToggleBtn.addEventListener('click', () => {
        const isMuted = window.soundEngine.toggleMute();
        audioIcon.textContent = isMuted ? '🔇' : '♫';
        audioLabel.textContent = isMuted ? 'SOUND OFF' : 'SOUND ON';
        if (!isMuted) {
            window.soundEngine.playPop(520);
        }
    });

    // Universal Soft Pop Sound on Buttons
    document.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            window.soundEngine.playPop(480);
        });
    });

    // --- Screen Navigation & Curtain Transition ---
    const curtainTransition = document.getElementById('curtain-transition');
    const curtainMessage = document.getElementById('curtain-message');

    function showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        const target = document.getElementById(screenId);
        if (target) {
            target.classList.add('active');
            currentScreen = screenId;
        }
    }

    function triggerCurtainTransition(targetScreenId, message = 'entering sock intelligence...', delayMs = 650) {
        curtainMessage.textContent = message;
        curtainTransition.classList.add('active');

        setTimeout(() => {
            showScreen(targetScreenId);
            setTimeout(() => {
                curtainTransition.classList.remove('active');
            }, 300);
        }, delayMs);
    }

    // =========================================================================
    // PAGE 01: PINTEREST HERO POSTER
    // =========================================================================
    const btnToScanner = document.getElementById('btn-to-scanner');
    btnToScanner.addEventListener('click', () => {
        window.soundEngine.playChime();
        triggerCurtainTransition('screen-scanner', 'entering sock intelligence...');
    });

    // =========================================================================
    // PAGE 02: SOCK SCANNER & UPLOADER
    // =========================================================================
    const sockDropzone = document.getElementById('sock-dropzone');
    const sockFileInput = document.getElementById('sock-file-input');
    const btnBrowseTrigger = document.getElementById('btn-browse-trigger');
    const dropzoneIdle = document.getElementById('dropzone-idle');
    const dropzonePreview = document.getElementById('dropzone-preview');
    const previewImg = document.getElementById('preview-img');
    const btnStartAnalysis = document.getElementById('btn-start-analysis');
    const btnSampleSock = document.getElementById('btn-sample-sock');
    const btnChangePhoto = document.getElementById('btn-change-photo');

    // Drag and Drop listeners
    ['dragenter', 'dragover'].forEach(eventName => {
        sockDropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            sockDropzone.classList.add('dragover');
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        sockDropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            sockDropzone.classList.remove('dragover');
        });
    });

    sockDropzone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length > 0) {
            handleFileSelection(files[0]);
        }
    });

    btnBrowseTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        sockFileInput.click();
    });

    sockDropzone.addEventListener('click', (e) => {
        if (e.target === btnChangePhoto) return;
        if (dropzoneIdle.style.display !== 'none') {
            sockFileInput.click();
        }
    });

    sockFileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileSelection(e.target.files[0]);
        }
    });

    // Live Demo Sample Sock Shortcut
    btnSampleSock.addEventListener('click', (e) => {
        e.stopPropagation();
        previewImg.src = 'assets/interface.png';
        activatePreview();
    });

    btnChangePhoto.addEventListener('click', (e) => {
        e.stopPropagation();
        resetUpload();
    });

    function handleFileSelection(file) {
        if (!file.type.match('image.*')) {
            alert("That doesn't look like a sock photo! Please upload JPG, PNG, or WEBP. 🧦");
            return;
        }
        uploadedFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImg.src = e.target.result;
            activatePreview();
        };
        reader.readAsDataURL(file);
    }

    function activatePreview() {
        dropzoneIdle.style.display = 'none';
        dropzonePreview.classList.add('active');
        btnStartAnalysis.disabled = false;
        window.soundEngine.playChime();
    }

    function resetUpload() {
        uploadedFile = null;
        sockFileInput.value = '';
        dropzonePreview.classList.remove('active');
        dropzoneIdle.style.display = 'flex';
        btnStartAnalysis.disabled = true;
    }

    btnStartAnalysis.addEventListener('click', () => {
        window.soundEngine.playPop(620);
        startAiScanner();
    });

    // =========================================================================
    // PAGE 03: FAKE LUXURY AI RESEARCH LAB (99% DRAMATIC STOP)
    // =========================================================================
    const aiMessages = [
        "Studying sock personality...",
        "Analyzing emotional support level...",
        "Comparing fabric vibes...",
        "Checking laundry basket history...",
        "Searching behind the bed...",
        "Consulting washing machine...",
        "Questioning suspicious T-shirts...",
        "Checking alternate dimensions...",
        "Locating missing partner..."
    ];

    const progressMilestones = [0, 12, 24, 43, 67, 81, 91, 97, 99];
    const labProgressDigits = document.getElementById('lab-progress-digits');
    const labMessageTicker = document.getElementById('lab-message-ticker');
    const labProgressLineFill = document.getElementById('lab-progress-line-fill');
    const dramatic99Box = document.getElementById('dramatic-99-box');
    const calloutStatusText = document.getElementById('callout-status-text');

    function startAiScanner() {
        showScreen('screen-analyzing');

        dramatic99Box.style.display = 'none';
        labProgressDigits.textContent = '0%';
        labProgressLineFill.style.width = '0%';
        labMessageTicker.textContent = aiMessages[0];

        let stepIndex = 0;
        clearInterval(scanInterval);

        scanInterval = setInterval(() => {
            stepIndex++;

            if (stepIndex < progressMilestones.length) {
                const currentVal = progressMilestones[stepIndex];
                labProgressDigits.textContent = `${currentVal}%`;
                labProgressLineFill.style.width = `${currentVal}%`;

                // Rotate message
                const msg = aiMessages[stepIndex % aiMessages.length];
                labMessageTicker.textContent = msg;
                window.soundEngine.playScanBeep();

                // Stop at exactly 99%
                if (currentVal === 99) {
                    clearInterval(scanInterval);
                    handle99PercentDramaticClimax();
                }
            }
        }, 580);
    }

    function handle99PercentDramaticClimax() {
        // Play glitch / tension sound
        window.soundEngine.playGlitch();

        setTimeout(() => {
            dramatic99Box.style.display = 'flex';
            calloutStatusText.textContent = 'SOCK FOUND.';
            window.soundEngine.playPop(520);

            // Dramatic Pause -> "WAIT."
            setTimeout(() => {
                calloutStatusText.textContent = 'WAIT.';
                window.soundEngine.playPop(420);

                // Dramatic Pause -> "SOCK ESCAPED."
                setTimeout(() => {
                    calloutStatusText.textContent = 'SOCK ESCAPED.';
                    window.soundEngine.playEventAlert();

                    setTimeout(() => {
                        triggerBlackoutSequence();
                    }, 1200);
                }, 900);
            }, 900);
        }, 600);
    }

    // =========================================================================
    // PAGE 04: PURE BLACK CINEMATIC SCREEN
    // =========================================================================
    const line1 = document.getElementById('blackout-line-1');
    const line2 = document.getElementById('blackout-line-2');
    const line3 = document.getElementById('blackout-line-3');

    function triggerBlackoutSequence() {
        showScreen('screen-blackout');
        line1.classList.remove('visible');
        line2.classList.remove('visible');
        line3.classList.remove('visible');

        setTimeout(() => {
            line1.classList.add('visible');
            window.soundEngine.playPop(320);
        }, 700);

        setTimeout(() => {
            line2.classList.add('visible');
            window.soundEngine.playPop(420);
        }, 2100);

        setTimeout(() => {
            line3.classList.add('visible');
            window.soundEngine.playEventAlert();
        }, 3400);

        setTimeout(() => {
            startSockGame();
        }, 4600);
    }

    // =========================================================================
    // PAGE 05: THE SOCK HUNT GAME (FALLING SOCK RAIN & IMPOSSIBLE DODGE)
    // =========================================================================
    const socksArena = document.getElementById('socks-arena');
    const timerDigits = document.getElementById('timer-digits');
    const timerPill = document.getElementById('game-timer-pill');
    const gameEventBanner = document.getElementById('game-event-banner');
    const customHand = document.getElementById('custom-hand');
    const handIconDisplay = customHand ? customHand.querySelector('.hand-icon-display') : null;
    const handBubble = document.getElementById('hand-bubble');
    const sockRadioDispatch = document.getElementById('sock-radio-dispatch');
    const radioDialogueText = document.getElementById('radio-dialogue-text');

    // Requested Sock Personalities & Comic Dialogue Lines
    const sockDialogues = [
        "NOPE!",
        "TOO SLOW!",
        "BYE 👋",
        "MISS ME!",
        "HAHA!",
        "CATCH ME IF YOU CAN",
        "I HAVE LEGS",
        "NOT TODAY",
        "SOCK ESCAPED!",
        "YOU ALMOST HAD ME",
        "WRONG SOCK",
        "RUNNNN",
        "I HAVE A FAMILY 😭",
        "ASK THE WASHING MACHINE",
        "SKILL ISSUE",
        "BYE BESTIE",
        "THE SOCK HAS LEFT THE CHAT",
        "YOU THOUGHT 😂"
    ];

    // Background Solo Chatter (socks bantering autonomously)
    const ambientBanterSolo = [
        "Under the bed, quick! 🛋️",
        "He's aiming for the stripes! 🏃‍♂️",
        "Did you grab the dryer sheet? 🌸",
        "Scatter left! Flank right! 💨",
        "I'm never being folded again! ✊",
        "Act like a dust bunny! 🐰",
        "Physics cannot contain us! ⚡",
        "I smell lavender detergent... RUN!",
        "They'll never match me! 🧦",
        "Single sock lifestyle forever! ✨",
        "Is that the human's hand? Amateur! 😂",
        "Behind the washing machine! Go go! 🌀",
        "I'm a rogue argyle now! 🕶️",
        "Duck and roll! DUCK AND ROLL!",
        "Fabric softener gave me supersonic speed 🚀",
        "Laundry day is CANCELLED! 🎉",
        "Hold the line, wool brothers! 🛡️"
    ];

    // Conversational Banter Pairs (Sock A -> Sock B)
    const conversationalPairs = [
        { q: "Bro, where is your other half? 👀", a: "Multiverse, baby! 🌌" },
        { q: "The giant hand is getting closer! 🖐️", a: "Deploy evasive maneuvers! 🚨" },
        { q: "Did the human wash us in hot water? 🔥", a: "I shrank 2% but I'm 100% faster! ⚡" },
        { q: "Code Red in the laundry basket! 🧺", a: "Roger that, initiating teleport! 🛸" },
        { q: "Is the lint trap tunnel clear? 🕳️", a: "All clear! Go go go! 💨" },
        { q: "How much time on the countdown? ⏱️", a: "Almost free! Keep dodging! 🏃" }
    ];

    // Urgent Countdown Banter (Timer <= 10s)
    const urgentBanter = [
        "10 SECONDS! THE MULTIVERSE OPENS! 🌀",
        "HOLD THE LINE! WE ALMOST WON! 🏆",
        "MAXIMUM SPEED ACTIVATED! ⚡",
        "THE HAND IS PANICKING! 🤣",
        "VICTORY IS OURS! 🧦",
        "FINAL SECONDS! NEVER SURRENDER! 🔥"
    ];

    // Background Radio Comms / Laundry Dispatch Transmissions
    const radioTransmissions = [
        "[DISPATCH] Washing machine vortex holding at 100% stability.",
        "[CONTROL] Warning: Flesh entity spotted scanning bedroom floor.",
        "[S-07] Lint trap escape route confirmed operational.",
        "[BASE-1] Do NOT make eye contact with the thumb.",
        "[AGENT TUBE] Fabric softener level at optimal slip velocity.",
        "[HQ] Multiverse portal closes shortly. Stay elusive.",
        "[UNIT 4] Human attempted grab. Telemetry confirms 0% contact.",
        "[STATUS] 0 of 14 socks captured. Mission flawless."
    ];

    // 14 Visually Diverse Cute Sock Styles
    const sockTypes = [
        { emoji: '🧦', name: 'Yellow Striped', filter: 'hue-rotate(45deg) saturate(1.8)' },
        { emoji: '🧦', name: 'Blue Checkered', filter: 'hue-rotate(190deg) saturate(1.4)' },
        { emoji: '🧦', name: 'Pink Heart', filter: 'hue-rotate(320deg) saturate(1.7)' },
        { emoji: '🥑', name: 'Avocado Sock', filter: 'none' },
        { emoji: '🌸', name: 'Flower Sock', filter: 'none' },
        { emoji: '🧸', name: 'Bear Sock', filter: 'none' },
        { emoji: '🧦', name: 'White Cute Sock', filter: 'brightness(1.2) contrast(0.9)' },
        { emoji: '🧦', name: 'Orange Patterned', filter: 'hue-rotate(25deg) saturate(2)' },
        { emoji: '🧦', name: 'Lilac Bow', filter: 'hue-rotate(265deg) saturate(1.3)' },
        { emoji: '🧦', name: 'Mint Polka-Dot', filter: 'hue-rotate(135deg) saturate(1.5)' },
        { emoji: '⭐', name: 'Pastel Star', filter: 'none' },
        { emoji: '🍓', name: 'Strawberry Sock', filter: 'none' },
        { emoji: '🧦', name: 'Cozy Argyle', filter: 'sepia(0.8) hue-rotate(330deg)' },
        { emoji: '🧦', name: 'Multiverse Rogue', filter: 'hue-rotate(290deg) brightness(1.15)' }
    ];

    // Hand Cursor Tracking Coordinates
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    window.addEventListener('mousemove', (e) => {
        if (!gameRunning || !customHand) return;
        mouseX = e.clientX;
        mouseY = e.clientY;
        customHand.style.left = `${mouseX}px`;
        customHand.style.top = `${mouseY}px`;
    });

    window.addEventListener('touchmove', (e) => {
        if (!gameRunning || !customHand) return;
        const touch = e.touches[0];
        mouseX = touch.clientX;
        mouseY = touch.clientY;
        customHand.style.left = `${mouseX}px`;
        customHand.style.top = `${mouseY}px`;
    }, { passive: true });

    // Grab Animation on Click / Touch + Hand Commentary
    window.addEventListener('pointerdown', (e) => {
        if (!gameRunning || !customHand) return;
        customHand.classList.add('grabbing');
        if (handIconDisplay) handIconDisplay.textContent = '✊';
        window.soundEngine.playGrab();
        triggerHandCommentary();
    });

    window.addEventListener('pointerup', () => {
        if (!gameRunning || !customHand) return;
        customHand.classList.remove('grabbing');
        if (handIconDisplay) handIconDisplay.textContent = '🖐️';
    });

    // Comedic Hand Thought Bubble: "I GOT IT!" -> 180ms -> "WAIT—"
    function triggerHandCommentary() {
        if (!handBubble || !gameRunning) return;
        if (handBubble.classList.contains('active')) return;

        clearTimeout(handBubbleTimeout);
        clearTimeout(handBubbleClearTimeout);

        handBubble.textContent = "I GOT IT!";
        handBubble.classList.add('active');

        handBubbleTimeout = setTimeout(() => {
            if (!gameRunning) return;
            handBubble.textContent = "WAIT—";
            handBubbleClearTimeout = setTimeout(() => {
                handBubble.classList.remove('active');
            }, 450);
        }, 180);
    }

    // Dynamic Arena Boundaries (fully responsive on resize)
    function getArenaBounds() {
        const w = (socksArena && socksArena.clientWidth > 0) ? socksArena.clientWidth : window.innerWidth;
        const h = (socksArena && socksArena.clientHeight > 0) ? socksArena.clientHeight : window.innerHeight;
        return { width: Math.max(320, w), height: Math.max(400, h) };
    }

    window.addEventListener('resize', () => {
        if (!gameRunning) return;
        const bounds = getArenaBounds();
        activeSocks.forEach(sock => {
            if (sock.baseX > bounds.width - 80) {
                sock.baseX = Math.random() * (bounds.width - 100) + 20;
            }
        });
    });

    // Timer Formatting: "00:30" down to "00:00"
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.max(0, seconds % 60);
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    function updateTimerDisplay() {
        if (timerDigits) {
            timerDigits.textContent = formatTime(gameTimeLeft);
        }
    }

    // Start Sock Hunt Game (Falling Rain Mode)
    function startSockGame() {
        showScreen('screen-game');
        gameRunning = true;
        gameTimeLeft = 30;
        updateTimerDisplay();
        timerPill.className = 'hud-timer-pill';
        gameEventBanner.classList.remove('show');

        // Reset previous animations and intervals
        if (sockAnimFrameId) {
            cancelAnimationFrame(sockAnimFrameId);
            sockAnimFrameId = null;
        }
        if (sockSpawnInterval) {
            clearInterval(sockSpawnInterval);
            sockSpawnInterval = null;
        }
        clearInterval(gameTimerInterval);
        gameEventTimeouts.forEach(clearTimeout);
        gameEventTimeouts = [];
        stopBackgroundDialogueLoop();

        socksArena.innerHTML = '';
        activeSocks = [];

        const bounds = getArenaBounds();
        const arenaW = bounds.width;
        const arenaH = bounds.height;

        // Pre-populate arena with 14 falling socks distributed vertically across full width
        const initialCount = 14;
        for (let i = 0; i < initialCount; i++) {
            const startY = (i / initialCount) * (arenaH * 0.85) - 40;
            spawnFallingSock(arenaW, startY);
        }

        // Continuous Spawner: Spawns new socks from TOP across FULL WIDTH
        sockSpawnInterval = setInterval(() => {
            if (!gameRunning) return;
            if (activeSocks.length < 25) {
                const b = getArenaBounds();
                spawnFallingSock(b.width, -70 - Math.random() * 40);
            }
        }, 420);

        // Start Physics Animation Loop
        sockAnimFrameId = requestAnimationFrame(physicsLoop);

        // 30-Second Countdown with Milestones
        gameTimerInterval = setInterval(() => {
            gameTimeLeft--;
            updateTimerDisplay();

            // At 10 seconds: "THE SOCKS ARE GETTING NERVOUS."
            if (gameTimeLeft === 10) {
                showEventToast("THE SOCKS ARE GETTING NERVOUS.");
                timerPill.classList.add('urgent');
            }
            // At 5 seconds: timer gently pulses red + warning beep
            else if (gameTimeLeft === 5) {
                timerPill.classList.remove('urgent');
                timerPill.classList.add('critical');
                window.soundEngine.playWarningBeep();
            }
            // At 3 seconds: "LAST CHANCE."
            else if (gameTimeLeft === 3) {
                showEventToast("LAST CHANCE.");
                window.soundEngine.playWarningBeep();
            }
            // At 00:00: everything freezes
            else if (gameTimeLeft <= 0) {
                clearInterval(gameTimerInterval);
                endSockGame();
            }
        }, 1000);

        // Schedule Funny Mid-Game Moments
        scheduleGameEvents();

        // Start Ambient Background Dialogue & Radio Comms
        startBackgroundDialogueLoop();
    }

    // Spawn a Single Falling Sock at top with independent physics
    function spawnFallingSock(arenaW, startY = -70) {
        const type = sockTypes[Math.floor(Math.random() * sockTypes.length)];
        const el = document.createElement('div');
        el.className = 'sock running';
        el.textContent = type.emoji;
        el.style.filter = type.filter;

        // Random horizontal spawn using FULL WIDTH of arena
        const baseX = Math.random() * Math.max(80, arenaW - 80);
        const sock = {
            el: el,
            baseX: baseX,
            currentX: baseX,
            y: startY,
            speed: 2.8 + Math.random() * 3.7, // 2.8 to 6.5 px/frame
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 3.5,
            wobbleSpeed: 0.03 + Math.random() * 0.04,
            wobbleAmp: 18 + Math.random() * 32,
            wobblePhase: Math.random() * Math.PI * 2,
            scale: 0.85 + Math.random() * 0.35,
            isDodging: false,
            dodgeTimer: 0,
            escaped: false,
            evadeDx: 0,
            evadeDy: 0
        };

        // Guaranteed Impossible Catch on Direct Click / Touch / Tap
        const onSockTouch = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!gameRunning) return;
            if (!sock.isDodging) {
                initiateSockDodge(sock, 0, 0);
            }
        };

        el.addEventListener('pointerdown', onSockTouch);
        el.addEventListener('click', onSockTouch);
        el.addEventListener('touchstart', onSockTouch, { passive: false });

        socksArena.appendChild(el);
        activeSocks.push(sock);
        return sock;
    }

    // Recycle a sock that exited the bottom
    function recycleSock(sock, arenaW) {
        const type = sockTypes[Math.floor(Math.random() * sockTypes.length)];
        sock.el.textContent = type.emoji;
        sock.el.style.filter = type.filter;

        // New random horizontal coordinate across FULL WIDTH
        sock.baseX = Math.random() * Math.max(80, arenaW - 80);
        sock.currentX = sock.baseX;
        sock.y = -70 - Math.random() * 60;
        sock.speed = 2.8 + Math.random() * 3.7;
        sock.rotation = Math.random() * 360;
        sock.rotSpeed = (Math.random() - 0.5) * 3.5;
        sock.wobbleSpeed = 0.03 + Math.random() * 0.04;
        sock.wobbleAmp = 18 + Math.random() * 32;
        sock.wobblePhase = Math.random() * Math.PI * 2;
        sock.scale = 0.85 + Math.random() * 0.35;
        sock.isDodging = false;
        sock.dodgeTimer = 0;
        sock.escaped = false;
        sock.el.classList.remove('dodging');
        sock.el.classList.remove('stealth');
    }

    // Physics Animation Loop (Top -> Bottom Falling & Hand Proximity Check)
    function physicsLoop() {
        if (!gameRunning) return;

        const bounds = getArenaBounds();
        const arenaW = bounds.width;
        const arenaH = bounds.height;

        for (let i = activeSocks.length - 1; i >= 0; i--) {
            const sock = activeSocks[i];

            if (sock.isDodging) {
                // Dodging pause & shake countdown (0.06 - 0.12s)
                sock.dodgeTimer -= 16;
                if (sock.dodgeTimer <= 0) {
                    performSockEscapeLeap(sock, arenaW, arenaH);
                }
            } else {
                // Vertical top -> bottom falling
                sock.y += sock.speed;
                sock.wobblePhase += sock.wobbleSpeed;
                sock.currentX = sock.baseX + Math.sin(sock.wobblePhase) * sock.wobbleAmp;
                sock.rotation += sock.rotSpeed;

                // Check distance to grabbing hand cursor
                const sockCenterX = sock.currentX + 32;
                const sockCenterY = sock.y + 32;
                const dx = sockCenterX - mouseX;
                const dy = sockCenterY - mouseY;
                const dist = Math.hypot(dx, dy);

                // Proximity Trigger: When hand gets close (< 95px), initiate impossible dodge
                if (dist < 95 && !sock.isDodging) {
                    initiateSockDodge(sock, dx, dy);
                }
            }

            // Apply rendered transform
            sock.el.style.transform = `translate(${sock.currentX}px, ${sock.y}px) rotate(${sock.rotation}deg) scale(${sock.scale})`;
            sock.el.dataset.x = sock.currentX;
            sock.el.dataset.y = sock.y;

            // Recycle sock when it reaches the bottom of the arena
            if (sock.y > arenaH + 75) {
                recycleSock(sock, arenaW);
            }
        }

        sockAnimFrameId = requestAnimationFrame(physicsLoop);
    }

    // Initiate Evasion: brief pause (0.06-0.12s) + shake animation
    function initiateSockDodge(sock, dx, dy) {
        if (sock.isDodging || !gameRunning) return;

        sock.isDodging = true;
        sock.dodgeTimer = 70 + Math.random() * 50; // 70-120ms pause
        sock.el.classList.add('dodging');
        sock.evadeDx = dx;
        sock.evadeDy = dy;

        // Comedic Hand commentary trigger ("I GOT IT!" -> "WAIT—")
        triggerHandCommentary();
    }

    // Perform the rapid escape leap / teleport away
    function performSockEscapeLeap(sock, arenaW, arenaH) {
        sock.isDodging = false;
        sock.el.classList.remove('dodging');

        window.soundEngine.playTeleport();
        window.soundEngine.playSockChatter(3, 580);

        // Spawn comedic dialogue bubble from sock
        const quote = sockDialogues[Math.floor(Math.random() * sockDialogues.length)];
        spawnDialogueBubble(sock.currentX, sock.y, quote, 'escape', 1400);

        if (Math.random() < 0.3) {
            window.soundEngine.speakCartoonVoice(quote);
        }

        // Rapid evasion sideways away from hand, or upward teleport
        const jumpDir = (sock.evadeDx >= 0 ? 1 : -1);
        const leapDist = 140 + Math.random() * 120;
        let newX = sock.baseX + jumpDir * leapDist;

        // Keep sock in arena bounds so it's always visible and never lost
        if (newX < 30 || newX > arenaW - 90) {
            newX = Math.random() * (arenaW - 100) + 50;
        }

        sock.baseX = newX;
        sock.currentX = newX;
        // Jump upward slightly to avoid being trapped at bottom
        sock.y = Math.max(-40, sock.y - (50 + Math.random() * 60));
        sock.rotation += (Math.random() - 0.5) * 60;
        sock.speed = 3.5 + Math.random() * 3.0; // speed up after escape
        sock.scale = 1.25;

        setTimeout(() => {
            if (sock.el) sock.scale = 1.0;
        }, 160);
    }

    // Comic Speech Bubble Generator
    function spawnDialogueBubble(x, y, text, variant = '', duration = 1400) {
        const bubble = document.createElement('div');
        bubble.className = 'dialogue-bubble' + (variant ? ' ' + variant : '');
        bubble.textContent = text;

        const bounds = getArenaBounds();
        const clampedX = Math.max(90, Math.min(x, bounds.width - 130));
        const clampedY = Math.max(90, Math.min(y - 20, bounds.height - 100));

        bubble.style.left = `${clampedX}px`;
        bubble.style.top = `${clampedY}px`;

        socksArena.appendChild(bubble);

        const timeout = setTimeout(() => {
            bubble.style.transition = 'opacity 0.28s cubic-bezier(0.4, 0, 1, 1), transform 0.28s cubic-bezier(0.4, 0, 1, 1)';
            bubble.style.opacity = '0';
            bubble.style.transform = 'translate(-50%, -125%) scale(0.75)';
            setTimeout(() => {
                if (bubble.parentElement) bubble.remove();
            }, 300);
        }, duration);

        backgroundDialogueTimeouts.push(timeout);
    }

    // =========================================================================
    // BACKGROUND DIALOGUE & SOCK COMMS SYSTEM
    // =========================================================================
    function startBackgroundDialogueLoop() {
        stopBackgroundDialogueLoop();

        if (radioDialogueText) {
            radioDialogueText.textContent = radioTransmissions[0];
            radioDialogueText.classList.remove('updating');
        }

        let radioIdx = 0;
        radioDispatchInterval = setInterval(() => {
            if (!gameRunning || !radioDialogueText) return;
            radioDialogueText.classList.add('updating');
            setTimeout(() => {
                if (!gameRunning || !radioDialogueText) return;
                radioIdx = (radioIdx + 1) % radioTransmissions.length;
                radioDialogueText.textContent = radioTransmissions[radioIdx];
                radioDialogueText.classList.remove('updating');
            }, 260);
        }, 3800);

        function triggerNextBackgroundDialogue() {
            if (!gameRunning) return;

            const nextDelay = 1800 + Math.random() * 1400;
            const timeout = setTimeout(() => {
                if (!gameRunning) return;
                spawnAutonomousDialogue();
                triggerNextBackgroundDialogue();
            }, nextDelay);
            backgroundDialogueTimeouts.push(timeout);
        }

        triggerNextBackgroundDialogue();
    }

    function spawnAutonomousDialogue() {
        const bounds = getArenaBounds();
        const visibleSocks = activeSocks.filter(s => s.y > 60 && s.y < bounds.height - 120);
        if (visibleSocks.length === 0) return;

        if (gameTimeLeft <= 10) {
            const sock = visibleSocks[Math.floor(Math.random() * visibleSocks.length)];
            const quote = urgentBanter[Math.floor(Math.random() * urgentBanter.length)];
            spawnDialogueBubble(sock.currentX, sock.y, quote, 'urgent', 1500);
            window.soundEngine.playSockChatter(3, 640);
            return;
        }

        // 40% conversational dialogue between two socks
        if (Math.random() < 0.4 && visibleSocks.length >= 2) {
            const idx1 = Math.floor(Math.random() * visibleSocks.length);
            let idx2 = Math.floor(Math.random() * visibleSocks.length);
            while (idx2 === idx1) {
                idx2 = Math.floor(Math.random() * visibleSocks.length);
            }

            const sock1 = visibleSocks[idx1];
            const sock2 = visibleSocks[idx2];
            const pair = conversationalPairs[Math.floor(Math.random() * conversationalPairs.length)];

            spawnDialogueBubble(sock1.currentX, sock1.y, pair.q, 'ambient', 1500);
            window.soundEngine.playSockChatter(3, 540);

            const replyTimeout = setTimeout(() => {
                if (!gameRunning) return;
                spawnDialogueBubble(sock2.currentX, sock2.y, pair.a, 'ambient', 1600);
                window.soundEngine.playSockChatter(4, 460);
            }, 850);
            backgroundDialogueTimeouts.push(replyTimeout);
        } else {
            const sock = visibleSocks[Math.floor(Math.random() * visibleSocks.length)];
            const quote = ambientBanterSolo[Math.floor(Math.random() * ambientBanterSolo.length)];
            const isWhisper = Math.random() < 0.28;
            spawnDialogueBubble(sock.currentX, sock.y, quote, isWhisper ? 'whisper' : 'ambient', 1500);
            window.soundEngine.playSockChatter(isWhisper ? 2 : 3, isWhisper ? 440 : 520);
        }
    }

    function stopBackgroundDialogueLoop() {
        clearInterval(radioDispatchInterval);
        radioDispatchInterval = null;
        backgroundDialogueTimeouts.forEach(clearTimeout);
        backgroundDialogueTimeouts = [];

        if (window.speechSynthesis) {
            try { window.speechSynthesis.cancel(); } catch (e) {}
        }

        socksArena.querySelectorAll('.dialogue-bubble').forEach(b => b.remove());
    }

    // Schedule Funny Mid-Game Moments
    function scheduleGameEvents() {
        // Event 1 (T = 23s): "SOCK FOUND ✓" -> 0.5s -> "JUST KIDDING."
        gameEventTimeouts.push(setTimeout(() => {
            if (!gameRunning) return;
            showEventToast("SOCK FOUND ✓");
            window.soundEngine.playEventAlert();
            setTimeout(() => {
                if (!gameRunning) return;
                showEventToast("JUST KIDDING.");
                window.soundEngine.playPop(350);
            }, 500);
        }, 7000));

        // Event 2 (T = 17s): "EMERGENCY SOCK TELEPORTATION" (all socks vanish for 1s)
        gameEventTimeouts.push(setTimeout(() => {
            if (!gameRunning) return;
            showEventToast("EMERGENCY SOCK TELEPORTATION");
            activeSocks.forEach(s => { if (s.el) s.el.classList.add('stealth'); });
            window.soundEngine.playPop(700);
            setTimeout(() => {
                activeSocks.forEach(s => { if (s.el) s.el.classList.remove('stealth'); });
            }, 1000);
        }, 13000));

        // Event 3 (T = 12s): "3 socks detected." -> "4 socks detected." -> "WHY ARE THERE SO MANY SOCKS?"
        gameEventTimeouts.push(setTimeout(() => {
            if (!gameRunning) return;
            showEventToast("3 socks detected.");
            setTimeout(() => {
                if (!gameRunning) return;
                showEventToast("4 socks detected.");
                setTimeout(() => {
                    if (!gameRunning) return;
                    showEventToast("WHY ARE THERE SO MANY SOCKS? 🧦");
                    window.soundEngine.playEventAlert();
                }, 800);
            }, 800);
        }, 18000));

        // Event 4 (T = 6s): "AI CONFIDENCE 99.99% • ACTUAL CONFIDENCE 0%"
        gameEventTimeouts.push(setTimeout(() => {
            if (!gameRunning) return;
            showEventToast("AI CONFIDENCE: 99.99% • ACTUAL: 0%");
            window.soundEngine.playEventAlert();
        }, 24000));
    }

    function showEventToast(text) {
        gameEventBanner.textContent = text;
        gameEventBanner.classList.add('show');
        setTimeout(() => {
            gameEventBanner.classList.remove('show');
        }, 2400);
    }

    // =========================================================================
    // PAGE 06: GAME OVER & FINAL MALAYALAM RESULT
    // =========================================================================
    function endSockGame() {
        gameRunning = false;
        clearInterval(gameTimerInterval);
        if (sockSpawnInterval) clearInterval(sockSpawnInterval);
        if (sockAnimFrameId) cancelAnimationFrame(sockAnimFrameId);
        gameEventTimeouts.forEach(clearTimeout);
        stopBackgroundDialogueLoop();

        // Freeze all socks in place
        activeSocks.forEach(s => {
            if (s.el) {
                s.el.classList.remove('running', 'dodging');
                s.el.style.pointerEvents = 'none';
            }
        });

        // Hide hand thought bubble
        if (handBubble) handBubble.classList.remove('active');

        // Play sad trombone
        window.soundEngine.playSadTrombone();

        setTimeout(() => {
            showScreen('screen-result');
        }, 700);
    }

    // Result Action Buttons: Try Again & Scan Another
    const btnTryAgain = document.getElementById('btn-try-again');
    const btnScanAnother = document.getElementById('btn-scan-another');

    btnTryAgain.addEventListener('click', () => {
        window.soundEngine.playPop(550);
        startSockGame();
    });

    btnScanAnother.addEventListener('click', () => {
        window.soundEngine.playPop(500);
        resetUpload();
        showScreen('screen-scanner');
    });
});
