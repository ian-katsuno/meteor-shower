/*
auto-generated by: https://github.com/react-spring/gltfjsx
*/

import * as THREE from 'three'
import React, { useEffect, useRef, useState } from 'react'
import { useLoader, useFrame } from 'react-three-fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default function Model(props) {
  const group = useRef()
  const { nodes, materials, animations } = useLoader(GLTFLoader, '/models/AnimatedTriangle/glTF-Embedded/AnimatedTriangle.gltf')

  const actions = useRef()
  const [mixer] = useState(() => new THREE.AnimationMixer())
  useFrame((state, delta) => mixer.update(delta))
  useEffect(() => {
    actions.current = {
      animation_0: mixer.clipAction(animations[0], group.current)
    }
    return () => animations.forEach(clip => mixer.uncacheClip(clip))
  }, [])

  return (
    <group ref={group} {...props} dispose={null}>
      <scene>
        <mesh 
          onClick={(e) => actions.current.animation_0.play()}
          material={nodes.mesh_0.material} geometry={nodes.mesh_0.geometry} name="mesh_0" />
      </scene>
    </group>
  )
}
