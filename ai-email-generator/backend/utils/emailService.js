import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
});


export const sendMail = async (to, subject, text, attachmentPath = null) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_USER,
            to,
            subject,
            text
        };

        // Attach file if provided
        if (attachmentPath && fs.existsSync(attachmentPath)) {
            mailOptions.attachments = [
                {
                    filename: attachmentPath.split("/").pop(),
                    path: attachmentPath,
                },
            ];
        }

        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully to", to);
    } catch (error) {
        console.error("Email sending error:", error);
        throw new Error("Failed to send email");
    }
};


