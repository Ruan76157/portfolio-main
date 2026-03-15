// ==================== UTILITÁRIOS ====================
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

const throttle = (func, limit) => {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
};

// ==================== NAVEGAÇÃO MOBILE ====================
const initMobileNav = () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!hamburger || !navMenu) return;

    const closeMenu = () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    };

    const toggleMenu = () => {
        const isActive = navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', String(isActive));
        document.body.style.overflow = isActive ? 'hidden' : '';
    };

    // Acessibilidade: suporte a teclado no hamburger
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-controls', 'nav-menu');
    hamburger.addEventListener('click', toggleMenu);
    hamburger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMenu();
        }
    });

    navLinks.forEach((link) => link.addEventListener('click', closeMenu));

    // Fecha ao clicar fora — usando mousedown para capturar antes do blur
    document.addEventListener('mousedown', (e) => {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            closeMenu();
        }
    });
};

// ==================== NAVBAR SCROLL ====================
const initNavbarScroll = () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const handleScroll = throttle(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Estado inicial correto ao recarregar página no meio
};

// ==================== ANIMAÇÃO DE DIGITAÇÃO ====================
const initTypingAnimation = () => {
    const typingText = document.querySelector('.typing-text');
    if (!typingText) return;

    const phrases = ['Desenvolvedor Full Stack', 'Criador de Experiências Web', 'Apaixonado por Código'];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typeWriter = () => {
        const currentPhrase = phrases[phraseIndex];

        if (!isDeleting) {
            typingText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;

            if (charIndex === currentPhrase.length) {
                // Pausa antes de apagar
                setTimeout(() => {
                    isDeleting = true;
                    typeWriter();
                }, 2000);
                return;
            }
        } else {
            typingText.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
            }
        }

        setTimeout(typeWriter, isDeleting ? 60 : 100);
    };

    typingText.textContent = '';
    setTimeout(typeWriter, 500);
};

// ==================== CONTADOR DE ESTATÍSTICAS ====================
const initStatsCounter = () => {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    if (statNumbers.length === 0) return;

    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-target'), 10);
        if (isNaN(target)) return; // Proteção contra data-target inválido

        const duration = 2000;
        const stepTime = 16;
        const increment = target / (duration / stepTime);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + '+';
            }
        };

        updateCounter();
    };

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    statNumbers.forEach((stat) => observer.observe(stat));
};

// ==================== SCROLL SUAVE ====================
const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (!target) return; // Evita erro se o elemento não existir

            e.preventDefault();
            const offset = 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        });
    });
};

// ==================== ANIMAÇÃO DAS BARRAS DE SKILL ====================
const initSkillBars = () => {
    const skillBars = document.querySelectorAll('.skill-progress[data-progress]');
    if (skillBars.length === 0) return;

    // Define largura inicial antes do observer para evitar flash
    skillBars.forEach((bar) => {
        bar.style.width = '0%';
        bar.style.transition = 'width 1.5s ease-out';
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const progress = parseFloat(entry.target.getAttribute('data-progress'));
                    if (!isNaN(progress)) {
                        entry.target.style.width = Math.min(progress, 100) + '%'; // Limita a 100%
                    }
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.3 }
    );

    skillBars.forEach((bar) => observer.observe(bar));
};

