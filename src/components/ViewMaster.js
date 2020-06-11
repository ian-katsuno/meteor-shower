import React, { useState, useRef, useEffect, useCallback } from 'react';

import StereoPano from './StereoPano';
import useMedia from '../lib/useMedia';
import { TextureLoader, DefaultLoadingManager } from 'three';
import { 
  SCENES,
  delay,
  generate3dButton,
  createOverlay,
  setProgressCounter,
  computePercent,
  requestMotionAccess,
 } from '../lib/CondoHelpers';

export default function ViewMaster({

}){
  const [ pano, setPano ] = useState()
  const [ rotation, setRotation ] = useState(SCENES[0].rotation)
  const panoRef = useRef(0);
  const [ visible, setVisible ] = useState(false);
  const overlayRef = useRef([]);
  const startButtonRef = useRef();
  const textures = useRef([]);
  const nAudioLoaded = useRef(0);
  const nTexturesLoaded = useRef(0);
  const nTotalTextures = useRef();
  const audioPlayers = useRef([]);
  const [ currentTexture, setCurrentTexture ] = useState(0);

  const {
    play,
    pause,
    setSrc,
    setOnFinish,
    setRef,
  } = useMedia()

  const nextScene = useCallback(() => {
      // first fade it down
    setVisible(false);
    pause();
    setTimeout(() => {
      // after it fades down change the src and fade it back up
      panoRef.current = (panoRef.current + 1) % SCENES.length;
      setPano(SCENES[panoRef.current].texture);
      //setPano(textures.current[panoRef.current]);

      setOnFinish(nextScene)
      setRef(audioPlayers.current[panoRef.current]);
      setSrc(SCENES[panoRef.current].audio);
      setRotation(SCENES[panoRef.current].rotation);
      setCurrentTexture(panoRef.current);
      setTimeout(() => {
        setVisible(true);
      }, 1400)
    }, 500)   
  }, [panoRef, play, pause, setPano, setSrc, setVisible]);

  const start = useCallback(() => {

    if (window.screenfull.isEnabled) {
      window.screenfull.request();
    }

    for(let i = 0; i < audioPlayers.current.length; i++){
      const a = new Audio();
      a.play();
      a.onended = nextScene;
      audioPlayers.current[i] = a;
    }

    requestMotionAccess()
    .then((result) => {
      if(!result){
        alert('Access to device orientation is required for use of this app. Please click start again and accept the prompt. :)')
        return 
      }
      startButtonRef.current.style.opacity = 0;
      setTimeout(() => {
        overlayRef.current.style.opacity = 0;

        setPano(SCENES[panoRef.current].texture);
        setTimeout(() =>{
          if(overlayRef.current && typeof overlayRef.current.remove === 'function'){
            overlayRef.current.remove();
          }

  //        setPano(textures.current[0]);
          setOnFinish(nextScene)
          //setSrc(SCENES[0].audio);
          setRef(audioPlayers.current[panoRef.current]);
          setSrc(SCENES[0].audio);
          setTimeout(() => {
            //play();
            setVisible(true);
          }, 2000);
        }, 2000)
      }, 1500)
    })
    .catch(err => {
      alert('Access to device orientation is required for use of this app. Please click start again and accept the prompt. :)')
    })
  }, [setOnFinish, nextScene, setSrc, play, setVisible, audioPlayers])

  useEffect(() => {
    setOnFinish(nextScene)
  }, [nextScene, setOnFinish])

  useEffect(() => {

    const [overlay, loadingGif, progress] = createOverlay();
    overlayRef.current = overlay;
    document.body.appendChild(overlay);

    const manager = DefaultLoadingManager;
    const loader = new TextureLoader();

    function checkExitLoading(percent){
     if(percent === 100){
      setTimeout(() => {
        if(progress && progress.style){
          progress.style.opacity = 0;
        }
        setTimeout(() => {
          loadingGif.remove();
          progress.remove();

          const startButton = generate3dButton('START', start);
          startButtonRef.current = startButton;
          overlay.appendChild(startButton);
          setTimeout(() =>{
            startButton.style.opacity = 1;
          }, 1000); // how long we wait with nothing before fading up the start button
        }, 1000); // how long we give the progress to disappear 
      }, 1000); // the time we leave the 100% up
     } 
    }

    manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
      console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );    
    };
    
    manager.onLoad = function ( ) {
      console.log( 'Loading complete!');
      const percent = computePercent(SCENES.length, nTexturesLoaded.current, nTotalTextures.current + SCENES.length);
      checkExitLoading(percent);
    };
    
    manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
      nTotalTextures.current = itemsTotal;
      nTexturesLoaded.current += 1;
      const percent = computePercent(SCENES.length, nTexturesLoaded.current, nTotalTextures.current + SCENES.length);
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
      a.volume = 0;
      a.preload = 'auto';
      
      a.addEventListener('canplaythrough', () => {
        // nAudioLoaded.current += 1;
        // const percent = computePercent(SCENES.length, nTexturesLoaded.current, nTotalTextures.current + SCENES.length);
        // delay(250);
        // setProgressCounter(progress, percent); 
        // checkExitLoading(percent);
        // a.src = '';
        // console.log('finished loaded audio', scene.audio);
      });

      a.src = scene.audio;
      a.load();
      a.onended = nextScene;
      a.volume = 0;
      audioPlayers.current.push(a);
    }
  }, [])

  return (
    <>
      <StereoPano 
        src={'/textures/overunder/v2/CondoVR-4.jpg'}
        opacity={1}
        rotation={0}
        radius={510}
      />
      <StereoPano 
        src={pano}
        texture={textures.current[currentTexture]}
        opacity={Number(visible)}
        rotation={rotation}
        play={play}
      />
    </>
  )
}