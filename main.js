import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';

import variables from './json/variables.js';
import contacts from './json/contacts.js';
import config from './smtp.config.js';

const CURRENTEMAIL = 'firstEmail'; // Change this for different emails.

var htmlTemplate; // Email template variable that will be populated.
var txtTemplate; // txt template variable that will be populated.
var subject = "This was sent with Node 😉";

// Check which email template to be used and populate variables accordingly.
switch (CURRENTEMAIL) {
  case 'firstEmail':
    htmlTemplate = './emails/first-email.html';
    txtTemplate = './emails/first-email.txt';
    break;
  case 'secondEmail':
    htmlTemplate = './emails/second-email.html';
    txtTemplate = './emails/second-email.txt';
    break;
}

// Read html and txt files seperately based on populated variables.
var readHtmlFile = fs.readFileSync(htmlTemplate, 'utf8');
var readTxtFile = fs.readFileSync(txtTemplate, 'utf8');

async function main() {

  // Create reusable transporter object
  let transporter = nodemailer.createTransport({
    host: config.host, //SMTP server
    port: config.port,
    secure: config.secure, // true for 465, false for other ports
    auth: {
      user: config.auth.user,
      pass: config.auth.pass,
    },
  });

  // Compile html template with handlebars
  var htmlTemplate = handlebars.compile(readHtmlFile);
  var htmlToSend = htmlTemplate(variables);

  // Compile txt template with handlebars
  var txtTemplate = handlebars.compile(readTxtFile);
  var txtToSend = txtTemplate(variables);

  // Mail options
  var mailOptions = {
    from: `${contacts.corne.name} <${contacts.corne.email}>`,
    to: contacts.corne.email,
    subject: subject,
    text: txtToSend,
    html: htmlToSend,
  };

  // Send email
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

main().catch(console.error);
