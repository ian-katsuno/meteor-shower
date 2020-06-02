import React, {useEffect } from 'react';
import { Canvas, Dom } from 'react-three-fiber';

// import Meteors from './components/Meteors';
// import Plane from './components/Plane';
// import Sphere from './components/Sphere';
import Controls from './components/Controls';
import Effects from './components/Effects';
import VRButton from './components/VRButton';
import './styles/styles.scss'
import OrientationControls from './components/OrientationControls';
import VrGamePad from './components/VrGamePad';
// import Triangle from './components/Triangle';
// import Avocado from './components/Avocado';
// import Chair from './components/Chair';
// import FlightHelmet from './components/FlightHelmet';
// import Menu from './components/Menu';
// import AnimatedTriangle from './components/AnimatedTriangle';
// import Fox from './components/Fox'
// import RockyPlanet from './components/RockyPlanet';
// import RingPlanet from './components/RingPlanet';
import StereoPano from './components/StereoPano';
import ViewMaster from './components/ViewMaster';

import {
  Vector3
} from 'three';

// function orbitAnimation(ref){
//   ref.current.position.z = ref.current.position.z + 2;
//   ref.current.position.y = ref.current.position.y + 1;
// }

function App() {
  return (
    <>
      <Canvas invalidateFrameloop vr={true}>
        <React.Suspense fallback={null}>
          {/* <Triangle 
            position={new Vector3(0, 0, -5)}
            scale={new Vector3(4, 4, 4)}
          /> */}
          {/* <Avocado
            position={new Vector3(0, 0, 4)}
            scale={new Vector3(4, 4, 4)}
            normal={true}
          /> */}
          {/* <AnimatedTriangle 
            position={[0, 0, -10]}
          /> */}
          {/* <FlightHelmet
            position={[0, -0.5, 3.5]}
          /> */}
          {/* <Menu

          /> */}
          {/* <Fox 
            position={[10, -10, -50]}
            scale={[0.3, 0.3, 0.3]}
          /> */}

          {/* <RockyPlanet 
            position={[0, 0, -80]}
          /> */}
          {/* <RingPlanet 
            position={[0, 0, -200]}
            scale={[0.1, 0.1, 0.1]}
          /> */}
          {/* <Chair 
            position={[0, 0, 2]}
          /> */}

          <ViewMaster />
        </React.Suspense>


        {/* <StereoPano /> */}
        <VrGamePad />
        <Effects />
        <VRButton />
        <ambientLight />
        {/* <Sphere 
          src={'/textures/overunder/chess-pano-4k-stereo.jpg'}
          radius={500}
          /> */}
        {/* <Sphere 
          src={'/textures/starry_background.jpg'}
          radius={500}
          /> */}
        {/* <Meteors /> */}
        {/*<perspectiveCamera 
          fov={45} 
          aspect={window.innerWidth/window.innerHeight} 
          near={0.1}
          far={1000}
          
        />*/}
        {/* <Sphere 
          name="near-planet"
          position={[20, 550, -550]}
          scale={[80, 80, 80]}
          src={"/textures/mercury.jpg"}
          frameAnimation={() => {}}
        /> */}
        <Controls />
        {/* <OrientationControls /> */}
        {/* <Plane 
          src="/textures/sand_ripples.jpg"
          position={[0, -20, 0]}
          rotation={[Math.PI/2, 0, 0]}
        /> */}
      </Canvas>
    </>
  );
}

export default App;
