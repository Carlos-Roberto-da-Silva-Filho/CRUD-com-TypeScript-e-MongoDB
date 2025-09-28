/**
 * Entidade de Domínio Endereco.
 * O ID customizado 'id' é um number.
 */
export class Endereco {
    _id?: string; // Agora opcional e sem inicialização
    id: number; // ID customizado incremental (number)
    
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string; 
    bairro: string;
    cidade: string;
    estado: string;
    
    // Relacionamento 1:1: ID do Cliente
    clienteId: string; 

    constructor(
        cep: string,
        logradouro: string,
        numero: string,
        bairro: string,
        cidade: string,
        estado: string,
        clienteId: string,
        complemento?: string,
        _id?: string,
        id?: number // Recebe o ID customizado (opcional na criação)
    ) {
        this._id = _id; // Agora apenas atribui o valor se fornecido
        this.id = id || 0; // Inicializado com 0 ou valor fornecido
        
        this.cep = cep;
        this.logradouro = logradouro;
        this.numero = numero;
        this.bairro = bairro;
        this.cidade = cidade;
        this.estado = estado;
        this.complemento = complemento;
        
        this.clienteId = clienteId; 
    }
}
