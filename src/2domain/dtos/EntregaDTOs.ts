import { Entrega } from "../../1entidades/Entrega";

/**
 * DTO para criação de entrega
 */
export type CriarEntregaDTO = Omit<Entrega, 'id' | '_id' | 'status' | 'dataEntregaReal'>;

/**
 * DTO para substituição completa
 */
export type SubstituirEntregaDTO = CriarEntregaDTO;

/**
 * DTO para atualização parcial
 */
export type AtualizarEntregaDTO = Partial<Omit<Entrega, 'id' | '_id' | 'enderecoEntregaId'>>;

/**
 * DTO para visualização
 */
export type ViewEntregaDTO = Omit<Entrega, '_id'>;
