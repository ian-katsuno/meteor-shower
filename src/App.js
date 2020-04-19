import React from 'react';
import { Canvas } from 'react-three-fiber';

import Meteors from './components/Meteors';
import Plane from './components/Plane';
import Sphere from './components/Sphere';
//import Controls from './components/Controls';
import Effects from './components/Effects';
//import VRButton from './components/VRButton';
import './styles/styles.scss'
import OrientationControls from './components/OrientationControls';
import WebXR from './components/WebXR';

import { MeshBasicMaterial, Color } from 'three';

function orbitAnimation(ref){
  ref.current.position.z = ref.current.position.z + 2;
  ref.current.position.y = ref.current.position.y + 1;
}

function App() {
  return (
    <>
      <h1 style={{color: 'white', position: 'fixed'}}>SPACESCAPE</h1>
      <Canvas invalidateFrameloop vr={true}>
        <WebXR 
          onSessionStart={(session) => console.debug('user onSessionStart called')}
          onSessionEnd={() => console.debug('user onSessionEnd called')}
    
          onSelect={(e, intersected, session) => {
            console.debug('user onSelect called');

            if(intersected){
              intersected.object.material = new MeshBasicMaterial({ color: new Color('hotpink'), transparent: true });
            }
          }}
          onSelectStart={() => console.debug('user onSelectStart called')}
          onSelectEnd={() => console.debug('user onSelectend called')}

          rayColor={0x76D7C4}
          activeRayColor={0x5DADE2}
        />
        <Effects />
        {/* <VRButton /> */}
        <ambientLight />
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
          name="near-planet"
          position={[20, 550, -550]}
          scale={[80, 80, 80]}
          src={"/textures/mercury.jpg"}
          frameAnimation={orbitAnimation}
        />
        {/* <Controls /> */}
        <OrientationControls />
        <Plane 
          src="/textures/sand_ripples.jpg"
          position={[0, -20, 0]}
          rotation={[Math.PI/2, 0, 0]}
          onPointerOver={(e) => console.log('user onPointerOver called')}
          onPointerOut={(e) => console.log("user onPointerOut called")}
        />
      </Canvas>
    </>
  );
}

export default App;
