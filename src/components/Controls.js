// import React, { useRef } from 'react';
// import { extend, useThree, useFrame } from 'react-three-fiber';
// import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';

// extend({ FirstPersonControls });

// export default function Controls(){
//   const controlsRef = useRef();
//   const {camera, gl } = useThree();
//   useFrame(() => controlsRef.current && controlsRef.current.update());
//   return (
//     <firstPersonControls
//       ref={controlsRef}
//       args={[camera, gl.domElement]}
//       enableRotate
//       enablePan={true}
//       maxDistance={100}
//       minDistance={5}
//       minPolarAngle={Math.PI / 6}
//       maxPolarAngle={Math.PI / 2}
//     />
//   );
// }


import React, { useRef } from 'react';
import { extend, useThree, useFrame} from 'react-three-fiber';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {FlyControls} from 'three/examples/jsm/controls/FlyControls';
import {DragControls} from '../lib/DragControls';
import {DeviceOrientationControls} from '../lib/DeviceOrientationControls';
extend({ 
  OrbitControls, 
  FlyControls, 
  DragControls,
  DeviceOrientationControls
});

function Controls({
  type = 'deviceOrientation'
}) {
  const controlsRef = useRef();
  const { camera, gl } = useThree();

  useFrame(() => controlsRef.current && controlsRef.current.update(1));

  switch(type){
    case 'fly':
      console.log('returning fly controls')
      return (
        <flyControls
          ref={controlsRef}
          args={[camera, gl.domElement]}
          dragToLook={true}
        />
      );
    case 'orbit': default:
      console.log('returning orbit');
      return (
        <orbitControls
          ref={controlsRef}
          args={[camera, gl.domElement]}
          enableRotate
          enablePan={false}
          maxDistance={0}
          minDistance={1}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2}
        />
      );
    case 'drag':
      return (
        <dragControls
          ref={controlsRef}
          args={[camera, gl.domElement]}
        />
      )
    case 'deviceOrientation':
      return (
        <deviceOrientationControls
          ref={controlsRef}
          args={[camera]}
        />
      )
  }

}

export default Controls;
