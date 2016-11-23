(function (window, document, $){
	'use strict';

	console.log('run');

	var maxHeight = 650;
	var maxWidth = 1020;

	var isMobile = (function() { 
		if( navigator.userAgent.match(/Android/i)
		|| navigator.userAgent.match(/webOS/i)
		|| navigator.userAgent.match(/iPhone/i)
		|| navigator.userAgent.match(/iPad/i)
		|| navigator.userAgent.match(/iPod/i)
		|| navigator.userAgent.match(/BlackBerry/i)
		|| navigator.userAgent.match(/Windows Phone/i)
		){
			return true;
		} else {
			return false;
		}
	})();

	function scrollMeTo(){

		
		var $header = $('#header');
		
		$('.js-goto').on('click', function(e){
			var paddingTop = $header.hasClass('header--scrolled') ? $header.outerHeight() : 0;
			var $target = $(this.href.replace( /^.*\#/, '#' ) );
			
			if ($target.length === 1) {
				e.preventDefault();

				$('body,html').animate({ 
					scrollTop: $target.offset().top - paddingTop,
					easing: 'ease-in'
				}, 500);
			};
		});

	};

	function header(){
		var $header = $('header');


		function fix(){
			var scrollTop = $(window).scrollTop();
			var showPosition = 200;

			if ( scrollTop > 0 && scrollTop <= showPosition ){
				$header.addClass('header--hidden');
				$header.removeClass('header--scrolled');
			}else if ( scrollTop > showPosition ){
				$header.addClass('header--scrolled');
				$header.removeClass('header--hidden');
			}else{
				$header.removeClass('header--scrolled');
				$header.removeClass('header--hidden');
			}
		}
		fix();

		$(document).on('scroll', fix);
	}


	function menu(){
		var $menuHrefs = $('.menu__href');
		var $sections = $('.section');

		var winHeight = ( window.innerHeight || document.documentElement.clientHeight );

		function setActive(){						
			$sections.each(function(index, section){				
				var sectionId = $(this).attr('id');
				var rect = this.getBoundingClientRect();
				var rectTop = Math.round(rect.top);
				var rectBottom = Math.round(rect.bottom);

				if (rectTop <= 50 && rectBottom / 2 <= winHeight ){
					$menuHrefs.removeClass('active');
					$menuHrefs.filter('[href="#' + sectionId + '"]').addClass('active');
				}
			});
		}
		setActive();

		$(window).on('scroll', function(e){
			setActive();
		});

		$(window).on('resize', function(e){
			winHeight = ( window.innerHeight || document.documentElement.clientHeight );			
			setActive();
		});

	}

	/*
		submit form
	*/

	function form(){	

		var $successOpener = $('.js-succes-opener');
		var $errorOpener = $('.js-error-opener');

		$('form').each( function(){



			var $form = $(this);
			var $inputs = $form.find('.required');
			var $button = $form.find('button[type="submit"]');

			function validation(){
				var isValid = true;
				var errorClass = 'form__input--error';
				
				var $email = $inputs.filter('[name="email"]');

				function validateEmail(email) {
					var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
					return re.test(email);
				}

				$inputs.each(function(){
					var $this = $(this);
					if ($this.val().length === 0){
						$this.addClass(errorClass);
						isValid = false;
					}else{
						$this.removeClass(errorClass);
					}
				});

				if (!validateEmail($email.val())){
					isValid = false;
					$email.addClass(errorClass);
				}else{
					$email.removeClass(errorClass);
				}

				console.log(isValid);

				return isValid;
			}

			$inputs.on('keyup change', validation);
			
			$form.on('submit', function(e){

				e.preventDefault();

				if ( !validation() ){
					return false;
				}

				var form = e.target;

				$button.text('Отправка...');
				$button.attr('disabled', true);

				$.ajax({
					url: $form.attr('action'), 
				    method: 'POST',
				    data: $form.serialize(),
				    dataType: 'json',
				    success: function( response ) {
				    	console.log(response);
						$successOpener.click();
				    },
				    error: function(xhr, ajaxOptions, error){
				    	console.log('Data could not be saved.' + error.message);
						$errorOpener.click();
				    },
				    complete: function(){					    	
						$button.attr('disabled', false).text('Отправить');	
						console.log($successOpener);
				    }
				});				
				
				

			});
		});

	}

	function accordion(){
		var $accordion = $('.js-accordion');
		var $accordionHref = $accordion.find('.js-accordion-href');
		var $accordionContent = $accordion.find('.js-accordion-content');

		$accordionContent.not(':first').hide();

		$accordionHref.on('click', function(e){
			e.preventDefault();

			var $this = $(this);

			var $content = $this.parents('.js-accordion-item').find('.js-accordion-content');

			$accordionContent.not($content).slideUp();
			$content.slideDown();
		});
	}

	function slider(){
		var $slider = $('#slider');
		
		$slider.bxSlider({
			pager: false,
			adaptiveHeight: true,
		});
	}

	function modal(){
		var scrollbar = $('.js-scrollbar').perfectScrollbar();
		var $html = $('.html');
		var $modals = $('.modal');
		var $modalClose = $('.js-modal-close');
		var $modalOpen = $('.js-modal-open');
		var $modalVideoOpen = $('.js-modal-video-open');

		var visibleClass = 'modal--visible';
		var htmlClass = 'html--modal';

		function show(id){			
			$html.addClass(htmlClass);
			$modals.filter(id).addClass(visibleClass);
			scrollbar.perfectScrollbar('update');
		}

		function hide(){
			$html.removeClass(htmlClass);
			$modals.removeClass(visibleClass);
		}

		$modalClose.on('click', function(e){	
			e.preventDefault();	

			if ($(e.target).hasClass('js-modal-close')){
				e.preventDefault();
				hide();
			}
		});

		$modalOpen.on('click', function(e){
			e.preventDefault();
			
			const id = $(this).attr('href');

			show(id);
		});

		$(window).on('resize', function(){
			scrollbar.perfectScrollbar('update');
		});

	}

	function init(){

		if (!isMobile){
			//header();
		}

		scrollMeTo();
		menu();
		form();
		accordion();
		slider();
		modal();
	}

	init();

})(window, document, jQuery, undefined);
