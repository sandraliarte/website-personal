<?php
if($_POST){
	
	//your email address
	$email_to = "youremail@yourwebsite.com";
	//email subject
	$emailSubject = "Spotless contact form";
	//edit the emailfrom
	$emailFrom = "contact@yourwebsite.com";
	
	$name = $_POST['name'];
	$website = $_POST['website'];
	$email = $_POST['email'];
	$phone = $_POST['phone'];
	$message = $_POST['message'];
	
	$text = "NAME: $name<br>
	         WEBSITE: $website<br>
	         EMAIL: $email<br> 
	         PHONE: $phone<br>  
	         MESSAGE: $message";
	$headers = "MIME-Version: 1.0" . "\r\n"; 
	$headers .= "Content-type:text/html; charset=utf-8" . "\r\n"; 
	$headers .= "From: <$emailFrom>" . "\r\n";
	mail($email_to, $emailSubject, $text, $headers);
	$data['success'] = true;
	echo json_encode($data);
}
?>