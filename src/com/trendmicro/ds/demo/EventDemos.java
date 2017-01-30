package com.trendmicro.ds.demo;

import java.io.BufferedReader;
import java.io.RandomAccessFile;
import java.net.*;
import java.io.*;
import java.util.*;
import javax.mail.*;
import javax.mail.internet.*;
import javax.activation.*;

public class EventDemos {

	public static void fireEmail1() {
		//System.out.println("fire send mail 1");
	    //// Recipient's email ID needs to be mentioned.
	    //String to = "mike@mdgsecurity.com";

	    //// Sender's email ID needs to be mentioned
	    //String from = "demo@trendenablement.com";

	    //// Assuming you are sending email from localhost
	    //String host = "smtp.1and1.com";

	    //// Get system properties
	    //Properties properties = System.getProperties();

	    //// Setup mail server
	    //properties.setProperty("mail.smtp.host", host);
	    //properties.setProperty("mail.smtp.auth", "true");

	    //// Get the default Session object.
	    //Session session = Session.getDefaultInstance(properties);

	    //try{
	       //// Create a default MimeMessage object.
	       //MimeMessage message = new MimeMessage(session);

	       //// Set From: header field of the header.
	       //message.setFrom(new InternetAddress(from));

	       //// Set To: header field of the header.
	       //message.addRecipient(Message.RecipientType.TO,
	                                //new InternetAddress(to));

	       //// Set Subject: header field
	       //message.setSubject("Deep Discovery Sample #1");

	       //// Create the message part 
	       //BodyPart messageBodyPart = new MimeBodyPart();

	       //// Fill the message
	       //messageBodyPart.setText("Attached you will find the benign sample that will be detected by the Deep Discovery virtual analysis functionality.");
	         
	       //// Create a multipart message
	       //Multipart multipart = new MimeMultipart();

	       //// Set text message part
	       //multipart.addBodyPart(messageBodyPart);

	       //// Part two is attachment
	       //messageBodyPart = new MimeBodyPart();
	       //String file = "./ROOT/samples/malwaresample1.exe";
	       //String filename = "sample1.txt";
	       //DataSource source = new FileDataSource(file);
	       //messageBodyPart.setDataHandler(new DataHandler(source));
	       //messageBodyPart.setFileName(filename);
	       //multipart.addBodyPart(messageBodyPart);

	       //// Send the complete message parts
	       //message.setContent(multipart);

	       //// Send message
	       //Transport.send(message);
	       //System.out.println("Sent message successfully....");
	    //}catch (MessagingException mex) {
	       //mex.printStackTrace();
	    //}
	}
	
	public static void fireEmail2() {
		//System.out.println("fire send mail 2");
		
		//try {
		//	String s;
		//	BufferedReader r = new BufferedReader(new InputStreamReader(new URL("http://wrs41.winshipway.com/").openStream()));
		//	while ((s = r.readLine()) != null) {
		//		System.out.println("Reading " + s.length());
		//	}
		//} catch (Exception ex) {
		//	ex.printStackTrace();
		//}

	}
	
	public static void fireWeb1() {
		System.out.println("fire web 1");

		String filepath = "webapps/ROOT/samples/malwaresample1.exe";
		long epoch = System.currentTimeMillis();
		long timestamp = epoch / 1000;
		String data = String.valueOf(timestamp);
						
	    try {
	    	RandomAccessFile file = new RandomAccessFile(filepath, "rw");
			file.seek(728448);
			file.write(data.getBytes());
			file.close();
	    } catch (Exception ex) {
	    	ex.printStackTrace();
	    }
	}
	
	public static void fireWeb2() {
		System.out.println("fire web 2");

		String filepath = "webapps/ROOT/samples/malwaresample2.exe";
		long epoch = System.currentTimeMillis();
		long timestamp = epoch / 1000;
		String data = String.valueOf(timestamp);
						
	    try {
	    	RandomAccessFile file = new RandomAccessFile(filepath, "rw");
			file.seek(728448);
			file.write(data.getBytes());
			file.close();
	    } catch (Exception ex) {
	    	ex.printStackTrace();
	    }
	}
	
	public static void fireWeb3() {
		System.out.println("fire web 3");

		String filepath = "webapps/ROOT/samples/malwaresample3.exe";
		long epoch = System.currentTimeMillis();
		long timestamp = epoch / 1000;
		String data = String.valueOf(timestamp);
						
	    try {
	    	RandomAccessFile file = new RandomAccessFile(filepath, "rw");
			file.seek(538848);
			file.write(data.getBytes());
			file.close();
	    } catch (Exception ex) {
	    	ex.printStackTrace();
	    }
	}
	
	public static void fireWeb4() {
		System.out.println("fire web 4");

		String filepath = "webapps/ROOT/samples/malwaresample4.exe";
		long epoch = System.currentTimeMillis();
		long timestamp = epoch / 1000;
		String data = String.valueOf(timestamp);
						
	    try {
	    	RandomAccessFile file = new RandomAccessFile(filepath, "rw");
			file.seek(614072);
			file.write(data.getBytes());
			file.close();
	    } catch (Exception ex) {
	    	ex.printStackTrace();
	    }
	}
}
