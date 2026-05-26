/* ═══════════════════════════════════════════════════════
   DUSK MOSQUE - Static Theme App.js
   Premium Interactive Wedding Invitation
   ═══════════════════════════════════════════════════════ */

'use strict';

/* ─── State ─── */
const state = {
    isOpened: false,
    isPlaying: false,
    activeSlideIdx: 0,
    layoutMode: 'slide-h', // 'slide-h' | 'slide-v' | 'scroll'
    activeMenuId: 'opening',
    mouseOffset: { x: 0, y: 0 },
    touchStart: { x: 0, y: 0, time: 0 },
    isDragging: false,
    isFullscreen: false,
    slideCount: 0,
    guestbookData: [
        { name: 'Ahmad Fadhil', message: 'Barakallahu lakuma wa baraka \'alaikuma wa jama\'a bainakuma fi khoir. Semoga sakinah mawaddah wa rahmah ya Aisyah & Rizki!', attendance: 'hadir', date: '2026-05-20' },
        { name: 'Siti Aisyah', message: 'Selamat berbahagia untuk kedua mempelai! Sangat menyukai tema Dusk Mosque yang indah ini.', attendance: 'hadir', date: '2026-05-22' },
    ],
};

/* ─── DOM References ─── */
const dom = {};

/* ─── Audio ─── */
let audio = null;

/* ─── Countdown target: 2027-06-20 08:00 WIB ─── */
const COUNTDOWN_TARGET = new Date('2027-06-20T08:00:00+07:00');

/* ─── Layout Mode Cycle ─── */
const LAYOUT_MODES = ['slide-h', 'slide-v', 'scroll'];
const LAYOUT_LABELS = { 'slide-h': 'Slide ↔', 'slide-v': 'Slide ↕', 'scroll': 'Scroll ↓' };

/* ═══════════════════════════════════════
   INIT
   ═══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
    cacheDom();
    initPreloader();
    initAudio();
    initCoverEvents();
    initFullscreen();
    initParticles();
    renderGuestbook();
    initRsvpForm();
    initBankTabs();
    initCopyButtons();
    startCountdown();
    initMouseParallax();
    initSwipeEvents();
});

function cacheDom() {
    dom.preloader     = document.getElementById('dusk-preloader');
    dom.cover         = document.getElementById('dusk-cover');
    dom.openBtn       = document.getElementById('dusk-open-btn');
    dom.stage         = document.getElementById('dusk-stage');
    dom.scene         = document.getElementById('dusk-scene');
    dom.musicBtn      = document.getElementById('dusk-music-btn');
    dom.fullscreenBtn = document.getElementById('dusk-fullscreen-btn');
    dom.layoutBtn     = document.getElementById('dusk-layout-btn');
    dom.layoutLabel   = document.getElementById('dusk-layout-label');
    dom.nav           = document.getElementById('dusk-nav');
    dom.navItems      = document.querySelectorAll('.dusk-mosque-nav-item');
    dom.mainArea      = document.getElementById('dusk-main');
    dom.swipeHint     = document.getElementById('dusk-swipe-hint');
    dom.whatsappFloat = document.getElementById('dusk-whatsapp-float');
    dom.guestbookList = document.getElementById('dusk-guestbook-list');
    dom.rsvpForm      = document.getElementById('dusk-rsvp-form');
    dom.rsvpSuccess   = document.getElementById('dusk-rsvp-success');
    dom.rsvpName      = document.getElementById('rsvp-name');
    dom.rsvpMsg       = document.getElementById('rsvp-msg');
    dom.rsvpCounter   = document.getElementById('rsvp-counter');
    dom.bankTabs      = document.querySelectorAll('.dusk-mosque-gift-tab');
    dom.bankPanels    = document.querySelectorAll('.dusk-bank-panel');
    dom.cards         = document.querySelectorAll('.dusk-mosque-card[data-slide]');
    dom.slideContainers = document.querySelectorAll('.dusk-mosque-slide-container');
    dom.toast         = document.getElementById('dusk-toast');
    dom.particleCanvas = document.getElementById('dusk-particles');

    /* Countdown units */
    dom.cdDays   = document.getElementById('cd-days');
    dom.cdHours  = document.getElementById('cd-hours');
    dom.cdMins   = document.getElementById('cd-mins');
    dom.cdSecs   = document.getElementById('cd-secs');
}

