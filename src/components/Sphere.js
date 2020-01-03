
import React, { useMemo} from 'react';
import * as THREE from 'three';
import { useLoader} from 'react-three-fiber';
import { TextureLoader } from 'three/src/loaders/TextureLoader.js'

export default function Sphere({
    radius = 5,
    position = [0, 0, -10],
    scale = [1, 1, 1],
    src
}){
  const texture = useMemo(() => src && new THREE.TextureLoader().load(src), [src]);

  return (
      <mesh
          onClick={() => console.log('click')}
          onPointerOver={() => console.log("onPointerOver")}
          onPointerOut={() => console.log("onPointerOut")} 
          scale={scale}
          rotate={[0,0.1, 0]}
          position={position}
      >
        <sphereBufferGeometry attach="geometry" args={[ radius, 32, 32 ]} />
        {
          src ? (          
            <meshBasicMaterial attach="material" transparent side={THREE.DoubleSide}>
              <primitive attach="map" object={texture} />
            </meshBasicMaterial>
            ) :
            <meshNormalMaterial attach="material" />
        }
      </mesh>
    )
}