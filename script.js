document.addEventListener('DOMContentLoaded', () => {
    // Native CSS Intersection Observer for scroll animations (Replaces AOS)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        let delay = 0;
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                delay += 150; // Staggered delay for elements appearing together
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, observerOptions);

    const slideUpElements = document.querySelectorAll('.slide-up');
    slideUpElements.forEach(el => observer.observe(el));

    // --- Modal Logic ---
    const modal = document.getElementById("projectModal");
    const closeBtn = document.querySelector(".close-modal");
    const modalImage = document.getElementById("modalImage");
    const modalTitle = document.getElementById("modalTitle");
    const modalDesc = document.getElementById("modalDesc");
    const modalTags = document.getElementById("modalTags");
    const modalLink = document.getElementById("modalLink");
    const modalGithubLink = document.getElementById("modalGithubLink");

    document.querySelectorAll('.open-modal').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();

            // Get data from clicked button
            const title = this.getAttribute('data-title');
            const desc = this.getAttribute('data-desc');
            const image = this.getAttribute('data-image');
            const tags = this.getAttribute('data-tags');
            const link = this.getAttribute('data-link');
            const github = this.getAttribute('data-github');

            // Set modal content
            modalTitle.textContent = title;
            modalDesc.textContent = desc;
            modalImage.src = image;

            // Set tags
            modalTags.innerHTML = '';
            if (tags) {
                tags.split(',').forEach(tag => {
                    const span = document.createElement('span');
                    span.textContent = tag.trim();
                    modalTags.appendChild(span);
                });
            }

            // Set GitHub Source Code link
            if (modalGithubLink) {
                if (github && github !== '#') {
                    modalGithubLink.href = github;
                    modalGithubLink.style.display = 'inline-flex';
                } else {
                    modalGithubLink.style.display = 'none';
                }
            }

            // Set Demo link
            if (modalLink) {
                if (link && link !== '#') {
                    modalLink.href = link;
                    modalLink.style.display = 'inline-flex';
                } else {
                    modalLink.style.display = 'none';
                }
            }

            // Show modal
            modal.style.display = 'flex';
            // small delay to allow display:flex to apply before adding opacity class
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);

            document.body.style.overflow = 'hidden'; // prevent background scrolling
        });
    });

    // Close modal function
    const closeModal = () => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300); // match transition duration
        document.body.style.overflow = 'auto';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // --- Navbar scroll effect ---
    const header = document.querySelector('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('i');

            if (navLinks.classList.contains('active')) {
                icon.classList.remove('ph-list');
                icon.classList.add('ph-x');
                document.body.style.overflow = 'hidden'; // Prevent scrolling when menu open
            } else {
                icon.classList.remove('ph-x');
                icon.classList.add('ph-list');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if (hamburger) {
                const icon = hamburger.querySelector('i');
                icon.classList.remove('ph-x');
                icon.classList.add('ph-list');
            }
            document.body.style.overflow = 'auto';
        });
    });

    // Smooth scroll for anchor links and Update active state on scroll
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    // Smooth Scroll (Hanya untuk link anchor navigasi, abaikan link eksternal atau tombol modal)
    document.querySelectorAll('a[href^="#"]:not(.open-modal):not(.btn-github):not(#modalGithubLink):not(#modalLink)').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#' || !targetId.startsWith('#')) return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update active nav link based on scroll position
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            // Add offset to trigger earlier
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });



    // --- 3D Tilt Effect on Cards ---
    // Only apply on non-touch devices to save performance and prevent bugs on mobile
    if (!('ontouchstart' in window)) {
        const cards = document.querySelectorAll('.project-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                // Calculate rotation (max 10 degrees)
                const rotateX = ((y - centerY) / centerY) * -10;
                const rotateY = ((x - centerX) / centerX) * 10;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                card.style.transition = 'none';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
                card.style.transition = 'transform 0.5s ease, box-shadow 0.3s ease';
            });
        });
    }

    // --- Theme Toggle Logic ---
    const themeBtn = document.getElementById('theme-toggle');
    const themeIcon = themeBtn ? themeBtn.querySelector('i') : null;
    const body = document.body;

    // Check local storage for theme
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
        body.classList.add('light-mode');
        if (themeIcon) {
            themeIcon.classList.remove('ph-moon');
            themeIcon.classList.add('ph-sun');
        }
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            body.classList.toggle('light-mode');

            if (body.classList.contains('light-mode')) {
                localStorage.setItem('theme', 'light');
                themeIcon.classList.remove('ph-moon');
                themeIcon.classList.add('ph-sun');
            } else {
                localStorage.setItem('theme', 'dark');
                themeIcon.classList.remove('ph-sun');
                themeIcon.classList.add('ph-moon');
            }

            // Add a small rotation animation on click
            themeIcon.style.transform = 'rotate(360deg)';
            themeIcon.style.transition = 'transform 0.5s ease';
            setTimeout(() => {
                themeIcon.style.transform = 'rotate(0deg)';
                themeIcon.style.transition = 'none';
            }, 500);
        });
    }


    // --- Scroll Progress Bar ---
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const totalScroll = document.documentElement.scrollTop;
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scroll = `${(totalScroll / windowHeight) * 100}%`;
            scrollProgress.style.width = scroll;
        });
    }

    // --- Mini Counter Animation ---
    const statsSection = document.querySelector('.hero-stats');
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimatedStats = false;

    function animateStats() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            const duration = 1800; // ms
            const frameRate = 30;
            const totalFrames = Math.round(duration / (1000 / frameRate));
            let frame = 0;

            const counter = setInterval(() => {
                frame++;
                const progress = frame / totalFrames;
                // Ease out quad
                const easeProgress = 1 - (1 - progress) * (1 - progress);
                const currentVal = Math.round(target * easeProgress);

                stat.textContent = currentVal;

                if (frame >= totalFrames) {
                    stat.textContent = target;
                    clearInterval(counter);
                }
            }, 1000 / frameRate);
        });
    }

    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimatedStats) {
                    hasAnimatedStats = true;
                    animateStats();
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        statsObserver.observe(statsSection);
    }

    // --- Back to Top Button ---
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        const handleScroll = () => {
            const scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            if (scrollPos > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- Helper: Toast Notification ---
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    let toastTimeout;

    function showToast(message, isSuccess = true) {
        if (!toast) return;
        if (toastMessage) toastMessage.textContent = message;

        const toastIcon = toast.querySelector('i');
        if (toastIcon) {
            toastIcon.className = isSuccess
                ? 'ph-fill ph-check-circle'
                : 'ph-fill ph-warning-circle';
            toastIcon.style.color = isSuccess ? 'var(--accent-2)' : '#ef4444';
        }

        toast.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }

    // --- Download CV Toast Trigger ---
    const downloadCvBtn = document.getElementById('download-cv-btn');
    if (downloadCvBtn) {
        downloadCvBtn.addEventListener('click', () => {
            showToast('CV Yandi berhasil diunduh!');
        });
    }

    // --- Contact Form Direct Telegram Bot Integration ---
    const TELEGRAM_BOT_TOKEN = '8734667762:AAGYYitu9hUFsRYaJATKjX8VQjfmlKua_uw';
    const TELEGRAM_CHAT_ID = '6164098575';

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('contact-submit-btn');
            const originalContent = submitBtn ? submitBtn.innerHTML : '<span>Send Message</span> <i class="ph-bold ph-paper-plane-tilt"></i>';

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<span>Mengirim ke Telegram...</span> <i class="ph-bold ph-spinner animate-spin"></i>`;
            }

            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const message = document.getElementById('contact-message').value.trim();

            // Format tanggal & waktu WIB
            const now = new Date();
            const timeStr = now.toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }) + ' WIB';

            // Pesan diformat rapi dengan emoji & HTML tags
            const telegramText = 
`🚀 <b>PESAN BARU DARI PORTOFOLIO!</b>

👤 <b>Nama:</b> ${escapeHtml(name)}
📧 <b>Email:</b> ${escapeHtml(email)}
💬 <b>Pesan:</b>
${escapeHtml(message)}

📅 <i>Dikirim: ${timeStr}</i>`;

            try {
                const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        chat_id: TELEGRAM_CHAT_ID,
                        text: telegramText,
                        parse_mode: 'HTML'
                    })
                });

                const result = await response.json();

                if (result.ok) {
                    showToast('Pesan berhasil terkirim langsung ke Telegram Yandi! 🚀', true);
                    contactForm.reset();
                } else {
                    console.error('Telegram API error:', result);
                    showToast('Gagal mengirim pesan. Silakan coba lagi.', false);
                }
            } catch (err) {
                console.error('Telegram fetch error:', err);
                showToast('Koneksi bermasalah. Silakan cek koneksi Anda.', false);
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalContent;
                }
            }
        });
    }

    // --- Guestbook / Buku Tamu System ---
    const gbForm = document.getElementById('guestbook-form');
    const gbList = document.getElementById('guestbook-list');
    const gbCount = document.getElementById('gb-count');
    const avatarOpts = document.querySelectorAll('.avatar-opt');
    let selectedEmoji = '🚀';

    // Emoji picker selection
    avatarOpts.forEach(opt => {
        opt.addEventListener('click', () => {
            avatarOpts.forEach(b => b.classList.remove('active'));
            opt.classList.add('active');
            selectedEmoji = opt.getAttribute('data-emoji') || '🚀';
        });
    });

    const defaultGuestbookMessages = [];

    function getGuestbookMessages() {
        try {
            // Bersihkan storage key lama yang mungkin masih menyimpan data dummy
            if (localStorage.getItem('yandidev_guestbook')) {
                localStorage.removeItem('yandidev_guestbook');
            }
            const stored = localStorage.getItem('yandidev_guestbook_clean');
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (e) {
            console.error('Error reading guestbook:', e);
        }
        return defaultGuestbookMessages;
    }

    function saveGuestbookMessages(messages) {
        try {
            localStorage.setItem('yandidev_guestbook_clean', JSON.stringify(messages));
        } catch (e) {
            console.error('Error saving guestbook:', e);
        }
    }

    function renderGuestbook() {
        if (!gbList) return;
        const messages = getGuestbookMessages();

        if (gbCount) {
            gbCount.textContent = messages.length;
        }

        if (messages.length === 0) {
            gbList.innerHTML = `
                <div class="gb-empty">
                    <i class="ph ph-chat-teardrop-dots"></i>
                    <p>No messages in the guestbook yet.</p>
                    <span>Be the first one to leave a friendly greeting here!</span>
                </div>
            `;
            return;
        }

        gbList.innerHTML = '';
        messages.forEach(item => {
            const card = document.createElement('div');
            card.className = 'gb-item';

            const ownerBadge = item.isOwner ? `<span class="gb-owner-badge">Creator</span>` : '';

            card.innerHTML = `
                <div class="gb-avatar">${item.emoji || '🚀'}</div>
                <div class="gb-body">
                    <div class="gb-head">
                        <span class="gb-name">${escapeHtml(item.name)} ${ownerBadge}</span>
                        <span class="gb-date">${escapeHtml(item.date)}</span>
                    </div>
                    <p class="gb-text">${escapeHtml(item.message)}</p>
                </div>
            `;
            gbList.appendChild(card);
        });
    }

    function escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    if (gbForm) {
        gbForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('gb-name');
            const messageInput = document.getElementById('gb-message');

            const name = nameInput.value.trim();
            const message = messageInput.value.trim();

            if (!name || !message) return;

            const newMessage = {
                id: Date.now().toString(),
                name: name,
                emoji: selectedEmoji,
                message: message,
                isOwner: false,
                date: 'Just now'
            };

            const currentMessages = getGuestbookMessages();
            currentMessages.unshift(newMessage);

            saveGuestbookMessages(currentMessages);
            renderGuestbook();

            showToast('Message added to Guestbook successfully! 🎉', true);
            gbForm.reset();
            avatarOpts.forEach(b => b.classList.remove('active'));
            if (avatarOpts[0]) avatarOpts[0].classList.add('active');
            selectedEmoji = '🚀';
        });

        // Initial render
        renderGuestbook();
    }

    // --- Education & Organizations Slide Showcase Controller ---
    const eduTrack = document.getElementById('edu-slider-track');
    const eduCards = document.querySelectorAll('.edu-card');
    const eduPrevBtn = document.getElementById('edu-slide-prev');
    const eduNextBtn = document.getElementById('edu-slide-next');
    const eduDots = document.querySelectorAll('#edu-slider-dots .dot-btn');
    const eduFilterTabs = document.querySelectorAll('#edu-filter-tabs .filter-tab');

    if (eduTrack && eduCards.length > 0) {
        function getVisibleCards() {
            return Array.from(eduCards).filter(card => !card.classList.contains('is-filtered-out'));
        }

        function updateSliderControls() {
            const visibleCards = getVisibleCards();
            if (visibleCards.length <= 1) {
                if (eduPrevBtn) eduPrevBtn.disabled = true;
                if (eduNextBtn) eduNextBtn.disabled = true;
            } else {
                const maxScrollLeft = Math.max(0, eduTrack.scrollWidth - eduTrack.clientWidth);
                if (eduPrevBtn) eduPrevBtn.disabled = eduTrack.scrollLeft <= 5;
                if (eduNextBtn) eduNextBtn.disabled = eduTrack.scrollLeft >= maxScrollLeft - 5;
            }

            // Find closest visible card to track center
            const trackRect = eduTrack.getBoundingClientRect();
            const trackCenter = trackRect.left + (trackRect.width / 2);
            let closestIndex = 0;
            let minDistance = Infinity;

            visibleCards.forEach((card, idx) => {
                const cardRect = card.getBoundingClientRect();
                const cardCenter = cardRect.left + (cardRect.width / 2);
                const dist = Math.abs(trackCenter - cardCenter);
                if (dist < minDistance) {
                    minDistance = dist;
                    closestIndex = idx;
                }
            });

            eduDots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === closestIndex);
            });
        }

        function scrollToCard(index) {
            const visibleCards = getVisibleCards();
            if (index >= 0 && index < visibleCards.length) {
                const targetCard = visibleCards[index];
                const trackRect = eduTrack.getBoundingClientRect();
                const cardRect = targetCard.getBoundingClientRect();
                const targetScrollLeft = eduTrack.scrollLeft + (cardRect.left - trackRect.left);
                eduTrack.scrollTo({
                    left: targetScrollLeft,
                    behavior: 'smooth'
                });
            }
        }

        if (eduPrevBtn) {
            eduPrevBtn.addEventListener('click', () => {
                const visibleCards = getVisibleCards();
                const cardWidth = visibleCards[0] ? visibleCards[0].offsetWidth + 24 : 340;
                eduTrack.scrollBy({ left: -cardWidth, behavior: 'smooth' });
            });
        }

        if (eduNextBtn) {
            eduNextBtn.addEventListener('click', () => {
                const visibleCards = getVisibleCards();
                const cardWidth = visibleCards[0] ? visibleCards[0].offsetWidth + 24 : 340;
                eduTrack.scrollBy({ left: cardWidth, behavior: 'smooth' });
            });
        }

        eduDots.forEach(dot => {
            dot.addEventListener('click', () => {
                const targetIdx = parseInt(dot.getAttribute('data-index') || '0', 10);
                scrollToCard(targetIdx);
            });
        });

        // Filter tabs logic
        eduFilterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                eduFilterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const filter = tab.getAttribute('data-filter') || 'all';

                eduCards.forEach(card => {
                    const cardCat = card.getAttribute('data-category');
                    if (filter === 'all' || cardCat === filter) {
                        card.classList.remove('is-filtered-out');
                    } else {
                        card.classList.add('is-filtered-out');
                    }
                });

                // Reset scroll to start
                eduTrack.scrollTo({ left: 0, behavior: 'smooth' });
                setTimeout(updateSliderControls, 120);
            });
        });

        eduTrack.addEventListener('scroll', () => {
            updateSliderControls();
        }, { passive: true });

        // Initial controls state
        setTimeout(updateSliderControls, 150);
    }

    // --- Dynamic Typewriter Effect ---
    const typingElement = document.getElementById('typing-text');
    const cursorElement = document.querySelector('.typing-cursor');

    if (typingElement) {
        const phrases = [
            'a Web Developer',
            'an Informatics Student',
            'a Frontend Developer',
            'a UI/UX Designer'
        ];

        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentText = phrases[phraseIndex];

            if (cursorElement) cursorElement.classList.add('typing');

            if (isDeleting) {
                charIndex--;
                typingElement.textContent = currentText.substring(0, charIndex);
            } else {
                charIndex++;
                typingElement.textContent = currentText.substring(0, charIndex);
            }

            let nextSpeed = isDeleting ? 32 : (70 + Math.random() * 25);

            if (!isDeleting && charIndex === currentText.length) {
                // Selesai mengetik satu profesi: jeda santai untuk membaca & kursor berkedip
                nextSpeed = 2200;
                isDeleting = true;
                if (cursorElement) cursorElement.classList.remove('typing');
            } else if (isDeleting && charIndex === 0) {
                // Selesai menghapus: pindah ke profesi berikutnya
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                nextSpeed = 400;
                if (cursorElement) cursorElement.classList.remove('typing');
            }

            setTimeout(type, nextSpeed);
        }

        typingElement.textContent = '';
        setTimeout(type, 500);
    }
});


