import { Produto } from "../../1entidades/Produto";

/**
 * DTO para a Criação de um novo Produto (POST)
 */
export type CriarProdutoDTO = Omit<
    Produto,
    'id' | '_id' | 'dataAtualizacao'
>;

/**
 * DTO para a Substituição Completa do Produto (PUT)
 */
export type SubstituirProdutoDTO = CriarProdutoDTO;

/**
 * DTO para atualização parcial do Produto (PATCH)
 */
export type AtualizarProdutoDTO = Partial<Omit<
    Produto,
    'id' | '_id' | 'dataAtualizacao'
>>;

/**
 * DTO para a Visualização do Produto (GET/Resposta)
 */
export type ViewProdutoDTO = Omit<
    Produto,
    '_id'
>;
