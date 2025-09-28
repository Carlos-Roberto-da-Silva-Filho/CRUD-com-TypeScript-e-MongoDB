import { IRepository } from "./IRepository";
import { Endereco } from "../../1entidades/Endereco";

export interface IEnderecoRepositorioInterface extends IRepository<Endereco> {
    buscarPorClienteId(clienteMongoId: string): Promise<Endereco | null>;
    deletarPorClienteId(clienteMongoId: string): Promise<boolean>;
}