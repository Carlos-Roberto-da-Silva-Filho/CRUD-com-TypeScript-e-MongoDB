/**
 * Interface base que define as operações CRUD comuns para todas as entidades.
 * T é o tipo da Entidade de Domínio.
 */
export interface IRepository<T> {
    buscarPorId(id: number): Promise<T | null>; 
    buscarTodos(pagina?: number, limite?: number): Promise<T[]>; 
    criar(entidade: T): Promise<T>; 
    atualizar(id: number, entidade: Partial<T>): Promise<T | null>; 
    substituir(id: number, dadosCompletos: T): Promise<T | null>;
    deletar(id: number): Promise<boolean>;
}
