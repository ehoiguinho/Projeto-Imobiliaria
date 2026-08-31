CREATE TABLE tb_perfil (
    per_id SERIAL PRIMARY KEY,
    per_descricao VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE tb_usuario (
    usu_id SERIAL PRIMARY KEY,
    usu_nome VARCHAR(100) NOT NULL,
    usu_email VARCHAR(150) NOT NULL UNIQUE,
    usu_ativo CHAR(1) NOT NULL DEFAULT 'S',
    usu_senha VARCHAR(255) NOT NULL,
    per_id INTEGER NOT NULL,

    CONSTRAINT fk_usuario_perfil
        FOREIGN KEY (per_id)
        REFERENCES tb_perfil(per_id),

    CONSTRAINT chk_usuario_ativo
        CHECK (usu_ativo IN ('S', 'N'))
);

CREATE TABLE tb_imovel (
    imv_id SERIAL PRIMARY KEY,
    imv_descricao VARCHAR(255) NOT NULL,
    imv_cep VARCHAR(10) NOT NULL,
    imv_endereco VARCHAR(255) NOT NULL,
    imv_bairro VARCHAR(100) NOT NULL,
    imv_cidade VARCHAR(100) NOT NULL,
    imv_valor NUMERIC(10, 2) NOT NULL,
    imv_disponivel CHAR(1) NOT NULL DEFAULT 'S',

    CONSTRAINT chk_imovel_valor
        CHECK (imv_valor > 0),

    CONSTRAINT chk_imovel_disponivel
        CHECK (imv_disponivel IN ('S', 'N'))
);

CREATE TABLE tb_contrato (
    ctr_id SERIAL PRIMARY KEY,
    imv_id INTEGER NOT NULL,
    usu_id INTEGER NOT NULL,
    con_status VARCHAR(20) NOT NULL DEFAULT 'ATIVO',

    CONSTRAINT fk_contrato_imovel
        FOREIGN KEY (imv_id)
        REFERENCES tb_imovel(imv_id),

    CONSTRAINT fk_contrato_usuario
        FOREIGN KEY (usu_id)
        REFERENCES tb_usuario(usu_id),

    CONSTRAINT chk_contrato_status
        CHECK (con_status IN ('ATIVO', 'CANCELADO'))
);

CREATE TABLE tb_aluguel (
    alu_id SERIAL PRIMARY KEY,
    alu_mes INTEGER NOT NULL,
    alu_vencimento DATE NOT NULL,
    alu_valor NUMERIC(10, 2) NOT NULL,
    alu_pago CHAR(1) NOT NULL DEFAULT 'N',
    alu_status VARCHAR(20) NOT NULL DEFAULT 'PENDENTE',
    ctr_id INTEGER NOT NULL,

    CONSTRAINT fk_aluguel_contrato
        FOREIGN KEY (ctr_id)
        REFERENCES tb_contrato(ctr_id),

    CONSTRAINT chk_aluguel_pago
        CHECK (alu_pago IN ('S', 'N')),

    CONSTRAINT chk_aluguel_status
        CHECK (alu_status IN (
            'PENDENTE',
            'PAGO',
            'ATRASADO',
            'CANCELADO'
        )),

    CONSTRAINT chk_aluguel_valor
        CHECK (alu_valor > 0)
);

CREATE TABLE tb_imgimovel (
    img_id SERIAL PRIMARY KEY,
    imv_id INTEGER NOT NULL,
    img_caminho VARCHAR(255) NOT NULL,
    img_extensao VARCHAR(10) NOT NULL,

    CONSTRAINT fk_imgimovel_imovel
        FOREIGN KEY (imv_id)
        REFERENCES tb_imovel(imv_id)
        ON DELETE CASCADE
);