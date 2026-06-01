document.addEventListener('DOMContentLoaded', () => {
  const navLogo = document.querySelector('.nav-logo svg');
  if (navLogo) {
    navLogo.outerHTML = `
      <svg width="44" height="44" viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="navArcG" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#00D4FF"/>
            <stop offset="100%" stop-color="#ffffff"/>
          </linearGradient>
        </defs>
        <path d="M85 255 C85 255 85 130 160 68 C235 130 235 255 235 255"
              fill="none" stroke="url(#navArcG)" stroke-width="30" stroke-linecap="round"/>
        <path d="M108 262 C108 262 108 145 160 95 C212 145 212 262 212 262"
              fill="#080818" stroke="#080818" stroke-width="3"/>
        <polygon points="160,38 163.5,80 160,86 156.5,80" fill="#ffffff" opacity="0.95"/>
        <polygon points="160,282 163.5,240 160,234 156.5,240" fill="#00D4FF" opacity="0.75"/>
        <polygon points="282,160 240,163.5 234,160 240,156.5" fill="#00D4FF" opacity="0.75"/>
        <polygon points="38,160 80,163.5 86,160 80,156.5" fill="#ffffff" opacity="0.95"/>
        <polygon points="246,74 218,104 213,99 217,95" fill="#7B2FBE" opacity="0.85"/>
        <polygon points="74,74 102,102 97,107 93,103" fill="#7B2FBE" opacity="0.85"/>
        <circle cx="160" cy="160" r="6" fill="#ffffff" opacity="0.95"/>
        <circle cx="160" cy="160" r="3.5" fill="#00D4FF"/>
      </svg>
    `;
  }
});