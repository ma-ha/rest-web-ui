<?php
header('Content-type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	echo json_encode( array() );
} else {
	$rows = 
		array(
			array( 'ID' => 'yyy7', 'Created' => '1481483418', 'Name' => array( "Prod F", "A" ), 'Rating' => '2', 'Status' => 'false', 'ProductPage' => 'http://mh-svr.de/pong_dev/README.md', 'descr' => 'Blah blub bubber.', 'Picture' => 'img/p07w.png', 'ZoomImg'=>'img/p07.jpg' ),
			array( 'ID' => 'yy01', 'Created' => '1471610061', 'Name' => array( "Prod N", "A" ), 'Rating' => '2', 'Status' => 'true',  'ProductPage' => 'http://mh-svr.de/pong_dev/README.md', 'descr' => 'Blah blub bubber.', 'Picture' => 'img/p01w.png', 'ZoomImg'=>'img/p01.jpg' ),
			array( 'ID' => 'yyy2', 'Created' => '1461610061', 'Name' => array( "Prod B", "A" ), 'Rating' => '2', 'Status' => 'true',  'ProductPage' => 'http://mh-svr.de/pong_dev/README.md', 'descr' => 'Blah blub bubber.', 'Picture' => 'img/p02w.png', 'ZoomImg'=>'img/p02.jpg' ),
			array( 'ID' => 'yyy3', 'Created' => '1451610061', 'Name' => array( "Prod B", "A" ), 'Rating' => '2', 'Status' => 'true',  'ProductPage' => 'http://mh-svr.de/pong_dev/README.md', 'descr' => 'Blah blub bubber.', 'Picture' => 'img/p03w.png', 'ZoomImg'=>'img/p03.jpg' ),
			array( 'ID' => 'yy04', 'Created' => '1441610061', 'Name' => array( "Prod N", "A" ), 'Rating' => '2', 'Status' => 'true',  'ProductPage' => 'http://mh-svr.de/pong_dev/README.md', 'descr' => 'Blah blub bubber.', 'Picture' => 'img/p04w.png', 'ZoomImg'=>'img/p04.jpg' ),
			array( 'ID' => 'yyy5', 'Created' => '1431610061', 'Name' => array( "Prod D", "A" ), 'Rating' => '2', 'Status' => 'true',  'ProductPage' => 'http://mh-svr.de/pong_dev/README.md', 'descr' => 'Blah blub bubber.', 'Picture' => 'img/p05w.png', 'ZoomImg'=>'img/p05.jpg' ),
			array( 'ID' => 'yyy6', 'Created' => '1421610061', 'Name' => array( "Prod E", "A" ), 'Rating' => '1', 'Status' => 'false', 'ProductPage' => 'http://mh-svr.de/pong_dev/README.md', 'descr' => 'Blah blub bubber.', 'Picture' => 'img/p06w.png', 'ZoomImg'=>'img/p06.jpg' ),
			array( 'ID' => 'yyy9', 'Created' => '1411610061', 'Name' => array( "Prod G", "A" ), 'Rating' => '2', 'Status' => 'true',  'ProductPage' => 'http://mh-svr.de/pong_dev/README.md', 'descr' => 'Blah blub bubber.', 'Picture' => 'img/p09w.png', 'ZoomImg'=>'img/p09.jpg' ),
			array( 'ID' => 'yyy8', 'Created' => '1401610061', 'Name' => array( "Prod G", "A" ), 'Rating' => '2', 'Status' => 'true',  'ProductPage' => 'http://mh-svr.de/pong_dev/README.md', 'descr' => 'Blah blub bubber.', 'Picture' => 'img/p08w.png', 'ZoomImg'=>'img/p08.jpg' ),
			array( 'ID' => 'yy10', 'Created' => '1401510061', 'Name' => array( "Prod I", "A" ), 'Rating' => '3', 'Status' => 'true',  'ProductPage' => 'http://mh-svr.de/pong_dev/README.md', 'descr' => 'Blah blub bubber.', 'Picture' => 'img/p10w.png', 'ZoomImg'=>'img/p10.jpg' ),
			array( 'ID' => 'yy11', 'Created' => '1401410061', 'Name' => array( "Prod J", "A" ), 'Rating' => '3', 'Status' => 'true',  'ProductPage' => 'http://mh-svr.de/pong_dev/README.md', 'descr' => 'Blah blub bubber.', 'Picture' => 'img/p11w.png', 'ZoomImg'=>'img/p11.jpg' ),
			array( 'ID' => 'yy12', 'Created' => '1401310061', 'Name' => array( "Prod K", "A" ), 'Rating' => '2', 'Status' => 'true',  'ProductPage' => 'http://mh-svr.de/pong_dev/README.md', 'descr' => 'Blah blub bubber.', 'Picture' => 'img/p12w.png', 'ZoomImg'=>'img/p12.jpg' ),
			array( 'ID' => 'yy13', 'Created' => '1401210061', 'Name' => array( "Prod L", "A" ), 'Rating' => '2', 'Status' => 'true',  'ProductPage' => 'http://mh-svr.de/pong_dev/README.md', 'descr' => 'Blah blub bubber.', 'Picture' => 'img/p13w.png', 'ZoomImg'=>'img/p13.jpg' ),
			array( 'ID' => 'yy14', 'Created' => '1401110061', 'Name' => array( "Prod M", "A" ), 'Rating' => '2', 'Status' => 'true',  'ProductPage' => 'http://mh-svr.de/pong_dev/README.md', 'descr' => 'Blah blub bubber.', 'Picture' => 'img/p14w.png', 'ZoomImg'=>'img/p14.jpg' ),
		);
	echo json_encode( $rows );
}
?>

