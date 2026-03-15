/* ============================================================
   script.js — Portfolio Ruan Lima Ramos
   Otimizado para GitHub Pages (sem bundler, sem build step)
   ============================================================ */

'use strict';

// ==================== UTILITÁRIOS ====================
const debounce = (fn, wait) => {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
};

const throttle = (fn, limit) => {
    let ok = true;
    return (...args) => {
        if (!ok) return;
        fn(...args);
        ok = false;
        setTimeout(() => (ok = true), limit);
    };
};

// Cria um IntersectionObserver com fallback para navegadores antigos
const createObserver = (callback, options = {}) => {
    if (!('IntersectionObserver' in window)) {
        // Fallback: executa callback imediatamente em todos os elementos
        return {
            observe: (el) => callback([{ isIntersecting: true, target: el }]),
            unobserve: () => {},
            disconnect: () => {}
        };
    }
    return new IntersectionObserver(callback, options);
};

// ==================== NAVEGAÇÃO MOBILE ====================
const initMobileNav = () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu   = document.querySelector('.nav-menu');
    const navLinks  = document.querySelectorAll('.nav-link');
    if (!hamburger || !navMenu) return;

    const closeMenu = () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    };

    const openMenu = () => {
        navMenu.classList.add('active');
        hamburger.classList.add('active');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    };

    const toggleMenu = () => {
        navMenu.classList.contains('active') ? closeMenu() : openMenu();
    };

    hamburger.addEventListener('click', toggleMenu);
    hamburger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMenu(); }
    });

    navLinks.forEach((link) => link.addEventListener('click', closeMenu));

    document.addEventListener('mousedown', (e) => {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) closeMenu();
    });
};

// ==================== NAVBAR SCROLL ====================
const initNavbarScroll = () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const update = () => navbar.classList.toggle('scrolled', window.scrollY > 50);
    window.addEventListener('scroll', throttle(update, 100), { passive: true });
    update();
};

// ==================== ANIMAÇÃO DE DIGITAÇÃO ====================
const initTypingAnimation = () => {
    const el = document.querySelector('.typing-text');
    if (!el) return;

    const phrases = [
        'Desenvolvedor Full Stack',
        'Criador de Experiências Web',
        'Apaixonado por Código'
    ];
    let pi = 0, ci = 0, deleting = false;

    const tick = () => {
        const phrase = phrases[pi];
        el.textContent = deleting
            ? phrase.substring(0, ci - 1)
            : phrase.substring(0, ci + 1);

        if (!deleting) {
            ci++;
            if (ci === phrase.length) {
                setTimeout(() => { deleting = true; tick(); }, 2000);
                return;
            }
        } else {
            ci--;
            if (ci === 0) {
                deleting = false;
                pi = (pi + 1) % phrases.length;
            }
        }
        setTimeout(tick, deleting ? 55 : 95);
    };

    el.textContent = '';
    setTimeout(tick, 600);
};

// ==================== CONTADOR DE ESTATÍSTICAS ====================
const initStatsCounter = () => {
    const stats = document.querySelectorAll('.stat-number[data-target]');
    if (!stats.length) return;

    const animate = (el) => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        if (isNaN(target)) return;
        const duration = 1800;
        const step = 16;
        const inc = target / (duration / step);
        let cur = 0;
        const run = () => {
            cur += inc;
            if (cur < target) {
                el.textContent = Math.floor(cur) + '+';
                requestAnimationFrame(run);
            } else {
                el.textContent = target + '+';
            }
        };
        run();
    };

    const obs = createObserver(
        (entries) => entries.forEach((e) => {
            if (e.isIntersecting) { animate(e.target); obs.unobserve(e.target); }
        }),
        { threshold: 0.3 }
    );
    stats.forEach((s) => obs.observe(s));
};

// ==================== SCROLL SUAVE ====================
const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });
};

// ==================== BARRAS DE SKILL ====================
const initSkillBars = () => {
    const bars = document.querySelectorAll('.skill-progress[data-progress]');
    if (!bars.length) return;

    // Garante largura 0 antes de animar
    bars.forEach((b) => { b.style.width = '0%'; });

    const obs = createObserver(
        (entries) => entries.forEach((e) => {
            if (e.isIntersecting) {
                const val = parseFloat(e.target.getAttribute('data-progress'));
                if (!isNaN(val)) {
                    // Pequeno delay para garantir que a transição CSS seja capturada
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            e.target.style.width = Math.min(val, 100) + '%';
                        });
                    });
                }
                obs.unobserve(e.target);
            }
        }),
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    bars.forEach((b) => obs.observe(b));
};

