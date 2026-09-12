import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function enviarEmailRecuperacao(email, nome, link) {
    const { data, error } = await resend.emails.send({
        from: "Vitta Imobiliária <onboarding@resend.dev>",
        to: [email],
        subject: "Recuperação de senha - Vitta Imobiliária",

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
                color: #292825;
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
                            background-color: #292825;
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

    if (error) {
        console.error("Erro ao enviar e-mail pelo Resend:", error);
        throw new Error("Não foi possível enviar o e-mail de recuperação.");
    }

    console.log("E-mail de recuperação enviado pelo Resend:", data?.id);

    return data;
}