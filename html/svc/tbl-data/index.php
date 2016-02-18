<?php
header('Content-type: application/json');
$rows = 
	array(
		array( 'ID' => 'yyy1', 'Name' => array( "Prod A", "A" ), 'Rating' => '3', 'Status' => 'false', 'ProductPage' => 'http://bla/yyy.pdf', 'descr' => 'Blah blub bubber.', 'Picture' => 'img/x02.png', 'ZoomImg'=>'img/tst.jpg' ),
		array( 'ID' => 'yyy3', 'Name' => array( "Prod B", "A" ), 'Rating' => '2', 'Status' => 'true', 'ProductPage' => 'http://bla/yyy.pdf', 'descr' => 'Blah blub bubber.', 'Picture' => 'img/x03.png', 'ZoomImg'=>'img/tst.jpg' ),
		array( 'ID' => 'yyy4', 'Name' => array( "Prod C", "A" ), 'Rating' => '2', 'Status' => 'true', 'ProductPage' => 'http://bla/yyy.pdf', 'descr' => 'Blah blub bubber.', 'Picture' => 'img/x04.png', 'ZoomImg'=>'img/tst.jpg' ),
		array( 'ID' => 'yyy5', 'Name' => array( "Prod D", "A" ), 'Rating' => '2', 'Status' => 'true', 'ProductPage' => 'http://bla/yyy.pdf', 'descr' => 'Blah blub bubber.', 'Picture' => 'img/x05.png', 'ZoomImg'=>'img/tst.jpg' ),
		array( 'ID' => 'yyy6', 'Name' => array( "Prod E", "A" ), 'Rating' => '1', 'Status' => 'false', 'ProductPage' => 'http://bla/yyy.pdf', 'descr' => 'Blah blub bubber.', 'Picture' => 'img/x06.png', 'ZoomImg'=>'img/tst.jpg' ),
		array( 'ID' => 'yyy7', 'Name' => array( "Prod F", "A" ), 'Rating' => '2', 'Status' => 'false', 'ProductPage' => 'http://bla/yyy.pdf', 'descr' => 'Blah blub bubber.', 'Picture' => 'img/x07.png', 'ZoomImg'=>'img/tst.jpg' ),
		array( 'ID' => 'yyy8', 'Name' => array( "Prod G", "A" ), 'Rating' => '2', 'Status' => 'true', 'ProductPage' => 'http://bla/yyy.pdf', 'descr' => 'Blah blub bubber.', 'Picture' => 'img/x08.png', 'ZoomImg'=>'img/tst.jpg' ),
		array( 'ID' => 'yyy9', 'Name' => array( "Prod G", "A" ), 'Rating' => '2', 'Status' => 'true', 'ProductPage' => 'http://bla/yyy.pdf', 'descr' => 'Blah blub bubber.', 'Picture' => 'img/x09.png', 'ZoomImg'=>'img/tst.jpg' ),
		array( 'ID' => 'yy10', 'Name' => array( "Prod I", "A" ), 'Rating' => '3', 'Status' => 'true', 'ProductPage' => 'http://bla/yyy.pdf', 'descr' => 'Blah blub bubber.', 'Picture' => 'img/x10.png', 'ZoomImg'=>'img/tst.jpg' ),
		array( 'ID' => 'yy11', 'Name' => array( "Prod J", "A" ), 'Rating' => '3', 'Status' => 'true', 'ProductPage' => 'http://bla/yyy.pdf', 'descr' => 'Blah blub bubber.', 'Picture' => 'img/x11.png', 'ZoomImg'=>'img/tst.jpg' ),
		array( 'ID' => 'yy12', 'Name' => array( "Prod K", "A" ), 'Rating' => '2', 'Status' => 'true', 'ProductPage' => 'http://bla/yyy.pdf', 'descr' => 'Blah blub bubber.', 'Picture' => 'img/x12.png', 'ZoomImg'=>'img/tst.jpg' ),
		array( 'ID' => 'yy13', 'Name' => array( "Prod L", "A" ), 'Rating' => '2', 'Status' => 'true', 'ProductPage' => 'http://bla/yyy.pdf', 'descr' => 'Blah blub bubber.', 'Picture' => 'img/x13.png', 'ZoomImg'=>'img/tst.jpg' ),
		array( 'ID' => 'yy14', 'Name' => array( "Prod M", "A" ), 'Rating' => '2', 'Status' => 'true', 'ProductPage' => 'http://bla/yyy.pdf', 'descr' => 'Blah blub bubber.', 'Picture' => 'img/x14.png', 'ZoomImg'=>'img/tst.jpg' ),
		array( 'ID' => 'yy15', 'Name' => array( "Prod N", "A" ), 'Rating' => '2', 'Status' => 'true', 'ProductPage' => 'http://bla/yyy.pdf', 'descr' => 'Blah blub bubber.', 'Picture' => 'img/x15.png', 'ZoomImg'=>'img/tst.jpg' ),
	);

echo json_encode( $rows );
?>

