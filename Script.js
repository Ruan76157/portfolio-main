// ==================== UTILITÁRIOS ====================
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// ==================== NAVEGAÇÃO MOBILE ====================
const initMobileNav = () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!hamburger || !navMenu) return;

    const toggleMenu = () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    };

    hamburger.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Fecha menu ao clicar fora
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
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

    window.addEventListener('scroll', handleScroll);
};

// ==================== ANIMAÇÃO DE DIGITAÇÃO ====================
const initTypingAnimation = () => {
    const typingText = document.querySelector('.typing-text');
    if (!typingText) return;

    const text = 'Desenvolvedor Full Stack';
    let index = 0;

    const typeWriter = () => {
        if (index < text.length) {
            typingText.textContent = text.substring(0, index + 1);
            index++;
            setTimeout(typeWriter, 100);
        } else {
            // Adiciona cursor piscando
            typingText.classList.add('typing-complete');
        }
    };

    typingText.textContent = '';
    setTimeout(typeWriter, 500);
};

// ==================== CONTADOR DE ESTATÍSTICAS ====================
const initStatsCounter = () => {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length === 0) return;

    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
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

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => observer.observe(stat));
};

// ==================== SCROLL SUAVE ====================
const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const offset = 80; // Altura da navbar
                const targetPosition = target.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
};

// ==================== ANIMAÇÃO DAS BARRAS DE SKILL ====================
const initSkillBars = () => {
    const skillBars = document.querySelectorAll('.skill-progress');
    if (skillBars.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target.getAttribute('data-progress');
                entry.target.style.width = progress + '%';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => {
        bar.style.width = '0%';
        bar.style.transition = 'width 1.5s ease-out';
        observer.observe(bar);
    });
};

// ==================== ANIMAÇÃO FADE IN ====================
const initFadeInAnimation = () => {
    const fadeElements = document.querySelectorAll('.projeto-card, .skill-category, .stat-card, .sobre-text, .contato-item');
    if (fadeElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    fadeElements.forEach(element => {
        element.classList.add('fade-in');
        observer.observe(element);
    });
};

// ==================== CURSOR PERSONALIZADO ====================
const initCustomCursor = () => {
    // Apenas em desktop
    if (window.innerWidth < 768) return;

    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    const animateCursor = () => {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.2;
        cursorY += dy * 0.2;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    };

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    animateCursor();

    // Efeito hover em elementos interativos
    const interactiveElements = document.querySelectorAll('a, button, .projeto-card, .tech-icon, input, textarea');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        element.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
};

// ==================== EFEITO PARALLAX ====================
const initParallax = () => {
    const parallaxElements = document.querySelectorAll('.hero-content, .particles');
    if (parallaxElements.length === 0) return;

    const handleScroll = throttle(() => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }, 16);

    window.addEventListener('scroll', handleScroll);
};

// ==================== PARTÍCULAS ANIMADAS ====================
const initParticles = () => {
    const particles = document.querySelectorAll('.particle');
    if (particles.length === 0) return;

    particles.forEach((particle, index) => {
        // Animação aleatória para cada partícula
        const duration = 15 + Math.random() * 10;
        const delay = Math.random() * 5;
        
        particle.style.animationDuration = duration + 's';
        particle.style.animationDelay = delay + 's';
        
        particle.addEventListener('mouseenter', () => {
            particle.style.transform = 'scale(2)';
        });
        
        particle.addEventListener('mouseleave', () => {
            particle.style.transform = 'scale(1)';
        });
    });
};

// ==================== FORMULÁRIO DE CONTATO ====================
const initContactForm = () => {
    const form = document.getElementById('contactForm');
    const statusMessage = document.getElementById('statusMessage');
    
    if (!form) return;

    const showMessage = (message, type) => {
        statusMessage.textContent = message;
        statusMessage.className = `status-message ${type}`;
        statusMessage.style.display = 'block';
        
        setTimeout(() => {
            statusMessage.style.opacity = '0';
            setTimeout(() => {
                statusMessage.style.display = 'none';
                statusMessage.style.opacity = '1';
            }, 300);
        }, 5000);
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const button = form.querySelector('button[type="submit"]');
        const originalContent = button.innerHTML;
        
        // Desabilita o botão
        button.disabled = true;
        button.innerHTML = '<span>Enviando...</span> <i class="fas fa-spinner fa-spin"></i>';
        
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                showMessage('✅ Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
                form.reset();
                
                // Remove classe 'valid' dos inputs
                form.querySelectorAll('input, textarea').forEach(field => {
                    field.classList.remove('valid');
                });
            } else {
                throw new Error('Erro ao enviar');
            }
        } catch (error) {
            showMessage('❌ Erro ao enviar mensagem. Tente novamente.', 'error');
            console.error('Erro:', error);
        } finally {
            button.disabled = false;
            button.innerHTML = originalContent;
        }
    });

    // Validação em tempo real
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.value.trim() !== '') {
                input.classList.add('valid');
            } else {
                input.classList.remove('valid');
            }
        });
    });
};

