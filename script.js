document.addEventListener('DOMContentLoaded', () => {
    // 1. Aktuelles Jahr im Footer setzen
    document.getElementById('year').textContent = new Date().getFullYear();

    // 2. Navbar-Scroll-Effekt
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    }, { passive: true });

    // 2b. Scroll-Reveal-Animation (Sichtbarkeitsprüfung)
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // 3. Mobiles Menü umschalten
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Mobiles Menü beim Klick auf einen Link schließen
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // 4. Logik für das Galerie-Modal der Leistungen
    const galleryModal = document.getElementById('service-gallery-modal');
    const galleryGrid = document.getElementById('sgm-grid');
    const galleryTitle = document.getElementById('sgm-title');
    const galleryClose = document.getElementById('sgm-close');

    // images.js dynamisch laden (Cache-Busting)
    const cacheBuster = new Date().getTime();
    const imgScript = document.createElement('script');
    imgScript.src = `images.js?v=${cacheBuster}`;
    imgScript.onload = () => {
        // images.js ist geladen, Leistungskarten können nun Galerien öffnen
    };
    imgScript.onerror = () => {
        console.error('Could not load images.js');
    };
    document.body.appendChild(imgScript);

    // Ordnernamen den entsprechenden Bild-Arrays zuordnen
    function getImagesForCategory(folder) {
        if (folder === 'Baumfaellung' && typeof imagesBaumfaellung !== 'undefined') return imagesBaumfaellung;
        if (folder === 'Hecken' && typeof imagesHecken !== 'undefined') return imagesHecken;
        if (folder === 'Zaun' && typeof imagesZaun !== 'undefined') return imagesZaun;
        return [];
    }

    function createGalleryItem(folder, fileName) {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.innerHTML = `
            <img src="${folder}/${fileName}" alt="WJ-Baumfällung Projekt" loading="lazy">
            <div class="gallery-overlay">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6"/><path d="M8 11h6"/></svg>
            </div>
        `;
        div.addEventListener('click', () => openLightbox(`${folder}/${fileName}`));
        return div;
    }

    function openServiceGallery(folder, title) {
        const images = getImagesForCategory(folder);
        galleryGrid.innerHTML = '';
        galleryTitle.textContent = title;

        if (images.length === 0) {
            galleryGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #7B8F77;">Noch keine Bilder vorhanden.</p>';
        } else {
            images.forEach(fileName => {
                galleryGrid.appendChild(createGalleryItem(folder, fileName));
            });
        }

        galleryModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeServiceGallery() {
        galleryModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Klick-Events für die Leistungskarten hinzufügen
    document.querySelectorAll('.service-card[data-gallery]').forEach(card => {
        card.addEventListener('click', () => {
            const folder = card.dataset.gallery;
            const title = card.dataset.galleryTitle;
            openServiceGallery(folder, title);
        });
    });

    galleryClose.addEventListener('click', closeServiceGallery);

    // Modal mit der Escape-Taste schließen
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (lightbox.classList.contains('active')) {
                closeLightbox();
            } else if (galleryModal.classList.contains('active')) {
                closeServiceGallery();
            }
        }
    });

    // 5. Lightbox-Logik (Bildvergrößerung)
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightboxBtn = document.querySelector('.lightbox-close');

    function openLightbox(imgSrc) {
        lightboxImg.src = imgSrc;
        lightbox.classList.add('active');
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
    }

    closeLightboxBtn.addEventListener('click', closeLightbox);
    
    // Lightbox schließen, wenn außerhalb des Bildes geklickt wird
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // 6. Logik für das E-Mail-Kontaktformular
    const toggleEmailBtn = document.getElementById('toggle-email-form');
    const emailFormContainer = document.getElementById('email-form-container');
    const contactForm = document.getElementById('contact-form');

    if (toggleEmailBtn && emailFormContainer && contactForm) {
        toggleEmailBtn.addEventListener('click', (e) => {
            e.preventDefault();
            emailFormContainer.classList.toggle('active');
            
            if(emailFormContainer.classList.contains('active')) {
                setTimeout(() => {
                    emailFormContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 300);
            }
        });

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('form-email').value;
            const subject = document.getElementById('form-subject').value;
            const body = document.getElementById('form-body').value;
            
            let mailBody = `Nachricht von (Antwort-E-Mail): ${email}\n\n${body}`;
            const mailtoLink = `mailto:info@wj-baumfaellung.de?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailBody)}`;
            
            window.location.href = mailtoLink;
        });
    }

    // 7. Cookie-Banner Logik
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    
    if (cookieBanner && acceptCookiesBtn) {
        // Prüfen, ob Cookies bereits akzeptiert wurden
        if (!localStorage.getItem('cookiesAccepted')) {
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 1000); // Nach 1 Sekunde einblenden
        }
        
        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.classList.remove('show');
        });
    }

});
