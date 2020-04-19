import * as THREE from 'three';
import { Vector3, MeshBasicMaterial, Color } from 'three';

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

function getControllerPose(controller){
  const position = controller.position;
      
  // create a direction vector going straight into the world (- z axis)
  const direction = new Vector3(0, 0, -1);

  // apply the coontroller's rotation to the direction vector
  direction.applyQuaternion(controller.quaternion);

  return [ position, direction.normalize() ];
}

function moveInDirection(origin, direction, distance){
  return new Vector3(
    origin.x + distance * direction.x,
    origin.y + distance * direction.y,
    origin.z + distance * direction.z
  );
}

function handleClickedObject(object){
  object.material = new MeshBasicMaterial({ color: new Color('hotpink'), transparent: true });
  if(object.type === 'Mesh' && object.__handlers){
    object.__handlers.click();
  }
}

function startXR(renderer, onSessionStarted){
  const currentSession = renderer.xr.getSession();
  if ( currentSession === null ) {
    // WebXR's requestReferenceSpace only works if the corresponding feature
    // was requested at session creation time. For simplicity, just ask for
    // the interesting ones as optional features, but be aware that the
    // requestReferenceSpace call will fail if it turns out to be unavailable.
    // ('local' is always available for immersive sessions and doesn't need to
    // be requested separately.)

    var sessionInit = { optionalFeatures: [ 'local-floor', 'bounded-floor' ] };
    navigator.xr.requestSession( 'immersive-vr', sessionInit ).then(session => onSessionStarted(session, renderer));
  } 
  else {
    currentSession.end();
  }
}

export {
  getControllerPose,
  moveInDirection,
  renderControllerRay,
  drawSphericalReticule,
  getClosestIntersected,
  handleClickedObject,

  startXR,
}