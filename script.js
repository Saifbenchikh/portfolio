function setupTypingEffect(elementId) {
    const targetElement = document.getElementById(elementId);
    if (!targetElement) return;


    const textToType = targetElement.innerText.trim(); 
    let charIndex = 0;
    
    if (!textToType) return;

    function type() {
        if (charIndex < textToType.length) {
            targetElement.innerHTML += textToType.charAt(charIndex);
            charIndex++;
            setTimeout(type, 100); 
        } else {
           
             targetElement.classList.remove('typing-cursor');
        }
    }

    
    targetElement.innerHTML = '';
    targetElement.classList.add('typing-cursor');
    
    targetElement.setAttribute('data-original-text', textToType); 
    
    
    setTimeout(type, 500);
}


document.addEventListener('DOMContentLoaded', () => {
    setupTypingEffect('main-title-typing');
});