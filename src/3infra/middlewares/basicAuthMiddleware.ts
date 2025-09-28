import { Request, Response, NextFunction } from 'express';
// Importa a exceção da camada de Domínio
import UnauthorizeException from '../../2domain/exceptions/UnauthorizeException'; 

// Credenciais de exemplo (devem ser carregadas de variáveis de ambiente em produção)
const USUARIO = 'UsuarioValido';
const SENHA = 'SenhaValida';

// Estende a interface Request do Express para incluir o campo 'user'
declare global {
    namespace Express {
        interface Request {
            user?: { username: string };
        }
    }
}

/**
 * Middleware para autenticação Basic Auth.
 * Valida as credenciais no cabeçalho Authorization.
 */
export const basicAuthMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        // Se não há header, solicita credenciais e lança exceção (será tratada pelo ErrorHandler)
        res.set('WWW-Authenticate', 'Basic realm="Protected Route"');
        throw new UnauthorizeException('Credenciais de autenticação são necessárias');
    }

    // 1. Verifica o formato
    if (!authHeader.startsWith('Basic ')) {
        throw new UnauthorizeException('Formato de autenticação inválido. Use Basic Auth');
    }

    // 2. Extrai e decodifica as credenciais
    const base64Credentials = authHeader.split(' ')[1];
    
    // Tratamento de erro para decodificação inválida (ex: Base64 corrompido)
    let credentials;
    try {
        credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    } catch (error) {
        throw new UnauthorizeException('Formato de credenciais Base64 inválido.');
    }
    
    const [username, password] = credentials.split(':');

    // 3. Valida as credenciais
    if (username === USUARIO && password === SENHA) {
        // Adiciona informações do usuário ao objeto Request para uso em rotas posteriores
        req.user = { username };
        next(); // Passa para o próximo middleware/rota
    } else {
        // Lança exceção se as credenciais não baterem
        throw new UnauthorizeException();
    }
};
