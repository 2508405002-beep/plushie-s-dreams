/* ============================================================
   PLUSHIE'S DREAM — script.js
   Interactive features: carousel, cart, sparkles, lightbox,
   scroll animations, custom cursor, and more.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ====================== PAGE LOADER ====================== */
    const loader = document.getElementById('pageLoader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 2000); // Show loader for 2s
    });

    // Fallback: hide loader after 3.5s regardless
    setTimeout(() => loader.classList.add('hidden'), 3500);

    /* ====================== CUSTOM CURSOR ====================== */
    const cursor = document.getElementById('customCursor');
    const trail = document.getElementById('cursorTrail');
    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
        cursor.classList.add('visible');
        trail.classList.add('visible');
    });

    // Smooth trail follow
    function animateTrail() {
        trailX += (mouseX - trailX) * 0.15;
        trailY += (mouseY - trailY) * 0.15;
        trail.style.left = trailX + 'px';
        trail.style.top = trailY + 'px';
        requestAnimationFrame(animateTrail);
    }
    animateTrail();

    // Cursor hover effects on interactive elements
    const interactives = document.querySelectorAll('a, button, .product-card, .gallery-item, .social-icon, input, textarea');
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    /* ====================== NAVBAR ====================== */
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const allNavLinks = document.querySelectorAll('.nav-link');

    // Scroll → shrink nav
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Hamburger toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu on link click
    allNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY + 200;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                allNavLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    });

    /* ====================== SCROLL ANIMATIONS ====================== */
    const animatedEls = document.querySelectorAll('[data-animate]');

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, parseInt(delay));
                scrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    animatedEls.forEach(el => scrollObserver.observe(el));

    /* ====================== FLOATING SPARKLES ====================== */
    const canvas = document.getElementById('sparklesCanvas');
    const ctx = canvas.getContext('2d');
    let sparkles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Sparkle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = Math.random() * -0.8 - 0.2;
            this.opacity = Math.random() * 0.6 + 0.2;
            this.fadeDir = Math.random() > 0.5 ? 1 : -1;
            this.hue = Math.random() * 60 + 280; // Purple-pink range
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.opacity += this.fadeDir * 0.008;

            if (this.opacity <= 0 || this.opacity >= 0.8) this.fadeDir *= -1;
            if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) this.reset();
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = `hsl(${this.hue}, 80%, 75%)`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = `hsl(${this.hue}, 80%, 75%)`;

            // Star shape
            ctx.beginPath();
            for (let i = 0; i < 4; i++) {
                const angle = (i * Math.PI) / 2;
                const outerX = this.x + Math.cos(angle) * this.size;
                const outerY = this.y + Math.sin(angle) * this.size;
                if (i === 0) ctx.moveTo(outerX, outerY);
                else ctx.lineTo(outerX, outerY);

                const innerAngle = angle + Math.PI / 4;
                const innerX = this.x + Math.cos(innerAngle) * (this.size * 0.4);
                const innerY = this.y + Math.sin(innerAngle) * (this.size * 0.4);
                ctx.lineTo(innerX, innerY);
            }
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
    }

    // Create sparkle particles
    const sparkleCount = Math.min(60, Math.floor(window.innerWidth / 20));
    for (let i = 0; i < sparkleCount; i++) {
        sparkles.push(new Sparkle());
    }

    function animateSparkles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        sparkles.forEach(s => {
            s.update();
            s.draw();
        });
        requestAnimationFrame(animateSparkles);
    }
    animateSparkles();

    /* ====================== TESTIMONIAL CAROUSEL ====================== */
    const track = document.getElementById('carouselTrack');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const dotsWrap = document.getElementById('carouselDots');
    let currentSlide = 0;

    // Create dots
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsWrap.appendChild(dot);
    });

    function goToSlide(index) {
        currentSlide = index;
        track.style.transform = `translateX(-${index * 100}%)`;
        document.querySelectorAll('.carousel-dot').forEach((d, i) => {
            d.classList.toggle('active', i === index);
        });
    }

    prevBtn.addEventListener('click', () => {
        goToSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
    });

    nextBtn.addEventListener('click', () => {
        goToSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
    });

    // Auto-advance carousel every 5s
    let autoCarousel = setInterval(() => {
        goToSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
    }, 5000);

    // Pause on hover
    const carouselEl = document.getElementById('testimonialCarousel');
    carouselEl.addEventListener('mouseenter', () => clearInterval(autoCarousel));
    carouselEl.addEventListener('mouseleave', () => {
        autoCarousel = setInterval(() => {
            goToSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
        }, 5000);
    });

    /* ====================== GALLERY LIGHTBOX ====================== */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img) {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightbox.classList.add('active');
            }
        });
    });

    lightboxClose.addEventListener('click', () => lightbox.classList.remove('active'));
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) lightbox.classList.remove('active');
    });

    // Close lightbox with Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') lightbox.classList.remove('active');
    });

    /* ====================== SHOPPING CART ====================== */
    const cart = [];
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartClose = document.getElementById('cartClose');
    const cartItems = document.getElementById('cartItems');
    const cartCountEl = document.getElementById('cartCount');
    const cartTotalEl = document.getElementById('cartTotal');
    const cartFooterEl = document.getElementById('cartFooter');
    const navCartBtn = document.getElementById('navCart');
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toastText');

    // Product emoji map
    const productEmojis = {
        'Cuddly Pink Bear': '🐻',
        'Magical Unicorn': '🦄',
        'Dreamy Blue Bunny': '🐰',
        'Dino Snuggles': '🦕',
        'Whisker Kitty': '🐱',
        'Foxy Friend': '🦊',
    };

    // Open / close cart sidebar
    navCartBtn.addEventListener('click', openCart);
    cartClose.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    function openCart() {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
    }

    function closeCart() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    }

    // Add to cart buttons
    document.querySelectorAll('.btn-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.dataset.name;
            const price = parseFloat(btn.dataset.price);

            cart.push({ name, price });
            updateCartUI();

            // Button feedback
            btn.classList.add('added');
            btn.querySelector('.btn-text').textContent = 'Added!';
            setTimeout(() => {
                btn.classList.remove('added');
                btn.querySelector('.btn-text').textContent = 'Add to Cart';
            }, 1500);

            // Cart count bump animation
            cartCountEl.classList.add('bump');
            setTimeout(() => cartCountEl.classList.remove('bump'), 400);

            // Show toast
            showToast(`${name} added to cart! 🎉`);
        });
    });

    function updateCartUI() {
        cartCountEl.textContent = cart.length;

        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="cart-empty">
                    <span>🧸</span>
                    <p>Your cart is empty!<br>Add some cuddles!</p>
                </div>`;
            cartFooterEl.style.display = 'none';
        } else {
            cartItems.innerHTML = '';
            cart.forEach((item, i) => {
                const el = document.createElement('div');
                el.className = 'cart-item';
                el.innerHTML = `
                    <span class="cart-item-emoji">${productEmojis[item.name] || '🧸'}</span>
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    </div>
                    <button class="cart-item-remove" data-index="${i}" aria-label="Remove">✕</button>`;
                cartItems.appendChild(el);
            });

            // Remove item listeners
            cartItems.querySelectorAll('.cart-item-remove').forEach(btn => {
                btn.addEventListener('click', () => {
                    const idx = parseInt(btn.dataset.index);
                    cart.splice(idx, 1);
                    updateCartUI();
                });
            });

            const total = cart.reduce((sum, item) => sum + item.price, 0);
            cartTotalEl.textContent = `$${total.toFixed(2)}`;
            cartFooterEl.style.display = 'block';
        }
    }

    function showToast(message) {
        toastText.textContent = message;
        toast.classList.add('active');
        setTimeout(() => toast.classList.remove('active'), 2500);
    }

    /* ====================== CONTACT FORM ====================== */
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Message sent! We\'ll be in touch! 💌');
        contactForm.reset();
    });

    /* ====================== PARALLAX EFFECT ====================== */
    const parallaxSection = document.getElementById('parallaxDivider');
    window.addEventListener('scroll', () => {
        if (parallaxSection) {
            const scrolled = window.scrollY;
            const rate = scrolled * 0.3;
            parallaxSection.style.backgroundPositionY = `${rate}px`;
        }
    });

    /* ====================== SMOOTH SCROLL ====================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const offset = 80; // navbar height
                const position = target.offsetTop - offset;
                window.scrollTo({ top: position, behavior: 'smooth' });
            }
        });
    });

    /* ====================== CHECKOUT BUTTON ====================== */
    const checkoutBtn = document.querySelector('.btn-checkout');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length > 0) {
                showToast('Thank you for your order! 🎁💖');
                cart.length = 0;
                updateCartUI();
                closeCart();
            }
        });
    }

    /* ====================== CHAT WIDGET ====================== */
    const chatFab = document.getElementById('chatFab');
    const chatFabIcon = document.getElementById('chatFabIcon');
    const chatWidget = document.getElementById('chatWidget');
    const chatClose = document.getElementById('chatWidgetClose');
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const chatStartBtn = document.getElementById('chatStartBtn');

    // Toggle chat widget
    function toggleChat() {
        const isOpen = chatWidget.classList.toggle('active');
        chatFab.classList.toggle('open', isOpen);
        chatFabIcon.textContent = isOpen ? '✕' : '💬';
        if (isOpen) chatInput.focus();
    }

    chatFab.addEventListener('click', toggleChat);
    chatClose.addEventListener('click', toggleChat);

    // "Start Chat" button in contact info card
    if (chatStartBtn) {
        chatStartBtn.addEventListener('click', () => {
            if (!chatWidget.classList.contains('active')) toggleChat();
            chatInput.focus();
        });
    }

    // Bot auto-reply responses
    const botReplies = [
        "That's a great question! 🧸 Our plushies are made from premium, hypoallergenic materials.",
        "We offer free shipping on orders over $50! 🚚✨",
        "Our most popular plushie is the Cuddly Pink Bear — it's a bestseller! 🐻💖",
        "We'd love to help! You can also email us at hello@plushiesdream.com 📧",
        "Great news — all our plushies are machine washable! 🧼🌟",
        "We have a 30-day return policy. No questions asked! 💝",
        "Thank you for your interest! Let me connect you with our team. 🌈",
    ];

    function addChatMessage(text, isUser) {
        const msg = document.createElement('div');
        msg.className = `chat-msg ${isUser ? 'user' : 'bot'}`;
        msg.innerHTML = `
            <span class="chat-msg-avatar">${isUser ? '😊' : '🧸'}</span>
            <div class="chat-msg-bubble">${text}</div>`;
        chatMessages.appendChild(msg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;

        addChatMessage(text, true);
        chatInput.value = '';

        // Simulate bot typing delay
        setTimeout(() => {
            const reply = botReplies[Math.floor(Math.random() * botReplies.length)];
            addChatMessage(reply, false);
        }, 800 + Math.random() * 700);
    });

    /* ====================== BACKGROUND MUSIC — Web Audio API ====================== */
    /* A slow, peppy, dreamy music-box melody that fits the Plushie's Dream theme */

    const musicToggle = document.getElementById('musicToggle');
    let audioCtx = null;
    let isMusicPlaying = false;
    let musicNodes = {};

    // Musical constants — C major pentatonic scale for a warm, happy feel
    const NOTE_FREQS = {
        'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'G3': 196.00, 'A3': 220.00,
        'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'G4': 392.00, 'A4': 440.00,
        'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'G5': 783.99, 'A5': 880.00,
    };

    // Dreamy, slow but peppy melody — 4 phrases that loop
    const melodyPhrases = [
        // Phrase 1 — ascending, hopeful
        ['E4','G4','A4','C5', 'A4','G4','E4','G4'],
        // Phrase 2 — playful bounce
        ['D4','E4','G4','E4', 'C4','D4','E4','C4'],
        // Phrase 3 — reaching high
        ['G4','A4','C5','D5', 'C5','A4','G4','E4'],
        // Phrase 4 — gentle landing
        ['A4','G4','E4','D4', 'E4','G4','C4','E4'],
    ];

    // Chord progression (root notes for the pad)
    const chordProg = [
        ['C3', 'E3', 'G3'],  // C major
        ['A3', 'C4', 'E4'],  // A minor (but sounds warm in context)
        ['D3', 'G3', 'A3'],  // Dsus / G open
        ['C3', 'G3', 'E3'],  // C major variant
    ];

    // Note duration in seconds (slow tempo ≈ 85 BPM, each note = one beat)
    const BEAT_DUR = 0.7;
    const PHRASE_DUR = melodyPhrases[0].length * BEAT_DUR;

    function initAudio() {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        // Master gain
        const masterGain = audioCtx.createGain();
        masterGain.gain.value = 0;
        masterGain.connect(audioCtx.destination);

        // Convolver for dreamy reverb
        const convolver = audioCtx.createConvolver();
        const reverbLen = audioCtx.sampleRate * 2;
        const reverbBuf = audioCtx.createBuffer(2, reverbLen, audioCtx.sampleRate);
        for (let ch = 0; ch < 2; ch++) {
            const data = reverbBuf.getChannelData(ch);
            for (let i = 0; i < reverbLen; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / reverbLen, 2.5);
            }
        }
        convolver.buffer = reverbBuf;

        // Wet/Dry mix
        const dryGain = audioCtx.createGain();
        dryGain.gain.value = 0.6;
        const wetGain = audioCtx.createGain();
        wetGain.gain.value = 0.4;

        dryGain.connect(masterGain);
        convolver.connect(wetGain);
        wetGain.connect(masterGain);

        // Melody gain
        const melodyGain = audioCtx.createGain();
        melodyGain.gain.value = 0.35;
        melodyGain.connect(dryGain);
        melodyGain.connect(convolver);

        // Pad gain (background chords)
        const padGain = audioCtx.createGain();
        padGain.gain.value = 0.12;
        padGain.connect(dryGain);
        padGain.connect(convolver);

        // Bell / music-box gain (high sparkle notes)
        const bellGain = audioCtx.createGain();
        bellGain.gain.value = 0.15;
        bellGain.connect(dryGain);
        bellGain.connect(convolver);

        musicNodes = { masterGain, melodyGain, padGain, bellGain };

        // Ramp volume up smoothly
        masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
        masterGain.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 1.5);

        // Start the loops
        scheduleMelody(audioCtx.currentTime + 0.3);
        schedulePad(audioCtx.currentTime);
        scheduleBells(audioCtx.currentTime + 0.15);
    }

    // ── Melody: music-box sine + triangle blend ──
    function playNote(freq, startTime, duration, gainNode) {
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const noteGain = audioCtx.createGain();

        osc1.type = 'sine';
        osc1.frequency.value = freq;

        osc2.type = 'triangle';
        osc2.frequency.value = freq;
        const osc2Gain = audioCtx.createGain();
        osc2Gain.gain.value = 0.3;

        // ADSR-ish envelope
        const attack = 0.05;
        const decay = duration * 0.3;
        const sustain = 0.6;
        const release = duration * 0.4;

        noteGain.gain.setValueAtTime(0, startTime);
        noteGain.gain.linearRampToValueAtTime(1, startTime + attack);
        noteGain.gain.linearRampToValueAtTime(sustain, startTime + attack + decay);
        noteGain.gain.linearRampToValueAtTime(0, startTime + duration);

        osc1.connect(noteGain);
        osc2.connect(osc2Gain);
        osc2Gain.connect(noteGain);
        noteGain.connect(gainNode);

        osc1.start(startTime);
        osc1.stop(startTime + duration + 0.05);
        osc2.start(startTime);
        osc2.stop(startTime + duration + 0.05);
    }

    // ── Schedule melody loop ──
    let melodyTimer = null;
    function scheduleMelody(startTime) {
        let t = startTime;
        for (let p = 0; p < melodyPhrases.length; p++) {
            const phrase = melodyPhrases[p];
            for (let n = 0; n < phrase.length; n++) {
                const freq = NOTE_FREQS[phrase[n]];
                if (freq) {
                    playNote(freq, t, BEAT_DUR * 0.85, musicNodes.melodyGain);
                }
                t += BEAT_DUR;
            }
        }

        // Schedule next loop
        const totalDur = melodyPhrases.length * PHRASE_DUR;
        const nextStart = startTime + totalDur;
        const delayMs = (nextStart - audioCtx.currentTime) * 1000 - 200;
        melodyTimer = setTimeout(() => {
            if (isMusicPlaying) scheduleMelody(nextStart);
        }, Math.max(0, delayMs));
    }

    // ── Pad: soft, sustained chords ──
    let padOscs = [];
    function schedulePad(startTime) {
        // Clean up previous pad oscillators
        padOscs.forEach(o => { try { o.stop(); } catch(e) {} });
        padOscs = [];

        let t = startTime;
        for (let p = 0; p < chordProg.length; p++) {
            const chord = chordProg[p];
            const chordDur = PHRASE_DUR;

            chord.forEach(noteName => {
                const freq = NOTE_FREQS[noteName];
                if (!freq) return;

                const osc = audioCtx.createOscillator();
                const oscGain = audioCtx.createGain();

                osc.type = 'sine';
                osc.frequency.value = freq;

                // Slow fade in/out for dreamy feel
                oscGain.gain.setValueAtTime(0, t);
                oscGain.gain.linearRampToValueAtTime(1, t + chordDur * 0.2);
                oscGain.gain.linearRampToValueAtTime(0.7, t + chordDur * 0.8);
                oscGain.gain.linearRampToValueAtTime(0, t + chordDur);

                osc.connect(oscGain);
                oscGain.connect(musicNodes.padGain);

                osc.start(t);
                osc.stop(t + chordDur + 0.1);
                padOscs.push(osc);
            });

            t += chordDur;
        }

        // Schedule next loop
        const totalDur = chordProg.length * PHRASE_DUR;
        const nextStart = startTime + totalDur;
        const delayMs = (nextStart - audioCtx.currentTime) * 1000 - 200;
        setTimeout(() => {
            if (isMusicPlaying) schedulePad(nextStart);
        }, Math.max(0, delayMs));
    }

    // ── Bell sparkle: random high pentatonic notes ──
    let bellTimer = null;
    function scheduleBells(startTime) {
        const highNotes = ['C5', 'E5', 'G5', 'A5', 'D5'];
        let t = startTime;

        // Scatter 6-8 bell notes across one full loop
        const loopDur = melodyPhrases.length * PHRASE_DUR;
        const bellCount = 6 + Math.floor(Math.random() * 3);

        for (let i = 0; i < bellCount; i++) {
            const noteTime = t + Math.random() * loopDur;
            const noteName = highNotes[Math.floor(Math.random() * highNotes.length)];
            const freq = NOTE_FREQS[noteName];
            if (freq) {
                // Bell: pure sine with fast decay
                const osc = audioCtx.createOscillator();
                const bellEnv = audioCtx.createGain();

                osc.type = 'sine';
                osc.frequency.value = freq;

                bellEnv.gain.setValueAtTime(0, noteTime);
                bellEnv.gain.linearRampToValueAtTime(0.8, noteTime + 0.02);
                bellEnv.gain.exponentialRampToValueAtTime(0.001, noteTime + 1.5);

                osc.connect(bellEnv);
                bellEnv.connect(musicNodes.bellGain);

                osc.start(noteTime);
                osc.stop(noteTime + 1.6);
            }
        }

        const nextStart = startTime + loopDur;
        const delayMs = (nextStart - audioCtx.currentTime) * 1000 - 200;
        bellTimer = setTimeout(() => {
            if (isMusicPlaying) scheduleBells(nextStart);
        }, Math.max(0, delayMs));
    }

    // ── Toggle music on/off ──
    musicToggle.addEventListener('click', () => {
        if (!isMusicPlaying) {
            // Start music
            if (!audioCtx) {
                initAudio();
            } else {
                audioCtx.resume();
                musicNodes.masterGain.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.5);
                scheduleMelody(audioCtx.currentTime + 0.3);
                schedulePad(audioCtx.currentTime);
                scheduleBells(audioCtx.currentTime + 0.15);
            }
            isMusicPlaying = true;
            musicToggle.classList.add('playing');
        } else {
            // Stop music — fade out
            isMusicPlaying = false;
            musicToggle.classList.remove('playing');

            if (audioCtx && musicNodes.masterGain) {
                musicNodes.masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.8);
                setTimeout(() => {
                    if (!isMusicPlaying) audioCtx.suspend();
                }, 1000);
            }

            clearTimeout(melodyTimer);
            clearTimeout(bellTimer);
        }
    });

});
