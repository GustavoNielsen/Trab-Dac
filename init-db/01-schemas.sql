CREATE SCHEMA IF NOT EXISTS cliente;
CREATE SCHEMA IF NOT EXISTS gerente;

CREATE TABLE IF NOT EXISTS gerente.gerentes (
    cpf VARCHAR(11) PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    tipo VARCHAR(20) NOT NULL DEFAULT 'GERENTE'
);

CREATE TABLE IF NOT EXISTS cliente.clientes (
    id BIGSERIAL PRIMARY KEY,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    salario NUMERIC(15, 2) NOT NULL,
    logradouro VARCHAR(255),
    numero VARCHAR(20),
    complemento VARCHAR(100),
    cep VARCHAR(9),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    gerente_cpf VARCHAR(11) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDENTE',
    motivo_recusa TEXT,
    data_decisao TIMESTAMP,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO gerente.gerentes (cpf, nome, email, telefone, tipo) VALUES
    ('98574307084', 'Geniéve', 'ger1@bantads.com.br', '(41)3000-0001', 'GERENTE'),
    ('64065268052', 'Godophredo', 'ger2@bantads.com.br', '(41)3000-0002', 'GERENTE'),
    ('23862179060', 'Gyândula', 'ger3@bantads.com.br', '(41)3000-0003', 'GERENTE')
ON CONFLICT (cpf) DO NOTHING;

INSERT INTO cliente.clientes (
    cpf, nome, email, telefone, salario,
    logradouro, numero, complemento, cep, bairro, cidade, estado,
    gerente_cpf, status
) VALUES
    ('12912861012', 'Catharyna', 'cli1@bantads.com.br', '(41)9000-0001', 10000.00,
     'Rua das Flores', '100', 'Apto 1', '80000-000', 'Centro', 'Curitiba', 'PR',
     '98574307084', 'APROVADO'),
    ('09506382000', 'Cleuddônio', 'cli2@bantads.com.br', '(41)9000-0002', 20000.00,
     'Av. Brasil', '200', '', '80000-001', 'Batel', 'Curitiba', 'PR',
     '64065268052', 'APROVADO'),
    ('85733854057', 'Catianna', 'cli3@bantads.com.br', '(41)9000-0003', 3000.00,
     'Rua XV', '300', '', '80000-002', 'Centro', 'Curitiba', 'PR',
     '23862179060', 'APROVADO'),
    ('58872160006', 'Cutardo', 'cli4@bantads.com.br', '(41)9000-0004', 500.00,
     'Rua Alfa', '400', '', '80000-003', 'Centro', 'Curitiba', 'PR',
     '98574307084', 'APROVADO'),
    ('76179646090', 'Coândrya', 'cli5@bantads.com.br', '(41)9000-0005', 1500.00,
     'Rua Beta', '500', '', '80000-004', 'Centro', 'Curitiba', 'PR',
     '64065268052', 'APROVADO')
ON CONFLICT (cpf) DO NOTHING;
