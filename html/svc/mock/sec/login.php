<?php
session_start();

if ( isset( $_SESSION["userstate"] ) && $_SESSION["userstate"] == 'login done' ) { 
  // simulate login done already
  $_SESSION["timeout"] = $_SESSION["timeout"] -1;
  if ( $_SESSION["timeout"] <= 0 ) {
    http_response_code( 401 ); // Unauthorized  
    $_SESSION["userstate"] = 'logout';
    echo "Session expired";
    return true;
  }
	echo $_SESSION["userid"];
	return true;
}
	

if ( $_SERVER['REQUEST_METHOD'] === 'POST') {
	if ( isset( $_POST['userid'] ) && $_POST['userid'] == 'test1' ) {
		$_SESSION["userstate"] = 'login done';
    $_SESSION["userid"] = 'test1';
    $_SESSION["timeout"] = 3;
		echo "Login OK";
		return true;
	} 
	if ( isset( $_POST['userid'] ) && $_POST['userid'] == 'test2' ) {
		$_SESSION["userstate"] = 'login done';
		$_SESSION["userid"] = 'test2';
    $_SESSION["timeout"] = 4;
		header('Content-type: application/json');		
		echo '{ "loginResult":"Login OK" }';
		return true;
	} 
	if ( isset( $_POST['userid'] ) && $_POST['userid'] == 'test3' ) {
		$_SESSION["userstate"] = 'login done';
		$_SESSION["userid"] = 'test3';
    $_SESSION["timeout"] = 4;
		header('Content-type: application/json');		
		echo '{ "loginResult":"Login OK", "changePassword":"true" }';
		return true;
	} 
}
http_response_code( 401 ); // Unauthorized
echo "Unauthorized";
?>