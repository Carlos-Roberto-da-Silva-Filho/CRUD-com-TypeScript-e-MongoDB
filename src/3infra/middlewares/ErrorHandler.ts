import { NextFunction, Request, Response } from 'express';
// Importa a classe base CustomError da camada de Domínio
import CustomError from '../../2domain/exceptions/CustomError'; 

/**
 * Classe responsável por centralizar e tratar todos os erros da aplicação.
 * Converte exceções de Domínio (CustomError) em respostas HTTP padronizadas.
 */
class ErrorHandler {
    
    /**
     * O manipulador de erro estático que será registrado no Express.
     * Deve receber 4 argumentos (error, req, res, next).
     */
    public static handleError(
        error: Error,
        req: Request, 
        res: Response, 
        next: NextFunction
    ): void {
        let status = 500;
        const message = error.message;
        
        // Loga o erro, mantendo o seu estilo original
        console.error(`[Erro] status: ${status}, Message: ${message}, Stack: ${error.stack}`);

        // 1. Tratamento para CustomError (erros conhecidos do Domínio)
        if (error instanceof CustomError) {
            status = error.getStatus();
            
            res.status(status).json({
                status: error.getStatus(),
                message // Usa a mensagem formatada pela Exceção (ex: validação, não encontrado)
            });
            return;
        }

        // 2. Tratamento para Erros Não Mapeados (Erros 500 Desconhecidos)
        // Se não for um CustomError, trata como um erro interno genérico.
        res.status(status).json({
            status,
            message: 'Ocorreu um erro interno no servidor.' // Mensagem genérica para 500
        });
    }

    /**
     * Método estático para retornar a função do manipulador de erros.
     */
    public static init():
        (error: Error, req: Request, res: Response, next: NextFunction) => void {
        return ErrorHandler.handleError;
    }
}

export default ErrorHandler;