// src/3infra/repositorios/Schemas/EntregaSchema.ts
import mongoose, { Schema } from "mongoose";
import { Entrega, StatusEntrega } from "../../../1entidades/Entrega";

const EntregaSchema = new Schema<Entrega>({
  id: { type: Number, required: true, unique: true },               // id incremental
  enderecoEntregaId: { type: Number, required: true },              // agora é Number
  produtosNestaEntregaIds: { type: [Number], required: true },      // agora é array de Number
  dataPrevista: { type: Date, required: true },
  valorFrete: { type: Number, required: true },
  status: { type: String, enum: Object.values(StatusEntrega), default: StatusEntrega.PENDENTE },
  dataEntregaReal: { type: Date }
});

export const EntregaModel = mongoose.model<Entrega>("Entrega", EntregaSchema);
