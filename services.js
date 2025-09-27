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
});
