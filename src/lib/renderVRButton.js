function disableButton(button) {

  button.style.display = '';

  button.style.cursor = 'auto';
  button.style.left = 'calc(50% - 75px)';
  button.style.width = '150px';

  button.onmouseenter = null;
  button.onmouseleave = null;

  button.onclick = null;
}

function stylizeElement( element ) {

  element.style.position = 'absolute';
  element.style.bottom = '20px';
  element.style.padding = '12px 6px';
  element.style.border = '1px solid #fff';
  element.style.borderRadius = '4px';
  element.style.background = 'rgba(0,0,0,0.1)';
  element.style.color = '#fff';
  element.style.font = 'normal 13px sans-serif';
  element.style.textAlign = 'center';
  element.style.opacity = '0.5';
  element.style.outline = 'none';
  element.style.zIndex = '999';
}

function showWebXRNotFound(button) {

  disableButton(button);
  button.textContent = 'VR NOT SUPPORTED';
}

function createButton(xrSupported, inlineSupported, onClick){

  const element = document.createElement(xrSupported ? 'button' : 'a');

  stylizeElement(element);

  if(xrSupported){

    element.style.display = 'none';

    if(!inlineSupported){
      disableButton(element);
      element.textContent = 'VR NOT SUPPORTED';
    }
    else{
      element.style.display = '';

      element.style.cursor = 'pointer';
      element.style.left = 'calc(50% - 50px)';
      element.style.width = '100px';

      element.textContent = 'ENTER VR';

      element.onmouseenter = function () {
        element.style.opacity = '1.0';
      };

      element.onmouseleave = function () {
        element.style.opacity = '0.5';
      };

      element.onclick = (e) => {
        element.textContent = "EXIT VR";
        onClick(e);
      }
    } 
  }
  else{

    element.href = 'https://immersiveweb.dev/';

    if ( window.isSecureContext === false ) {
      element.innerHTML = 'WEBXR NEEDS HTTPS'; // TODO Improve message
    } else {
      element.innerHTML = 'WEBXR NOT AVAILABLE';
    }

    element.style.left = 'calc(50% - 90px)';
    element.style.width = '180px';
    element.style.textDecoration = 'none';
  }
  document.body.appendChild(element);
}

export {
  stylizeElement,
  disableButton,
  showWebXRNotFound,
  createButton,
}