import CustomError from './CustomError';

class ConflictException extends CustomError {
    /**
     * @param message A mensagem a ser exibida. Padrão: 'Conflito: o recurso já existe ou os dados violam uma restrição única.'
     */
    constructor(message: string = 'Conflito: o recurso já existe ou os dados violam uma restrição única.') {
        // Usa o status 409 para indicar um conflito de dados
        super(message, 409);
    }
}

export default ConflictException;