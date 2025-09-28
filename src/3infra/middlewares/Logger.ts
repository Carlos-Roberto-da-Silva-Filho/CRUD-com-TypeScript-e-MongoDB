import { Request, Response, NextFunction } from 'express';

/**
 * Classe responsável por registrar informações básicas sobre cada requisição.
 */
class Logger {
    
    private static implementacao(req: Request, res: Response, next: NextFunction) {
        const timestamp = new Date().toISOString();
        // Loga informações da requisição (método e URL)
        console.info(`${timestamp} Chamada ao método: ${req.method} url: ${req.url} `);
        
        next();
    }

    /**
     * Método estático para retornar a função do middleware para uso no Express.
     */
    static init() {
        return this.implementacao;
    }
}
export default Logger;
