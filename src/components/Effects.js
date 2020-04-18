import React, {useEffect, useRef} from 'react';
import { extend, useFrame, useThree } from 'react-three-fiber'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass'
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
//import { HorizontalBlurShader  } from 'three/examples/jsm/shaders/HorizontalBlurShader';
//import { VerticalBlurShader  } from 'three/examples/jsm/shaders/VerticalBlurShader';
// Makes these objects available as native objects "<renderPass />" and so on

extend({ EffectComposer, RenderPass, GlitchPass, BloomPass, ShaderPass });

export default function Effects({ factor }) {
  const { gl, scene, camera, size } = useThree()
  const composer = useRef()
  useEffect(() => void composer.current.setSize(size.width, size.height), [size])
  // This takes over as the main render-loop (when 2nd arg is set to true)
  useFrame(() => {
    composer.current.render()
  }, 1);
  return (
    <effectComposer ref={composer} args={[gl]}>
      <renderPass attachArray="passes" args={[scene, camera]} renderToScreen/>
      {/* <shaderPass attachArray="passes" args={[
        HorizontalBlurShader
      ]} />
      <shaderPass attachArray="passes" args={[
        VerticalBlurShader
      ]} /> */}
      {/* <bloomPass attachArray="passes" args={[
            1,    // strength
            25,   // kernel size
            4,    // sigma ?
            256,  // blur render target resolution
      ]} renderToScreen /> */}
      {/* <glitchPass attachArray="passes" factor={factor} renderToScreen /> */}
    </effectComposer>
  )
}