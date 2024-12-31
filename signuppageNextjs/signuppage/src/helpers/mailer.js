import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";

export const sendEmail = async ({ email, emailType, userId }) => {
    try {
        // Generate a hashed token
        const hashedToken = await bcrypt.hash(userId.toString(), 10);

        // Update the user model based on the email type
        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, {
                verifyToken: hashedToken,
                verifyTokenExpiry: Date.now() + 15 * 60 * 1000, // Token valid for 15 minutes
            });
        } else if (emailType === "RESET_PASSWORD") {
            await User.findByIdAndUpdate(userId, {
                forgotPasswordToken: hashedToken,
                forgotPasswordTokenExpiry: Date.now() + 15 * 60 * 1000, // Token valid for 15 minutes
            });
        } else {
            throw new Error("Invalid email type specified.");
        }

        // Configure the email transporter
        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io", // Use environment variables in production
            port: 2525,
            auth: {
                user: process.env.SMTP_USER || "59243e99d8bc91", // Replace with env variable
                pass: process.env.SMTP_PASS || "e12c4d89b0d9f0", // Replace with env variable
            },
        });

        // Define mail options
        const tokenUrl = `${process.env.DOMAIN}/${
            emailType === "VERIFY" ? "verifyemail" : "resetpassword"
        }?token=${encodeURIComponent(hashedToken)}`;

        const mailOptions = {
            from: "anishsharmaf@gmail.com",
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html: `
                <p>
                    Click <a href="${tokenUrl}">here</a> to ${
                        emailType === "VERIFY" ? "verify your email" : "reset your password"
                    } or copy and paste the link below into your browser:
                </p>
                <p>
                    <a href="${tokenUrl}">${tokenUrl}</a>
                </p>
            `,
        };

        // Send the email
        const mailResponse = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", mailResponse);
        return mailResponse;
    } catch (error) {
        console.error("Error sending email:", error.message);
        throw new Error("Failed to send email. Please try again later.");
    }
};