// ==================== ANIMAÇÃO FADE IN ====================
const initFadeInAnimation = () => {
    const fadeElements = document.querySelectorAll(
        '.projeto-card, .skill-category, .stat-card, .sobre-text, .contato-item'
    );
    if (fadeElements.length === 0) return;

    // Injeta estilos necessários uma única vez
    if (!document.getElementById('fade-in-styles')) {
        const style = document.createElement('style');
        style.id = 'fade-in-styles';
        style.textContent = `
            .fade-in { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
            .fade-in-visible { opacity: 1; transform: translateY(0); }
        `;
        document.head.appendChild(style);
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    fadeElements.forEach((element) => {
        element.classList.add('fade-in');
        observer.observe(element);
    });
};

// ==================== CURSOR PERSONALIZADO ====================
const initCustomCursor = () => {
    if (window.innerWidth < 768) return;

    // Evita duplicar o cursor em resize
    let cursor = document.querySelector('.custom-cursor');
    if (!cursor) {
        cursor = document.createElement('div');
        cursor.classList.add('custom-cursor');
        document.body.appendChild(cursor);
    }

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let rafId = null;

    const animateCursor = () => {
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        rafId = requestAnimationFrame(animateCursor);
    };

    // Usa transform em vez de left/top para melhor performance
    cursor.style.position = 'fixed';
    cursor.style.top = '0';
    cursor.style.left = '0';
    cursor.style.pointerEvents = 'none';

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Mostra/oculta cursor ao entrar/sair da janela
    document.addEventListener('mouseleave', () => cursor.classList.add('hidden'));
    document.addEventListener('mouseenter', () => cursor.classList.remove('hidden'));

    if (!rafId) animateCursor();

    const interactiveElements = document.querySelectorAll('a, button, .projeto-card, .tech-icon, input, textarea');
    interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
};

// ==================== EFEITO PARALLAX ====================
const initParallax = () => {
    const parallaxElements = document.querySelectorAll('[data-speed]');
    if (parallaxElements.length === 0) return;

    // Desativa parallax em dispositivos com preferência por movimento reduzido
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const handleScroll = throttle(() => {
        const scrolled = window.pageYOffset;
        parallaxElements.forEach((element) => {
            const speed = parseFloat(element.dataset.speed) || 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }, 16);

    window.addEventListener('scroll', handleScroll, { passive: true });
};

// ==================== PARTÍCULAS ANIMADAS ====================
const initParticles = () => {
    const particles = document.querySelectorAll('.particle');
    if (particles.length === 0) return;

    particles.forEach((particle) => {
        const duration = 15 + Math.random() * 10;
        const delay = Math.random() * 5;

        particle.style.animationDuration = duration + 's';
        particle.style.animationDelay = '-' + delay + 's'; // Negativo para iniciar no meio da animação (sem delay visível)

        particle.addEventListener('mouseenter', () => (particle.style.transform = 'scale(2)'));
        particle.addEventListener('mouseleave', () => (particle.style.transform = 'scale(1)'));
    });
};

// ==================== FORMULÁRIO DE CONTATO ====================
const initContactForm = () => {
    const form = document.getElementById('contactForm');
    const statusMessage = document.getElementById('statusMessage');

    if (!form || !statusMessage) return;

    let hideTimeout;

    const showMessage = (message, type) => {
        clearTimeout(hideTimeout);
        statusMessage.textContent = message;
        statusMessage.className = `status-message ${type}`;
        statusMessage.style.display = 'block';
        statusMessage.style.opacity = '1';
        statusMessage.setAttribute('role', 'alert'); // Acessibilidade

        hideTimeout = setTimeout(() => {
            statusMessage.style.transition = 'opacity 0.3s ease';
            statusMessage.style.opacity = '0';
            setTimeout(() => {
                statusMessage.style.display = 'none';
                statusMessage.removeAttribute('role');
            }, 300);
        }, 5000);
    };

    // Validação de email simples
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validação básica antes de enviar
        const emailField = form.querySelector('input[type="email"]');
        if (emailField && !isValidEmail(emailField.value.trim())) {
            showMessage('⚠️ Por favor, insira um e-mail válido.', 'error');
            emailField.focus();
            return;
        }

        const formData = new FormData(form);
        const button = form.querySelector('button[type="submit"]');
        const originalContent = button.innerHTML;

        button.disabled = true;
        button.innerHTML = '<span>Enviando...</span> <i class="fas fa-spinner fa-spin"></i>';

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: { Accept: 'application/json' },
            });

            if (response.ok) {
                showMessage('✅ Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
                form.reset();
                form.querySelectorAll('input, textarea').forEach((field) => field.classList.remove('valid'));
            } else {
                // Tenta ler mensagem de erro da API, se houver
                const data = await response.json().catch(() => ({}));
                const msg = data?.error || 'Erro ao enviar mensagem.';
                throw new Error(msg);
            }
        } catch (error) {
            showMessage(`❌ ${error.message || 'Erro ao enviar mensagem. Tente novamente.'}`, 'error');
            console.error('Erro no formulário:', error);
        } finally {
            button.disabled = false;
            button.innerHTML = originalContent;
        }
    });

    // Validação em tempo real
    form.querySelectorAll('input, textarea').forEach((input) => {
        input.addEventListener('blur', () => {
            input.classList.toggle('valid', input.value.trim() !== '');
        });
        input.addEventListener('input', () => {
            if (input.classList.contains('valid')) {
                input.classList.toggle('valid', input.value.trim() !== '');
            }
        });
    });
};

// ==================== EFEITO GLITCH ====================
const initGlitchEffect = () => {
    const glitchTitle = document.querySelector('.glitch');
    if (!glitchTitle) return;

    glitchTitle.addEventListener('mouseenter', () => {
        glitchTitle.style.animationDuration = '0.3s';
    });

    glitchTitle.addEventListener('mouseleave', () => {
        glitchTitle.style.animationDuration = '3s';
    });
};

// ==================== ANIMAÇÃO DOS ÍCONES DE TECNOLOGIA ====================
const initTechIcons = () => {
    const techIcons = document.querySelectorAll('.tech-icon');
    if (techIcons.length === 0) return;

    techIcons.forEach((icon, index) => {
        icon.style.animationDelay = `${index * 0.1}s`;

        icon.addEventListener('click', () => {
            // Usa classe em vez de manipular animation diretamente (mais confiável)
            icon.classList.remove('bounce');
            // Force reflow para reiniciar a animação
            void icon.offsetWidth;
            icon.classList.add('bounce');
        });

        icon.addEventListener('animationend', () => {
            icon.classList.remove('bounce');
        });
    });
};

