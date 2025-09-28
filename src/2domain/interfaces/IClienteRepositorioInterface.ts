import { IRepository } from "./IRepository";
import { Cliente } from "../../1entidades/Cliente";

export interface IClienteRepositorioInterface extends IRepository<Cliente> {
    /**
     * Vincula endereço a um cliente
     * @param clienteIdMongo ID Mongo do cliente
     * @param enderecoIdMongo ID Mongo do endereço
     */
    vincularEndereco(clienteIdMongo: string, enderecoIdMongo: string): Promise<Cliente | null>;

    /** Remove vínculo do endereço */
    desvincularEndereco(clienteIdMongo: string): Promise<Cliente | null>;

    /** Busca cliente pelo ID Mongo (_id) */
    buscarPorMongoId(_id: string): Promise<Cliente | null>;
}
