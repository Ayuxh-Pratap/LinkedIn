import { MailtrapClient, sender } from "../lib/mailtrap.js"

export const sendWelcomeEmail = async (email, name, profileUrl) => {
    const recipient = [{ email }]

    try {
        const response = await MailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "welcome to linkedin",
            html: createWelcomeEmailTemplate(name, profileUrl),
            category: "welcome"
        })

        console.log("welcome email sent successfully", response)
    } catch (error) {
        throw new Error(error.message)
    }
}