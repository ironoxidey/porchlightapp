const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const sendEmail = async (email, subject, payload, template) => {
  try {
    console.log("sendEmail");
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: 'mail.porchlight.art',
      port: 465,
      auth: {
        user: 'passwordreset@porchlight.art',
        pass: 'ca&^w~GLvq5d',
      },
    });

    const source = fs.readFileSync(path.join(__dirname, template), "utf8");
    const compiledTemplate = handlebars.compile(source);
    const options = () => {
      return {
        from: 'passwordreset@porchlight.art',
        to: email,
        subject: subject,
        html: compiledTemplate(payload),
      };
    };

    // Send email
    console.log("email should send now to "+email+" with the subject: "+subject);
    transporter.sendMail(options(), (error, info) => {
      if (error) {
        console.log(error);
        return error;
      } else {
        console.log("Email should have sent successfully on port 465.");
        return res.status(200).json({
          msg: 'Email should have sent successfully',
          success: true,
        });
      }
    });
  } catch (error) {
    console.log(error);
    return error;
  }
};

/*
Example:
sendEmail(
  "youremail@gmail.com,
  "Email subject",
  { name: "Eze" },
  "./templates/layouts/main.handlebars"
);
*/

module.exports = sendEmail;
