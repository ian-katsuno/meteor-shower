/*
auto-generated by: https://github.com/react-spring/gltfjsx
*/

import * as THREE from 'three'
import React, { useEffect, useRef } from 'react'
import { useLoader, useFrame } from 'react-three-fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default function Model(props) {
  const group = useRef()
  const { nodes, materials, animations } = useLoader(GLTFLoader, 'models/black_leather_chair.gltf')

  console.log(materials);
  console.log(nodes);
  materials.chair.color.setHex(0xffffff);
  return (
    <group ref={group} {...props} dispose={null}>
      <scene name="Scene">
        <mesh
          material={materials.chair}
          geometry={nodes.koltuk.geometry}
          name="koltuk"
          position={[0, 0, 0]}
          rotation={[0, -0.5, 0]}
        />
      </scene>
    </group>
  )
}
