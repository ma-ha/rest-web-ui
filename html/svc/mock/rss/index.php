<?php 
header( "Content-Type: application/rss+xml; charset=utf-8" );
if ( $_SERVER['REQUEST_METHOD'] === 'GET' ) {		
	if ( isset( $_GET['rss'] ) ) {
		$rssURL = $_GET['rss'];
		$ch = curl_init( $rssURL );		
		curl_setopt( $ch, CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT'] );
		$callResult = curl_exec( $ch );
		$header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
		$contents = substr( $callResult, $header_size );
		$status = curl_getinfo( $ch );
		curl_close ( $ch );		
		print( $contents );
	}
}
?>