import { Cliente } from "../../1entidades/Cliente";
import { IClienteRepositorioInterface } from "../../2domain/interfaces/IClienteRepositorioInterface";
import { ClienteModel, ClienteDocument } from "./Schemas/ClienteSchema";
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class ClienteRepository implements IClienteRepositorioInterface {

    /** Converte o documento do Mongoose para a Entidade de Domínio */
    private toDomain(doc: ClienteDocument | null): Cliente | null {
        if (!doc) return null;

        const cliente = new Cliente(
            doc.nome,
            doc.email,
            doc.senha,
            doc.telefone,
            doc._id.toString(),
            doc.id
        );

        cliente.enderecoId = doc.enderecoId ? doc.enderecoId.toString() : undefined;
        cliente.produtosIds = doc.produtosIds ? doc.produtosIds.map(id => id.toString()) : [];
        cliente.entregasIds = doc.entregasIds ? doc.entregasIds.map(id => id.toString()) : [];

        return cliente;
    }

    /** Busca cliente pelo ID Mongo (_id) */
    async buscarPorMongoId(_id: string): Promise<Cliente | null> {
        const doc = await ClienteModel.findById(_id).exec();
        return this.toDomain(doc as ClienteDocument | null);
    }

    /** Vincula endereço a um cliente */
    async vincularEndereco(clienteIdMongo: string, enderecoIdMongo: string): Promise<Cliente | null> {
        const doc = await ClienteModel.findByIdAndUpdate(
            clienteIdMongo,
            { $set: { enderecoId: enderecoIdMongo } },
            { new: true }
        ).exec();

        return this.toDomain(doc as ClienteDocument | null);
    }

    /** Remove vínculo do endereço */
    async desvincularEndereco(clienteIdMongo: string): Promise<Cliente | null> {
        const doc = await ClienteModel.findByIdAndUpdate(
            clienteIdMongo,
            { $unset: { enderecoId: 1 } },
            { new: true }
        ).exec();

        return this.toDomain(doc as ClienteDocument | null);
    }

    /** Busca cliente pelo ID customizado */
    async buscarPorId(id: number): Promise<Cliente | null> {
        const doc = await ClienteModel.findOne({ id }).exec();
        return this.toDomain(doc as ClienteDocument | null);
    }

    /** Busca todos os clientes com paginação */
    async buscarTodos(pagina = 1, limite = 10): Promise<Cliente[]> {
        const offset = (pagina - 1) * limite;
        const docs = await ClienteModel.find().skip(offset).limit(limite).exec() as ClienteDocument[];
        return docs.map(doc => this.toDomain(doc) as Cliente);
    }

    /** Cria um novo cliente */
    async criar(entidade: Cliente): Promise<Cliente> {
        const { _id, ...dados } = entidade as any;
        const novoCliente = new ClienteModel(dados);
        const resultado = await novoCliente.save();
        return this.toDomain(resultado as ClienteDocument) as Cliente;
    }

    /** Atualiza parcialmente os dados do cliente */
    async atualizar(id: number, entidade: Partial<Cliente>): Promise<Cliente | null> {
        delete (entidade as any).id;
        delete (entidade as any)._id;
        delete (entidade as any).produtosIds;
        delete (entidade as any).entregasIds;
        delete (entidade as any).enderecoId;

        const doc = await ClienteModel.findOneAndUpdate(
            { id },
            { $set: entidade },
            { new: true }
        ).exec();

        return this.toDomain(doc as ClienteDocument | null);
    }

    /** Substitui completamente os dados de um cliente */
    async substituir(id: number, dadosCompletos: Cliente): Promise<Cliente | null> {
        const { _id, ...dados } = dadosCompletos;

        // Força que o 'id' do novo documento seja o mesmo da rota
        dados.id = id;

        const doc = await ClienteModel.findOneAndReplace(
            { id },
            dados,
            { new: true }
        ).exec();

        return this.toDomain(doc as ClienteDocument | null);
    }

    /** Deleta um cliente pelo ID customizado */
    async deletar(id: number): Promise<boolean> {
        const resultado = await ClienteModel.deleteOne({ id }).exec();
        return resultado.deletedCount === 1;
    }
}
