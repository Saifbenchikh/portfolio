document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. LOADER DE PAGE (Seulement si présent dans le HTML) ---
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => { loader.style.display = 'none'; }, 500);
        }, 500);
    }

    // --- 2. ANNÉE DYNAMIQUE ---
    const footerYear = document.querySelector('footer p');
    if (footerYear) {
        footerYear.innerHTML = `© ${new Date().getFullYear()} - Saif BENCHIKH. Tous droits réservés.`;
    }

    // --- 3. NAVIGATION ACTIVE & MOBILE ---
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('header ul li a').forEach(link => {
        // Gestion simple pour correspondre index.html et racine
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('header ul');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // --- 4. ANIMATIONS AU SCROLL & PROGRESS BARS ---
    const reveals = document.querySelectorAll('.reveal');
    const skills = document.querySelectorAll('.progress-bar-fill');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        reveals.forEach(reveal => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });

        // Animation des barres de compétences
        skills.forEach(skill => {
            const rect = skill.getBoundingClientRect();
            if (rect.top < windowHeight - 50) {
                skill.style.width = skill.getAttribute('data-width');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // --- 5. LIGHTBOX (Galerie) ---
    const galleryImages = document.querySelectorAll('.gallery-img');
    if (galleryImages.length > 0) {
        // Création dynamique de la lightbox si elle n'existe pas
        let lightbox = document.getElementById('lightbox');
        if (!lightbox) {
            lightbox = document.createElement('div');
            lightbox.id = 'lightbox';
            lightbox.innerHTML = '<img src="" alt="Zoom">';
            document.body.appendChild(lightbox);
            
            // Fermeture au clic
            lightbox.addEventListener('click', () => {
                lightbox.style.display = 'none';
            });
        }
        
        galleryImages.forEach(img => {
            img.addEventListener('click', () => {
                const lightboxImg = lightbox.querySelector('img');
                lightboxImg.src = img.src;
                lightbox.style.display = 'flex';
            });
        });
    }

    // --- 6. AJAX FORM (Formspree) ---
    const form = document.getElementById("contact-form");
    if (form) {
        form.addEventListener("submit", function(ev) {
            ev.preventDefault();
            const btn = form.querySelector("button");
            const originalText = btn.innerHTML;
            btn.innerHTML = "<i class='fas fa-spinner fa-spin'></i> Envoi...";
            
            const data = new FormData(form);
            fetch(form.action, {
                method: form.method,
                body: data,
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    btn.innerHTML = "<i class='fas fa-check'></i> Message Envoyé !";
                    btn.style.background = "#10b981"; // Vert
                    btn.style.borderColor = "#10b981";
                    form.reset();
                } else {
                    btn.innerHTML = "<i class='fas fa-times'></i> Erreur.";
                    btn.style.background = "#ef4444"; // Rouge
                }
                setTimeout(() => { 
                    btn.innerHTML = originalText; 
                    btn.style.background = ""; 
                    btn.style.borderColor = "";
                }, 3000);
            });
        });
    }
});