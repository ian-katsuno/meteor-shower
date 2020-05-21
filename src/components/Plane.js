import React, { useMemo, useEffect, useRef} from 'react';
import * as THREE from 'three';
import { useLoader} from 'react-three-fiber';
import { TextureLoader } from 'three/src/loaders/TextureLoader.js'

export default function Plane({
    position = [0, 0, -100],
    rotation = [0,0,0],
    src
}){
  const texture = useMemo(() => new THREE.TextureLoader().load(src), [src])
  const ref = useRef();
  useEffect(() => {
    ref.current.rotation.x = rotation[0];
    ref.current.rotation.y = rotation[1];
    ref.current.rotation.z = rotation[2];
  },[])

  return (
      <mesh
          onClick={() => console.log('click')}
          onPointerOver={() => console.log("onPointerOver")}
          onPointerOut={() => console.log("onPointerOut")} 
          scale={[1, 1, 1]}
          position={position}
          ref={ref}
      >
        <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
        <meshBasicMaterial attach="material" side={THREE.DoubleSide}>
          <primitive attach="map" object={texture} />
          <primitive attach="normalMap" object={texture} />
        </meshBasicMaterial>
      </mesh>
  )
}