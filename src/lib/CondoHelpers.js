function delay(delay_ms){
  const start = Date.now();
  while((Date.now() - start) < delay_ms){
  }
}

function generateColor(percent){
 //return `rgba(${100 - percent}, ${105*(percent/100) + 100}, ${100 - percent}, 0.7)`
 return `rgba(${255 - percent}, ${255}, ${255 - percent}, 0.7)`
}

function createCounter(classes){
  const counter = document.createElement('h1');
  counter.innerHTML = '0%';
  counter.style.transition = 'color 0.5s, opacity 2.5s';
  for(const c of classes){
    counter.classList.add(c);
  }
  return counter;
}

function createProgressCounter(){
  const pc = document.createElement('div');
  pc.style.transition = 'color 0.5s, opacity 2.5s';
  const red = createCounter(['red']);
  const cyan = createCounter(['cyan']);
  pc.appendChild(red);
  pc.appendChild(cyan);
  return pc;
}

function setProgressCounter(pc, percent){
  for(const child of pc.children){
    child.innerHTML = `${percent}%`;
  }
}

function createOverlay(){
  const overlay = document.createElement('div');
  overlay.classList.add('start-overlay');

  const loadingGif = document.createElement('img');
  // loadingGif.src = '/images/circle-loader.gif';
  // loadingGif.style.transition = 'opacity 2s';
  // loadingGif.style.opacity = 0;
  // overlay.appendChild(loadingGif);

  const progressCounter = createProgressCounter();
  overlay.appendChild(progressCounter);

  return [ overlay, loadingGif, progressCounter ];
}

function generateStartButton(onClick){
  const div = document.createElement('div');
  div.style.transition = 'opacity 3s';
  div.style.opacity = 0;
  div.onclick = onClick;

  const redButton = document.createElement('button')
  redButton.onclick = onClick;
  redButton.classList.add('red')
  redButton.innerHTML = 'START';

  const cyanButton = document.createElement('button')
  cyanButton.onclick = onClick;
  cyanButton.classList.add('cyan')
  cyanButton.innerHTML = 'START';

  div.appendChild(redButton);
  div.appendChild(cyanButton);
  return div;
}

const SCENES = [
  { texture: '/textures/overunder/condo_01.jpg', audio: '/audio/condo_01.mp3', rotation: Math.PI*2},
  { texture: '/textures/overunder/condo_02.jpg', audio: '/audio/condo_02.mp3', rotation: 0},
  { texture: '/textures/overunder/condo_03.jpg', audio: '/audio/condo_03.mp3', rotation: 0},
  { texture: '/textures/overunder/condo_04.jpg', audio: '/audio/condo_04.mp3', rotation: 0},
  { texture: '/textures/overunder/condo_05.jpg', audio: '/audio/condo_05.mp3', rotation: 0},
]

export {
  SCENES,

  delay,

  generateColor,
  generateStartButton,
  createOverlay,
  setProgressCounter
}