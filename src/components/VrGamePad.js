import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import { Raycaster, Color, Vector3, ArrowHelper, MeshBasicMaterial } from 'three';

function getControllerPose(controller){
  const position = controller.position;
      
  // create a direction vector going straight into the world (- z axis)
  const direction = new Vector3(0, 0, -1);

  // apply the coontroller's rotation to the direction vector
  direction.applyQuaternion(controller.quaternion);

  return [ position, direction ];
}

function renderControllerRay(scene, arrowRef, position, direction, color = 0xffff00){
    const length = 1000;

    if(arrowRef.current){
      scene.remove(arrowRef.current);
    }

    arrowRef.current = new ArrowHelper( direction.normalize(), position, length, color);
    arrowRef.current.name = 'inputArrow';
    scene.add(arrowRef.current);
}

// this function takes the raycaster, the scene, and the visibleArrowName
//  it returns the ONE CLOSEST item that the raycaster intersected with
//    that is NOT the visible arrow.
//  This function ONLY gets the intersected thing it DOES NOT handle what to do
// on a sucessful click
//  if nothing of interest is intersected then null is returned
function getClosestIntersectedObject(scene, raycaster, visibleArrowName){
  let intersects = raycaster.intersectObjects(scene.children, true);

  if(intersects.length === 0){
    return null;
  }

  intersects = intersects.filter(i => {

    if(!i.object.parent){ 
      return false
    }

    // don't keep the object if it's our visible arrow
    return (i.object.parent.name !== visibleArrowName)
  });

  // sort by distance, ascending (smallest distance first)
  intersects.sort((a, b) => a.distance - b.distance)

  return intersects[0] ? intersects[0].object : null;
}

function handleClickedObject(object){
  object.material = new MeshBasicMaterial({ color: new Color('hotpink'), transparent: true });
  if(object.type === 'Mesh' && object.__handlers){
    object.__handlers.click();
  }
}

export default function VrGamePad({

}){
 const { gl, scene } = useThree();
 const raycaster = useRef();
 const arrow = useRef();
 const xrSession = gl.xr.getSession();
 
 useEffect(() => {
  // calling getController with a new id creates a controller at that ID
  gl.xr.getController(0);

  // ref to the raycaster 
  raycaster.current = new Raycaster();
 }, []);

 useEffect(() => {
  if(xrSession){
    // once the xrSession is created, register onSelect handler
    function onSelect(){
      console.log('onSelect ran');

      // get array of all objects the controller ray intersects with
      const intersects = raycaster.current.intersectObjects(scene.children, true);

      if(intersects.length > 0){
        console.log('intersected something');
      }

      //  
      for ( var i = 0; i < intersects.length; i++ ) {
        intersects[ i ].object.material.color.set( 0xff0000 );  
      }
    }

    xrSession.addEventListener('select', onSelect);

    // if xrSession changes, unsubscribe from the old before subscribing to the new one
    return () => xrSession.removeEventListener('select', onSelect);
  }
 }, [xrSession]);
 
 useFrame((time, frame) => {
  const session = gl.xr.getSession() ;
  if(session){
    const xrReferenceSpace = gl.xr.getReferenceSpace();

    // get the controller because we need to get the pose (position + orientation)
    const [ position, direction ] = getControllerPose(gl.xr.getController(0));

    // render the controller ray    
    renderControllerRay(scene, arrow, position, direction);
    raycaster.current.set(position, direction.normalize());

    // check handle button presses
    if(session.inputSources[0].gamepad.buttons[0].pressed){
      const intersected = getClosestIntersectedObject(scene, raycaster.current, arrow.current.name);
     
      if(intersected){
        handleClickedObject(intersected);
      }
    }   
  }
 }, 1);

 return null;
}