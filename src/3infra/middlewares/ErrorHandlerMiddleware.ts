// ARQUIVO: src/3infra/middlewares/ErrorHandlerMiddleware.ts

import { Request, Response, NextFunction } from 'express';
// Importa a classe base CustomError da camada de Domínio
import CustomError from '../../2domain/exceptions/CustomError'; 
// Importamos o objeto ValidationError do express-validator (necessário para formatação)
import { ValidationError } from 'express-validator'; 

// O tipo de detalhes de erro que esperamos (string ou objeto de validação)
type ErrorDetail = string | ValidationError;

/**
 * Classe responsável por centralizar e tratar todos os erros da aplicação.
 * Converte exceções de Domínio (CustomError) em respostas HTTP padronizadas.
 */
class ErrorHandler {
    
    /**
     * Helper para formatar o objeto de erro (especialmente útil para BadRequest)
     */
    private static formatErrorDetails(error: CustomError): ErrorDetail[] {
        // Se a exceção tiver uma propriedade 'details' (como esperamos das suas classes)
        if (Array.isArray((error as any).details)) {
            return (error as any).details;
        }
        // Caso contrário, retorna a mensagem principal como um array
        return [error.message];
    }

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
        let message = 'Ocorreu um erro interno no servidor.';
        let details: ErrorDetail[] = [];
        
        // 1. Tratamento para CustomError (erros conhecidos do Domínio)
        if (error instanceof CustomError) {
            const customError = error as CustomError;
            status = customError.getStatus();
            message = customError.message; 
            details = ErrorHandler.formatErrorDetails(customError);

            // Loga o erro de forma mais controlada
            console.warn(`[API ERROR] Status: ${status} | Message: ${message} | Path: ${req.url}`);
            
            res.status(status).json({
                status,
                message, // Mensagem de erro principal (ex: "Cliente não encontrado")
                errors: details, // Lista de detalhes/validações
                timestamp: new Date().toISOString(),
                path: req.url,
            });
            return;
        }

        // 2. Tratamento para Erros Não Mapeados (Erros 500 Desconhecidos)
        // Loga o erro de sistema completo
        console.error(`[SERVER ERROR] Status: 500 | Message: ${error.message} | Stack: ${error.stack}`);
        
        res.status(status).json({
            status,
            message,
            errors: [error.message || message],
            timestamp: new Date().toISOString(),
            path: req.url,
        });
    }

    /**
     * Método estático para retornar a função do manipulador de erros (o que o Express registra).
     */
    public static init():
        (error: Error, req: Request, res: Response, next: NextFunction) => void {
        return ErrorHandler.handleError;
    }
}

export const errorHandlerMiddleware = ErrorHandler.init(); 
// Exportamos a função manipuladora diretamente para uso no app.use()
// (Ou você pode exportar a classe e chamar ErrorHandler.init() no main.ts)