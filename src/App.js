import React, { useCallback, useState } from 'react';
import { Canvas } from 'react-three-fiber';

import Meteors from './components/Meteors';
import Plane from './components/Plane';
import Sphere from './components/Sphere';
import Controls from './components/Controls';

import './styles/styles.scss'

function App() {
  const [ controlsType, setControlsType ] = useState('drag');

  const magicWindowClick = useCallback(() => {
    if ( window.DeviceOrientationEvent !== undefined && typeof window.DeviceOrientationEvent.requestPermission === 'function' ) {
			window.DeviceOrientationEvent.requestPermission().then( function ( response ) {
				if ( response == 'granted' ) {
          setControlsType('deviceOrientation');
				}
			} ).catch( function ( error ) {
        alert("Can not enter magic window mode because user permission was not given.");
        console.error( 'THREE.DeviceOrientationControls: Unable to use DeviceOrientation API:', error );
      } );
    }
    else{
      alert('magic window not supported on this device');
    }
  },[setControlsType])

  return (
    <>
      <button 
        style={{
          position: 'fixed',
          top: '5vw',
          left: '5vw',
          zIndex: 10,
          color: 'black',
          background: 'white'
        }}
        onClick={magicWindowClick}
      >
        Magic Window
      </button>
      <Canvas invalidateFrameloop>
        <Sphere 
          src={"/textures/starry_background.jpg"} 
          radius={500}
          />
        <Meteors />
        {/*<perspectiveCamera 
          fov={45} 
          aspect={window.innerWidth/window.innerHeight} 
          near={0.1}
          far={1000}
          
        />*/}
        <Sphere 
          position={[20, 50, -30]}
        />
        <Controls type={controlsType}/>
        <Plane 
          src="/textures/sand_ripples.jpg"
          position={[0, -20, 0]}
          rotation={[Math.PI/2, 0, 0]}
        />
      </Canvas>
    </>
  );
}

export default App;
