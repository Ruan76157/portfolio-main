/* Portfolio - Ruan Lima Ramos */
(function () {

    /* ---------- helpers ---------- */
    function $(sel) { return document.querySelector(sel); }
    function $$(sel) { return Array.from(document.querySelectorAll(sel)); }

    function onVisible(el, cb) {
        if (!window.IntersectionObserver) { cb(); return; }
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) { cb(); io.unobserve(el); }
            });
        }, { threshold: 0 });
        io.observe(el);
    }

    /* ---------- navbar ---------- */
    function navbar() {
        var nav = $('.navbar');
        if (!nav) return;
        function upd() { nav.classList.toggle('scrolled', window.scrollY > 50); }
        window.addEventListener('scroll', upd, { passive: true });
        upd();
    }

    /* ---------- menu mobile ---------- */
    function mobileMenu() {
        var btn  = $('.hamburger');
        var menu = $('.nav-menu');
        if (!btn || !menu) return;

        function close() {
            menu.classList.remove('active');
            btn.classList.remove('active');
            btn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
        function open() {
            menu.classList.add('active');
            btn.classList.add('active');
            btn.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        }
        btn.addEventListener('click', function () {
            menu.classList.contains('active') ? close() : open();
        });
        $$('.nav-link').forEach(function (l) { l.addEventListener('click', close); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
        document.addEventListener('mousedown', function (e) {
            if (!menu.contains(e.target) && !btn.contains(e.target)) close();
        });
    }

    /* ---------- scroll suave ---------- */
    function smoothScroll() {
        $$('a[href^="#"]').forEach(function (a) {
            a.addEventListener('click', function (e) {
                var id = a.getAttribute('href');
                if (id === '#') return;
                var target = $(id);
                if (!target) return;
                e.preventDefault();
                window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
            });
        });
    }

    /* ---------- link ativo ---------- */
    function activeLink() {
        var secs  = $$('section[id]');
        var links = $$('.nav-link');
        if (!secs.length) return;
        function upd() {
            var y = window.pageYOffset + 140;
            secs.forEach(function (s) {
                if (y >= s.offsetTop && y < s.offsetTop + s.offsetHeight) {
                    var id = s.getAttribute('id');
                    links.forEach(function (l) {
                        l.classList.toggle('active', l.getAttribute('href') === '#' + id);
                    });
                }
            });
        }
        window.addEventListener('scroll', upd, { passive: true });
        upd();
    }

    /* ---------- digitação ---------- */
    function typing() {
        var el = $('.typing-text');
        if (!el) return;
        var phrases = ['Desenvolvedor Full Stack', 'Criador de Experiências Web', 'Apaixonado por Código'];
        var pi = 0, ci = 0, del = false;
        function tick() {
            var p = phrases[pi];
            el.textContent = del ? p.slice(0, ci - 1) : p.slice(0, ci + 1);
            if (!del) {
                ci++;
                if (ci > p.length) { del = true; setTimeout(tick, 1800); return; }
            } else {
                ci--;
                if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; }
            }
            setTimeout(tick, del ? 50 : 90);
        }
        el.textContent = '';
        setTimeout(tick, 300);
    }

    /* ---------- contadores ---------- */
    function counters() {
        $$('.stat-number[data-target]').forEach(function (el) {
            var target = parseInt(el.dataset.target, 10);
            if (isNaN(target)) return;
            el.textContent = '0+';
            onVisible(el, function () {
                var start = null;
                function step(ts) {
                    if (!start) start = ts;
                    var p = Math.min((ts - start) / 1500, 1);
                    el.textContent = Math.floor(p * target) + '+';
                    if (p < 1) requestAnimationFrame(step);
                }
                requestAnimationFrame(step);
            });
        });
    }

    /* ---------- barras de skill ---------- */
    function skillBars() {
        $$('.skill-progress[data-progress]').forEach(function (bar) {
            var val = Math.min(parseFloat(bar.dataset.progress) || 0, 100);
            bar.style.width = '0%';
            bar.style.transition = 'width 1.4s cubic-bezier(.22,1,.36,1)';
            onVisible(bar, function () {
                requestAnimationFrame(function () {
                    requestAnimationFrame(function () {
                        bar.style.width = val + '%';
                    });
                });
            });
        });
    }

    /* ---------- fade-in ao scroll ---------- */
    function fadeIn() {
        /* injeta CSS apenas 1x */
        if (!document.getElementById('_fi')) {
            var s = document.createElement('style');
            s.id = '_fi';
            s.textContent = [
                '.fi{opacity:0;transform:translateY(24px);',
                'transition:opacity .6s ease,transform .6s ease}',
                '.fi.fv{opacity:1!important;transform:none!important}'
            ].join('');
            document.head.appendChild(s);
        }

        var sel = [
            '.stat-card','.skill-category','.projeto-card',
            '.sobre-text','.contato-item','.contato-form-wrapper'
        ].join(',');

        $$(sel).forEach(function (el, i) {
            el.classList.add('fi');
            el.style.transitionDelay = Math.min(i * 70, 350) + 'ms';
            onVisible(el, function () {
                setTimeout(function () { el.classList.add('fv'); }, 10);
            });
        });
    }

    /* ---------- partículas ---------- */
    function particles() {
        $$('.particle').forEach(function (p) {
            p.style.animationDuration = (14 + Math.random() * 12) + 's';
            p.style.animationDelay   = '-' + (Math.random() * 12)  + 's';
        });
    }

    /* ---------- formulário ---------- */
    function form() {
        var f   = document.getElementById('contactForm');
        var msg = document.getElementById('statusMessage');
        if (!f || !msg) return;

        function show(text, type) {
            msg.textContent = text;
            msg.className   = 'status-message ' + type;
            msg.style.cssText = 'display:block;opacity:1;transition:opacity .3s';
            clearTimeout(show._t);
            show._t = setTimeout(function () {
                msg.style.opacity = '0';
                setTimeout(function () { msg.style.display = 'none'; }, 320);
            }, 5000);
        }

        f.addEventListener('submit', async function (e) {
            e.preventDefault();
            var em = f.querySelector('input[type=email]');
            if (em && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value.trim())) {
                show('⚠️ Insira um e-mail válido.', 'error');
                em.focus(); return;
            }
            var btn = f.querySelector('button[type=submit]');
            var orig = btn.innerHTML;
            btn.disabled = true; btn.innerHTML = '<span>Enviando...</span>';
            try {
                var res = await fetch(f.action, {
                    method: 'POST', body: new FormData(f),
                    headers: { Accept: 'application/json' }
                });
                if (res.ok) { show('✅ Mensagem enviada!', 'success'); f.reset(); }
                else throw new Error('Erro ao enviar.');
            } catch (err) {
                show('❌ ' + err.message, 'error');
            } finally {
                btn.disabled = false; btn.innerHTML = orig;
            }
        });

        f.querySelectorAll('input,textarea').forEach(function (i) {
            i.addEventListener('blur',  function () { i.classList.toggle('valid', i.value.trim() !== ''); });
            i.addEventListener('input', function () {
                if (i.classList.contains('valid')) i.classList.toggle('valid', i.value.trim() !== '');
            });
        });
    }

    /* ---------- scroll to top ---------- */
    function scrollTop() {
        if ($('.scroll-to-top')) return;
        var btn = document.createElement('button');
        btn.className = 'scroll-to-top';
        btn.setAttribute('aria-label', 'Voltar ao topo');
        btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        document.body.appendChild(btn);
        window.addEventListener('scroll', function () {
            btn.classList.toggle('visible', window.scrollY > 400);
        }, { passive: true });
        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ---------- cursor ---------- */
    function cursor() {
        if (window.innerWidth < 768) return;
        if ($('.custom-cursor')) return;
        var c = document.createElement('div');
        c.className = 'custom-cursor';
        c.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none;z-index:9999';
        document.body.appendChild(c);
        var mx = 0, my = 0, cx = 0, cy = 0;
        document.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; });
        document.addEventListener('mouseleave', function () { c.classList.add('hidden'); });
        document.addEventListener('mouseenter', function () { c.classList.remove('hidden'); });
        (function loop() {
            cx += (mx - cx) * 0.15; cy += (my - cy) * 0.15;
            c.style.transform = 'translate(' + cx + 'px,' + cy + 'px)';
            requestAnimationFrame(loop);
        })();
        $$('a,button,.projeto-card,.tech-icon,input,textarea').forEach(function (el) {
            el.addEventListener('mouseenter', function () { c.classList.add('hover'); });
            el.addEventListener('mouseleave', function () { c.classList.remove('hover'); });
        });
    }

    /* ---------- boot ---------- */
    function boot() {
        navbar();
        mobileMenu();
        smoothScroll();
        activeLink();
        particles();
        counters();
        skillBars();
        fadeIn();
        form();
        scrollTop();
        typing();
        cursor();
    }

    /* Roda assim que o DOM estiver disponível — sem window.load */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

})();