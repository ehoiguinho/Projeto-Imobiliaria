import AuthMiddleware from "../middlewares/authMiddleware.js";
import RecuperarSenhaService from "../services/recuperarSenhaService.js";
import UsuarioRepository from "../repositories/usuarioRepository.js";

export default class AutenticaoController {

    #repositorio;
    #recuperarService;

    constructor() {
        this.#repositorio = new UsuarioRepository();
        this.#recuperarService = new RecuperarSenhaService();
    }

    async usuario(req, res) {
        try {
            if (req.usuarioLogado)
                return res.status(200).json(req.usuarioLogado);
            else
                throw new Error("Não foi possivel obter o usuário.");

        } catch (exception) {
            console.log(exception);
            return res.status(500).json({
                msg: "Erro ao gerar o token de acesso!"
            });
        }
    }

    async esqueciSenha(req, res) {
        try {

            const { email } = req.body;

            const token =
                await this.#recuperarService.solicitar(email);

            return res.status(200).json({
                msg: "Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha.",
                token
            });

        } catch (exception) {

            console.log(exception);

            return res.status(400).json({
                msg: exception.message
            });
        }
    }

    async redefinirSenha(req, res) {
        try {

            const { token, senha } = req.body;

            await this.#recuperarService.redefinirSenha(
                token,
                senha
            );

            return res.status(200).json({
                msg: "Senha alterada com sucesso!"
            });

        } catch (exception) {

            console.log(exception);

            return res.status(400).json({
                msg: exception.message
            });
        }
    }

    async token(req, res) {

        try {

            let { email, senha } = req.body;

            if (email && senha) {

                let usuario =
                    await this.#repositorio.validarAcesso(email, senha);

                if (usuario) {

                    let auth = new AuthMiddleware();

                    let token = await auth.gerarToken(
                        usuario.id,
                        usuario.nome,
                        usuario.email,
                        usuario.perfil.id
                    );

                    res.clearCookie("token");

                    res.cookie("token", token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite:
                            process.env.NODE_ENV === "production"
                                ? "none"
                                : "lax",
                        path: "/"
                    });

                    return res.status(200).json({
                        token: token
                    });

                } else {

                    return res.status(404).json({
                        msg: "Usuário não encontrado."
                    });
                }

            } else {

                return res.status(400).json({
                    msg: "Informe um e-mail e senha válidos para gerar o token!"
                });
            }

        } catch (exception) {

            console.log(exception);

            return res.status(500).json({
                msg: "Erro ao gerar token de acesso"
            });
        }
    }
}
