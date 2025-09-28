// src/3infra/repositorios/EntregaRepository.ts
import { Entrega, StatusEntrega } from "../../1entidades/Entrega";
import { IEntregaRepositorioInterface } from "../../2domain/interfaces/IEntregaRepositorioInterface";
import { EntregaModel } from "./Schemas/EntregaSchema";
import { injectable } from "inversify";
import mongoose from "mongoose";

interface EntregaDocument extends mongoose.HydratedDocument<Entrega> {}

@injectable()
export class EntregaRepository implements IEntregaRepositorioInterface {

  /** Converte documento do Mongo para entidade de domínio */
  private toDomain(doc: EntregaDocument | null): Entrega | null {
    if (!doc) return null;

    const entrega = new Entrega(
      doc.enderecoEntregaId,                  // agora é Number
      doc.dataPrevista,
      doc.valorFrete,
      doc.produtosNestaEntregaIds,            // agora é Number[]
      doc._id.toString(),
      doc.id
    );

    entrega.status = doc.status;
    entrega.dataEntregaReal = doc.dataEntregaReal;

    return entrega;
  }

  async buscarPorId(id: number): Promise<Entrega | null> {
    const doc = await EntregaModel.findOne({ id }).exec();
    return this.toDomain(doc as EntregaDocument | null);
  }

  async buscarTodos(): Promise<Entrega[]> {
    const docs = await EntregaModel.find().exec() as EntregaDocument[];
    return docs.map(doc => this.toDomain(doc) as Entrega);
  }

  async criar(entidade: Entrega): Promise<Entrega> {
    const novaEntregaDoc = new EntregaModel({
      ...entidade,
      _id: undefined    // deixa o Mongo gerar o _id
    });

    const resultado = await novaEntregaDoc.save();
    return this.toDomain(resultado as EntregaDocument) as Entrega;
  }

  async atualizar(id: number, dados: Partial<Entrega>): Promise<Entrega | null> {
    delete (dados as any)._id;
    delete (dados as any).id;

    const doc = await EntregaModel.findOneAndUpdate(
      { id },
      { $set: dados },
      { new: true }
    ).exec();

    return this.toDomain(doc as EntregaDocument | null);
  }

  async substituir(id: number, dadosCompletos: Entrega): Promise<Entrega | null> {
    const existente = await EntregaModel.findOne({ id }).exec();
    if (!existente) return null;

    const dadosParaSalvar = {
      ...dadosCompletos,
      _id: existente._id
    };

    const doc = await EntregaModel.findOneAndReplace(
      { id },
      dadosParaSalvar,
      { new: true }
    ).exec();

    return this.toDomain(doc as EntregaDocument | null);
  }

  async deletar(id: number): Promise<boolean> {
    const resultado = await EntregaModel.deleteOne({ id }).exec();
    return resultado.deletedCount === 1;
  }

  async atualizarStatus(id: number, novoStatus: StatusEntrega): Promise<Entrega | null> {
    const doc = await EntregaModel.findOneAndUpdate(
      { id },
      { $set: { status: novoStatus } },
      { new: true }
    ).exec();

    return this.toDomain(doc as EntregaDocument | null);
  }

  async buscarPorStatus(status: StatusEntrega): Promise<Entrega[]> {
    const docs = await EntregaModel.find({ status }).exec() as EntregaDocument[];
    return docs.map(doc => this.toDomain(doc) as Entrega);
  }

  async buscarPorEnderecoId(enderecoMongoId: string): Promise<Entrega[]> {
    const docs = await EntregaModel.find({
      enderecoEntregaId: Number(enderecoMongoId)
    }).exec() as EntregaDocument[];

    return docs.map(doc => this.toDomain(doc) as Entrega);
  }
}