// ==================== EFEITO GLITCH ====================
const initGlitchEffect = () => {
    const glitchTitle = document.querySelector('.glitch');
    if (!glitchTitle) return;

    glitchTitle.addEventListener('mouseenter', () => {
        glitchTitle.style.animation = 'glitch 0.3s infinite';
    });

    glitchTitle.addEventListener('mouseleave', () => {
        glitchTitle.style.animation = 'glitch 3s infinite';
    });
};

// ==================== ANIMAÇÃO DOS ÍCONES DE TECNOLOGIA ====================
const initTechIcons = () => {
    const techIcons = document.querySelectorAll('.tech-icon');
    if (techIcons.length === 0) return;

    techIcons.forEach((icon, index) => {
        icon.style.animationDelay = `${index * 0.1}s`;
        
        icon.addEventListener('click', () => {
            icon.style.animation = 'none';
            setTimeout(() => {
                icon.style.animation = 'bounce 0.5s ease';
            }, 10);
        });
    });
};

// ==================== LOADING INICIAL ====================
const initPageLoad = () => {
    const loader = document.querySelector('.loader');
    const hero = document.querySelector('.hero');

    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }

    if (hero) {
        hero.style.opacity = '0';
        hero.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            hero.style.transition = 'opacity 1s ease, transform 1s ease';
            hero.style.opacity = '1';
            hero.style.transform = 'translateY(0)';
        }, 100);
    }
};

// ==================== SEÇÃO ATIVA NA NAVEGAÇÃO ====================
const initActiveSection = () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (sections.length === 0 || navLinks.length === 0) return;

    const handleScroll = throttle(() => {
        const scrollY = window.pageYOffset + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, 100);

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Executa na inicialização
};

// ==================== LAZY LOADING DE IMAGENS ====================
const initLazyLoading = () => {
    if (!('IntersectionObserver' in window)) return;

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => imageObserver.observe(img));
};

// ==================== TECLAS DE ATALHO ====================
const initKeyboardShortcuts = () => {
    document.addEventListener('keydown', (e) => {
        // ESC para fechar menu mobile
        if (e.key === 'Escape') {
            const navMenu = document.querySelector('.nav-menu');
            const hamburger = document.querySelector('.hamburger');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
};

// ==================== SCROLL TO TOP ====================
const initScrollToTop = () => {
    const scrollBtn = document.createElement('button');
    scrollBtn.classList.add('scroll-to-top');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.setAttribute('aria-label', 'Voltar ao topo');
    document.body.appendChild(scrollBtn);

    const handleScroll = throttle(() => {
        scrollBtn.classList.toggle('visible', window.scrollY > 500);
    }, 100);

    window.addEventListener('scroll', handleScroll);

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
};

// ==================== CONSOLE MESSAGE ====================
const initConsoleMessage = () => {
    const styles = {
        title: 'font-size: 20px; color: #00d4ff; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,212,255,0.3);',
        subtitle: 'font-size: 14px; color: #8892b0;',
        contact: 'font-size: 14px; color: #ff006e; font-weight: bold;'
    };

    console.log('%c🚀 Portfólio Desenvolvido por Ruan Lima Ramos', styles.title);
    console.log('%c💻 Desenvolvedor Full Stack', styles.subtitle);
    console.log('%c📧 Entre em contato!', styles.contact);
    console.log('%c⚠️ Cuidado com o que você cola aqui!', 'font-size: 16px; color: #ff0000; font-weight: bold;');
};

// ==================== PROTEÇÃO CONTRA CLICK DIREITO (OPCIONAL) ====================
const initProtection = () => {
    // Descomente se quiser ativar
    /*
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
            e.preventDefault();
            return false;
        }
    });
    */
};

// ==================== INICIALIZAÇÃO ====================
const init = () => {
    // Inicializa todas as funções
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
    // initProtection(); // Descomente se quiser ativar
    
    // Apenas em desktop
    if (window.innerWidth >= 768) {
        initCustomCursor();
    }
};

// Executa quando a página carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Executa animações após o carregamento completo
window.addEventListener('load', () => {
    initPageLoad();
    initTypingAnimation();
});

// Reinicializa cursor em resize (mobile <-> desktop)
let wasDesktop = window.innerWidth >= 768;
window.addEventListener('resize', debounce(() => {
    const isDesktop = window.innerWidth >= 768;
    if (isDesktop && !wasDesktop) {
        initCustomCursor();
    }
    wasDesktop = isDesktop;
}, 250));