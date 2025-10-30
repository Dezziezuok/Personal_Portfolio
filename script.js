// ---------------- DOMContentLoaded wrapper ---------------- */
document.addEventListener('DOMContentLoaded', () => {
// ---------------- Butterfly follow cursor ---------------- */
  const butterfly = document.getElementById('butterfly');
  if (butterfly) {

     butterfly.style.pointerEvents = 'none';

      document.addEventListener('mousemove', (e) => {
      butterfly.style.left = `${e.clientX}px`;
      butterfly.style.top = `${e.clientY}px`;
    });
  } else {
  }


  // ---------------- Sparkle effect on click ---------------- */
  document.addEventListener('click', (e) => {

  const sparkle = document.createElement('img');
  sparkle.src = "http://dl5.glitter-graphics.net/pub/79/79975yk3ulkvbq5.gif";
  sparkle.className = "sparkle";
  
  sparkle.style.left = `${e.clientX}px`;
  sparkle.style.top = `${e.clientY}px`;

  document.body.appendChild(sparkle);

  sparkle.addEventListener("animationend", () => sparkle.remove());
  setTimeout(() => sparkle.remove(), 1200);
});


// ---------------- Typing effect ---------------- */
  const text = "Electrical Engineer / Software Engineer / Machine Learning Engineer";
  const typingElement = document.querySelector(".typing");
  let i = 0;
  let hasTyped = false; // prevent retyping if scrolled again

  function type() {
    if (i < text.length) {
      typingElement.textContent += text.charAt(i);
      i++;
      setTimeout(type, 45);
    } else {
      typingElement.style.borderRight = "none"; // remove cursor at end
    }
  }

  // Use Intersection Observer to trigger typing when visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasTyped) {
        hasTyped = true;
        type();
      }
    });
  }, { threshold: 0.5 }); // 0.5 means start when 50% of element is visible

  observer.observe(typingElement);



// ---------------- Theme toggle (dark/light) ---------------- */
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  function updateIconTo(iconEl, iconName) {
    if (!iconEl) return;

    iconEl.classList.remove('fa-sun', 'fa-moon');
    iconEl.classList.add(iconName);
  }

  function applyTheme(theme) {
    if (theme === 'light') {
      body.classList.add('light-mode');
      body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
      if (themeToggle) {
        const i = themeToggle.querySelector('i');
        updateIconTo(i, 'fa-moon'); // show moon when site is light
        themeToggle.setAttribute('aria-label', 'Switch to dark mode');
      }
    } else {
      body.classList.add('dark-mode');
      body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
      if (themeToggle) {
        const i = themeToggle.querySelector('i');
        updateIconTo(i, 'fa-sun'); // show sun when site is dark
        themeToggle.setAttribute('aria-label', 'Switch to light mode');
      }
    }
  }

  if (themeToggle) {
    // Set initial theme: use localStorage if present, otherwise default to dark
    const saved = localStorage.getItem('theme');
    if (saved === 'light') applyTheme('light');
    else applyTheme('dark'); // default dark with sun icon (per your request)

    themeToggle.addEventListener('click', () => {
      const nowIsLight = body.classList.contains('light-mode');
      applyTheme(nowIsLight ? 'dark' : 'light');
    });
  } else {
    // console.info('#theme-toggle not found — theme button will not work');
  }

  /* ---------------- About Me tabs (robust) ----------------*/
  const tabLinks = document.querySelectorAll('.aboutme-links');
  const tabContents = document.querySelectorAll('.aboutme-contents');

  function showTabByName(name, clickedLink) {
    if (!name) return;
    tabLinks.forEach(l => l.classList.remove('active-link'));
    tabContents.forEach(c => c.classList.remove('active-tab'));

    if (clickedLink) clickedLink.classList.add('active-link');
    const el = document.getElementById(name);
    if (el) el.classList.add('active-tab');
  }

  // Wire clicks for any .aboutme-links present
  tabLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      // prefer explicit data-tab attribute if provided
      let tabName = link.getAttribute('data-tab') || null;

      // fallback: try to parse inline onclick attr like opentab('skills')
      if (!tabName) {
        const onclick = link.getAttribute('onclick') || '';
        const m = onclick.match(/opentab\(['"]([^'"]+)['"]\)/);
        if (m) tabName = m[1];
      }

      // final fallback: use text content (lowercased, no spaces)
      if (!tabName) {
        tabName = link.textContent.trim().toLowerCase();
      }

      showTabByName(tabName, link);
    });
  });

  // Also expose a global opentab function so your inline calls still work:
  window.opentab = function(tabName) {
    // find the link that triggered event if available
    const evt = window.event || null;
    const clicked = evt && evt.currentTarget ? evt.currentTarget : null;

    // If opentab called from inline and we can find the matching link by onclick attribute, prefer it
    if (!clicked && tabName) {
      // try find link with onclick containing opentab('tabName')
      const candidate = Array.from(document.querySelectorAll('.aboutme-links')).find(l => {
        const onclick = l.getAttribute('onclick') || '';
        return onclick.includes(`opentab('${tabName}')`) || onclick.includes(`opentab("${tabName}")`);
      });
      if (candidate) {
        showTabByName(tabName, candidate);
        return;
      }
    }

    showTabByName(tabName, clicked);
  };


  // ---------------- Side menu toggle ---------------- */
  const sidemenu = document.getElementById('sidemenu');
  const upIcon = document.getElementById('up');   // bars
  const downIcon = document.getElementById('down'); // close

  if (sidemenu && upIcon && downIcon) {
    // initial state: show upIcon, hide downIcon if sidemenu is off-screen
    if (sidemenu.style.right === '0') {
      upIcon.style.display = 'none';
      downIcon.style.display = 'block';
    } else {
      upIcon.style.display = 'block';
      downIcon.style.display = 'none';
    }

    upIcon.addEventListener('click', () => {
      sidemenu.style.right = '0';
      upIcon.style.display = 'none';
      downIcon.style.display = 'block';
    });

    downIcon.addEventListener('click', () => {
      sidemenu.style.right = '-200px';
      upIcon.style.display = 'block';
      downIcon.style.display = 'none';
    });
  }

  /* ---------------- Google Sheets contact form (optional) ---------------- */
  const form = document.forms['submit-to-google-sheet'];
  const msg = document.getElementById('msg');
  const scriptURL = 'https://script.google.com/macros/s/AKfycbxoirYcSOpv9UYY01zKFsmBIzNBUpXwelKSiO13wfFI278mlxo61cFlIYUkIUKdoQ9O/exec';

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      fetch(scriptURL, { method: 'POST', body: new FormData(form) })
        .then(response => {
          if (msg) {
            msg.textContent = "Form sent successfully!";
            setTimeout(() => { msg.textContent = ""; }, 3000);
          }
          form.reset();
        })
        .catch(error => console.error('Error!', error.message));
    });
  }

});