/* ═══════════════════════════════════════
   PRELOADER
   ═══════════════════════════════════════ */
function initPreloader() {
    setTimeout(() => {
        if (dom.preloader) {
            dom.preloader.classList.add('is-hidden');
        }
    }, 1300);
}

/* ═══════════════════════════════════════
   AUDIO
   ═══════════════════════════════════════ */
function initAudio() {
    audio = new Audio('/audio/backsound.mp3');
    audio.loop = true;
    audio.volume = 0.55;
    audio.preload = 'auto';

    if (dom.musicBtn) {
        dom.musicBtn.addEventListener('click', toggleMusic);
    }
}

function toggleMusic() {
    if (!audio) return;
    if (state.isPlaying) {
        audio.pause();
        state.isPlaying = false;
        dom.musicBtn.classList.remove('is-playing');
    } else {
        audio.play().catch(() => {});
        state.isPlaying = true;
        dom.musicBtn.classList.add('is-playing');
    }
}

/* ═══════════════════════════════════════
   COVER GATE
   ═══════════════════════════════════════ */
function initCoverEvents() {
    if (!dom.openBtn) return;
    dom.openBtn.addEventListener('click', openInvitation);
}

function openInvitation() {
    if (state.isOpened) return;
    state.isOpened = true;

    /* Hide cover */
    dom.cover.classList.add('is-hidden');

    /* Show navigation & controls */
    setTimeout(() => {
        dom.musicBtn.classList.add('is-visible');
        dom.fullscreenBtn.classList.add('is-visible');
        dom.layoutBtn.classList.add('is-visible');
        dom.nav.classList.add('is-visible');
        if (dom.whatsappFloat) dom.whatsappFloat.style.opacity = '1';
    }, 600);

    /* Request fullscreen */
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
    }

    /* Autoplay music */
    if (audio) {
        audio.play().then(() => {
            state.isPlaying = true;
            dom.musicBtn.classList.add('is-playing');
        }).catch(() => {});
    }

    /* Build main layout */
    buildLayout();

    /* Show first card */
    setTimeout(() => showCard(0), 800);

    /* Show swipe hint */
    if (state.layoutMode !== 'scroll' && dom.swipeHint) {
        dom.swipeHint.style.opacity = '1';
    }

    /* Start scrollspy for scroll mode */
    if (state.layoutMode === 'scroll') {
        initScrollSpy();
    }

    /* Raise buttons when nav is visible */
    raiseButtons();
}

/* ═══════════════════════════════════════
   LAYOUT BUILDER
   ═══════════════════════════════════════ */
function buildLayout() {
    const isSlide = state.layoutMode !== 'scroll';
    const isSlideH = state.layoutMode === 'slide-h';
    const isSlideV = state.layoutMode === 'slide-v';

    /* Clear & set main class */
    dom.mainArea.className = '';
    if (isSlideH) dom.mainArea.classList.add('dusk-mosque-main--slide', 'dusk-mosque-main--slide-h');
    else if (isSlideV) dom.mainArea.classList.add('dusk-mosque-main--slide', 'dusk-mosque-main--slide-v');
    else {
        dom.mainArea.classList.add('dusk-mosque-main--scroll');
        document.body.style.overflow = 'auto';
    }

    if (isSlide) {
        document.body.style.overflow = 'hidden';
    }

    /* Update scene class */
    updateSceneClass();
}

function updateSceneClass() {
    if (!dom.scene) return;
    const isSlide = state.layoutMode !== 'scroll';

    if (isSlide) {
        const idx = state.activeSlideIdx;
        dom.scene.className = 'dusk-mosque-scene';
        if (idx >= 4) {
            dom.scene.classList.add('active-slide-post');
        } else {
            dom.scene.classList.add(`active-slide-${idx}`);
        }
    } else {
        dom.scene.className = 'dusk-mosque-scene active-slide-0';
    }
}

/* ═══════════════════════════════════════
   CARDS (Stage Overlay Cards)
   ═══════════════════════════════════════ */
