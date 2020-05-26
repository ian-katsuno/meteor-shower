import React, { useState, useRef, useEffect, useCallback } from 'react';

import StereoPano from './StereoPano';
import useMedia from '../lib/useMedia';

function createOverlay(extraClasses, onClick){
  const overlay = document.createElement('div');
  overlay.classList.add('start-overlay');
  
  const redButton = document.createElement('button')
  redButton.onclick = onClick;
  redButton.classList.add('red')
  redButton.innerHTML = 'START';
  overlay.appendChild(redButton);

  const cyanButton = document.createElement('button')
  cyanButton.onclick = onClick;
  cyanButton.classList.add('cyan')
  cyanButton.innerHTML = 'START';
  overlay.appendChild(cyanButton);
  return overlay
}

const OVERUNDER_TEXTURES = [
  '/textures/overunder/CondoTest0370.jpg',
  '/textures/overunder/Panorama1_8k_Test.jpg',
  '/textures/overunder/chess-pano-4k-stereo.jpg',
//   '/textures/overunder/ACM_3603D_4096x4096_01.jpg', //galazy spaceship 1
//   '/textures/overunder/ACM_3603D_4096x4096_02.jpg', //bacteria 
//   '/textures/overunder/ACM_3603D_4096x4096_03.jpg', // galaxy spaceship 2
//  '/textures/overunder/ACM_3603D_4096x4096_04.jpg', // trippy arms and legs
]

const SCENES = [
  { texture: '/textures/overunder/CondoTest0370.jpg', audio: '/audio/1.mp3'},
  { texture: '/textures/overunder/UE_8k_80q.jpg', audio: '/audio/1.mp3'},
  { texture: '/textures/overunder/Panorama1_8k_Test.jpg', audio: '/audio/1.mp3'},
  { texture: '/textures/overunder/chess-pano-4k-stereo.jpg', audio: '/audio/1.mp3'},
]

const STARTING_INDEX = 0,
  TIME_BETWEEN_SCENE_CHANGES = 14000;

export default function ViewMaster({

}){
  const [ pano, setPano ] = useState(SCENES[STARTING_INDEX].texture)
  const panoRef = useRef(STARTING_INDEX);
  const [ visible, setVisible ] = useState(false);
  const overlayRef = useRef([]);

  const {
    play,
    pause,
    setSrc,
    setOnFinish
  } = useMedia()

  const nextScene = useCallback(() => {
      // first fade it down
    setVisible(false);
    pause();
    setTimeout(() => {
      // after it fades down change the src and fade it back up
      panoRef.current = (panoRef.current + 1) % OVERUNDER_TEXTURES.length;
      setPano(SCENES[panoRef.current].texture);
      setSrc(SCENES[panoRef.current].audio);

      setTimeout(() => {
        play();
        setVisible(true);
      }, 1300)
    }, 1000)   
  }, [panoRef, play, pause, setPano, setSrc, setVisible]);

  const start = useCallback(() => {
      while(overlayRef.current.length > 0){
        const toRemove = overlayRef.current.splice(0, 1);
        toRemove[0].remove();
      }
      setOnFinish(nextScene)
      setSrc(SCENES[STARTING_INDEX].audio);
      setTimeout(() => {
        play();
        setVisible(true);
      }, 1000);
  }, [setOnFinish, nextScene, setSrc, play, setVisible])

  useEffect(() => {
    setOnFinish(nextScene)
  }, [nextScene, setOnFinish])


  useEffect(() => {
    const redOverlay = createOverlay(['red'], start);
    overlayRef.current.push(redOverlay);
    document.body.appendChild(redOverlay);
  }, []);

  return (
    <StereoPano 
      src={pano}
      opacity={Number(visible)}
    />
  )
}