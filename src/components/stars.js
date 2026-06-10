const StarsComponent = {
  /**
   * Renders the star rating inside a container.
   * @param {string|HTMLElement} container - The target container.
   * @param {number} count - Number of active stars (1 to 3).
   * @param {boolean} animate - Whether to apply reveal animations.
   */
  render(container, count, animate = true) {
    const el = typeof container === "string" ? document.getElementById(container) : container;
    if (!el) return;

    let html = "";
    for (let i = 1; i <= 3; i++) {
      const isActive = i <= count;
      const animationClass = animate ? "star-reveal" : "";
      const delay = animate ? `style="animation-delay: ${i * 0.15}s;"` : "";
      
      html += `
        <span class="${animationClass} ${isActive ? 'active' : 'inactive'}" ${delay}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" class="star-svg">
            <path fill="${isActive ? '#ffd93d' : '#22384f'}" 
                  stroke="${isActive ? '#ffb900' : 'rgba(255,255,255,0.1)'}" 
                  stroke-width="2" 
                  d="M12 .587l3.668 7.431 8.2 1.191-5.934 5.784 1.4 8.168L12 18.896l-7.334 3.858 1.4-8.168L.132 9.409l8.2-1.191L12 .587z"/>
          </svg>
        </span>
      `;
    }
    
    el.innerHTML = html;

    if (animate) {
      // Trigger the reveal animation
      setTimeout(() => {
        el.querySelectorAll(".star-reveal").forEach(star => {
          star.classList.add("show");
        });
      }, 50);
    }
  }
};

window.StarsComponent = StarsComponent;
