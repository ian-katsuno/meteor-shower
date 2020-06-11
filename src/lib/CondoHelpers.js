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
  pc.style.transition = 'color 0.5s, opacity 2.0s';
  const red = createCounter(['red']);
  const cyan = createCounter(['cyan']);
  pc.appendChild(red);
  pc.appendChild(cyan);
  return pc;
}

function setProgressCounter(pc, percent){
  if(isNaN(percent)){
    return;
  }
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

  // const fullscreenButton = generate3dButton('Enter FULLSCREEN', () => {
  //   if (window.screenfull.isEnabled) {
  //     window.screenfull.request();
  //   }
  // }, ['fullscreen'])
  // fullscreenButton.style.opacity = 1;
  // overlay.appendChild(fullscreenButton);

  return [ overlay, loadingGif, progressCounter ];
}

function generate3dButton(text, onClick, classes = []){
  const div = document.createElement('div');
  div.style.transition = 'opacity 1.5s';
  div.style.opacity = 0;
  div.onclick = onClick;

  const redButton = document.createElement('button')
  redButton.onclick = onClick;
  redButton.classList.add('red')
  redButton.innerHTML = text;

  const cyanButton = document.createElement('button')
  cyanButton.onclick = onClick;
  cyanButton.classList.add('cyan')
  cyanButton.innerHTML = text;

  for(const c of classes){
    redButton.classList.add(c);
    cyanButton.classList.add(c);
  }

  div.appendChild(redButton);
  div.appendChild(cyanButton);
  return div;
}

function computePercent(nAudio, nTextures, total){
  return Math.round(((nAudio + nTextures) / total)*100);
}

const SCENES = [
  { texture: '/textures/overunder/v2/condo_01_v2.jpg', audio: '/audio/condo_01.mp3', rotation: Math.PI*2},
  { texture: '/textures/overunder/v2/condo_02_v2.jpg', audio: '/audio/condo_02.mp3', rotation: 0},
  { texture: '/textures/overunder/v2/condo_03_v2.jpg', audio: '/audio/condo_03.mp3', rotation: 0},
  { texture: '/textures/overunder/v2/condo_04_v2.jpg', audio: '/audio/condo_04.mp3', rotation: 0},
  { texture: '/textures/overunder/v2/condo_05_v2.jpg', audio: '/audio/condo_05.mp3', rotation: 0},
]

function requestMotionAccess(cb){
  return new Promise((res, resj) => {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      // iOS 13+
      DeviceOrientationEvent.requestPermission()
      .then(response => {
        if (response == 'granted') {
/*          if(result){
            var sessionInit = { optionalFeatures: [ 'local-floor', 'bounded-floor' ] };
            navigator.xr.requestSession( 'immersive-vr', sessionInit ).then( onSessionStarted );
          }*/
          return res(true);
        }
        else{
          alert("Permission Denied: immersive phone VR requires permission for DeviceOrientation events");
          return res(false);
        }
      })
    } else {
      // non iOS 13+
      return res(true);
    }
  });
}


export {
  SCENES,

  delay,
  computePercent,

  generateColor,
  generate3dButton,
  createOverlay,
  setProgressCounter,
  requestMotionAccess,
}