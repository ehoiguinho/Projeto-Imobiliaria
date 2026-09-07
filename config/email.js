import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

export async function enviarEmailRecuperacao(email, nome, link) {

    await transporter.sendMail({
        from: `"Projeto Imobiliária" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Recuperação de senha - Projeto Imobiliária",

        text: `
Olá, ${nome || "usuário"}!

Recebemos uma solicitação para redefinir a senha da sua conta.

Acesse o link abaixo para criar uma nova senha:

${link}

Este link é válido por 30 minutos.

Se você não solicitou a recuperação de senha, ignore este e-mail.
        `,

        html: `
            <div style="
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: 0 auto;
                padding: 30px;
                color: #1e293b;
            ">

                <h2>Recuperação de senha</h2>

                <p>
                    Olá, ${nome || "usuário"}!
                </p>

                <p>
                    Recebemos uma solicitação para redefinir
                    a senha da sua conta.
                </p>

                <p>
                    Clique no botão abaixo para criar uma nova senha:
                </p>

                <div style="margin: 30px 0;">
                    <a
                        href="${link}"
                        style="
                            display: inline-block;
                            padding: 12px 24px;
                            background-color: #2563eb;
                            color: white;
                            text-decoration: none;
                            border-radius: 8px;
                            font-weight: bold;
                        "
                    >
                        Redefinir minha senha
                    </a>
                </div>

                <p>
                    Este link é válido por <strong>30 minutos</strong>.
                </p>

                <p style="color: #64748b; font-size: 14px;">
                    Se você não solicitou a recuperação de senha,
                    ignore este e-mail.
                </p>

            </div>
        `
    });
}