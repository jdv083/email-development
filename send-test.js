const fs = require('fs');
const path = require('path');

// IMPORTANT: Store your API keys securely.
// It's best practice to use environment variables.
const mailjet = require('node-mailjet').apiConnect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);

// --- Configuration ---
const SENDER_EMAIL = 'villajmlm@gmail.com'; // Replace with your verified Mailjet sender email
const RECIPIENT_EMAIL = 'villajmlm@gmail.com'; // Replace with the email you want to send the test to
const EMAIL_SUBJECT = 'This Email came from Mailjet and Tested in VSCode!';

// Get the file path from the command-line arguments
const relativeFilePath = process.argv[2];

if (!relativeFilePath) {
  console.error('Error: Please provide the path to the HTML file you want to send.');
  console.error('Usage: node send-test.js <path/to/your/file.html>');
  process.exit(1);
}

// Read the HTML file from the provided path
const htmlFilePath = path.join(__dirname, relativeFilePath);
let htmlPart;

try {
  htmlPart = fs.readFileSync(htmlFilePath, 'utf8');
} catch (err) {
  console.error(`Error reading HTML file: ${htmlFilePath}`, err);
  process.exit(1);
}

// --- Send the Email ---
const request = mailjet.post('send', { version: 'v3.1' }).request({
  Messages: [
    {
      From: {
        Email: SENDER_EMAIL,
        Name: 'John Villa',
      },
      To: [
        {
          Email: RECIPIENT_EMAIL,
          Name: 'John Doe',
        },
      ],
      Subject: EMAIL_SUBJECT,
      HTMLPart: htmlPart,
      CustomID: 'MJMLTestEmail',
    },
  ],
});

request
  .then(result => {
    console.log('Email sent successfully!');
    console.log(JSON.stringify(result.body, null, 2));
  })
  .catch(err => {
    console.error('Error sending email:');
    console.error(`Status: ${err.statusCode}`);
    console.error(`Message: ${err.message}`);
    console.error(JSON.stringify(err.response.data, null, 2));
  });