// ==================== FADE IN AO ROLAR ====================
const initFadeIn = () => {
    const selector = [
        '.projeto-card',
        '.skill-category',
        '.stat-card',
        '.sobre-text',
        '.contato-item',
        '.section-title',
        '.tech-icon',
        '.contato-form-wrapper'
    ].join(', ');

    const els = document.querySelectorAll(selector);
    if (!els.length) return;

    // Injeta CSS de fade in diretamente para garantir que funcione sem arquivos externos
    const styleId = 'fade-in-runtime';
    if (!document.getElementById(styleId)) {
        const s = document.createElement('style');
        s.id = styleId;
        s.textContent = `
            .will-fade {
                opacity: 0;
                transform: translateY(28px);
                transition: opacity 0.65s ease, transform 0.65s ease;
            }
            .will-fade.is-visible {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(s);
    }

    els.forEach((el, i) => {
        el.classList.add('will-fade');
        // Delay escalonado por índice (máx 400ms)
        el.style.transitionDelay = Math.min(i * 60, 400) + 'ms';
    });

    const obs = createObserver(
        (entries) => entries.forEach((e) => {
            if (e.isIntersecting) {
                e.target.classList.add('is-visible');
                obs.unobserve(e.target);
            }
        }),
        { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );

    els.forEach((el) => obs.observe(el));
};

// ==================== PARTÍCULAS ====================
const initParticles = () => {
    document.querySelectorAll('.particle').forEach((p) => {
        p.style.animationDuration = (15 + Math.random() * 12) + 's';
        p.style.animationDelay    = '-' + (Math.random() * 10) + 's';
    });
};

// ==================== FORMULÁRIO DE CONTATO ====================
const initContactForm = () => {
    const form   = document.getElementById('contactForm');
    const status = document.getElementById('statusMessage');
    if (!form || !status) return;

    let hideTimer;

    const showMsg = (msg, type) => {
        clearTimeout(hideTimer);
        status.textContent = msg;
        status.className   = 'status-message ' + type;
        status.style.display  = 'block';
        status.style.opacity  = '1';
        status.setAttribute('role', 'alert');
        hideTimer = setTimeout(() => {
            status.style.transition = 'opacity 0.3s';
            status.style.opacity    = '0';
            setTimeout(() => { status.style.display = 'none'; }, 320);
        }, 5000);
    };

    const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const emailEl = form.querySelector('input[type="email"]');
        if (emailEl && !isEmail(emailEl.value.trim())) {
            showMsg('⚠️ Insira um e-mail válido.', 'error');
            emailEl.focus();
            return;
        }

        const btn = form.querySelector('button[type="submit"]');
        const orig = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<span>Enviando...</span>';

        try {
            const res = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { Accept: 'application/json' }
            });

            if (res.ok) {
                showMsg('✅ Mensagem enviada com sucesso!', 'success');
                form.reset();
                form.querySelectorAll('input, textarea').forEach((f) => f.classList.remove('valid'));
            } else {
                const data = await res.json().catch(() => ({}));
                throw new Error(data?.error || 'Erro ao enviar.');
            }
        } catch (err) {
            showMsg('❌ ' + (err.message || 'Erro ao enviar. Tente novamente.'), 'error');
        } finally {
            btn.disabled = false;
            btn.innerHTML = orig;
        }
    });

    form.querySelectorAll('input, textarea').forEach((input) => {
        input.addEventListener('blur',  () => input.classList.toggle('valid', input.value.trim() !== ''));
        input.addEventListener('input', () => {
            if (input.classList.contains('valid'))
                input.classList.toggle('valid', input.value.trim() !== '');
        });
    });
};

// ==================== EFEITO GLITCH ====================
const initGlitchEffect = () => {
    const el = document.querySelector('.glitch');
    if (!el) return;
    el.addEventListener('mouseenter', () => el.style.animationDuration = '0.25s');
    el.addEventListener('mouseleave', () => el.style.animationDuration = '3s');
};

// ==================== TECH ICONS ====================
const initTechIcons = () => {
    document.querySelectorAll('.tech-icon').forEach((icon, i) => {
        icon.style.animationDelay = (i * 0.08) + 's';
        icon.addEventListener('click', () => {
            icon.classList.remove('bounce');
            void icon.offsetWidth; // reflow
            icon.classList.add('bounce');
        });
        icon.addEventListener('animationend', (e) => {
            if (e.animationName === 'bounce') icon.classList.remove('bounce');
        });
    });
};

// ==================== SEÇÃO ATIVA NO MENU ====================
const initActiveSection = () => {
    const sections = document.querySelectorAll('section[id]');
    const links    = document.querySelectorAll('.nav-link');
    if (!sections.length || !links.length) return;

    const update = throttle(() => {
        const y = window.pageYOffset + 120;
        sections.forEach((sec) => {
            if (y >= sec.offsetTop && y < sec.offsetTop + sec.offsetHeight) {
                const id = sec.getAttribute('id');
                links.forEach((l) => {
                    const active = l.getAttribute('href') === '#' + id;
                    l.classList.toggle('active', active);
                    l.setAttribute('aria-current', active ? 'page' : 'false');
                });
            }
        });
    }, 100);

    window.addEventListener('scroll', update, { passive: true });
    update();
};

// ==================== LAZY LOADING DE IMAGENS ====================
const initLazyLoading = () => {
    const imgs = document.querySelectorAll('img[data-src]');
    if (!imgs.length) return;

    if (!('IntersectionObserver' in window)) {
        imgs.forEach((img) => { img.src = img.dataset.src; img.classList.add('loaded'); });
        return;
    }

    const obs = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (e.isIntersecting) {
                e.target.src = e.target.dataset.src;
                e.target.removeAttribute('data-src');
                e.target.classList.add('loaded');
                obs.unobserve(e.target);
            }
        });
    }, { rootMargin: '200px' });

    imgs.forEach((img) => obs.observe(img));
};

// ==================== TECLADO ====================
const initKeyboardShortcuts = () => {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const menu = document.querySelector('.nav-menu');
            const btn  = document.querySelector('.hamburger');
            if (menu && menu.classList.contains('active')) {
                menu.classList.remove('active');
                btn?.classList.remove('active');
                btn?.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        }
    });
};

// ==================== SCROLL TO TOP ====================
const initScrollToTop = () => {
    if (document.querySelector('.scroll-to-top')) return;

    const btn = document.createElement('button');
    btn.className   = 'scroll-to-top';
    btn.innerHTML   = '<i class="fas fa-arrow-up"></i>';
    btn.setAttribute('aria-label', 'Voltar ao topo');
    document.body.appendChild(btn);

    window.addEventListener('scroll', throttle(() => {
        btn.classList.toggle('visible', window.scrollY > 500);
    }, 100), { passive: true });

    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
};

// ==================== CURSOR PERSONALIZADO ====================
const initCustomCursor = () => {
    if (window.innerWidth < 768) return;

    let cursor = document.querySelector('.custom-cursor');
    if (!cursor) {
        cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);
    }

    let mx = 0, my = 0, cx = 0, cy = 0;

    const loop = () => {
        cx += (mx - cx) * 0.18;
        cy += (my - cy) * 0.18;
        cursor.style.transform = `translate(${cx}px, ${cy}px)`;
        requestAnimationFrame(loop);
    };

    document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
    document.addEventListener('mouseleave', () => cursor.classList.add('hidden'));
    document.addEventListener('mouseenter', () => cursor.classList.remove('hidden'));
    loop();

    document.querySelectorAll('a, button, .projeto-card, .tech-icon, input, textarea').forEach((el) => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
};

// ==================== LOADING INICIAL (sem loader, só hero) ====================
const initPageLoad = () => {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    hero.style.opacity   = '0';
    hero.style.transform = 'translateY(20px)';
    hero.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
    requestAnimationFrame(() => requestAnimationFrame(() => {
        hero.style.opacity   = '1';
        hero.style.transform = 'translateY(0)';
    }));
};

// ==================== CONSOLE ====================
const initConsole = () => {
    console.log('%c🚀 Portfólio — Ruan Lima Ramos', 'font-size:18px;color:#c9a84c;font-weight:bold;');
    console.log('%c💻 Desenvolvedor Full Stack', 'font-size:13px;color:#8b8a96;');
    console.log('%c⚠️  Cuidado com o que você cola aqui!', 'font-size:14px;color:#c94c4c;font-weight:bold;');
};

// ==================== INICIALIZAÇÃO ====================
const init = () => {
    initMobileNav();
    initNavbarScroll();
    initSmoothScroll();
    initStatsCounter();
    initSkillBars();
    initFadeIn();
    initParticles();
    initContactForm();
    initGlitchEffect();
    initTechIcons();
    initActiveSection();
    initLazyLoading();
    initKeyboardShortcuts();
    initScrollToTop();
    initConsole();
};

// Garante execução assim que o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Animações visuais após tudo carregar
window.addEventListener('load', () => {
    initPageLoad();
    initTypingAnimation();
    if (window.innerWidth >= 768) initCustomCursor();
});

// Cursor ao redimensionar
let _wasDesktop = window.innerWidth >= 768;
window.addEventListener('resize', debounce(() => {
    const isDesktop = window.innerWidth >= 768;
    if (isDesktop && !_wasDesktop) initCustomCursor();
    _wasDesktop = isDesktop;
}, 250));