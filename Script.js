/* ============================================================
   script.js — Portfolio Ruan Lima Ramos
   Estratégia: NUNCA esconder elementos via JS.
   Animações são bônus, conteúdo sempre visível.
   ============================================================ */

'use strict';

// ==================== UTILITÁRIOS ====================
const debounce = (fn, ms) => {
    let t;
    return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
};

const throttle = (fn, ms) => {
    let ok = true;
    return (...a) => { if (!ok) return; fn(...a); ok = false; setTimeout(() => ok = true, ms); };
};

// Observer com rootMargin generoso e threshold zero — máxima compatibilidade
const onVisible = (elements, callback) => {
    if (!('IntersectionObserver' in window)) {
        // Sem suporte: executa tudo imediatamente
        elements.forEach(el => callback(el));
        return;
    }
    const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                callback(entry.target);
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0,
        rootMargin: '0px 0px 0px 0px'  // sem margem negativa — detecta assim que toca a tela
    });
    elements.forEach(el => io.observe(el));
};

// ==================== HERO — aparece imediatamente sem JS ====================
// O hero é visível por CSS. JS só adiciona a transição suave se possível.
const initHero = () => {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    // Já visível via CSS — apenas adiciona classe para animação extra
    requestAnimationFrame(() => hero.classList.add('hero-ready'));
};

// ==================== DIGITAÇÃO ====================
const initTyping = () => {
    const el = document.querySelector('.typing-text');
    if (!el) return;

    const phrases = ['Desenvolvedor Full Stack', 'Criador de Experiências Web', 'Apaixonado por Código'];
    let pi = 0, ci = 0, del = false;

    const tick = () => {
        const p = phrases[pi];
        el.textContent = del ? p.slice(0, ci - 1) : p.slice(0, ci + 1);
        if (!del) {
            ci++;
            if (ci > p.length) {
                del = true;
                setTimeout(tick, 1800);
                return;
            }
        } else {
            ci--;
            if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; }
        }
        setTimeout(tick, del ? 50 : 90);
    };

    el.textContent = '';
    setTimeout(tick, 400);
};

// ==================== CONTADOR ====================
const initCounters = () => {
    const els = document.querySelectorAll('.stat-number[data-target]');
    if (!els.length) return;

    const run = (el) => {
        const target = parseInt(el.dataset.target, 10);
        if (isNaN(target)) return;
        // Já tem valor — não reanimar
        if (el.dataset.animated) return;
        el.dataset.animated = '1';

        let start = null;
        const duration = 1500;
        const step = (ts) => {
            if (!start) start = ts;
            const pct = Math.min((ts - start) / duration, 1);
            el.textContent = Math.floor(pct * target) + '+';
            if (pct < 1) requestAnimationFrame(step);
            else el.textContent = target + '+';
        };
        requestAnimationFrame(step);
    };

    onVisible([...els], run);
};

// ==================== BARRAS DE SKILL ====================
const initSkillBars = () => {
    const bars = document.querySelectorAll('.skill-progress[data-progress]');
    if (!bars.length) return;

    const fill = (bar) => {
        if (bar.dataset.filled) return;
        bar.dataset.filled = '1';
        const val = Math.min(parseFloat(bar.dataset.progress) || 0, 100);
        // Duplo rAF garante que o browser registra a transição antes de mudar width
        requestAnimationFrame(() => requestAnimationFrame(() => {
            bar.style.width = val + '%';
        }));
    };

    onVisible([...bars], fill);
};

// ==================== FADE IN ====================
const initFadeIn = () => {
    // Injeta estilos de fade inline — não depende do style.css carregar
    if (!document.getElementById('_fade_styles')) {
        const s = document.createElement('style');
        s.id = '_fade_styles';
        s.textContent = `
            .fi { opacity:0; transform:translateY(22px); transition:opacity .6s ease,transform .6s ease; }
            .fi.fv { opacity:1 !important; transform:none !important; }
        `;
        document.head.appendChild(s);
    }

    const targets = document.querySelectorAll([
        '.stat-card', '.skill-category', '.projeto-card',
        '.sobre-text', '.contato-item', '.contato-form-wrapper'
    ].join(','));

    targets.forEach(el => el.classList.add('fi'));

    onVisible([...targets], el => {
        // Pequeno delay escalonado por posição DOM
        const siblings = [...el.parentElement.children];
        const idx = siblings.indexOf(el);
        setTimeout(() => el.classList.add('fv'), idx * 80);
    });
};

// ==================== NAVBAR SCROLL ====================
const initNavbar = () => {
    const nav = document.querySelector('.navbar');
    if (!nav) return;
    const update = () => nav.classList.toggle('scrolled', window.scrollY > 50);
    window.addEventListener('scroll', throttle(update, 80), { passive: true });
    update();
};

// ==================== MENU MOBILE ====================
const initMobileMenu = () => {
    const btn  = document.querySelector('.hamburger');
    const menu = document.querySelector('.nav-menu');
    if (!btn || !menu) return;

    const close = () => {
        menu.classList.remove('active');
        btn.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    };
    const open = () => {
        menu.classList.add('active');
        btn.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    };

    btn.addEventListener('click', () => menu.classList.contains('active') ? close() : open());
    document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', close));
    document.addEventListener('mousedown', e => {
        if (!menu.contains(e.target) && !btn.contains(e.target)) close();
    });
    document.addEventListener('keydown', e => e.key === 'Escape' && close());
};