function showCard(slideIdx) {
    if (state.layoutMode === 'scroll') return;

    /* Hide all stage cards */
    document.querySelectorAll('.dusk-mosque-card[data-slide]').forEach(c => {
        c.classList.remove('is-visible');
    });

    /* Show the matching card */
    const target = document.querySelector(`.dusk-mosque-card[data-slide="${slideIdx}"]`);
    if (target) {
        setTimeout(() => target.classList.add('is-visible'), 100);
    }

    /* Update slide containers state */
    dom.slideContainers.forEach((container, i) => {
        container.classList.remove('is-active', 'is-prev', 'is-next');
        if (i === slideIdx) container.classList.add('is-active');
        else if (i < slideIdx) container.classList.add('is-prev');
        else container.classList.add('is-next');
    });

    /* Update navigation active item */
    const navMap = { 0: 'opening', 1: 'bride_groom', 2: 'bride_groom', 3: 'event' };
    const sectionId = navMap[slideIdx] || null;
    if (sectionId) setActiveNav(sectionId);

    /* Update scene camera */
    updateSceneClass();

    /* Swipe hint logic */
    if (dom.swipeHint) {
        dom.swipeHint.classList.toggle('is-hidden', slideIdx >= 4);
    }
}

/* ═══════════════════════════════════════
   SLIDE NAVIGATION
   ═══════════════════════════════════════ */
function getSlideCount() {
    return dom.slideContainers.length;
}

function nextSlide() {
    const max = getSlideCount() - 1;
    if (state.activeSlideIdx >= max) return;
    state.activeSlideIdx++;
    showCard(state.activeSlideIdx);
}

function prevSlide() {
    if (state.activeSlideIdx <= 0) return;
    state.activeSlideIdx--;
    showCard(state.activeSlideIdx);
}

/* ═══════════════════════════════════════
   LAYOUT SWITCHER
   ═══════════════════════════════════════ */
function initLayoutBtn() {
    if (!dom.layoutBtn) return;
    dom.layoutBtn.addEventListener('click', cycleLayout);
    updateLayoutLabel();
}

function cycleLayout() {
    const idx = LAYOUT_MODES.indexOf(state.layoutMode);
    state.layoutMode = LAYOUT_MODES[(idx + 1) % LAYOUT_MODES.length];
    state.activeSlideIdx = 0;

    updateLayoutLabel();
    buildLayout();

    /* Reset all slide containers */
    dom.slideContainers.forEach((c, i) => {
        c.classList.remove('is-active', 'is-prev', 'is-next');
        if (i === 0) c.classList.add('is-active');
        else c.classList.add('is-next');
    });

    /* Reset all cards */
    document.querySelectorAll('.dusk-mosque-card[data-slide]').forEach(c => c.classList.remove('is-visible'));
    if (state.layoutMode !== 'scroll') {
        setTimeout(() => showCard(0), 100);
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
        initScrollSpy();
    }

    showToast(`Mode: ${LAYOUT_LABELS[state.layoutMode]}`);
    raiseButtons();
}

function updateLayoutLabel() {
    if (dom.layoutLabel) {
        dom.layoutLabel.textContent = LAYOUT_LABELS[state.layoutMode];
    }
    /* Update tooltip on button */
    if (dom.layoutBtn) {
        dom.layoutBtn.title = `Mode: ${LAYOUT_LABELS[state.layoutMode]}`;
    }
}

/* ─── Initialize layout button AFTER DOM caches ─── */
document.addEventListener('DOMContentLoaded', () => {
    initLayoutBtn();
});

/* ═══════════════════════════════════════
   MOUSE PARALLAX
   ═══════════════════════════════════════ */
function initMouseParallax() {
    window.addEventListener('mousemove', (e) => {
        if (!state.isOpened) return;
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        state.mouseOffset = { x, y };
        applyParallax();
    });

    /* Mobile device orientation */
    window.addEventListener('deviceorientation', (e) => {
        if (!state.isOpened) return;
        const x = (e.gamma || 0) * 0.4;
        const y = (e.beta ? (e.beta - 45) : 0) * 0.25;
        state.mouseOffset = { x: Math.max(-15, Math.min(15, x)), y: Math.max(-15, Math.min(15, y)) };
        applyParallax();
    });
}

