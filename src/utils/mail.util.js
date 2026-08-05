import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendEmail = async (options) => { //ACTUALLY SENDS THE EMAIL//

    //email template generator//
    const mailGenerator = new Mailgen({
        theme: "default" , 
        product: {
            name : "Product management system",
            link: "http://localhost:5173",
        }
    })

    //emailTexutal and emailhtml is used for the mail drafting//
    // FIXED: Changed to mailGenContent (Capital G) to match the controller
    console.log(options.mailGenContent);
    const emailTextual = mailGenerator.generatePlaintext(options.mailGenContent); //Text generation//

    const emailHtml = mailGenerator.generate(options.mailGenContent); //html generator//

    const transporter = nodemailer.createTransport({ //mail trap is connecting to the email server so that the connection between our app and email-server can be built via node mailer
        host: process.env.MAILTRAP_SMTP_HOST,
        port: process.env.MAILTRAP_SMTP_PORT,
        auth: {
            user: process.env.MAILTRAP_SMTP_USER,
            pass: process.env.MAILTRAP_SMTP_PASS
        }
    })

    const mail = { //obj --> Kinda evnvelope to the node mailer//
        from: "mail.taskmanager@example.com",
        to: options.email,
        subject: options.subject,
        text: emailTextual,
        html: emailHtml //browse will pickup the html content//
    }

    try {
        await transporter.sendMail(mail);
    } catch (error) {
        console.error("Email.service failed silently. Make sure that you have provided your MAILTRAP credentials in the .env file")
        console.error("Error:",error);
    }

}

//in short const mail = () tranffered via tranporter.func(mail)//

//will help us to send draft user email id//

const emailVerificationMailGen = (username , emailURL) => {
    return {
        body: {
            name: username,
            intro: "We received a request to verify your email address. Please click the button below to continue",
            action: {
                instructions: "To verify the Email please click on the following button" , 
                button: {
                    color: "#1aae5aff",
                    text: "Verify your email",
                    link: emailURL,
                },   
            },
            outro: "Need Help ,or have questions? Just reply to this email , we would like to help",
        },
    }
};

const forgotPassMailGen = (username , reqURL) => {
    return {
        body: {
            name: username,
            intro: "We got the request for the forgot to reset , kindly confirm the url",
            action: {
                instructions: "To change the existing password,  click on the following button" , 
                button: {
                    color: "#1aae5aff",
                    text: "Reset password",
                    link: reqURL,
                },   
            },
            outro: " , or have questions? Just reply to this email , we would like to help",
        },
    }
};

export {emailVerificationMailGen , forgotPassMailGen , sendEmail} // these are the function to return the mail structure//