import React, { useRef} from 'react';
import { extend, useThree, useFrame} from 'react-three-fiber';
import {DeviceOrientationControls} from '../lib/DeviceOrientationControls.js';

extend({ DeviceOrientationControls });

function OrientationControls() {
  const controlsRef = useRef();
  const { camera, gl } = useThree();

  useFrame(() => controlsRef.current && controlsRef.current.update());

  return (
    <deviceOrientationControls
      ref={controlsRef}
      args={[camera]}
    />
  );
}

export default OrientationControls;