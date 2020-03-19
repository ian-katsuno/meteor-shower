import React, { useEffect, useState, useRef } from 'react';
import { useFrame } from 'react-three-fiber';
import Box from './Box';
import Sphere from './Sphere';
import Model from './Model';

const METEOR_DEPTH_THRESHOLD = -10;

function plusMinus(width){
  return (Math.random() - 0.5)* width;
}

function randomRange(width, offset = 0){
  return (Math.random()-0.5) * width + offset;
}

function generateRandomMeteor(radius = 5){
  return {
    radius,
    position: [
      randomRange(300),
      randomRange(20, 100),
      randomRange(300)
    ]
  };
}

export default function Meteors({
    N_DROPS = 10,
    meteorRadius = 1,
}){
    const [meteors, setMeteors] = useState([]);
    const meteorsRef = useRef([]); 
    useEffect(() => {
      const meteors = new Array(N_DROPS).fill(0).map(() => generateRandomMeteor());
      setMeteors(meteors);
    },[]);

    useEffect(() => {
      meteorsRef.current = meteors;
    },[meteors])

    useEffect(() => {
      const timerId = setInterval(() => {
        setMeteors([...meteorsRef.current, generateRandomMeteor()]);
      },500);
      return () => clearInterval(timerId);
    }, [])
    useFrame(() => {
      const newMeteors = meteors.map(m => ({
          ...m, 
          position:[
            m.position[0], 
            m.position[1] - 0.2, 
            m.position[2]
          ]
      }))
      .filter(m => m.position[1] > METEOR_DEPTH_THRESHOLD)
      setMeteors(newMeteors);
    });

    return (
        <>
            {
                meteors.map((m, i) => (
                    // <Model 
                    //   url={'/models/comets/asteroid_OBJ/asteroid OBJ.obj'}
                    //   position={m.position}
                    //   key={i}
                    // />
                    <Sphere
                        radius={m.radius}
                        position={m.position}
                        key={i}
                    />
                ))
            }
        </>
    );
}