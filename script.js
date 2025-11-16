// Fichier : script.js

// --------------------- EFFET DE SAISIE (TYPING) ---------------------
function setupTypingEffect(elementId) {
    const targetElement = document.getElementById(elementId);
    if (!targetElement) return;

    // Récupère le texte original dans l'HTML (ex: "Bonjour, je suis Saif BENCHIKH")
    const textToType = targetElement.innerText.trim(); 
    let charIndex = 0;
    
    if (!textToType) return;

    function type() {
        if (charIndex < textToType.length) {
            targetElement.innerHTML += textToType.charAt(charIndex);
            charIndex++;
            setTimeout(type, 100); // Vitesse de frappe (50ms)
        } else {
             // Quand la saisie est finie, on retire le curseur
             targetElement.classList.remove('typing-cursor');
        }
    }

    // Préparation : on vide le contenu, on ajoute le curseur clignotant
    targetElement.innerHTML = '';
    targetElement.classList.add('typing-cursor');
    // On sauvegarde le texte pour pouvoir le retaper
    targetElement.setAttribute('data-original-text', textToType); 
    
    // On lance la fonction de frappe après un petit délai
    setTimeout(type, 500);
}

// Lancement des scripts quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Lancement de l'effet de saisie
    setupTypingEffect('main-title-typing');

    // 2. Configuration de l'animation au défilement
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.1 
    });

    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    elementsToAnimate.forEach((el) => observer.observe(el));

    // 3. NOUVEAU : Logique du Menu Latéral (Sidebar)
    const menuToggleBtn = document.getElementById('menu-toggle');
    const sidebarMenu = document.getElementById('sidebar-menu');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    if (menuToggleBtn && sidebarMenu && sidebarOverlay) {
        
        // Ouvre/Ferme le menu au clic sur le bouton
        menuToggleBtn.addEventListener('click', () => {
            menuToggleBtn.classList.toggle('active');
            sidebarMenu.classList.toggle('active');
            sidebarOverlay.classList.toggle('active');
        });

        // Ferme le menu au clic sur l'overlay
        sidebarOverlay.addEventListener('click', () => {
            menuToggleBtn.classList.remove('active');
            sidebarMenu.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        });
    }
});