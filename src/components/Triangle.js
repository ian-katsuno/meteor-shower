/*
auto-generated by: https://github.com/react-spring/gltfjsx
*/

import * as THREE from 'three'
import React, { useEffect, useRef } from 'react'
import { useLoader, useFrame } from 'react-three-fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import {
  MeshNormalMaterial,
} from 'three'

export default function Model(props) {
  const group = useRef()
  const { nodes, materials, animations } = useLoader(GLTFLoader, '/models/triangle/Triangle.gltf')

  return (
    <group ref={group} {...props} dispose={null}>
      <scene>
        <mesh material={nodes.mesh_0.material} geometry={nodes.mesh_0.geometry} name="mesh_0" />
        {/* <mesh material={new MeshNormalMaterial()} wireframe={true} geometry={nodes.mesh_0.geometry} name="mesh_0" /> */}
      </scene>
    </group>
  )
}