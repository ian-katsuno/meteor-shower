import {
  Vector2,
  Vector3,
} from 'three';

function ClampToRange(value, min, max){
  return Math.min(Math.max(value, min), max);
}

function getEventCoords(event){
  if(event.touches){
      return new Vector2(event.touches[0].pageX, event.touches[0].pageY);
  }
  else{
    return new Vector2(event.pageX, event.pageY);
  }
}

export const DragControls = function(camera, domElement){
  this.object = camera;
  this.object.rotation.order = "YXZ";
  this.domElement = domElement;

  //api
  this.rotationSpeed = 0.0001;
  this.alphaMax = Math.PI/2*0.25;
  this.alphaMin = -Math.PI/2*0.25;

  // internals
  this.mouseStart = new Vector2(0, 0);
  this.mouseCurrent = new Vector2(0, 0);
  this.rotationVector = new Vector3();
  this.rotationVector.copy(camera.rotation);
  console.log(this.rotationVector);

	function bind( scope, fn ) {
		return function () {
			fn.apply( scope, arguments );
		};
	}

	function contextmenu( event ) {
		event.preventDefault();
	}

  this.mousedown = function(event){
    try{
      event.preventDefault();
      event.stopPropagation();

      this.mouseDown = true;

      // save the starting mouse coordinates
      const container = this.getContainerDimensions();
      const coords = getEventCoords(event);
      const xStart = coords.x - container.offset[0];
      const yStart = coords.y - container.offset[1];
      
      this.mouseStart.set(xStart, yStart);

    }
    catch(err){
      alert(JSON.stringify(err));
    }
  }

  this.mousemove = function(event){
    event.preventDefault();
    event.stopPropagation();
    try{
      if(this.mouseDown){
        const container = this.getContainerDimensions();

        const coords = getEventCoords(event);
        const currentX = coords.x - container.offset[0];
        const currentY = coords.y - container.offset[1];

        const distanceX = currentX - this.mouseStart.x;
        const distanceY = currentY - this.mouseStart.y;

        this.rotationVector.x += distanceY*this.rotationSpeed;
        this.rotationVector.x = ClampToRange(this.rotationVector.x, this.alphaMin, this.alphaMax);
        this.rotationVector.y += distanceX*this.rotationSpeed;
        this.rotationVector.z = 0;
      }
    }
    catch(err){
      alert(JSON.stringify(err));
    }
  }

  this.mouseup = function(event){
    this.mouseDown = false;
  }

  this.update = function(){
     this.object.rotation.y = this.rotationVector.y;
     this.object.rotation.x = this.rotationVector.x;
  }

  this.dispose = function () {

    this.domElement.removeEventListener( 'contextmenu', contextmenu, false );
    this.domElement.removeEventListener( 'mousedown', _mousedown, false );
    this.domElement.removeEventListener( 'mousemove', _mousemove, false );
    this.domElement.removeEventListener( 'mouseup', _mouseup, false );

    this.domElement.removeEventListener( 'touchstart', _mousedown, false);
    this.domElement.removeEventListener( 'touchmove', _mousemove, false);
    this.domElement.removeEventListener( 'touchend', _mouseup, false);
  };

 	this.getContainerDimensions = function () {
		if ( this.domElement != document ) {
			return {
				size: [ this.domElement.offsetWidth, this.domElement.offsetHeight ],
				offset: [ this.domElement.offsetLeft, this.domElement.offsetTop ]
			};
		} else {
			return {
				size: [ window.innerWidth, window.innerHeight ],
				offset: [ 0, 0 ]
			};
		}
  }; 

	var _mousemove = bind( this, this.mousemove );
	var _mousedown = bind( this, this.mousedown );
	var _mouseup = bind( this, this.mouseup );

	this.domElement.addEventListener( 'contextmenu', contextmenu, false );

  this.domElement.addEventListener( 'mousemove', _mousemove, false );
	this.domElement.addEventListener( 'mousedown', _mousedown, false );
  this.domElement.addEventListener( 'mouseup', _mouseup, false );

  this.domElement.addEventListener( 'touchstart', _mousedown, false);
  this.domElement.addEventListener( 'touchmove', _mousemove, false);
  this.domElement.addEventListener( 'touchend', _mouseup, false);
}