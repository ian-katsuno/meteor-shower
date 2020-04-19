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

  onSessionStart,
  onSessionEnd,

  rayColor = 0xff11ff,
  activeRayColor =  0xaaffbb,

}){
  const [ session, setSession ] = useState();
  //const hovered = useRef();

  const { gl: renderer, scene } = useThree(),
    raycaster = useRef(),
    arrow = useRef(),
    reticule = useRef();

  useEffect(() => {
    if( options && options.referenceSpaceType ){
			renderer.xr.setReferenceSpaceType( options.referenceSpaceType );
    }
  }, [options, renderer]);


  useEffect(() => {
    // ref to the raycaster 
    raycaster.current = new Raycaster();
  }, []);


  const _onSessionStart = useCallback(( session, renderer ) => {

    setSession(session);
    renderer.xr.setSession( session );

    onSessionStart(session);
  }, [onSessionStart]);


  useEffect(() => {
    if(!session){
      return;
    }

    console.debug('onSelect callbacks registered')

    function _onSelectStart(e){
      console.log('_selectStart')
      onSelectStart(e)
    }

    function _onSelect(e){
      console.log('_onSelect')
      const intersected = getClosestIntersected(scene, raycaster.current, [arrow.current, reticule.current]);

      if(intersected && intersected.object.type === 'Mesh' && intersected.object.__handlers){
        intersected.object.__handlers.click();
      }

      onSelect(e, intersected, session);
    }

    function _onSelectEnd(e){
      console.log('_selectEnd');
      onSelectEnd(e);
    }

    session.addEventListener('selectstart', _onSelectStart);
    session.addEventListener('select', _onSelect);
    session.addEventListener('selectend', _onSelectEnd);

    return () => {
      if(session){
        console.debug('onSelect callbacks cleaned up');
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
      if(session){
        session.removeEventListener('end', _onSessionEnd)
        setSession(null);
      }
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
          button = createButton(true, isSupported, () => startXR(renderer, _onSessionStart));
      });
    }
    else{
      button = createButton(false, false)
    }
    return () => button.remove();
  },[renderer, _onSessionStart]);
 
 useFrame((time) => {

  const session = renderer.xr.getSession();

  if(session){

    // get the controller pose (position + orientation)
    const [ position, direction ] = getControllerPose(renderer.xr.getController(0));

    // render the controller ray    
    raycaster.current.set(position, direction);

    // determine
    const intersected = getClosestIntersected(scene, raycaster.current, [arrow.current, reticule.current]);

    // TODO: add pointerOver/pointerOut logic here
    /*
      - if we are intersecting a new thing from last time:
          - call the pointerOut for the item we are no longer on
          - call the user onPointerOut callback passed in here as a prop
      - update the hovered ref to point to our new thing we are pointing at
      - call the pointerOver callback if there is one for the currently intersected item
    if(intersected && intersected.object.__handlers){
      console.log(intersected.object.__handlers);
      if(intersected.object.__handlers.pointerOver){
        intersected.object.__handlers.pointerOver();
      }
    }
    */


    let distance = intersected ? intersected.distance : DEFAULT_RAY_DISTANCE;
    let rayDest = intersected ? intersected.point : moveInDirection(position, direction, distance);
    let buttonPressed = false;
    try{
      buttonPressed = session.inputSources[0].gamepad.buttons[0].pressed;
    }
    catch(err){
      console.warn('error accessint button');
      console.warn(err);
    }
    
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
  }
 }, 1);

 return null;
}