// ==================== SCROLL SUAVE ====================
const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function(e) {
            const id = this.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        });
    });
};

// ==================== LINK ATIVO NO MENU ====================
const initActiveLink = () => {
    const sections = [...document.querySelectorAll('section[id]')];
    const links    = [...document.querySelectorAll('.nav-link')];
    if (!sections.length) return;

    const update = throttle(() => {
        const y = window.pageYOffset + 140;
        sections.forEach(sec => {
            if (y >= sec.offsetTop && y < sec.offsetTop + sec.offsetHeight) {
                links.forEach(l => {
                    l.classList.toggle('active', l.getAttribute('href') === '#' + sec.id);
                });
            }
        });
    }, 100);

    window.addEventListener('scroll', update, { passive: true });
    update();
};

// ==================== PARTÍCULAS ====================
const initParticles = () => {
    document.querySelectorAll('.particle').forEach(p => {
        p.style.animationDuration = (14 + Math.random() * 12) + 's';
        p.style.animationDelay   = '-' + (Math.random() * 12) + 's';
    });
};

// ==================== ÍCONES TECH ====================
const initTechIcons = () => {
    document.querySelectorAll('.tech-icon').forEach((icon, i) => {
        icon.addEventListener('click', () => {
            icon.classList.remove('bounce');
            void icon.offsetWidth;
            icon.classList.add('bounce');
        });
        icon.addEventListener('animationend', () => icon.classList.remove('bounce'));
    });
};

// ==================== FORMULÁRIO ====================
const initForm = () => {
    const form   = document.getElementById('contactForm');
    const status = document.getElementById('statusMessage');
    if (!form || !status) return;

    const show = (msg, type) => {
        status.textContent = msg;
        status.className   = 'status-message ' + type;
        status.style.display = 'block';
        status.style.opacity = '1';
        setTimeout(() => { status.style.opacity = '0'; setTimeout(() => status.style.display = 'none', 300); }, 5000);
    };

    form.addEventListener('submit', async e => {
        e.preventDefault();
        const emailEl = form.querySelector('input[type="email"]');
        if (emailEl && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
            show('⚠️ Insira um e-mail válido.', 'error');
            emailEl.focus(); return;
        }
        const btn = form.querySelector('button[type="submit"]');
        const orig = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<span>Enviando...</span>';
        try {
            const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
            if (res.ok) { show('✅ Mensagem enviada!', 'success'); form.reset(); }
            else throw new Error('Erro ao enviar.');
        } catch (err) {
            show('❌ ' + err.message, 'error');
        } finally {
            btn.disabled = false; btn.innerHTML = orig;
        }
    });

    form.querySelectorAll('input,textarea').forEach(f => {
        f.addEventListener('blur',  () => f.classList.toggle('valid', f.value.trim() !== ''));
        f.addEventListener('input', () => { if (f.classList.contains('valid')) f.classList.toggle('valid', f.value.trim() !== ''); });
    });
};

// ==================== SCROLL TO TOP ====================
const initScrollTop = () => {
    if (document.querySelector('.scroll-to-top')) return;
    const btn = document.createElement('button');
    btn.className = 'scroll-to-top';
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.setAttribute('aria-label', 'Voltar ao topo');
    document.body.appendChild(btn);
    window.addEventListener('scroll', throttle(() => btn.classList.toggle('visible', window.scrollY > 400), 100), { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
};

// ==================== CURSOR ====================
const initCursor = () => {
    if (window.innerWidth < 768 || document.querySelector('.custom-cursor')) return;
    const c = document.createElement('div');
    c.className = 'custom-cursor';
    document.body.appendChild(c);
    let mx = 0, my = 0, cx = 0, cy = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    document.addEventListener('mouseleave', () => c.classList.add('hidden'));
    document.addEventListener('mouseenter', () => c.classList.remove('hidden'));
    (function loop() {
        cx += (mx - cx) * 0.15; cy += (my - cy) * 0.15;
        c.style.transform = `translate(${cx}px,${cy}px)`;
        requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a,button,.projeto-card,.tech-icon,input,textarea').forEach(el => {
        el.addEventListener('mouseenter', () => c.classList.add('hover'));
        el.addEventListener('mouseleave', () => c.classList.remove('hover'));
    });
};

// ==================== INICIALIZAÇÃO ====================
// Tudo roda direto no DOMContentLoaded, sem depender de window.load
const boot = () => {
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initActiveLink();
    initParticles();
    initTechIcons();
    initCounters();
    initSkillBars();
    initFadeIn();
    initForm();
    initScrollTop();
    initHero();
    initTyping();   // pode rodar antes do load — não precisa de recursos externos
    if (window.innerWidth >= 768) initCursor();
    console.log('%c🚀 Ruan Lima Ramos — Dev Portfolio', 'color:#c9a84c;font-weight:bold;font-size:16px;');
};

// Dispara o mais cedo possível
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot(); // já carregou
}

// Cursor em resize
let _wd = window.innerWidth >= 768;
window.addEventListener('resize', debounce(() => {
    const d = window.innerWidth >= 768;
    if (d && !_wd) initCursor();
    _wd = d;
}, 300));