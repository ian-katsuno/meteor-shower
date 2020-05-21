import React, { useMemo } from 'react';
import { extend } from 'react-three-fiber';
import ThreeMeshUI from 'three-mesh-ui';
import {
  Group,
  Vector3,
  Euler,
  MeshBasicMaterial,
} from 'three';

extend({
  Group,
  Block: ThreeMeshUI.Block,
})

export default function Menu({

}){
  const block = useMemo(() => {
    const container = ThreeMeshUI.Block({
      height: 1.5,
      width: 1
    })
    container.set({
      fontFamily: 'fonts/helvetika.typeface.json'
    });
    const textBlock = ThreeMeshUI.Block({
      height: 0.4,
      width: 0.8,
      margin: 0.05, // like in CSS, horizontal and vertical distance from neighbour
      offset: 0.1 // distance separating the inner block from its parent
    });
    const text = new ThreeMeshUI.Text({
      content: 'This is a cool ui menu by ian',
      fontMaterial: new MeshBasicMaterial({ color: 0xefffe8 })
    });
    textBlock.appendChild(text)
    container.appendChild(textBlock)
    return container.threeOBJ;
  }, []);

  return (
    <group
      position={new Vector3(0, 1, 1.8)}
      rotation={new Euler(0, 0, 0)}
    >
      <scene>
        <primitive object={block} />
      </scene>
    </group>
  );
}