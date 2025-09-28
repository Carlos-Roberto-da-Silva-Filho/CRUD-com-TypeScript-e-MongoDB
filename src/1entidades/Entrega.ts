export enum StatusEntrega {
    PENDENTE = 'PENDENTE',
    EM_TRANSITO = 'EM_TRANSITO',
    ENTREGUE = 'ENTREGUE',
    CANCELADA = 'CANCELADA'
}

/**
 * Entidade de Domínio Entrega.
 */
export class Entrega {
    _id: string; 
    id: number; 
    enderecoEntregaId: number;  // número no domínio
    status: StatusEntrega;
    dataPrevista: Date;
    dataEntregaReal?: Date; 
    valorFrete: number;
    produtosNestaEntregaIds: number[]; // números no domínio

    constructor(
        enderecoEntregaId: number,
        dataPrevista: Date,
        valorFrete: number,
        produtosNestaEntregaIds: number[],
        _id?: string,
        id?: number
    ) {
        this._id = _id || '';
        this.id = id || 0;
        this.enderecoEntregaId = enderecoEntregaId;
        this.dataPrevista = dataPrevista;
        this.valorFrete = valorFrete;
        this.produtosNestaEntregaIds = produtosNestaEntregaIds;
        this.status = StatusEntrega.PENDENTE;
    }
}
