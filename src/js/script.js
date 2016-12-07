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

	function home(){
		$('#home').addClass('home--fullheight');
	}

	function header(){
		var $header = $('header');


		function fix(){
			var scrollTop = $(window).scrollTop();
			var showPosition = 400;

			if ( scrollTop > 200 && scrollTop <= showPosition ){
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
		var $header = $('#header');

		var winHeight = ( window.innerHeight || document.documentElement.clientHeight );

		function setActive(){						
			$sections.each(function(index, section){				
				var sectionId = $(this).attr('id');
				var rect = this.getBoundingClientRect();
				var rectTop = Math.round(rect.top);
				var rectBottom = Math.round(rect.bottom);

				if (rectTop <= $header.outerHeight() + 10  ){
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
		var errorClass = 'form__input--error';

		function validateEmail(email) {
			var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(email);
		}

		function validate(){

			var isValid = true;
			var $this = $(this);

			if ($this.val().length === 0){
				isValid = false;
				$this.addClass(errorClass);
			}else{
				$this.removeClass(errorClass);
			}

			if ($this.attr('type') === 'email' && !validateEmail($this.val())){
				isValid = false;
				$this.addClass(errorClass);
			}

			return isValid;
		}

		function validation($inputs){
			var isValid = true;
			
			$inputs.each(function(){
				isValid = validate.call(this);
			});

			return isValid;
		}

		$('form').each( function(){

			var $form = $(this);
			var $inputs = $form.find('.required');
			var $button = $form.find('button[type="submit"]');

			$inputs.on('keyup change', validate);
			
			$form.on('submit', function(e){

				e.preventDefault();

				if ( !validation($inputs) ){
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
			
			var id = $(this).attr('href');

			show(id);
		});

		$(window).on('resize', function(){
			scrollbar.perfectScrollbar('update');
		});

	}

	function cut(){
		var $cutContents = $('.js-cut-content');
		var $cutOpener = $('.js-cut-opener');

		$cutContents.addClass('cut__content--invisible');

		$cutOpener.on('click', function(e){
			e.preventDefault();

			var $this = $(this);
			var $content = $this.closest('.js-cut').find('.js-cut-content');
			var $sliderViewport = $this.closest('.bx-viewport');
			var $sliderSlide = $this.closest('.people-item');

			if ($content.hasClass('cut__content--invisible')){
				$content.removeClass('cut__content--invisible');
				$sliderViewport.css('height', $sliderSlide.outerHeight());
				$this.text('Скрыть');
			}else{
				$content.addClass('cut__content--invisible');
				$sliderViewport.css('height', $sliderSlide.outerHeight());
				$this.text('Подробнее');
			}
			
		})
	}

	function wow(){
		new WOW().init();
	}

	function init(){

		if (!isMobile){
			home();
			header();
			wow();
		}

		scrollMeTo();
		menu();
		form();
		cut();
		accordion();
		slider();
		modal();
	}

	init();

})(window, document, jQuery, undefined);
