const ProgressBar = {
  render(containerId, value, max, label = "") {
    const container = document.getElementById(containerId);
    if (!container) return;

    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    container.innerHTML = `
      <div class="custom-progress-wrapper" aria-label="Progress: ${value} of ${max}">
        ${label ? `<span class="custom-progress-label">${label}</span>` : ""}
        <div class="custom-progress-track">
          <div class="custom-progress-fill" style="width: 0%; transition: width 0.5s ease-out;"></div>
        </div>
        <span class="custom-progress-value">${value}/${max}</span>
      </div>
    `;

    // Trigger reflow to animate width from 0%
    setTimeout(() => {
      const fill = container.querySelector(".custom-progress-fill");
      if (fill) {
        fill.style.width = `${percentage}%`;
      }
    }, 50);
  }
};

window.ProgressBar = ProgressBar;
