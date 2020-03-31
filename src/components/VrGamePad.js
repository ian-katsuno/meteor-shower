import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import { Raycaster, Vector3, ArrowHelper } from 'three';

export default function VrGamePad({

}){
 const { gl, scene } = useThree();
 const raycaster = useRef();
 const arrow = useRef();
 
 
 useEffect(() => {
  gl.xr.getController(0);

  raycaster.current = new Raycaster();
 }, [])
 
 useFrame((time, frame) => {
 /* console.log(frame);
  console.log(time);*/
  const session = gl.xr.getSession() ;
  if(session){

    const xrReferenceSpace = gl.xr.getReferenceSpace();
    const controller = gl.xr.getController(0);
    const position = controller.position;
    const direction = new Vector3()
  //  controller.quaternion.getWorldDirection(direction);
    raycaster.current.set(controller.position, direction);
    console.log(controller);

    arrow.current && scene.remove ( arrow.current );
    arrow.current = new ArrowHelper( (new Vector3(-1, -1, -1)).normalize(), position , 100, 0xffff00);
    scene.add( arrow.current) ;
  }
/*  for(let input in session.inputSources){
    const pose = input.getPose(input.targetRaySpace, xrReferenceSpace);
  }*/
//  console.log();
 }, 1);

 return null;
}