
	'use strict';
  		
  		var btn,
  			  change,
          items;

        items = [
           {
              bg: '#2980b9',
              img: 'matheuslcflatsmall.jpg'
           },

           {
              bg: 'url(../img/beach.jpg)',
              img: 'matheuslcbeachsmall.jpg'
           }
        ];

       var randomize = function (firstvalue, secondvalue) {
                var min = 0,
                    max = 0;

                // Check min a max value
                if (firstvalue > secondvalue) {
                    max = firstvalue;
                    min = secondvalue;
                } else {
                    max = secondvalue;
                    min = firstvalue;
                };

                // Check if it's a decimal or integer number
                if ((max % 1 === 0) && (min % 1 === 0)) {
                    return Math.floor(Math.random()*(max-min+1)+min);
                } else {
                    return (Math.random() * (max-min)+min).toFixed(2);
                };
};


  		change = function() {
  			var img,
  				  bg,
  				  i,
            n,
  				  sheet,
  				  css;

  			css = document.querySelector('body');
  			img = document.querySelector(".photo img");

  			// Catch the element
  			for(i = 0; i < css.length; i++) {
  				if( css[i].href == "http://" + document.location.hostname + ":" + document.location.port + "/css/main.css" || css[i].href == "http://" + document.location.hostname + "/css/main.css") {
  					sheet = css[i];
  				}
  			}

        n = randomize(0, items.length - 1);

        css.style.background = items[n].bg;
        css.style.backgroundSize = "cover";
        img.setAttribute('src', "img/" + items[n].img);

  		};

    



	


