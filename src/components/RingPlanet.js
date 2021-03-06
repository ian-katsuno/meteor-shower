/*
auto-generated by: https://github.com/react-spring/gltfjsx
*/

import * as THREE from 'three'
import React, { useEffect, useRef, useState } from 'react'
import { useLoader, useFrame } from 'react-three-fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default function Model(props) {
  const group = useRef()
  const { nodes, materials, animations } = useLoader(GLTFLoader, '/models/saturn.gltf')
  const [ rotation, setRotation ] = useState(0);
  const texture = useLoader(THREE.TextureLoader, 'textures/NOVA_solarSystem_planets_UVwrap_jupiter.png')

  useFrame(() => {
    setRotation(rotation + 0.01);
  })

  return (
    <group ref={group} {...props} dispose={null} rotation={[0.2, rotation, 0]}>
      <scene name="Scene">
        <group name="Light" position={[4.08, 5.9, -1.01]} rotation={[1.89, 0.88, -2.05]} />
        <group name="Camera" position={[7.36, 4.96, 6.93]} rotation={[1.24, 0.33, -0.76]} />
        {/* <mesh material={materials.Material} geometry={nodes.Cube.geometry} name="Cube" /> */}
        <mesh
          material={materials.None}
          geometry={nodes.Saturn001.geometry}
          name="Saturn001"
          rotation={[Math.PI / 2, 0, 0]}
        >
          {/* <meshStandardMaterial
            attach="material"
            map={texture}
          /> */}
        </mesh>
        {/* <mesh
          material={materials.SaturnRings}
          geometry={nodes.RingsTop.geometry}
          name="RingsTop"
          rotation={[Math.PI / 2, 0, 0]}
        /> */}
        <mesh
          material={materials.SaturnRings}
          geometry={nodes.RingsBottom.geometry}
          name="RingsBottom"
          rotation={[Math.PI / 2, 0, 0]}
        />
      </scene>
    </group>
  )
}
