import CustomError from './CustomError';

class NotFoundException extends CustomError {
    /**
     * @param message A mensagem a ser exibida. Padrão: 'Dado não encontrado'.
     */
    constructor(message: string = 'Dado não encontrado') {
        // Usa o status 404 para indicar que o recurso não existe
        super(message, 404);
    }
}

export default NotFoundException;