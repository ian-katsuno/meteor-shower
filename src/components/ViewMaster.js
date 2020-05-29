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
 } from '../lib/CondoHelpers';

const STARTING_INDEX = 0,
  TIME_BETWEEN_SCENE_CHANGES = 14000;

export default function ViewMaster({

}){
  const [ pano, setPano ] = useState(SCENES[STARTING_INDEX].texture)
  const [ rotation, setRotation ] = useState(SCENES[STARTING_INDEX].rotation)
  const panoRef = useRef(STARTING_INDEX);
  const [ visible, setVisible ] = useState(true);
  const overlayRef = useRef([]);
  const textures = useRef([]);

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
    overlayRef.current.style.opacity = 0;
    setTimeout(() =>{
      if(overlayRef.current && typeof overlayRef.current.remove === 'function'){
        overlayRef.current.remove();
      }

      setOnFinish(nextScene)
      setSrc(SCENES[STARTING_INDEX].audio);
      setTimeout(() => {
        play();
        setVisible(true);
      }, 2000);

    }, 2500)
  }, [setOnFinish, nextScene, setSrc, play, setVisible])

  useEffect(() => {
    setOnFinish(nextScene)
  }, [nextScene, setOnFinish])


  useEffect(() => {
    const [overlay, loadingGif, progress] = createOverlay();
    overlayRef.current = overlay;
    document.body.appendChild(overlay);
    loadingGif.style.opacity = 1;
    const manager = new LoadingManager();
    const loader = new TextureLoader(manager);

    manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
      console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );    
    };
    
    manager.onLoad = function ( ) {
      console.log( 'Loading complete!');
        setTimeout(() => {
          if(progress && progress.style){
            progress.style.opacity = 0;
          }
          setTimeout(() => {
            loadingGif.remove();
            progress.remove();

            const startButton = generateStartButton(start);
            overlay.appendChild(startButton);
            setTimeout(() =>{
              startButton.style.opacity = 1;
            }, 2000);
          }, 2000)
        }, 1500);
    };
    
    manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
      const percent = Math.round((itemsLoaded/itemsTotal)*100);
      delay(450);
      setProgressCounter(progress, percent);
      console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
    };
    
    manager.onError = function ( url ) {
      console.log( 'There was an error loading ' + url );    
    };

    for(const scene of SCENES){
      textures.current.push(loader.load(scene.texture));
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