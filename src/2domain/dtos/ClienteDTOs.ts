// DTO para a Criação (POST) - Campos obrigatórios iniciais
export interface CriarClienteDTO {
    nome: string;
    email: string;
    senha: string;
    telefone?: string; // Opcional no POST
}

// DTO para a Atualização Parcial (PATCH) - Todos os campos opcionais
export type AtualizarClienteDTO = Partial<CriarClienteDTO>;

// DTO para a Substituição Completa (PUT) - Requer todos os campos (exceto ID e Mongo _id)
export interface SubstituirClienteDTO {
    nome: string;
    email: string;
    senha: string;
    telefone?: string;
}

// DTO para a Visualização (GET/Resposta) - Não expõe campos sensíveis (ex: senha)
export interface ViewClienteDTO {
    id: number;
    nome: string;
    email: string;
    telefone?: string;
}
