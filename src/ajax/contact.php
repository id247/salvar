<?php
	$mailto = 'info@salvar-bankrot.ru';

	date_default_timezone_set( 'Europe/Moscow' );

	if ( empty( $_POST ) ){         
		die('Ошибка'); 
	}

	$d = array();
	foreach( $_POST as $key => $value ){
		$d[$key] = empty( $_POST[$key] ) ? '' : htmlspecialchars( @$_POST[$key] );
	}
	$now = date('d.m.Y, H:i');


	$headers = <<<TEXT
From: robot@{$_SERVER['HTTP_HOST']}
Reply-To: robot@{$_SERVER['HTTP_HOST']}
MIME-Version: 1.0
Content-Type: text/html;charset=utf-8
TEXT;
	$mail = <<<HTML
Привет!
<br />
<br />У вас новый лид [{$d['type']}]:
<br />
<br />Имя: <strong>{$d['name']}</strong>
<br />Телефон: <strong>{$d['phone']}</strong>
<br />email: <strong>{$d['email']}</strong>
<br />Собщение: <strong>{$d['message']}</strong>
<br />
<br />Сейчас: <strong>$now</strong>
<br />
<br />--
<br />С уважением,
<br />ваш лендинг-робот.
HTML;

//<br />referer: <strong>{$d['referer']}</strong>
//<br />Источник: <strong>{$d['crawler']}</strong>
//<br />Запрос: <strong>{$d['query']}</strong>

	if ( mail($mailto, 'Новая заявка c ' . $_SERVER['HTTP_HOST'] . ': '.$d['type'], $mail, $headers ) ){

		echo '["res":"Ваш запрос отправлен! Спасибо! Наши менеджеры свяжутся с вами в ближайшее время"]';

	}else{

		echo '["res":"Ошибка отправки"]';

	}
