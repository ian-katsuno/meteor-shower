import React, { useState, useRef, useEffect, useCallback } from 'react';

import StereoPano from './StereoPano';
import useMedia from '../lib/useMedia';
import { TextureLoader, LoadingManager } from 'three';
import { 
  SCENES,
  delay,
  generateStartButton,
  createOverlay,
  setProgressCounter,
  computePercent,
 } from '../lib/CondoHelpers';

export default function ViewMaster({

}){
  const [ pano, setPano ] = useState(SCENES[0].texture)
  const [ rotation, setRotation ] = useState(SCENES[0].rotation)
  const panoRef = useRef(0);
  const [ visible, setVisible ] = useState(true);
  const overlayRef = useRef([]);
  const startButtonRef = useRef();
  const textures = useRef([]);
  const nAudioLoaded = useRef(0);
  const nTexturesLoaded = useRef(0);

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
      panoRef.current = (panoRef.current + 1) % SCENES.length;
      setPano(SCENES[panoRef.current].texture);
      setSrc(SCENES[panoRef.current].audio);
      setRotation(SCENES[panoRef.current].rotation);

      setTimeout(() => {
        play();
        setVisible(true);
      }, 1400)
    }, 1000)   
  }, [panoRef, play, pause, setPano, setSrc, setVisible]);

  const start = useCallback(() => {
    startButtonRef.current.style.opacity = 0;
    setTimeout(() => {
      overlayRef.current.style.opacity = 0;
      setTimeout(() =>{
        if(overlayRef.current && typeof overlayRef.current.remove === 'function'){
          overlayRef.current.remove();
        }

        setOnFinish(nextScene)
        setSrc(SCENES[0].audio);
        setTimeout(() => {
          play();
          setVisible(true);
        }, 2000);
      }, 2500)

    }, 2000)

  }, [setOnFinish, nextScene, setSrc, play, setVisible])

  useEffect(() => {
    setOnFinish(nextScene)
  }, [nextScene, setOnFinish])

  useEffect(() => {

    const [overlay, loadingGif, progress] = createOverlay();
    overlayRef.current = overlay;
    document.body.appendChild(overlay);

    const manager = new LoadingManager();
    const loader = new TextureLoader(manager);

    function checkExitLoading(percent){
     if(percent === 100){
      setTimeout(() => {
        if(progress && progress.style){
          progress.style.opacity = 0;
        }
        setTimeout(() => {
          loadingGif.remove();
          progress.remove();

          const startButton = generateStartButton(start);
          startButtonRef.current = startButton;
          overlay.appendChild(startButton);
          setTimeout(() =>{
            startButton.style.opacity = 1;
          }, 2000);
        }, 2000)
      }, 1500);
     } 
    }

    manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
      console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );    
    };
    
    manager.onLoad = function ( ) {
      console.log( 'Loading complete!');
      const percent = computePercent(nAudioLoaded.current, nTexturesLoaded.current);
      checkExitLoading(percent);
    };
    
    manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
      nTexturesLoaded.current += 1;
      const percent = computePercent(nAudioLoaded.current, nTexturesLoaded.current);
      delay(250);
      setProgressCounter(progress, percent);
      console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
    };
    
    manager.onError = function ( url ) {
      console.log( 'There was an error loading ' + url );    
    };
   
    for(const scene of SCENES){
      // load the texture
      textures.current.push(loader.load(scene.texture));

      // load the audio
      const a = new Audio();
      
      a.addEventListener('canplaythrough', () => {
        nAudioLoaded.current += 1;
        const percent = computePercent(nAudioLoaded.current, nTexturesLoaded.current);
        delay(250);
        setProgressCounter(progress, percent); 
        checkExitLoading(percent);
      });

      a.src = scene.audio;
    }
  }, [])

  return (
    <>
      <StereoPano 
        src={'/textures/overunder/CondoVR-3.jpg'}
        opacity={1}
        rotation={0}
        radius={510}
      />
      <StereoPano 
        src={pano}
        opacity={Number(visible)}
        rotation={rotation}
      />
    </>
  )
}