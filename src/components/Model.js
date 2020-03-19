import React, {useState, useMemo} from 'react';
import * as THREE from 'three';
//import { OBJLoader } from 'three/src/loaders/OBJLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

export default function Model({ url, position }) {
  const [obj, set] = useState()
  useMemo(() => new OBJLoader()
                  .load(url, set), [url])
                  .setMaterials()
  return obj ? <primitive object={obj} position={position} /> : null
}