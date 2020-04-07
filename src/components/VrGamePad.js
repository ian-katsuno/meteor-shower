import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import { Raycaster, Color, Vector3, ArrowHelper, Euler, MeshBasicMaterial } from 'three';

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
     console.log("registering onSelect event listener");
    function onSelect(){
      console.log('onSelect ran');
      const intersects = raycaster.current.intersectObjects(scene.children, true);
      if(intersects.length > 0){
        console.log('intersected something');
      }
      for ( var i = 0; i < intersects.length; i++ ) {
        intersects[ i ].object.material.color.set( 0xff0000 );  
      }
    }
    xrSession.addEventListener('select', onSelect);
    return () => xrSession.removeEventListener('select', onSelect);
   }
 }, [xrSession]);
 
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
    let arrowColor = 0x00ffff;
    if(session.inputSources[0].gamepad.buttons[0].pressed){
      arrowColor = 0xffff00;
      let intersects = raycaster.current.intersectObjects(scene.children, true);
      if(intersects.length > 0){
        console.log(intersects);
          intersects = intersects.filter(i => {
          debugger;
          const hasParent = !!i.object.parent;
          if(!hasParent){ return false}
          const hasName = (i.object.parent.name !== 'inputArrow')
          return hasName
        })
        intersects.sort((a, b) => a.distance - b.distance)
        if(intersects[0] && intersects[0].object){
          intersects[0].object.material = new MeshBasicMaterial({ color: new Color('hotpink'), transparent: true });
          if(intersects[0].object.type === 'Mesh' && intersects[0].object.__handlers){
            intersects[0].object.__handlers.click();
          }
        }
      }
    }   
    arrow.current && scene.remove ( arrow.current );
    arrow.current = new ArrowHelper( direction.normalize(), position , 100, arrowColor);
    arrow.current.name = 'inputArrow'
    scene.add( arrow.current) ;

  }
 }, 1);

 return null;
}