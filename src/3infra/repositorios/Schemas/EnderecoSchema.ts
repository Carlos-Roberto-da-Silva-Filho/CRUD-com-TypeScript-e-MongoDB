import mongoose, { Schema, HydratedDocument } from "mongoose";
import { Endereco } from "../../../1entidades/Endereco";

export interface EnderecoDocument extends HydratedDocument<Endereco> {}

const EnderecoSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },

    cep: { type: String, required: true },
    logradouro: { type: String, required: true },
    numero: { type: String, required: true },
    complemento: { type: String, required: false },
    bairro: { type: String, required: true },
    cidade: { type: String, required: true },
    estado: { type: String, required: true },

    clienteId: {
      type: Schema.Types.ObjectId,
      ref: "Cliente",
      required: true,
      unique: true,
    },
  },
  {
    timestamps: { createdAt: false, updatedAt: false },
  }
);

export const EnderecoModel = mongoose.model<EnderecoDocument>(
  "Endereco",
  EnderecoSchema
);
