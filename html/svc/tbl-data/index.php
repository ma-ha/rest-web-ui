<?php
header('Content-type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	echo json_encode( array() );
} else {
	$d = time();
	$rows = 
		array(
			array( 'ID' => 'yyy1', 'Created' => '1481483418', 'Name' => array( "Prod F", "A" ), 'Rating' => '2', 'Status' => 'false', 'ProductPage' => 'http://mh-svr.de/pong_dev/README.md', 'Description' => 'http://mh-svr.de/', 'Picture' => 'img/p07w.png', 'ZoomImg'=>'img/p07.jpg', 'act'=>'do it', 'SelC'=>'Two' ),
			array( 'ID' => 'yy02null', 'Created' => NULL, 'Name' => array( "Prod N", "A" ), 'Rating' => null, 'Status' => 'true',  'ProductPage' => 'http://mh-svr.de/pong_dev/README.md', 'Description' => 'Blah blub bubber.', 'Picture' => 'img/p01w.png', 'ZoomImg'=>'img/p01.jpg' ),
			array( 'ID' => 'yyy3t', 'Created' => '1461610061', 'Name' => array( "Prod B", "A" ), 'Rating' => '2', 'Status' => true,  'ProductPage' => '', 'Description' => 'Blah blub bubber.', 'Picture' => 'img/p02w.png', 'ZoomImg'=>'img/p02.jpg', 'act'=>'buy' ),
			array( 'ID' => 'yyy4', 'Created' => '1451610061', 'Name' => array( "Prod B", "A" ), 'Rating' => '2', 'Status' => 'true',  'ProductPage' => 'http://mh-svr.de/pong_dev/README.md', 'Description' => 'Blah blub bubber.', 'Picture' => 'img/p03w.png', 'ZoomImg'=>'img/p03.jpg', 'act'=>'get it' ),
			array( 'ID' => 'yy05', 'Created' => '1441610061', 'Name' => array( "Prod N", "A" ), 'Rating' => '2', 'Status' => 'true',  'ProductPage' => 'http://mh-svr.de/pong_dev/README.md', 'Description' => 'Blah blub bubber.', 'Picture' => 'img/p04w.png', 'ZoomImg'=>'img/p04.jpg', 'act'=>'do it' ),
			array( 'ID' => 'yyy6', 'Created' => '1431610061', 'Name' => array( "Prod D", "A" ), 'Rating' => '2', 'Status' => 'true',  'ProductPage' => 'http://mh-svr.de/pong_dev/README.md', 'Description' => 'Blah blub bubber.', 'Picture' => 'img/p05w.png', 'ZoomImg'=>'img/p05.jpg', 'act'=>'do it' ),
			array( 'ID' => 'yyy7', 'Created' => '1421610061', 'Name' => array( "Prod E", "A" ), 'Rating' => '1', 'Status' => 'false', 'ProductPage' => 'http://mh-svr.de/pong_dev/README.md', 'Description' => 'Blah blub bubber.', 'Picture' => 'img/p06w.png', 'ZoomImg'=>'img/p06.jpg', 'act'=>'do it' ),
			array( 'ID' => 'yyy8', 'Created' => '1411610061', 'Name' => array( "Prod G", "A" ), 'Rating' => '2', 'Status' => 'true',  'ProductPage' => 'http://mh-svr.de/pong_dev/README.md', 'Description' => 'Blah blub bubber.', 'Picture' => 'img/p09w.png', 'ZoomImg'=>'img/p09.jpg', 'act'=>'do it' ),
			array( 'ID' => 'yyy9', 'Created' => '1401610061', 'Name' => array( "Prod G", "A" ), 'Rating' => '2', 'Status' => 'true',  'ProductPage' => 'http://mh-svr.de/pong_dev/README.md', 'Description' => 'Blah blub bubber.', 'Picture' => 'img/p08w.png', 'ZoomImg'=>'img/p08.jpg', 'act'=>'do it' ),
			array( 'ID' => 'yy10', 'Created' => '1401510061', 'Name' => array( "Prod I", "A" ), 'Rating' => '3', 'Status' => 'true',  'ProductPage' => 'http://mh-svr.de/pong_dev/README.md', 'Description' => 'Blah blub bubber.', 'Picture' => 'img/p10w.png', 'ZoomImg'=>'img/p10.jpg', 'act'=>'do it' ),
			array( 'ID' => 'yy11', 'Created' => '1401410061', 'Name' => array( "Prod J", "A" ), 'Rating' => '3', 'Status' => 'true',  'ProductPage' => 'http://mh-svr.de/pong_dev/README.md', 'Description' => 'Blah blub bubber.', 'Picture' => 'img/p11w.png', 'ZoomImg'=>'img/p11.jpg', 'act'=>'do it' ),
			array( 'ID' => 'yy12', 'Created' => '1401310061', 'Name' => array( "Prod K", "A" ), 'Rating' => '2', 'Status' => 'true',  'ProductPage' => 'http://mh-svr.de/pong_dev/README.md', 'Description' => 'Blah blub bubber.', 'Picture' => 'img/p12w.png', 'ZoomImg'=>'img/p12.jpg', 'act'=>'do it' ),
			array( 'ID' => 'yy13', 'Created' => '1401210061', 'Name' => array( "Prod L", "A" ), 'Rating' => '2', 'Status' => 'true',  'ProductPage' => 'http://mh-svr.de/pong_dev/README.md', 'Description' => 'Blah blub bubber.', 'Picture' => 'img/p13w.png', 'ZoomImg'=>'img/p13.jpg', 'act'=>'do it' ),
			array( 'ID' => 'yy14', 'Created' => '1401110061', 'Name' => array( "Prod M", "A" ), 'Rating' => '2', 'Status' => 'true',  'ProductPage' => 'http://mh-svr.de/pong_dev/README.md', 'Description' => 'Blah blub bubber.', 'Picture' => 'img/p14w.png', 'ZoomImg'=>'img/p14.jpg', 'act'=>'do it' ),
		);     
	for ( $i=0; $i < count($rows); $i++){
		if ( $rows[$i]['Created'] != NULL)
			$rows[$i]['Created'] = ''.$d;
		$d = $d - 1000000;
	}                                
	if ( isset( $_GET['dataFilter'] ) ) {
		// error_log( 'we have dataFilter ');
		$filter = $_GET['dataFilter'];
		if ( isset( $filter['dateMin'] ) &&  $filter['dateMin']  != '' ) {
			$time = strtotime(  $filter['dateMin'] );
			// error_log( 'we have dateMin '.$time );
			for ( $i = count( $rows )-1; $i>=0; $i-- ) {
				if ( $rows[$i]['Created'] < $time ) 
					array_splice( $rows, $i, 1 );
			}
		}
		if ( isset( $filter['rating'] ) && $filter['rating'] == '1' ) {
			for ( $i = count( $rows )-1; $i>=0; $i-- ) {
				if ( $rows[$i]['Rating'] != '3' ) 
					array_splice( $rows, $i, 1 );
			}
		} 
	} 
	// else 		error_log( implode("|",$_GET) );

	echo json_encode( $rows );
}
?>

