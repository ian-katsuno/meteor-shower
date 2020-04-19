import { useEffect, useRef, useCallback, useState } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import { Raycaster } from 'three';
import { createButton } from '../lib/renderVRButton';
import { startXR } from '../lib/WebXRLib';

import { 
  getControllerPose,
  moveInDirection,
  renderControllerRay, 
  drawSphericalReticule,
  getClosestIntersected,
  handleClickedObject,
} from '../lib/WebXRLib';

const DEFAULT_RAY_DISTANCE = 200;

export default function WebXR({
  options,

  onSelectStart,
  onSelect,
  onSelectEnd,

  /*
    // TODO: add suport for these
  onPointerOver,
  onPointerOut, 
  */

  onSessionEnd,

  rayColor = 0xff11ff,
  activeRayColor =  0xaaffbb,

}){
  const [ session, setSession ] = useState();
  const hovered = useRef();

  const { gl: renderer, scene } = useThree(),
    raycaster = useRef(),
    arrow = useRef(),
    reticule = useRef();

  useEffect(() => {
    if( options && options.referenceSpaceType ){
			renderer.xr.setReferenceSpaceType( options.referenceSpaceType );
    }
  }, [options]);


  useEffect(() => {
    // ref to the raycaster 
    raycaster.current = new Raycaster();
  }, []);


  const onSessionStarted = useCallback(( session, renderer ) => {

    setSession(session);

    for(let source of session.inputSources){
      console.dir(source);
    }
    
    renderer.xr.setSession( session );
  }, [renderer, ]);


  useEffect(() => {
    if(!session){
      return;
    }

    function _onSelectStart(e){
      console.log('selectStart')
      onSelectStart(e)
    }

    function _onSelect(e){

      const intersected = getClosestIntersected(scene, raycaster.current, [arrow.current, reticule.current]);
      console.log('select');
      onSelect(e, intersected, session);
    }

    function _onSelectEnd(e){
      console.log('selectEnd');
      onSelectEnd(e);
    }

    return () => {
      if(session){
        session.removeEventListener('selectstart', _onSelectStart);
        session.removeEventListener('select', _onSelect);
        session.removeEventListener('selectend', _onSelectEnd);
      }
    }
  }, [session, onSelectStart, onSelect, onSelectEnd, scene, renderer]);

  useEffect(() => {
    if(!session){
      return;
    }

    function _onSessionEnd(e){
      console.log('WEBXR session ended');
      session.removeEventListener('end', _onSessionEnd)
      onSessionEnd(e);
    }
    session.addEventListener('end', _onSessionEnd);
    return () => void (session && session.removeEventListener('end', _onSessionEnd));
  }, [session, onSessionEnd]);


  // this block is responsible for creating the buton with the callback
  useEffect(() => {
    let button;

    // calling getController with a new id creates a controller at that ID
    renderer.xr.getController(0);

    if( 'xr' in navigator){
      navigator.xr.isSessionSupported( 'inline' )
        .then( function ( isSupported ) {
          button = createButton(true, isSupported, () => startXR(renderer, onSessionStarted));
      });
    }
    else{
      button = createButton(false, false)
    }
    return () => button.remove();
  },[renderer, onSessionStarted]);
 
 useFrame((time) => {

  const session = renderer.xr.getSession();

  if(session){

    // get the controller pose (position + orientation)
    const [ position, direction ] = getControllerPose(renderer.xr.getController(0));

    // render the controller ray    
    raycaster.current.set(position, direction);

    // determine
    const intersected = getClosestIntersected(scene, raycaster.current, [arrow.current, reticule.current]);

    let distance = intersected ? intersected.distance : DEFAULT_RAY_DISTANCE;
    let rayDest = intersected ? intersected.point : moveInDirection(position, direction, distance);
    let buttonPressed = session.inputSources[0].gamepad.buttons[0].pressed;
    
    reticule.current = drawSphericalReticule(
      scene, 
      rayDest, 
      reticule.current, 
      distance
    );

    renderControllerRay(
      scene, 
      arrow, 
      position, 
      direction, 
      distance, 
      buttonPressed ? activeRayColor : rayColor
    );

    if(buttonPressed && intersected){
      handleClickedObject(intersected.object);
    }
  }
 }, 1);

 return null;
}