function applyParallax() {
    const { x, y } = state.mouseOffset;

    const bg  = document.querySelector('.dusk-mosque-layer--background');
    const kl  = document.querySelector('.dusk-mosque-layer--kurma-left');
    const kr  = document.querySelector('.dusk-mosque-layer--kurma-right');
    const bi  = document.querySelector('.dusk-mosque-layer--birds');
    const co  = document.querySelector('.dusk-mosque-layer--couple');
    const fg  = document.querySelector('.dusk-mosque-layer--foreground');

    if (bg)  bg.style.transform  = `translate3d(${x*0.3}px, ${y*0.3}px, 0) scale(1.1)`;
    if (kl)  kl.style.transform  = `translate3d(${x*0.5 - 20}px, ${y*0.5 - 20}px, 0) scale(1.3)`;
    if (kr)  kr.style.transform  = `scaleX(-1) translate3d(${x*0.5 - 20}px, ${y*0.5 - 20}px, 0) scale(1.3)`;
    if (bi)  bi.style.transform  = `translate3d(${x*0.2 - 30}px, ${y*0.2 - 50}px, 0) scale(1.05)`;
    if (co)  co.style.transform  = `translate3d(${x*0.4}px, ${y*0.4 + 40}px, 0) scale(1.15)`;
    if (fg)  fg.style.transform  = `translate3d(${x*0.7}px, ${y*0.7}px, 0) scale(1.25)`;
}

/* ═══════════════════════════════════════
   SWIPE / DRAG EVENTS
   ═══════════════════════════════════════ */
function initSwipeEvents() {
    const area = dom.mainArea;
    if (!area) return;

    /* Touch */
    area.addEventListener('touchstart', (e) => {
        state.touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY, time: Date.now() };
        state.isDragging = true;
    }, { passive: true });

    area.addEventListener('touchend', (e) => {
        if (!state.isDragging) return;
        state.isDragging = false;
        handleSwipeEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    });

    /* Mouse drag */
    area.addEventListener('mousedown', (e) => {
        state.touchStart = { x: e.clientX, y: e.clientY, time: Date.now() };
        state.isDragging = true;
    });
    area.addEventListener('mouseup', (e) => {
        if (!state.isDragging) return;
        state.isDragging = false;
        handleSwipeEnd(e.clientX, e.clientY);
    });
    area.addEventListener('mouseleave', () => { state.isDragging = false; });

    /* Wheel */
    area.addEventListener('wheel', (e) => {
        if (state.layoutMode === 'scroll') return;
        e.preventDefault();
        if (e.deltaY > 0) nextSlide();
        else prevSlide();
    }, { passive: false });
}

function handleSwipeEnd(x, y) {
    if (state.layoutMode === 'scroll') return;

    const dx = x - state.touchStart.x;
    const dy = y - state.touchStart.y;
    const dt = Date.now() - state.touchStart.time;
    const threshold = 50;
    const isFast = dt < 300 && (Math.abs(dx) > 25 || Math.abs(dy) > 25);

    if (state.layoutMode === 'slide-h') {
        if (Math.abs(dx) > Math.abs(dy) && (Math.abs(dx) > threshold || isFast)) {
            if (dx < 0) nextSlide(); else prevSlide();
        }
    } else {
        if (Math.abs(dy) > Math.abs(dx) && (Math.abs(dy) > threshold || isFast)) {
            if (dy < 0) nextSlide(); else prevSlide();
        }
    }
}

/* ═══════════════════════════════════════
   NAVIGATION
   ═══════════════════════════════════════ */
function setActiveNav(id) {
    state.activeMenuId = id;
    dom.navItems.forEach(btn => {
        btn.classList.toggle('is-active', btn.dataset.section === id);
    });
}

/* Nav item click */
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.dusk-mosque-nav-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.dataset.section;
            if (!section) return;

            if (state.layoutMode === 'scroll') {
                const el = document.getElementById(section);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            } else {
                /* Map section to slide index */
                const slideMap = { opening: 0, bride_groom: 1, event: 3, gallery: 4, rsvp: 5, bank: 6, closing: 7 };
                const idx = slideMap[section];
                if (idx !== undefined) {
                    state.activeSlideIdx = idx;
                    showCard(idx);
                }
            }
            setActiveNav(section);
        });
    });
});

