import { Endereco } from "../../1entidades/Endereco";

/**
 * DTO para a Criação de um novo Endereço (POST)
 */
export type CriarEnderecoDTO = Omit<
    Endereco,
    'id' | '_id' | 'dataAtualizacao'
>;

/**
 * DTO para a Substituição Completa do Endereço (PUT)
 */
export type SubstituirEnderecoDTO = CriarEnderecoDTO;

/**
 * DTO para atualização parcial do Endereço (PATCH)
 */
export type AtualizarEnderecoDTO = Partial<Omit<
    Endereco,
    'id' | '_id' | 'dataAtualizacao' | 'clienteId'
>>;

/**
 * DTO para a Visualização do Endereço (GET/Resposta)
 */
export type ViewEnderecoDTO = Omit<
    Endereco,
    '_id' | 'dataAtualizacao'
>;
