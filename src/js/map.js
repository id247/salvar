;(function(){


	ymaps.ready(function () {

		var address = $('#map').data('address');

		if (address !== '' ){


			var myGeocoder = ymaps.geocode(address, { results: 1 } ); // пытаюсь передать переменную 

			myGeocoder.then(
				function (res) {

		
					var place = res.geoObjects.get(0).geometry.getCoordinates();

					var myMap = new ymaps.Map('map', {
							center: place,
							zoom: 16,
							controls: ['zoomControl']
						});

					var position = myMap.getGlobalPixelCenter();
					myMap.setGlobalPixelCenter([ position[0] - 0, position[1] ]);

				  	myPlacemark = new ymaps.Placemark(
				  		place, 
				  		{ 
				  			hintContent: address
						},
						{	
							iconLayout: 'default#image',
		                    iconImageHref: 'assets/images/map-point.png', // картинка иконки
		                    iconImageSize: [28, 38], // размеры картинки
		                    //iconImageOffset: [-28, -19] // смещение картинки
	                    }
					);

					myMap.geoObjects.add(myPlacemark);

					myMap.behaviors
						// Отключаем часть включенных по умолчанию поведений:
						.disable(['scrollZoom']);


				},
	            function (err) {
	            	console.log ('no ok');
	            	console.log (err);
	                // обработка ошибки
	            }
	        );
		}
	});

}());
