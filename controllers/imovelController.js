import Imovel from "../entities/imovel.js";
import ImovelRepository from "../repositories/imovelRepository.js";
import ImagemRepository from "../repositories/imgImovelRepository.js";
import Imagem from "../entities/imagem.js";


export default class ImovelController{

    #repo;
    #imagemRepository;

    constructor(){
        this.#repo = new ImovelRepository();
        this.#imagemRepository = new ImagemRepository();
    }

    async cadastrar(req, res){
        try{
            let {descricao, cep, endereco, bairro, cidade, valor, disponivel} = req.body;

            if(!descricao || !cep || !endereco || !bairro || !cidade || valor == null || !disponivel){
                return res.status(400).json({msg: "Preencha os campos corretamente!"});
            }
            let entidade = new Imovel(0, descricao, cep, endereco, bairro, cidade, valor, disponivel);

            let idImovel = await this.#repo.gravar(entidade);

        if (!idImovel) {
            throw new Error("Erro ao cadastrar imóvel.");
        }

        entidade.id = idImovel;

        if (req.files && req.files.length > 0) {
            for (let arquivo of req.files) {
                let caminho = `/uploads/imoveis/${arquivo.filename}`;

                let imagem = new Imagem(0, entidade, caminho, arquivo.mimetype.split("/")[1]);

                imagem.imovel.id = idImovel;

                if (!imagem.validar()) {
                    return res.status(400).json({
                        msg: "Formato de imagem inválido. Use jpg, jpeg ou png."
                    });
                }

                await this.#imagemRepository.gravar(imagem);
            }
        }

        return res.status(200).json({msg: "Imóvel cadastrado com sucesso!"});
        }
        catch(error){
            console.error(error);
            return res.status(500).json({msg: "Erro ao processar requisição."});
        }

    }

     async imagem(req, res){
        try{
            let {id} = req.params;
            if(!id) {
                return res.status(400).json({msg: "O id do imóvel não foi enviado!"});
            }

            let imagens = await this.#imagemRepository.listarPorImovel(id);

            if(imagens.length > 0)
                res.status(200).json(imagens);
            else
                res.status(404).json({msg: "Nenhuma imagem encontrada para o imóvel especificado"});
        }
        catch(ex) {
            console.log(ex);
            return res.status(500).json({msg: "Erro durante a consulta de imagens"})
        }
    }


    async alterar(req, res){
    try{
        const {id} = req.params;
        let {descricao, cep, endereco, bairro, cidade, valor, disponivel} = req.body;

        if(!id || !descricao || !cep || !endereco || !bairro || !cidade || valor == null || disponivel == "true"){
            return res.status(400).json({msg: "Preencha todos os campos obrigatórios"});
        }
        // cria entidade
        let entidade = new Imovel(id, descricao, cep, endereco, bairro, cidade, valor, disponivel);

        //  validação da regra de negócio
        if(!entidade.validar()){
            return res.status(400).json({msg: "Dados do imóvel inválidos"});
        }
        let atualizado = await this.#repo.alterar(entidade);

        if(atualizado){
            return res.status(200).json({msg: "Imóvel atualizado com sucesso"});
        }else{
            return res.status(404).json({msg: "Imóvel não encontrado"});
        }

    }
    catch(error){
        console.log(error);
        return res.status(500).json({msg: "Erro ao processar requisição"});
    }
}

    async listar(req, res){
        try{
            let lista = await this.#repo.listar();
            if(lista.length > 0){
                return res.status(200).json(lista);
            }
            else
                return res.status(400).json({msg: "Nenhum imóvel encontrado."});

        }catch(error){
        console.error(error);
        return res.status(500).json({msg: "Erro ao processar requisição"});
        }
        
    }

      async listarDisponivel(req, res) {
        var lista = await this.#repo.listarDisponivel();
        if(lista.length == 0)
            return res.status(404).json({msg: "Nenhum imóvel encontrado"});

        return res.status(200).json(lista);
    }

    async obterPeloId(req, res){
        try{
        let {id} = req.params;
        let imovel = await this.#repo.obterId(id);
        if(imovel){
            return res.status(200).json(imovel);
        }
        else
            return res.status(404).json({msg: "Não foi possível encontrar o imóvel com o ID inserido."});
    }catch(error){
        console.error(error);
        return res.status(500).json({msg: "Erro ao processar requisição."});
    }
    } 
    
    async deletar(req, res){
        try{
            let {id} = req.params;
            let imovel = await this.#repo.obterId(id);
            if(imovel){
                await this.#repo.deletar(id);
                return res.status(200).json({msg: "Imóvel deletado com sucesso."});
            }
            else{
                return res.status(404).json({msg: "Não foi possivel encontrar o imóvel para deleção"});
            }
        }
        catch(error){
            console.error(error);
            return res.status(500).json({msg: "Erro ao processar requisição."});
        }

    }

    async adicionarImagens(req, res){
        try{
            let {id} = req.params;

            if(!id){
                return res.status(400).json({msg: "Id do imóvel não foi encontrado!"});
            }
            if(!req.files || req.files.length === 0){
                return res.status(400).json({msg: "Nenhuma imagem foi enviada!"});
            }
            let imovel = new Imovel();
            imovel.id = id;

            for(let arquivo of req.files){
                let caminho = `/uploads/imoveis/${arquivo.filename}`;
                let extensao = arquivo.mimetype.split("/")[1];

                let imagem = new Imagem(0, imovel, caminho, extensao);

                if(!imagem.validar()){
                    return res.status(400).json({
                        msg: "Formato de imagem inválido, use JPG, JPEG ou PNG!"
                    });
                }

                await this.#imagemRepository.gravar(imagem);
            }

            return res.status(200).json({msg: "Imagens adicionadas com sucesso!"});
        }
    catch(error){
        console.error(error);
        return res.status(500).json({msg: "Erro ao processar requisição."});
    }
}

    async deletarImagem(req, res){
     try{
        let {id} = req.params;

        if(!id){
            return res.status(400).json({msg: "Id da imagem não foi encontrado!"});
        }

        let deletar = await this.#imagemRepository.deletar(id);

        if(deletar){
            return res.status(200).json({msg: "Imagem deletada com sucesso!"});
        }

        return res.status(404).json({msg: "Não foi possível encontrar a imagem para deleção!"});

    }catch(error){
        console.error(error);
        return res.status(500).json({msg: "Erro ao processar requisição."});
     }

}
}