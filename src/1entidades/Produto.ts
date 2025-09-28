/**
 * Entidade de Domínio Produto.
 * O ID customizado 'id' é um number e será preenchido na Camada de Aplicação.
 */
export class Produto {
    // ID do MongoDB (tratado como string no domínio)
    _id: string; 

    // ID customizado incremental (number)
    id: number; 

    nome: string;
    descricao?: string; 
    preco: number; 
    estoque: number;

    constructor(
        nome: string,
        preco: number,
        estoque: number,
        descricao?: string,
        _id?: string,
        id?: number // Recebe o ID customizado (opcional na criação)
    ) {
        this._id = _id || ''; // Mongoose preenche o _id
        this.id = id || 0; // Inicializado com 0, ou com o ID vindo do banco

        this.nome = nome;
        this.descricao = descricao;
        this.preco = preco;
        this.estoque = estoque;
    }
}