// ==================== LOADING INICIAL ====================
const initPageLoad = () => {
    const loader = document.querySelector('.loader');
    const hero = document.querySelector('.hero');

    if (loader) {
        loader.style.transition = 'opacity 0.5s ease';
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }

    if (hero) {
        hero.style.opacity = '0';
        hero.style.transform = 'translateY(20px)';
        hero.style.transition = 'opacity 1s ease, transform 1s ease';

        // Usa rAF para garantir que a transição seja aplicada após o paint inicial
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                hero.style.opacity = '1';
                hero.style.transform = 'translateY(0)';
            });
        });
    }
};

// ==================== SEÇÃO ATIVA NA NAVEGAÇÃO ====================
const initActiveSection = () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (sections.length === 0 || navLinks.length === 0) return;

    const handleScroll = throttle(() => {
        const scrollY = window.pageYOffset + 150;

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach((link) => {
                    const isActive = link.getAttribute('href') === `#${sectionId}`;
                    link.classList.toggle('active', isActive);
                    link.setAttribute('aria-current', isActive ? 'page' : 'false');
                });
            }
        });
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
};

// ==================== LAZY LOADING DE IMAGENS ====================
const initLazyLoading = () => {
    if (!('IntersectionObserver' in window)) {
        // Fallback: carrega todas as imagens imediatamente
        document.querySelectorAll('img[data-src]').forEach((img) => {
            img.src = img.dataset.src;
            img.classList.add('loaded');
        });
        return;
    }

    const imageObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src'); // Evita reprocessamento
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        },
        { rootMargin: '200px' } // Carrega imagens 200px antes de entrar na tela
    );

    document.querySelectorAll('img[data-src]').forEach((img) => imageObserver.observe(img));
};

// ==================== TECLAS DE ATALHO ====================
const initKeyboardShortcuts = () => {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const navMenu = document.querySelector('.nav-menu');
            const hamburger = document.querySelector('.hamburger');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger?.classList.remove('active');
                hamburger?.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        }
    });
};

// ==================== SCROLL TO TOP ====================
const initScrollToTop = () => {
    // Evita duplicar o botão em re-inicializações
    if (document.querySelector('.scroll-to-top')) return;

    const scrollBtn = document.createElement('button');
    scrollBtn.classList.add('scroll-to-top');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.setAttribute('aria-label', 'Voltar ao topo');
    document.body.appendChild(scrollBtn);

    const handleScroll = throttle(() => {
        scrollBtn.classList.toggle('visible', window.scrollY > 500);
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
};

// ==================== CONSOLE MESSAGE ====================
const initConsoleMessage = () => {
    console.log(
        '%c🚀 Portfólio Desenvolvido por Ruan Lima Ramos',
        'font-size: 20px; color: #00d4ff; font-weight: bold;'
    );
    console.log('%c💻 Desenvolvedor Full Stack', 'font-size: 14px; color: #8892b0;');
    console.log('%c📧 Entre em contato!', 'font-size: 14px; color: #ff006e; font-weight: bold;');
    console.log(
        '%c⚠️ Cuidado com o que você cola aqui!',
        'font-size: 16px; color: #ff0000; font-weight: bold;'
    );
};

// ==================== PROTEÇÃO CONTRA CLICK DIREITO (OPCIONAL) ====================
const initProtection = () => {
    // Descomente se quiser ativar
    /*
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
            e.preventDefault();
        }
    });
    */
};

// ==================== INICIALIZAÇÃO ====================
const init = () => {
    initMobileNav();
    initNavbarScroll();
    initSmoothScroll();
    initStatsCounter();
    initSkillBars();
    initFadeInAnimation();
    initParallax();
    initParticles();
    initContactForm();
    initGlitchEffect();
    initTechIcons();
    initActiveSection();
    initLazyLoading();
    initKeyboardShortcuts();
    initScrollToTop();
    initConsoleMessage();
    // initProtection();
};

// Executa quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Executa animações visuais após carregamento completo dos recursos
window.addEventListener('load', () => {
    initPageLoad();
    initTypingAnimation();

    if (window.innerWidth >= 768) {
        initCustomCursor();
    }
});

// Reinicializa cursor ao alternar entre mobile e desktop
let wasDesktop = window.innerWidth >= 768;
window.addEventListener(
    'resize',
    debounce(() => {
        const isDesktop = window.innerWidth >= 768;
        if (isDesktop && !wasDesktop) {
            initCustomCursor();
        }
        wasDesktop = isDesktop;
    }, 250)
);