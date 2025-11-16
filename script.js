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

// Lancement de l'effet sur le titre principal
document.addEventListener('DOMContentLoaded', () => {
    setupTypingEffect('main-title-typing');
});