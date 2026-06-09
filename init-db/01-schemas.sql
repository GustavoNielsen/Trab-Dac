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

CREATE SCHEMA IF NOT EXISTS conta;

CREATE TABLE IF NOT EXISTS conta.contas (
    numero VARCHAR(10) PRIMARY KEY,
    cpf_cliente VARCHAR(11) NOT NULL,
    saldo NUMERIC(15, 2) NOT NULL DEFAULT 0,
    limite NUMERIC(15, 2) NOT NULL DEFAULT 0,
    cpf_gerente VARCHAR(11) NOT NULL,
    data_criacao DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS conta.movimentacoes (
    id BIGSERIAL PRIMARY KEY,
    conta_numero VARCHAR(10) NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    data_hora TIMESTAMP NOT NULL,
    valor NUMERIC(15, 2) NOT NULL,
    cpf_origem VARCHAR(11),
    cpf_destino VARCHAR(11)
);

-- Contas pré-cadastradas (dados do enunciado)
INSERT INTO conta.contas (numero, cpf_cliente, saldo, limite, cpf_gerente, data_criacao) VALUES
    ('1291', '12912861012', 800.00, 5000.00, '98574307084', '2000-01-01'),
    ('0950', '09506382000', -10000.00, 10000.00, '64065268052', '1990-10-10'),
    ('8573', '85733854057', -1000.00, 1500.00, '23862179060', '2012-12-12'),
    ('5887', '58872160006', 150000.00, 0.00, '98574307084', '2022-02-22'),
    ('7617', '76179646090', 1500.00, 0.00, '64065268052', '2025-01-01')
ON CONFLICT (numero) DO NOTHING;

-- Movimentações pré-cadastradas (dados do enunciado)
INSERT INTO conta.movimentacoes (conta_numero, tipo, data_hora, valor, cpf_origem, cpf_destino) VALUES
    ('1291', 'DEPOSITO',      '2020-01-01 10:00', 1000.00, NULL, NULL),
    ('1291', 'DEPOSITO',      '2020-01-01 11:00',  900.00, NULL, NULL),
    ('1291', 'SAQUE',         '2020-01-01 12:00',  550.00, NULL, NULL),
    ('1291', 'SAQUE',         '2020-01-01 13:00',  350.00, NULL, NULL),
    ('1291', 'DEPOSITO',      '2020-01-10 15:00', 2000.00, NULL, NULL),
    ('1291', 'SAQUE',         '2020-01-15 08:00',  500.00, NULL, NULL),
    ('1291', 'TRANSFERENCIA', '2020-01-20 12:00', 1700.00, '12912861012', '09506382000'),
    ('0950', 'DEPOSITO',      '2025-01-01 12:00', 1000.00, NULL, NULL),
    ('0950', 'DEPOSITO',      '2025-01-02 10:00', 5000.00, NULL, NULL),
    ('0950', 'SAQUE',         '2025-01-10 10:00',  200.00, NULL, NULL),
    ('0950', 'DEPOSITO',      '2025-02-05 10:00', 7000.00, NULL, NULL),
    ('8573', 'DEPOSITO',      '2025-05-05 00:00', 1000.00, NULL, NULL),
    ('8573', 'SAQUE',         '2025-05-06 00:00', 2000.00, NULL, NULL),
    ('5887', 'DEPOSITO',      '2025-06-01 00:00', 150000.00, NULL, NULL),
    ('7617', 'DEPOSITO',      '2025-07-01 00:00', 1500.00, NULL, NULL);
