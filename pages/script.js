// Butterfly follow effect
document.addEventListener('DOMContentLoaded', () => {
  /* ---------------- Butterfly follow effect ---------------- */
  const butterfly = document.getElementById('butterfly');
  if (butterfly) {
    // ensure it won't capture clicks
    butterfly.style.pointerEvents = 'none';
    // use clientX/Y so the position is relative to viewport when using fixed/absolute
    document.addEventListener('mousemove', (e) => {
      butterfly.style.left = `${e.clientX}px`;
      butterfly.style.top = `${e.clientY}px`;
    });
  } else {
    // console.info('butterfly element not found (id="butterfly")');
  }

  document.addEventListener('click', (e) => {
  // Create sparkle image
  const sparkle = document.createElement('img');
  sparkle.src = "http://dl5.glitter-graphics.net/pub/79/79975yk3ulkvbq5.gif";
  sparkle.className = "sparkle";
  
  // Position at click point
  sparkle.style.left = `${e.clientX}px`;
  sparkle.style.top = `${e.clientY}px`;

  // Add to page
  document.body.appendChild(sparkle);

  // Remove after animation ends (or 1s fallback)
  sparkle.addEventListener("animationend", () => sparkle.remove());
  setTimeout(() => sparkle.remove(), 1200);
});


  /* ---------------- Theme toggle (light / dark) ---------------- */
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

  /* ---------------- Menu open/close for small screens ----------------
     Your HTML uses icons with id="up" and id="down". This code will show/hide sidemenu.
  --------------------------------------------------------------------- */
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

  // click game
  const startBtn = document.getElementById("startBtn"); // Start Game button
  const clickPad = document.getElementById("clickPad"); // Clicking pad button
  const scoreDisplay = document.getElementById("score");
  const timerDisplay = document.getElementById("timer");

  let score = 0;
  let timeLeft = 15;
  let timer;

  // Start the game
  startBtn.addEventListener("click", () => {
    score = 0;
    timeLeft = 15;

    // Reset displays
    scoreDisplay.innerHTML = "<h5>Score:</h5> " + score;
    timerDisplay.innerHTML = "<h5>Time Left:</h5> " + timeLeft + "s";

    // Enable the clicking pad
    clickPad.disabled = false;
    startBtn.disabled = true;

    // Countdown timer
    timer = setInterval(() => {
      timeLeft--;
      timerDisplay.innerHTML = "<h5>Time Left:</h5> " + timeLeft + "s";

      if (timeLeft <= 0) {
        clearInterval(timer);
        clickPad.disabled = true;
        startBtn.disabled = false;
        alert("Game Over! 🎉 Your score: " + score);
      }
    }, 1000);
  });

  // Handle clicks on the pad
  clickPad.addEventListener("click", () => {
    score++;
    scoreDisplay.innerHTML = "<h5>Score:</h5> " + score;
  });


});
