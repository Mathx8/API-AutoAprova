import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

const mailerSend = new MailerSend({
    apiKey: process.env.MAILERSEND_API_KEY,
});

export async function enviarOTP(emailDestino, nome, otp) {
    const sentFrom = new Sender(
        process.env.EMAIL_FROM,
        "AutoAprova"
    );

    const recipients = [
        new Recipient(emailDestino, nome)
    ];

    const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setSubject("Seu código de verificação")
        .setText(`Seu código OTP é: ${otp}`)
        .setHtml(`
      <h2>AutoAprova</h2>
      <p>Seu código de verificação é:</p>
      <h1>${otp}</h1>
      <p>Esse código expira em 5 minutos.</p>
    `);

    await mailerSend.email.send(emailParams);
}