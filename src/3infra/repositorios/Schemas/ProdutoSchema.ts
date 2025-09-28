import mongoose, { Schema, HydratedDocument } from "mongoose";
import { Produto } from "../../../1entidades/Produto";

export interface ProdutoDocument extends HydratedDocument<Produto> {}

const ProdutoSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },

    nome: { type: String, required: true, unique: true },
    descricao: { type: String, required: false },
    preco: { type: Number, required: true, min: 0 },
    estoque: { type: Number, required: true, min: 0 },
  },
  {
    timestamps: { createdAt: false, updatedAt: false },
  }
);

export const ProdutoModel = mongoose.model<ProdutoDocument>(
  "Produto",
  ProdutoSchema
);
