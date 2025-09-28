import { IRepository } from "./IRepository";
import { Entrega, StatusEntrega } from "../../1entidades/Entrega";

export interface IEntregaRepositorioInterface extends IRepository<Entrega> {
    buscarPorStatus(status: StatusEntrega): Promise<Entrega[]>;
    buscarPorEnderecoId(enderecoMongoId: string): Promise<Entrega[]>;
    atualizarStatus(id: number, novoStatus: StatusEntrega): Promise<Entrega | null>;
}