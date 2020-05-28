import React, { useMemo, useRef, useEffect, useState } from 'react';
//import { useSpring } from '@react-spring/core';
// import { a, useSpring } from '@react-spring/three';

import { 
  useThree,
  useLoader,
  extend,
  useFrame
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


const OVERUNDER_TEXTURES = [
  '/textures/overunder/chess-pano-4k-stereo.jpg',
  '/textures/overunder/ACM_3603D_4096x4096_01.jpg', //galazy spaceship 1
  '/textures/overunder/ACM_3603D_4096x4096_02.jpg', //bacteria 
  '/textures/overunder/ACM_3603D_4096x4096_03.jpg', // galaxy spaceship 2
  '/textures/overunder/ACM_3603D_4096x4096_04.jpg', // trippy arms and legs
  '/textures/starry_background.jpg'
]

const OPACITY_STEP = 0.04;

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
  opacity = 0.5,
  rotation = 0,
  radius = 500
}){
  //const texture = useLoader(TextureLoader, OVERUNDER_TEXTURES[0]);

  // const { spring } = useSpring({
  //   spring: opacity,
  //   config: { mass: 1, tension: 170, friction: 90, precision: 0.0001 }
  // })

  // const opacityValue = spring.to([0, 1], [0, 1]);
  const opacityRef = useRef(opacity);
  const materialRef1 = useRef();
  const materialRef2 = useRef();

  const [geometryL, geometryR] = useMemo(() => {
    const geometryL = new SphereGeometry(radius, 60, 40);
    const geometryR = new SphereGeometry(radius, 60, 40);
    mapSphereGeometryToOverUnder(geometryL, "top"); 
    mapSphereGeometryToOverUnder(geometryR, "bottom");
    return [ geometryL, geometryR ];
  }, []);

  const texture = useMemo(() => src && new TextureLoader().load(src), [src]);

  const [meshL, setMeshL] = useState();
  const [meshR, setMeshR] = useState();
  
  // const [props, set, stop] = useSpring(() => ({opacity: 1}))

  // useEffect(() => {
  //   set({opacity});
  // }, [opacity]);

  const { camera, gl } = useThree();

  useFrame(() => {
    if(!materialRef1.current){
      return;
    }

    if(Math.abs(opacity - opacityRef.current) > OPACITY_STEP){
      opacityRef.current += (OPACITY_STEP * Math.sign(opacity - opacityRef.current));
    }
    else{
      opacityRef.current = opacity;
    }

    materialRef1.current.opacity = opacityRef.current;
    materialRef2.current.opacity = opacityRef.current;

  }, 1);

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
      <mesh layers={1} rotation-y={rotation}>
        <meshStandardMaterial ref={materialRef1} attach="material" map={texture} side={DoubleSide} transparent={true} />
        <primitive attach="geometry" object={geometryL} />
      </mesh>
      <mesh layers={2} rotation-y={rotation}>
        <meshStandardMaterial ref={materialRef2} attach="material" map={texture} side={DoubleSide} transparent={true} />
        <primitive attach="geometry" object={geometryR} />
      </mesh>
    </group>
  );
}