/* ═══════════════════════════════════════
   SCROLLSPY (Scroll mode only)
   ═══════════════════════════════════════ */
function initScrollSpy() {
    const sections = ['opening', 'bride_groom', 'event', 'love_story', 'gallery', 'rsvp', 'bank', 'closing'];

    const handleScroll = () => {
        let current = sections[0];
        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                const rect = el.getBoundingClientRect();
                if (rect.top <= 250 && rect.bottom > 100) current = id;
            }
        });
        setActiveNav(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
}

/* ═══════════════════════════════════════
   COUNTDOWN
   ═══════════════════════════════════════ */
function startCountdown() {
    function tick() {
        const now = new Date();
        const diff = COUNTDOWN_TARGET - now;

        if (diff <= 0) {
            if (dom.cdDays) dom.cdDays.textContent = '0';
            if (dom.cdHours) dom.cdHours.textContent = '0';
            if (dom.cdMins) dom.cdMins.textContent = '0';
            if (dom.cdSecs) dom.cdSecs.textContent = '0';
            return;
        }

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        if (dom.cdDays)  dom.cdDays.textContent  = d;
        if (dom.cdHours) dom.cdHours.textContent = h;
        if (dom.cdMins)  dom.cdMins.textContent  = m;
        if (dom.cdSecs)  dom.cdSecs.textContent  = s;
    }

    tick();
    setInterval(tick, 1000);
}

/* ═══════════════════════════════════════
   GUESTBOOK
   ═══════════════════════════════════════ */
function renderGuestbook() {
    if (!dom.guestbookList) return;
    dom.guestbookList.innerHTML = '';

    state.guestbookData.forEach(w => {
        const card = createWishCard(w);
        dom.guestbookList.appendChild(card);
    });
}

function createWishCard(w) {
    const div = document.createElement('div');
    div.className = 'dusk-mosque-wish-card';

    const dateStr = w.date
        ? new Date(w.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
        : 'Baru saja';

    const statusHtml = w.attendance
        ? `<span class="dusk-mosque-wish-status dusk-mosque-wish-status--${w.attendance}">${w.attendance === 'hadir' ? 'Hadir' : 'Tidak Hadir'}</span>`
        : '';

    div.innerHTML = `
        <div class="dusk-mosque-wish-header">
            <span class="dusk-mosque-wish-name">${escapeHtml(w.name)}</span>
            <span class="dusk-mosque-wish-date">${dateStr}</span>
        </div>
        ${statusHtml}
        <p class="dusk-mosque-wish-message">${escapeHtml(w.message)}</p>
    `;

    return div;
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str || ''));
    return div.innerHTML;
}

/* ═══════════════════════════════════════
   RSVP FORM
   ═══════════════════════════════════════ */
function initRsvpForm() {
    if (!dom.rsvpForm) return;

    /* Character counter */
    if (dom.rsvpMsg && dom.rsvpCounter) {
        dom.rsvpMsg.addEventListener('input', () => {
            dom.rsvpCounter.textContent = `${dom.rsvpMsg.value.length}/1000`;
        });
    }

    dom.rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name       = (document.getElementById('rsvp-name')?.value || '').trim();
        const message    = (document.getElementById('rsvp-msg')?.value || '').trim();
        const attendance = document.querySelector('input[name="attendance"]:checked')?.value || 'hadir';

        if (!name || !message) return;

        const newWish = {
            name,
            message,
            attendance,
            date: new Date().toISOString().split('T')[0],
        };

        /* Prepend to list */
        state.guestbookData.unshift(newWish);
        const card = createWishCard(newWish);
        if (dom.guestbookList) {
            dom.guestbookList.prepend(card);
        }

        /* Show success */
        if (dom.rsvpSuccess) {
            dom.rsvpSuccess.style.display = 'block';
            setTimeout(() => { dom.rsvpSuccess.style.display = 'none'; }, 4000);
        }

        showToast('Doa & Ucapan berhasil dikirim! 🌙');

        /* Reset form */
        dom.rsvpForm.reset();
        if (dom.rsvpCounter) dom.rsvpCounter.textContent = '0/1000';
    });
}

/* ═══════════════════════════════════════
   BANK TABS
   ═══════════════════════════════════════ */
