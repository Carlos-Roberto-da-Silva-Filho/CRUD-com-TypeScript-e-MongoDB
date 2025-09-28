import 'dotenv/config'; 
import mongoose, { ConnectOptions } from 'mongoose';
import { env } from 'process'; // Importa 'env' para TypeScript

/**
 * A classe MongooseConfig encapsula a lógica de conexão com o banco.
 * Utiliza variáveis de ambiente para obter a URI de conexão.
 */
class MongooseConfig {
    /**
     * Tenta estabelecer a conexão com o MongoDB.
     * @returns Promise<void>
     */
    static async connect(): Promise<void> {
        try {
            // Usamos a variável de ambiente única MONGO_URI
            const CHAVEMONGO = env.MONGO_URI;

            if (!CHAVEMONGO) {
                // Se a chave não for encontrada, lança um erro e encerra a aplicação.
                throw new Error('Chave MONGO_URI não encontrada no ambiente. Verifique seu arquivo .env.');
            }

            // Opções de conexão (mantendo o connectTimeoutMS)
            const connectOptions: ConnectOptions = { 
                connectTimeoutMS: 5000 
            }; 

            // Estabelece a conexão
            await mongoose.connect(CHAVEMONGO, connectOptions);

            console.log('Conectado ao MongoDB (db_mongoose).');
            
        } catch (error) {
            console.error('Erro ao conectar ao MongoDB:', error);
            // Encerra o processo em caso de falha crítica na inicialização
            process.exit(1); 
        }
    }
    
    /**
     * Função para fechar a conexão, útil para testes.
     * @returns Promise<void>
     */
    static async disconnect(): Promise<void> {
        await mongoose.disconnect();
        console.log('Conexão com o MongoDB encerrada.');
    }
}

// Exporta a classe para ser usada no arquivo principal (main.ts)
export default MongooseConfig;