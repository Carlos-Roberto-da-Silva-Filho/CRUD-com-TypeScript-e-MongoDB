import { ValidationError } from 'express-validator';
import CustomError from './CustomError';

class BadRequestException extends CustomError {
    /**
     * @param messages Array de ValidationError do express-validator ou array de strings.
     */
    constructor(messages: Array<ValidationError | string>) {
        
        // Trata o array de mensagens para obter apenas a string de erro
        const mensagemTratada = messages.map(m => {
            if (typeof m === 'string') {
                return m;
            }
            return m.msg;
        });

        // Chama o construtor da classe base com a mensagem concatenada e status 400
        super(mensagemTratada.toString(), 400);
    }
}

export default BadRequestException;