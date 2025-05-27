document.addEventListener('DOMContentLoaded', function() {
    const anchorLinks = document.querySelectorAll('.terms-navigation a');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            const headerHeight = document.querySelector('header').offsetHeight;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            history.pushState(null, null, targetId);
        });
    });
    
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('.terms-article h2');
        const navLinks = document.querySelectorAll('.terms-navigation a');
        
        let currentSection = '';
        const headerHeight = document.querySelector('header').offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            
            if (sectionTop < headerHeight + 100) {
                currentSection = '#' + section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active-term');
            if (link.getAttribute('href') === currentSection) {
                link.classList.add('active-term');
            }
        });
    });
    
    const termsContent = document.querySelector('.terms-content');
    termsContent.style.opacity = '0';
    termsContent.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        termsContent.style.opacity = '1';
        termsContent.style.transform = 'translateY(0)';
        termsContent.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    }, 100);
});