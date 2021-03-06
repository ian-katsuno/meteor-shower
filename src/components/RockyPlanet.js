/*
auto-generated by: https://github.com/react-spring/gltfjsx
*/

import * as THREE from 'three'
import React, { useEffect, useRef, useState } from 'react'
import { useLoader, useFrame } from 'react-three-fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import {
  MeshStandardMaterial
} from 'three';

export default function Model(props) {
  const group = useRef()
  const { nodes, materials, animations } = useLoader(GLTFLoader, '/models/low-poly-rocky-planet.gltf')
  const texture = useLoader(THREE.TextureLoader, 'textures/NOVA_solarSystem_planets_UVwrap_jupiter.png')
  console.log(materials);
  const [ rotation, setRotation ] = useState(0);

  useFrame(() => {
    setRotation(rotation + 0.01);
  })
  
  return (
    <group ref={group} {...props} dispose={null} scale={[0.3, 0.3, 0.3]}>
      <scene name="Scene">
        <group name="Light" position={[4.08, 5.9, -1.01]} rotation={[1.89, 0.88, -2.05]} />
        <group name="Camera" position={[7.36, 4.96, 6.93]} rotation={[1.24, 0.33, -0.76]} />
        <mesh
   /*       material={materials.________}*/
          geometry={nodes.Rock1221.geometry}
          name="Rock1221"
          rotation={[rotation, rotation, 0]}
        >
          <meshStandardMaterial 
            attach="material"
            map={texture}
          />
        </mesh>
      </scene>
    </group>
  )
}
