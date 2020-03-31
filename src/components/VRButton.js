import React, { useEffect } from 'react';
import { VRButton as vrButton } from '../lib/VRButton';
import { useThree } from 'react-three-fiber';

export default function VRButton({

}){
  const { gl }  = useThree();
  useEffect(() => {
    document.body.appendChild( vrButton.createButton( gl ) );
  }, []) ;
  return null;
}

