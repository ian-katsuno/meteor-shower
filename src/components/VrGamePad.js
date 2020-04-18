import { useEffect, useRef } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import { Raycaster } from 'three';
import { createButton } from '../lib/renderVRButton';
import { startXR } from '../lib/WebXR';

import { 
  getControllerPose,
  moveInDirection,
  renderControllerRay, 
  drawSphericalReticule,
  getClosestIntersected,
  handleClickedObject,
} from '../lib/WebXR';

export default function VrGamePad({
  options
}){

  const { gl: renderer, scene } = useThree(),
    raycaster = useRef(),
    arrow = useRef(),
    reticule = useRef();

  useEffect(() => {
    if( options && options.referenceSpaceType ){
			renderer.xr.setReferenceSpaceType( options.referenceSpaceType );
    }

    // calling getController with a new id creates a controller at that ID
    renderer.xr.getController(0);

    // ref to the raycaster 
    raycaster.current = new Raycaster();

    if( 'xr' in navigator){
      navigator.xr.isSessionSupported( 'inline' )
        .then( function ( isSupported ) {
          createButton(true, isSupported, () => startXR(renderer));
      });
    }
    else{
      createButton(false, false)
    }
  },[options, renderer]);
 
 useFrame((time) => {
  const session = renderer.xr.getSession();
  if(session){

    // get the controller because we need to get the pose (position + orientation)
    const [ position, direction ] = getControllerPose(renderer.xr.getController(0));

    // render the controller ray    
    raycaster.current.set(position, direction);

    const intersected = getClosestIntersected(scene, raycaster.current, [arrow.current, reticule.current]);

    let distance = intersected ? intersected.distance : 200;
    let rayDest = intersected ? intersected.point : moveInDirection(position, direction, distance);
    let rayColor = 0xff11ff;


    if(session.inputSources[0].gamepad.buttons[0].pressed){
      rayColor = 0xaaffbb;
      if(intersected){    
        handleClickedObject(intersected.object);
      }
    }   
    reticule.current = drawSphericalReticule(scene, rayDest, reticule.current, distance);
    renderControllerRay(scene, arrow, position, direction, distance, rayColor);

}
 }, 1);

 return null;
}