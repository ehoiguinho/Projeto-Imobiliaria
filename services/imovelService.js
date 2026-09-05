import fs from "fs/promises";
import path from "path";
import Database from "../db/database.js";
import Imovel from "../entities/imovel.js";
import Imagem from "../entities/imagem.js";
import ImovelRepository from "../repositories/imovelRepository.js";
import ImagemRepository from "../repositories/imgImovelRepository.js";

export default class ImovelService {

    #repo;
    #imagemRepository;

    constructor() {
        this.#repo = new ImovelRepository();
        this.#imagemRepository = new ImagemRepository();
    }

    async cadastrar(dados, arquivos) {

        const {
            descricao,
            cep,
            endereco,
            bairro,
            cidade,
            valor,
            disponivel
        } = dados;

        if (
            !descricao ||
            !cep ||
            !endereco ||
            !bairro ||
            !cidade ||
            valor == null ||
            !disponivel
        ) {
            throw new Error("Preencha os campos corretamente!");
        }

        const entidade = new Imovel(
            0,
            descricao,
            cep,
            endereco,
            bairro,
            cidade,
            valor,
            disponivel
        );

        if (!entidade.validar()) {
            throw new Error("Dados do imóvel inválidos");
        }

        const idImovel = await this.#repo.gravar(entidade);

        if (!idImovel) {
            throw new Error("Erro ao cadastrar imóvel.");
        }

        entidade.id = idImovel;

        if (arquivos && arquivos.length > 0) {

            for (const arquivo of arquivos) {

                const caminho = `/uploads/imoveis/${arquivo.filename}`;
                const extensao = arquivo.mimetype.split("/")[1];

                const imagem = new Imagem(
                    0,
                    entidade,
                    caminho,
                    extensao
                );

                if (!imagem.validar()) {
                    throw new Error(
                        "Formato de imagem inválido. Use jpg, jpeg ou png."
                    );
                }

                await this.#imagemRepository.gravar(imagem);
            }
        }

        return {
            msg: "Imóvel cadastrado com sucesso!"
        };
    }

    async listar() {

        const lista = await this.#repo.listar();

        if (lista.length === 0) {
            throw new Error("Nenhum imóvel encontrado.");
        }

        return lista;
    }

    async listarDisponivel() {

        const lista = await this.#repo.listarDisponivel();

        if (lista.length === 0) {
            throw new Error("Nenhum imóvel encontrado");
        }

        return lista;
    }

    async listarDestaques() {
        
        const lista = await this.#repo.listarDestaques();

        if (!lista || lista.length === 0) {
            throw new Error("Nenhum imóvel disponível para destaque.");
        }

        return lista;
    }
    


    async obterPeloId(id) {

    const banco = new Database();

    this.#repo.banco = banco;

    if (!id) {
        const erro = new Error("O id do imóvel não foi enviado!");
        erro.status = 400;
        throw erro;
    }

    const imovel = await this.#repo.obterId(id);

    if (!imovel || imovel.length === 0) {
        const erro = new Error(
            "Não foi possível encontrar o imóvel com o ID inserido."
        );

        erro.status = 404;
        throw erro;
    }

    return imovel;
}

    async alterar(id, dados) {

        const {
            descricao,
            cep,
            endereco,
            bairro,
            cidade,
            valor,
            disponivel
        } = dados;

        if (
            !id ||
            !descricao ||
            !cep ||
            !endereco ||
            !bairro ||
            !cidade ||
            valor == null ||
            disponivel == null
        ) {
            throw new Error(
                "Preencha todos os campos obrigatórios"
            );
        }

        const entidade = new Imovel(
            id,
            descricao,
            cep,
            endereco,
            bairro,
            cidade,
            valor,
            disponivel
        );

        if (!entidade.validar()) {
            throw new Error("Dados do imóvel inválidos");
        }

        const atualizado = await this.#repo.alterar(entidade);

        if (!atualizado) {
            throw new Error("Imóvel não encontrado");
        }

        return {
            msg: "Imóvel atualizado com sucesso"
        };
    }

    async deletar(id) {

    if (!id) {
        const erro = new Error(
            "O id do imóvel não foi enviado!"
        );

        erro.status = 400;
        throw erro;
    }

    const imovel = await this.#repo.obterId(id);

    if (!imovel || imovel.length === 0) {
        const erro = new Error(
            "Não foi possível encontrar o imóvel para deleção"
        );

        erro.status = 404;
        throw erro;
    }

    const possuiContrato = await this.#repo.possuiContrato(id);

    if (possuiContrato) {
        const erro = new Error(
            "Não é possível excluir este imóvel, pois existem contratos vinculados a ele."
        );

        erro.status = 409;
        throw erro;
    }

    const deletado = await this.#repo.deletar(id);

    if (!deletado) {
        throw new Error(
            "Erro ao deletar imóvel"
        );
    }

    return {
        msg: "Imóvel deletado com sucesso."
    };
}

    async listarImagens(id) {

        if (!id) {
            throw new Error(
                "O id do imóvel não foi enviado!"
            );
        }

        const imagens =
            await this.#imagemRepository.listarPorImovel(id);

        if (!imagens || imagens.length === 0) {
            throw new Error(
                "Nenhuma imagem encontrada para o imóvel especificado"
            );
        }

        return imagens;
    }

    async adicionarImagens(id, arquivos) {

        if (!id) {
            throw new Error(
                "Id do imóvel não foi encontrado!"
            );
        }

        if (!arquivos || arquivos.length === 0) {
            throw new Error(
                "Nenhuma imagem foi enviada!"
            );
        }

        const imovel = new Imovel();
        imovel.id = id;

        for (const arquivo of arquivos) {

            const caminho =
                `/uploads/imoveis/${arquivo.filename}`;

            const extensao =
                arquivo.mimetype.split("/")[1];

            const imagem = new Imagem(
                0,
                imovel,
                caminho,
                extensao
            );

            if (!imagem.validar()) {
                throw new Error(
                    "Formato de imagem inválido, use JPG, JPEG ou PNG!"
                );
            }

            await this.#imagemRepository.gravar(imagem);
        }

        return {
            msg: "Imagens adicionadas com sucesso!"
        };
    }

    async deletarImagem(id) {

    if (!id) {
        const erro = new Error(
            "Id da imagem não foi encontrado!"
        );

        erro.status = 400;
        throw erro;
    }

    const imagem = await this.#imagemRepository.obterPorId(id);

    if (!imagem) {
        const erro = new Error(
            "Não foi possível encontrar a imagem para deleção!"
        );

        erro.status = 404;
        throw erro;
    }

    const deletado =
        await this.#imagemRepository.deletar(id);

    if (!deletado) {
        throw new Error(
            "Erro ao deletar imagem do banco de dados!"
        );
    }

    const caminhoArquivo = path.join(
        process.cwd(),
        imagem.caminho.replace(/^\/uploads/, "uploads")
    );

    try {
        await fs.unlink(caminhoArquivo);
    }
    catch (error) {
        console.error(
            "Imagem removida do banco, mas não foi possível remover o arquivo físico:",
            error.message
        );
    }

    return {
        msg: "Imagem deletada com sucesso!"
    };
}
}