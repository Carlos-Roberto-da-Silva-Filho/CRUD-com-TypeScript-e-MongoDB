import CustomError from './CustomError';

class UnauthorizeException extends CustomError {
    /**
     * @param message A mensagem a ser exibida. Padrão: 'Acesso não autorizado'.
     */
    constructor(message: string = 'Acesso não autorizado') {
        // Usa o status 401 para indicar falha de autenticação
        super(message, 401);
    }
}

export default UnauthorizeException;