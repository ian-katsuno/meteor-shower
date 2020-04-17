
export default funciton VRButton({}){
  const styles = {
    position: 'absolute',
    bottom: '20px',
    padding: '12px 6px',
    border: '1px solid #fff',
    borderRadius: '4px',
    background: 'rgba(0,0,0,0.1)',
    color: '#fff',
    font: 'normal 13px sans-serif',
    textAlign: 'center',
    opacity: '0.5',
    outline: 'none',
    zIndex: '999'
  };

  if('xr' in navigator){
    return <div></div>
    return (
      <button
        style={styles}
        disabled={!supported}
      >
        {supported ? 'VR NOT SUPPORTED': 'ENTER VR'}
      </button>
    )
  }
  else{
    return (
      <a  
        href="https://immersiveweb.dev/"
        style={styles}
      >
       { (window.isSecureContext === false) ? "WEBXR NEEDS HTTPS" : "WEBXR NOT AVAILABLE"} 
      </a>
    )
  } 
}
