import mongoose, { Schema, HydratedDocument } from "mongoose";
import { Cliente } from "../../../1entidades/Cliente";

export interface ClienteDocument extends HydratedDocument<Cliente> {}

const ClienteSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },

    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    telefone: { type: String, required: false },

    enderecoId: {
      type: Schema.Types.ObjectId,
      ref: "Endereco",
      required: false,
    },
    produtosIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Produto",
      },
    ],
    entregasIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Entrega",
      },
    ],
  },
  {
    timestamps: { createdAt: false, updatedAt: false },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const ClienteModel = mongoose.model<ClienteDocument>(
  "Cliente",
  ClienteSchema
);