function initBankTabs() {
    dom.bankTabs.forEach((tab, i) => {
        tab.addEventListener('click', () => {
            dom.bankTabs.forEach(t => t.classList.remove('is-active'));
            dom.bankPanels.forEach(p => p.style.display = 'none');
            tab.classList.add('is-active');
            if (dom.bankPanels[i]) dom.bankPanels[i].style.display = 'block';
        });
    });

    /* Activate first tab */
    if (dom.bankTabs[0]) dom.bankTabs[0].classList.add('is-active');
    dom.bankPanels.forEach((p, i) => {
        p.style.display = i === 0 ? 'block' : 'none';
    });
}

/* ═══════════════════════════════════════
   COPY BUTTONS
   ═══════════════════════════════════════ */
function initCopyButtons() {
    document.querySelectorAll('.dusk-mosque-copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.dataset.copy || '';
            if (!text) return;

            const originalText = btn.innerHTML;

            const fallbackCopy = (txt) => {
                const ta = document.createElement('textarea');
                ta.value = txt;
                Object.assign(ta.style, { position: 'fixed', opacity: 0 });
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
            };

            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(text)
                    .then(() => flashCopied(btn, originalText))
                    .catch(() => { fallbackCopy(text); flashCopied(btn, originalText); });
            } else {
                fallbackCopy(text);
                flashCopied(btn, originalText);
            }

            showToast('Berhasil disalin! 📋');
        });
    });
}

function flashCopied(btn, originalHtml) {
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg> Disalin!';
    btn.style.background = '#28a745';
    setTimeout(() => {
        btn.innerHTML = originalHtml;
        btn.style.background = '';
    }, 2000);
}

/* ═══════════════════════════════════════
   TOAST
   ═══════════════════════════════════════ */
function showToast(msg) {
    if (!dom.toast) return;
    dom.toast.textContent = msg;
    dom.toast.classList.add('is-show');
    setTimeout(() => dom.toast.classList.remove('is-show'), 2800);
}

/* ═══════════════════════════════════════
   FULLSCREEN
   ═══════════════════════════════════════ */
function initFullscreen() {
    if (!dom.fullscreenBtn) return;
    dom.fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        } else {
            document.exitFullscreen();
        }
    });

    document.addEventListener('fullscreenchange', () => {
        state.isFullscreen = !!document.fullscreenElement;
        /* Swap icon */
        const icon = dom.fullscreenBtn.querySelector('svg');
        if (icon) {
            if (state.isFullscreen) {
                icon.innerHTML = '<path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7"/>';
            } else {
                icon.innerHTML = '<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>';
            }
        }
    });
}

/* ═══════════════════════════════════════
   GOLD DUST PARTICLES
   ═══════════════════════════════════════ */
function initParticles() {
    const canvas = dom.particleCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    });

    const particles = Array.from({ length: 40 }, () => createParticle(W, H));

    function createParticle(w, h) {
        return {
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() * 2 + 0.5,
            vy: -(Math.random() * 0.4 + 0.15),
            vx: (Math.random() - 0.5) * 0.3,
            alpha: Math.random() * 0.6 + 0.1,
            decay: Math.random() * 0.003 + 0.001,
        };
    }

    function animate() {
        ctx.clearRect(0, 0, W, H);

        particles.forEach((p, i) => {
            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle   = '#D4AF37';
            ctx.shadowBlur  = 6;
            ctx.shadowColor = 'rgba(212,175,55,0.8)';
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= p.decay;

            if (p.alpha <= 0 || p.y < -10) {
                particles[i] = createParticle(W, H);
                particles[i].y = H + 5;
                particles[i].alpha = 0;
            }
        });

        requestAnimationFrame(animate);
    }

    animate();
}

/* ═══════════════════════════════════════
   RAISE BUTTONS (when nav visible)
   ═══════════════════════════════════════ */
function raiseButtons() {
    [dom.musicBtn, dom.fullscreenBtn, dom.layoutBtn].forEach(btn => {
        if (btn) {
            btn.classList.add('dusk-mosque-music-btn--raised');
        }
    });
    if (dom.whatsappFloat) dom.whatsappFloat.classList.add('dusk-mosque-whatsapp-float--raised');
}
