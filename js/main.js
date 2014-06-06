
	'use strict';
  		
  		var btn,
  			change;


  		change = function() {
  			var img,
  				bg,
  				i,
  				sheet,
  				css;

  			css = document.styleSheets;
  			img = document.querySelector(".photo img");

  			// Catch the element
  			for(i = 0; i < css.length; i++) {
  				if( css[i].href == "http://" + document.location.hostname + ":" + document.location.port + "/css/main.css" || css[i].href == "http://" + document.location.hostname + "/css/main.css") {
  					sheet = css[i];
  				}
  			}

  			sheet.insertRule("body { background: url('../img/beach.jpg') !important; background-size: cover !important;}", 1);

  			img.setAttribute('src', "img/matheuslcbeachsmall.jpg");


  		};

    



	


