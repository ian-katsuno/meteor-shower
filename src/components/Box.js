import React, { useRef } from 'react';
import { useFrame } from 'react-three-fiber';

export default function Box({
    position = [1, 1, 1]
}){
  const ref = useRef();

  useFrame(() => {
      ref.current.rotation.x = ref.current.rotation.x + 0.1;
  });

  return (
    <mesh
      ref={ref}
      onClick={() => console.log('click')}
      onPointerOver={() => console.log("onPointerOver")}
      onPointerOut={() => console.log("onPointerOut")} 
      position={position}
    >
      <boxBufferGeometry attach="geometry" args={[1,1,1]} />
      <meshNormalMaterial attach="material"/>
    </mesh>
  )
}