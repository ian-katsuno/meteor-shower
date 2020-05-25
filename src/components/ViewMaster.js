import React, { useState, useRef, useEffect, useCallback } from 'react';


import StereoPano from './StereoPano';

const OVERUNDER_TEXTURES = [
  '/textures/overunder/CondoTest0370.jpg',
  '/textures/overunder/Panorama1_8k_Test.jpg',
  '/textures/overunder/chess-pano-4k-stereo.jpg',
  // '/textures/overunder/ACM_3603D_4096x4096_01.jpg', //galazy spaceship 1
  // '/textures/overunder/ACM_3603D_4096x4096_02.jpg', //bacteria 
  // '/textures/overunder/ACM_3603D_4096x4096_03.jpg', // galaxy spaceship 2
  '/textures/overunder/ACM_3603D_4096x4096_04.jpg', // trippy arms and legs
]

const STARTING_INDEX = 0,
  TIME_BETWEEN_SCENE_CHANGES = 12000;

export default function ViewMaster({

}){
  const [ pano, setPano ] = useState(OVERUNDER_TEXTURES[STARTING_INDEX])
  const panoRef = useRef(STARTING_INDEX);
  const [ visible, setVisible ] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setVisible(true);
    }, 2000)
    const timer = setInterval(() => {
      // first fade it down
      setVisible(false);
      setTimeout(() => {
        // after it fades down change the src and fade it back up
        panoRef.current = (panoRef.current + 1) % OVERUNDER_TEXTURES.length;
        setPano(OVERUNDER_TEXTURES[panoRef.current]);

        setTimeout(() => {
          setVisible(true);
        }, 500)
      }, 900)
    }, TIME_BETWEEN_SCENE_CHANGES);

    return () => clearInterval(timer);
  }, []);

  return (
    <StereoPano 
      src={pano}
      opacity={Number(visible)}
    />
  )
}