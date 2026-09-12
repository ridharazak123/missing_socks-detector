/**
 * Web Audio API Sound Synthesizer for "Missing Sock Locator"
 * 100% self-contained: No external audio files required!
 */

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
            this.initialized = true;
        } catch (e) {
            console.warn('Web Audio not supported:', e);
        }
    }

    ensureContext() {
        if (!this.initialized) {
            this.init();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted && window.speechSynthesis) {
            try { window.speechSynthesis.cancel(); } catch (e) {}
        }
        return this.isMuted;
    }

    // Soft bubble pop for button clicks and interactions
    playPop(pitch = 440) {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(pitch * 0.4, this.ctx.currentTime + 0.12);

        gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.13);
    }

    // Happy upload / detection chime
    playChime() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.08);

            gain.gain.setValueAtTime(0.18, this.ctx.currentTime + i * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.08 + 0.35);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(this.ctx.currentTime + i * 0.08);
            osc.stop(this.ctx.currentTime + i * 0.08 + 0.36);
        });
    }

    // Futuristic scanner pulse / chirp
    playScanBeep() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        const startFreq = 800 + Math.random() * 400;
        osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(startFreq * 1.5, this.ctx.currentTime + 0.07);

        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.09);
    }

    // Dramatic 99% stall / power malfunction sound
    playGlitch() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(80, this.ctx.currentTime + 0.8);

        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.005, this.ctx.currentTime + 0.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.85);
    }

    // Cartoon whoosh / teleport boing when sock escapes
    playTeleport() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        const baseFreq = 280 + Math.random() * 80;
        osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 3.2, this.ctx.currentTime + 0.12);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.8, this.ctx.currentTime + 0.22);

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.23);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.24);
    }

    // Cartoon grab swish on click
    playGrab() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(500, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.09);

        gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    }

    // Urgent countdown warning beep (<= 5s)
    playWarningBeep() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(880, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.11);
    }

    // Random comedy event alert fanfare
    playEventAlert() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const notes = [440, 554.37, 659.25, 880];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.06);

            gain.gain.setValueAtTime(0.18, this.ctx.currentTime + idx * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.06 + 0.2);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(this.ctx.currentTime + idx * 0.06);
            osc.stop(this.ctx.currentTime + idx * 0.06 + 0.22);
        });
    }

    // Comedic sad trombone punchline (wa-wa-wa-waaah)
    playSadTrombone() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const notes = [
            { freq: 330, dur: 0.35 }, // E4
            { freq: 311, dur: 0.35 }, // Eb4
            { freq: 293, dur: 0.35 }, // D4
            { freq: 277, dur: 0.8 }   // Db4 (long sad wobble)
        ];

        let offset = 0;
        notes.forEach((n, i) => {
            const startTime = this.ctx.currentTime + offset;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(n.freq, startTime);

            if (i === 3) {
                // Add vibrato/pitch drop to the final note
                osc.frequency.linearRampToValueAtTime(n.freq - 15, startTime + n.dur);
            }

            gain.gain.setValueAtTime(0.22, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + n.dur);

            // Subtle lowpass filter for muted brass feel
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(650, startTime);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + n.dur + 0.02);

            offset += n.dur * 0.95;
        });
    }

    // Procedural cute cartoon sock chatter / gibberish squeaks (Animalese-style)
    playSockChatter(syllables = 3, basePitch = 520) {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const count = Math.max(2, Math.min(syllables, 5));
        let offset = 0;

        for (let i = 0; i < count; i++) {
            const startTime = this.ctx.currentTime + offset;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            // Random variation around base pitch for animated conversational cadence
            const pitchJitter = (Math.random() - 0.5) * 260;
            const noteFreq = Math.max(300, basePitch + pitchJitter + (i % 2 === 0 ? 60 : -40));

            osc.type = i % 2 === 0 ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(noteFreq, startTime);
            osc.frequency.exponentialRampToValueAtTime(noteFreq * (0.8 + Math.random() * 0.5), startTime + 0.055);

            const noteVol = 0.09 + Math.random() * 0.04;
            gain.gain.setValueAtTime(noteVol, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.06);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + 0.065);

            offset += 0.048 + Math.random() * 0.025;
        }
    }

    // High-pitched comedic voice synthesis for dialogue one-liners
    speakCartoonVoice(text) {
        if (this.isMuted || !window.speechSynthesis) return;
        try {
            // Avoid queue buildup
            window.speechSynthesis.cancel();
            const cleanText = text.replace(/[\u{1F300}-\u{1FAFF}]/gu, '').trim();
            if (!cleanText) return;

            const utterance = new SpeechSynthesisUtterance(cleanText);
            utterance.pitch = 1.85; // Chipmunk cartoon pitch
            utterance.rate = 1.35;  // Fast playful tempo
            utterance.volume = 0.45;
            window.speechSynthesis.speak(utterance);
        } catch (e) {
            // Fallback gracefully if speech synthesis is disabled or blocked
        }
    }
}

// Global audio engine instance
window.soundEngine = new SoundEngine();
