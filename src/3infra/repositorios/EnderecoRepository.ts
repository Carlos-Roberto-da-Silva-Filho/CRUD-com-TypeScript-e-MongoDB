import { injectable } from "inversify";
import { IEnderecoRepositorioInterface } from "../../2domain/interfaces/IEnderecoRepositorioInterface";
import { Endereco } from "../../1entidades/Endereco";
import { EnderecoModel } from "./Schemas/EnderecoSchema";

@injectable()
export class EnderecoRepository implements IEnderecoRepositorioInterface {

    async buscarTodos(): Promise<Endereco[]> {
        return await EnderecoModel.find().lean();
    }

    async buscarPorId(id: number): Promise<Endereco | null> {
        return await EnderecoModel.findOne({ id }).lean();
    }

    async criar(endereco: Endereco): Promise<Endereco> {
        const novoEndereco = new EnderecoModel(endereco);
        await novoEndereco.save();
        return novoEndereco.toObject();
    }

    async atualizar(id: number, dados: Partial<Endereco>): Promise<Endereco | null> {
        return await EnderecoModel.findOneAndUpdate({ id }, dados, { new: true }).lean();
    }

    async substituir(id: number, dadosCompletos: Endereco): Promise<Endereco | null> {
        const existente = await EnderecoModel.findOne({ id });
        if (!existente) return null;

        dadosCompletos._id = existente._id; // mantém o mesmo ObjectId do Mongo

        const atualizado = await EnderecoModel.findOneAndReplace({ id }, dadosCompletos, { new: true }).lean();
        return atualizado;
    }

    async deletar(id: number): Promise<boolean> {
        const resultado = await EnderecoModel.deleteOne({ id });
        return resultado.deletedCount === 1;
    }

    async buscarPorClienteId(clienteMongoId: string): Promise<Endereco | null> {
        return await EnderecoModel.findOne({ clienteId: clienteMongoId }).lean();
    }

    async deletarPorClienteId(clienteMongoId: string): Promise<boolean> {
        const resultado = await EnderecoModel.deleteMany({ clienteId: clienteMongoId });
        return resultado.deletedCount !== undefined && resultado.deletedCount > 0;
    }
}
