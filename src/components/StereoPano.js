import React, { useMemo, useRef, useEffect, useState } from 'react';
import { useSpring } from '@react-spring/core';
import { a } from '@react-spring/three';
//import { animated } from 'react-spring-three';

import { 
  useThree,
  useLoader,
  extend
} from 'react-three-fiber';

import {
  SphereBufferGeometry,
  SphereGeometry,
  MeshStandardMaterial,
  TextureLoader,
  BackSide,
  DoubleSide,
  Mesh,
  MeshPhysicalMaterial,
  Group
} from 'three';


function mapSphereGeometryToOverUnder(sphereGeometry, half="top"){
  const uvs = sphereGeometry.faceVertexUvs[0];
  for (var i = 0; i < uvs.length; i++) {
    for (var j = 0; j < 3; j++) {
      uvs[ i ][ j ][ "y" ] *= 0.5;
      if(half !== 'top'){
        uvs[ i ][ j ][ "y" ] += 0.5;
      }
    }
  }
}

export default function StereoPano({
  src,
  opacity = 0.5
}){
  //const texture = useLoader(TextureLoader, OVERUNDER_TEXTURES[0]);

  const { spring } = useSpring({
    spring: opacity,
    config: { mass: 1, tension: 170, friction: 90, precision: 0.0001 }
  })
  const opacityValue = spring.to([0, 1], [0, 1]);
  const [geometryL, geometryR] = useMemo(() => {
    const geometryL = new SphereGeometry(500, 60, 40);
    const geometryR = new SphereGeometry(500, 60, 40);
    mapSphereGeometryToOverUnder(geometryL, "top"); 
    mapSphereGeometryToOverUnder(geometryR, "bottom");
    return [ geometryL, geometryR ];
  }, []);

const texture = useMemo(() => src && new TextureLoader().load(src), [src]);

  const [meshL, setMeshL] = useState();
  const [meshR, setMeshR] = useState();
  
  const [props, set, stop] = useSpring(() => ({opacity: 1}))

  useEffect(() => {
    set({opacity});
  }, [opacity]);

  const { camera, gl, useFrame } = useThree();

  useEffect(() => {
    // enabling layer 1 so that the camera can see one pano sphere before you 'Enter VR'
    camera.layers.enable(1);
    gl.setClearColor(0x000000);
  }, [])

  // useEffect(() => {
  //   if(materialRef.current){
  //     materialRef.current.opacity = opacity;
  //     materialRef.current.needsUpdate = true;

  //   }
  // }, [opacity, materialRef.current])

  useEffect(() => {
    // const geometryL = new SphereGeometry(500, 60, 40);
    // const geometryR = new SphereGeometry(500, 60, 40);
    // mapSphereGeometryToOverUnder(geometryL, "top"); 
    // mapSphereGeometryToOverUnder(geometryR, "bottom");

    // const material = new MeshStandardMaterial();
    // material.side = DoubleSide;
    // material.map = texture;
    // material.opacity = opacity;
    // material.transparent = true;
    // materialRef.current = material;

    // const meshL = new Mesh(geometryL, material);
    // const meshR = new Mesh(geometryR, material);

    // meshL.layers.set(1);
    // meshR.layers.set(2);

    // setMeshL(meshL);
    // setMeshR(meshR);

  }, [src])

  if(!texture){
    return null;
  }
  return (
    <group>
      <a.mesh layers={1}>
        <a.meshStandardMaterial attach="material" map={texture} side={DoubleSide} transparent={true} opacity={opacityValue} />
        <primitive attach="geometry" object={geometryL} />
      </a.mesh>
      <a.mesh layers={2}>
        <a.meshStandardMaterial attach="material" map={texture} side={DoubleSide} transparent={true} opacity={opacityValue} />
        <primitive attach="geometry" object={geometryR} />
      </a.mesh>

    </group>
  );
}