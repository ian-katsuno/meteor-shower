import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import { Raycaster, Color, Vector3, MeshBasicMaterial } from 'three';
import * as THREE from 'three';

function moveInDirection(origin, direction, distance){
  return new Vector3(
    origin.x + distance * direction.x,
    origin.y + distance * direction.y,
    origin.z + distance * direction.z
  );
}

function getControllerPose(controller){
  const position = controller.position;
      
  // create a direction vector going straight into the world (- z axis)
  const direction = new Vector3(0, 0, -1);

  // apply the coontroller's rotation to the direction vector
  direction.applyQuaternion(controller.quaternion);

  return [ position, direction.normalize() ];
}



function renderControllerRay(scene, lineRef, position, direction, distance, color = 0xffff00){

  if(lineRef.current){
    scene.remove(lineRef.current);
  }

  var material = new THREE.LineBasicMaterial({ color });

  const normd = direction.normalize();

  const dest = new Vector3(
    position.x + distance * normd.x,
    position.y + distance * normd.y,
    position.z + distance * normd.z
  )
  
  var points = [position, dest];
  
  var geometry = new THREE.BufferGeometry().setFromPoints( points );
  
  lineRef.current = new THREE.Line( geometry, material );

  scene.add( lineRef.current );  
}

/*
  point is a Vector3 from intersectObjects
  color is a hex coloor
*/
function drawSphericalReticule(scene, point, sphere, distance, color=0xff00ff){
  const r = 0.1;
  if(!sphere){
    var geometry = new THREE.SphereGeometry( r, 32, 32 );
    var material = new THREE.MeshBasicMaterial( {color} );
    sphere = new THREE.Mesh( geometry, material );
    sphere.name = 'reticule-sphere';
    sphere.position.copy(point);
    scene.add(sphere);
  }

  sphere.position.copy(point);
  const scale = r * distance * 0.5;
  sphere.scale.copy(new Vector3(scale, scale, scale));

  return sphere;
}

// this function takes the raycaster, the scene, and the visibleArrowName
//  it returns the ONE CLOSEST item that the raycaster intersected with
//    that is NOT the visible arrow.
//  This function ONLY gets the intersected thing it DOES NOT handle what to do
// on a sucessful click
//  if nothing of interest is intersected then null is returned
function getClosestIntersected(scene, raycaster, meshesToIgnore = []){
  let intersects = raycaster.intersectObjects(scene.children, true);

  if(intersects.length === 0){
    return null;
  }

  intersects = intersects.filter(i => {
    return !meshesToIgnore.some(obj => {
      return obj && (obj === i.object)
    });
  });

  // sort by distance, ascending (smallest distance first)
  intersects.sort((a, b) => a.distance - b.distance)

  return intersects[0] ? intersects[0] : null;
}

function handleClickedObject(object){
  object.material = new MeshBasicMaterial({ color: new Color('hotpink'), transparent: true });
  if(object.type === 'Mesh' && object.__handlers){
    object.__handlers.click();
  }
}

export default function VrGamePad({

}){
 const { gl, scene } = useThree(),
  raycaster = useRef(),
  arrow = useRef(),
  reticule = useRef(),
  xrSession = gl.xr.getSession();
 
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
  if(session && session.inputSources[0]){
    const xrReferenceSpace = gl.xr.getReferenceSpace();

    // get the controller because we need to get the pose (position + orientation)
    const [ position, direction ] = getControllerPose(gl.xr.getController(0));

    // render the controller ray    
    raycaster.current.set(position, direction);

    const intersected = getClosestIntersected(scene, raycaster.current, [arrow.current, reticule.current]);

    let distance = intersected ? intersected.distance : 200;
    let rayDest = intersected ? intersected.point : moveInDirection(position, direction, distance);

    reticule.current = drawSphericalReticule(scene, rayDest, reticule.current, distance);
    renderControllerRay(scene, arrow, position, direction, distance, 0xff11ff);
    if(intersected && session.inputSources && session.inputSources[0]){
      if(intersected.point){
      }
    
      // check handle button presses
      if(session.inputSources[0].gamepad.buttons[0].pressed){
        handleClickedObject(intersected.object);
      }
    }   
  }
 }, 1);

 return null;
}