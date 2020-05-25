import React, { useState, useRef, useEffect } from 'react';
import StereoPano from './StereoPano';

const OVERUNDER_TEXTURES = [
  '/textures/overunder/chess-pano-4k-stereo.jpg',
  '/textures/overunder/ACM_3603D_4096x4096_01.jpg', //galazy spaceship 1
  '/textures/overunder/ACM_3603D_4096x4096_02.jpg', //bacteria 
  '/textures/overunder/ACM_3603D_4096x4096_03.jpg', // galaxy spaceship 2
  '/textures/overunder/ACM_3603D_4096x4096_04.jpg', // trippy arms and legs
]

const STARTING_INDEX = 0;

export default function ViewMaster({

}){
  const [ pano, setPano ] = useState(OVERUNDER_TEXTURES[STARTING_INDEX])
  const panoRef = useRef(STARTING_INDEX);

  useEffect(() => {
    const timer = setInterval(() => {
      console.log('interval running ', panoRef.current);
      panoRef.current = (panoRef.current + 1) % OVERUNDER_TEXTURES.length;
      setPano(OVERUNDER_TEXTURES[panoRef.current]);
    }, 2200);

    return () => clearInterval(timer);
  }, []);

  return (
    <StereoPano 
      src={pano}
    />
  )
}