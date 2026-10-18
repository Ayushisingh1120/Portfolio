// ==========================================================================
// AYUSHI SINGH - PORTFOLIO INTERACTION LOGIC
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ==========================================================================
    // SCROLL PROGRESS BAR INDICATOR
    // ==========================================================================
    const scrollProgressBar = document.getElementById('scrollProgress');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
        
        if (scrollProgressBar) {
            scrollProgressBar.style.transform = `scaleX(${scrollPercentage})`;
        }
    });

    // ==========================================================================
    // THEME TOGGLER (PERSISTENT STATE)
    // ==========================================================================
    const themeToggleBtn = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;

    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }

    function toggleTheme() {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('portfolio-theme', newTheme);
    }

    // ==========================================================================
    // CONSOLE TYPING EFFECT
    // ==========================================================================
    const whoamiText = document.getElementById('whoami-type');
    const roles = [
        "Generative AI Engineer",
        "AI Agent Developer",
        "RAG Specialist",
        "NLP & ML Practitioner"
    ];
    
    let roleIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let typeDelay = 110;

    function runTyping() {
        const currentText = roles[roleIdx];
        
        if (deleting) {
            whoamiText.textContent = currentText.substring(0, charIdx - 1);
            charIdx--;
            typeDelay = 55;
        } else {
            whoamiText.textContent = currentText.substring(0, charIdx + 1);
            charIdx++;
            typeDelay = 110;
        }

        if (!deleting && charIdx === currentText.length) {
            typeDelay = 2200; // Pause at full word
            deleting = true;
        } else if (deleting && charIdx === 0) {
            deleting = false;
            roleIdx = (roleIdx + 1) % roles.length;
            typeDelay = 500; // Pause before writing next
        }

        setTimeout(runTyping, typeDelay);
    }

    if (whoamiText) {
        setTimeout(runTyping, 1000);
    }

    // ==========================================================================
    // INTERACTIVE PROJECT TABS
    // ==========================================================================
    const projectCards = document.querySelectorAll('.tab-project-card');

    projectCards.forEach(card => {
        const triggers = card.querySelectorAll('.tab-trigger');
        const panes = card.querySelectorAll('.tab-pane');

        triggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const targetTab = trigger.getAttribute('data-tab');

                // Remove active classes
                triggers.forEach(t => t.classList.remove('active'));
                panes.forEach(p => p.classList.remove('active'));

                // Add active classes
                trigger.classList.add('active');
                
                const matchedPane = card.querySelector(`[data-pane="${targetTab}"]`);
                if (matchedPane) {
                    matchedPane.classList.add('active');
                }
            });
        });
    });

    // ==========================================================================
    // FLOATING NAV ACTIVE STATE SCROLL SPY
    // ==========================================================================
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    function scrollSpy() {
        let scrollPos = window.scrollY || document.documentElement.scrollTop;

        sections.forEach(sec => {
            const top = sec.offsetTop - 150;
            const height = sec.offsetHeight;
            const id = sec.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', scrollSpy);

    // ==========================================================================
    // MOBILE NAVIGATION OVERLAY MENU
    // ==========================================================================
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleMobileMenu() {
        menuToggle.classList.toggle('active');
        mobileNav.classList.toggle('open');
        document.body.classList.toggle('menu-open-body');
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileNav.classList.contains('open')) {
                toggleMobileMenu();
            }
        });
    });

    // ==========================================================================
    // COMMAND PALETTE LOGIC
    // ==========================================================================
    const cmdBtn = document.getElementById('cmdBtn');
    const cmdOverlay = document.getElementById('cmdOverlay');
    const cmdSearchInput = document.getElementById('cmdSearchInput');
    const cmdItems = document.querySelectorAll('.cmd-item');

    function openCommandPalette() {
        cmdOverlay.classList.add('open');
        cmdSearchInput.value = '';
        cmdSearchInput.focus();
        filterCommands('');
    }

    function closeCommandPalette() {
        cmdOverlay.classList.remove('open');
    }

    if (cmdBtn) {
        cmdBtn.addEventListener('click', openCommandPalette);
    }

    // Close palette on overlay background click
    cmdOverlay.addEventListener('click', (e) => {
        if (e.target === cmdOverlay) {
            closeCommandPalette();
        }
    });

    // Hotkey listening for Command Palette (Ctrl+K or Cmd+K)
    window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            if (cmdOverlay.classList.contains('open')) {
                closeCommandPalette();
            } else {
                openCommandPalette();
            }
        }
        if (e.key === 'Escape' && cmdOverlay.classList.contains('open')) {
            closeCommandPalette();
        }
    });

    // Filtering logic in command palette
    cmdSearchInput.addEventListener('input', (e) => {
        filterCommands(e.target.value.toLowerCase());
    });

    function filterCommands(query) {
        cmdItems.forEach(item => {
            const text = item.querySelector('span').textContent.toLowerCase();
            if (text.includes(query)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // Trigger action on command selection
    cmdItems.forEach(item => {
        item.addEventListener('click', () => {
            const action = item.getAttribute('data-action');
            closeCommandPalette();
            executeCommandAction(action);
        });
    });

    function executeCommandAction(action) {
        if (action.startsWith('#')) {
            // Section scrolling
            const element = document.querySelector(action);
            if (element) {
                window.scrollTo({
                    top: element.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        } else if (action === 'toggle-theme') {
            toggleTheme();
        } else if (action === 'mail-to') {
            window.location.href = 'mailto:777ayushisingh@gmail.com';
        }
    }

    // ==========================================================================
    // CONTACT FORM SUBMISSION
    // ==========================================================================
    const contactForm = document.getElementById('contactForm');
    const formSubmit = document.getElementById('formSubmit');
    const formFeedback = document.getElementById('formFeedback');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            formSubmit.disabled = true;
            const originalText = formSubmit.querySelector('span').textContent;
            formSubmit.querySelector('span').textContent = "Sending...";

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // Direct mailto fallback or Web3Forms
            fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    access_key: "43a625de-0ad2-43e2-bc3f-ded45e6473fc",
                    name: name,
                    email: email,
                    subject: `Portfolio Message from ${name}: ${subject}`,
                    message: message
                })
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Web3Forms submission response error');
            })
            .then(data => {
                formFeedback.classList.remove('hidden', 'error');
                formFeedback.classList.add('success');
                formFeedback.textContent = "Thank you! Your message has been sent successfully.";
                contactForm.reset();
            })
            .catch(error => {
                // If offline or blocked, graceful message with mailto fallback
                formFeedback.classList.remove('hidden', 'success');
                formFeedback.classList.add('error');
                formFeedback.innerHTML = `Message couldn't be sent automatically. You can email directly to <a href="mailto:777ayushisingh@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}" style="text-decoration:underline; font-weight:600;">777ayushisingh@gmail.com</a>`;
                console.error("Submission info:", error);
            })
            .finally(() => {
                formSubmit.disabled = false;
                formSubmit.querySelector('span').textContent = originalText;
                setTimeout(() => {
                    formFeedback.classList.add('hidden');
                }, 8000);
            });
        });
    }

    // ==========================================================================
    // SCROLL REVEAL (INTERSECTION OBSERVER)
    // ==========================================================================
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.05,
            rootMargin: "0px 0px -60px 0px"
        });
        
        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('is-visible'));
    }
});
