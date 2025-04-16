document.addEventListener('mousemove', (e) => {
    butterfly.style.left = `${e.pageX}px`;
    butterfly.style.top = `${e.pageY}px`;
    // etc...
  });
  butterfly.style.transition = 'top 0.1s linear, left 0.1s linear';
