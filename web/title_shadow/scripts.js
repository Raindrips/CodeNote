const hero = document.querySelector('.hero')
  const text = hero.querySelector('h1')
  const r = 200;


  function shadow(e) {
    // 鼠标移动区域的宽高
    const {offsetWidth: width, offsetHeight: height} = hero
    let { offsetX: x, offsetY: y} = e
    if (this !== e.target) {
      x = x + e.target.offsetLeft
      y = y + e.target.offsetTop
    }
    const xR = Math.round((x / width) * r - (r / 2));
    const yR = Math.round((y / height) * r - (r / 2));
    text.style.textShadow = `
      ${xR}px ${yR}px 1px rgba(112, 176, 112),
      ${yR}px ${xR}px 1px rgba(78, 148, 206)
    `
  }
  hero.addEventListener('mousemove', shadow)