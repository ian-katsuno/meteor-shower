import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import { Raycaster, Vector3, ArrowHelper, Euler } from 'three';

export default function VrGamePad({

}){
 const { gl, scene } = useThree();
 const raycaster = useRef();
 const arrow = useRef();
 const xrSession = gl.xr.getSession();
 
 
 useEffect(() => {
  gl.xr.getController(0);

  raycaster.current = new Raycaster();

 }, []);

 useEffect(() => {
   if(xrSession){
    xrSession.on('select', () => {
      const intersects = raycaster.current.intersectObjects(scene.children);
      if(intersects.length > 0){
        console.log('intersected something');
      }
      for ( var i = 0; i < intersects.length; i++ ) {
        intersects[ i ].object.material.color.set( 0xff0000 );  
      }
    })
   }
 }, []);
 
 useFrame((time, frame) => {
  const session = gl.xr.getSession() ;
  if(session){
    const xrReferenceSpace = gl.xr.getReferenceSpace();
    const controller = gl.xr.getController(0);
    const position = controller.position;
    const direction = new Vector3(0, 0, -1);
    const euler = new Euler();
    euler.setFromQuaternion(controller.quaternion);
    direction.applyEuler(euler);
    raycaster.current.set(controller.position, direction.normalize());
    console.log(controller);
    arrow.current && scene.remove ( arrow.current );
    arrow.current = new ArrowHelper( direction.normalize(), position , 100, 0x00ffff);
    scene.add( arrow.current) ;
  }
 }, 1);

 return null;
}