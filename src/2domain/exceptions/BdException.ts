import CustomError from './CustomError';

class BdException extends CustomError {
    /**
     * @param message A mensagem de erro original vinda do banco de dados (ex: erro do Mongoose).
     */
    constructor(message: string) {
        // Usa o status 500 para erros internos de Banco de Dados
        super(message.toString(), 500);
        // Mantendo o console.log no construtor como no seu código original
        console.log('Banco de dados Error: ', super.message);
    }
}

export default BdException;