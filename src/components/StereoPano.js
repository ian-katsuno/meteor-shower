import React, { useMemo, useRef, useEffect, useState } from 'react';

import { 
  useThree,
  useLoader,
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
} from 'three';

const OVERUNDER_TEXTURES = [
  '/textures/overunder/chess-pano-4k-stereo.jpg',
  '/textures/overunder/ACM_3603D_4096x4096_01.jpg', //galazy spaceship 1
  '/textures/overunder/ACM_3603D_4096x4096_02.jpg', //bacteria 
  '/textures/overunder/ACM_3603D_4096x4096_03.jpg', // galaxy spaceship 2
  '/textures/overunder/ACM_3603D_4096x4096_04.jpg', // trippy arms and legs
  '/textures/starry_background.jpg'
]

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
  src = OVERUNDER_TEXTURES[4]
}){
  //const texture = useLoader(TextureLoader, OVERUNDER_TEXTURES[0]);

  const texture = useMemo(() => src && new TextureLoader().load(src), [src]);
  const [meshL, setMeshL] = useState();
  const [meshR, setMeshR] = useState();
  
  const { camera, gl } = useThree();

  useEffect(() => {
    // enabling layer 1 so that the camera can see one pano sphere before you 'Enter VR'
    camera.layers.enable(1);
    gl.setClearColor(0x000000);
  }, [])

  useEffect(() => {
    const geometryL = new SphereGeometry(500, 60, 40);
    const geometryR = new SphereGeometry(500, 60, 40);
    mapSphereGeometryToOverUnder(geometryL, "top"); 
    mapSphereGeometryToOverUnder(geometryR, "bottom");

    const materialL = new MeshStandardMaterial();
    materialL.side = DoubleSide;
    materialL.map = texture;

    const materialR = new MeshStandardMaterial();
    materialR.side = DoubleSide;
    materialR.map = texture;

    const meshL = new Mesh(geometryL, materialL);
    const meshR = new Mesh(geometryR, materialR);

    meshL.layers.set(1);
    meshR.layers.set(2);

    setMeshL(meshL);
    setMeshR(meshR);

  }, [])

  if(!meshL){
    return null;
  }
  return (
    <>
      <primitive object={meshL} position={[0,0,0]} />
      <primitive object={meshR} position={[0,0,0]} />
    </>
  );
}