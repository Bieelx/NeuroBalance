# 1. Modelagem de Dados (MER/DER)

Este documento descreve a modelagem de dados relacional (MER/DER) da aplicação NeuroBalance, conforme solicitado nos requisitos.

## Modelo Entidade-Relacionamento (MER)

* **USUARIO:** Armazena os dados cadastrais do usuário.
* **CHECKIN:** Armazena cada registro de humor e agitação enviado pelo usuário.
* **METRICAS_USUARIO:** Armazena dados agregados e calculados (de desempenho) para cada usuário, atualizados automaticamente.

## Diagrama Entidade-Relacionamento (DER)

Abaixo segue o DDL (Data Definition Language) que representa o diagrama:

```sql
-- Tabela de Usuários
CREATE TABLE USUARIO (
    id_usuario NUMBER PRIMARY KEY,
    email VARCHAR2(100) NOT NULL UNIQUE,
    nome VARCHAR2(100),
    data_criacao DATE DEFAULT SYSDATE
);

-- Tabela Fato principal
CREATE TABLE CHECKIN (
    id_checkin NUMBER PRIMARY KEY,
    id_usuario NUMBER NOT NULL,
    timestamp DATE DEFAULT SYSDATE,
    humor VARCHAR2(50),
    texto_checkin VARCHAR2(500),
    nivel_agitacao VARCHAR2(50),
    CONSTRAINT fk_usuario_checkin FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario)
);

-- Tabela de métricas automatizadas (para controle de desempenho)
CREATE TABLE METRICAS_USUARIO (
    id_metricas NUMBER PRIMARY KEY,
    id_usuario NUMBER NOT NULL UNIQUE,
    total_checkins NUMBER DEFAULT 0,
    dias_agitado NUMBER DEFAULT 0,
    dias_ansioso NUMBER DEFAULT 0,
    data_ultimo_checkin DATE,
    CONSTRAINT fk_usuario_metricas FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario)
);

-- Sequências para chaves primárias
CREATE SEQUENCE SEQ_USUARIO_ID START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE SEQ_CHECKIN_ID START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE SEQ_METRICAS_ID START WITH 1 INCREMENT BY 1;

```

## Implementação de Rotinas PL/SQL (Automação)
A seguir, estão as rotinas PL/SQL implementadas para automatizar o "controle de desempenho" (o preenchimento da tabela METRICAS_USUARIO).

A. Gatilho (Trigger)
O gatilho TRG_APOS_NOVO_CHECKIN é disparado automaticamente após cada novo registro na tabela CHECKIN.

```SQL

CREATE OR REPLACE TRIGGER TRG_APOS_NOVO_CHECKIN
AFTER INSERT ON CHECKIN
FOR EACH ROW
BEGIN
    -- Chama o procedimento que faz a lógica
    ATUALIZAR_METRICAS_USUARIO(
        :new.id_usuario,
        :new.humor,
        :new.nivel_agitacao,
        :new.timestamp
    );
END;
```
B. Procedimento (Procedure)
Este procedimento (ATUALIZAR_METRICAS_USUARIO) contém a lógica de negócio para calcular e atualizar as métricas de desempenho do usuário.

```SQL

CREATE OR REPLACE PROCEDURE ATUALIZAR_METRICAS_USUARIO (
    p_id_usuario      IN METRICAS_USUARIO.id_usuario%TYPE,
    p_humor           IN CHECKIN.humor%TYPE,
    p_nivel_agitacao  IN CHECKIN.nivel_agitacao%TYPE,
    p_timestamp       IN CHECKIN.timestamp%TYPE
)
IS
    v_cont_metricas NUMBER;
    v_dias_agitado  NUMBER;
    v_dias_ansioso  NUMBER;
BEGIN
    -- 1. Verifica se o usuário já possui um registro de métricas
    SELECT COUNT(*)
    INTO v_cont_metricas
    FROM METRICAS_USUARIO
    WHERE id_usuario = p_id_usuario;

    -- 2. Converte os dados do novo check-in em valores numéricos
    v_dias_agitado := CASE WHEN p_nivel_agitacao = 'Agitado' THEN 1 ELSE 0 END;
    v_dias_ansioso := CASE WHEN p_humor = 'ansioso' THEN 1 ELSE 0 END; -- (Valor de exemplo)

    IF v_cont_metricas > 0 THEN
        -- 3. Se o usuário existe, ATUALIZA (UPDATE) suas métricas
        UPDATE METRICAS_USUARIO
        SET
            total_checkins = total_checkins + 1,
            dias_agitado = dias_agitado + v_dias_agitado,
            dias_ansioso = dias_ansioso + v_dias_ansioso,
            data_ultimo_checkin = p_timestamp
        WHERE
            id_usuario = p_id_usuario;
            
    ELSE
        -- 4. Se for o primeiro check-in, CRIA (INSERT) o registro de métricas
        INSERT INTO METRICAS_USUARIO (
            id_metricas,
            id_usuario,
            total_checkins,
            dias_agitado,
            dias_ansioso,
            data_ultimo_checkin
        )
        VALUES (
            SEQ_METRICAS_ID.NEXTVAL, 
            p_id_usuario,
            1, -- Primeiro check-in
            v_dias_agitado,
            v_dias_ansioso,
            p_timestamp
        );
    END IF;

    COMMIT;

EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
END;
/