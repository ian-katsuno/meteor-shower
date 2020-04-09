import React from 'react';
import { Canvas } from 'react-three-fiber';

import Meteors from './components/Meteors';
import Plane from './components/Plane';
import Sphere from './components/Sphere';
import Controls from './components/Controls';

import './styles/styles.scss'

function App() {
  return (
    <>
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
        <Controls />
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
