/**
 * Entidade de Domínio Cliente.
 * O ID customizado 'id' é um number e será preenchido na Camada de Aplicação.
 */
export class Cliente {
    // ID do MongoDB (tratado como string no domínio)
    _id: string; 
    
    // ID customizado incremental (number)
    id: number; 
    
    nome: string;
    email: string; 
    senha: string; 
    telefone: string;
    
    // Relacionamentos: Referências aos IDs das outras entidades
    enderecoId?: string; 
    produtosIds: string[]; 
    entregasIds: string[]; 

    constructor(
        nome: string,
        email: string,
        senha: string,
        telefone: string,
        _id?: string,
        id?: number // Recebe o ID customizado (opcional na criação, preenchido no banco)
    ) {
        this._id = _id || ''; // Mongoose preenche o _id
        
        // Inicializado com 0, ou com o ID vindo do banco
        this.id = id || 0; 

        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.telefone = telefone;
        
        this.produtosIds = [];
        this.entregasIds = [];

    }
}