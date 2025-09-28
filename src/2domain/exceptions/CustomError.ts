abstract class CustomError extends Error {
    protected statusCode: number;

    constructor(message: string, statusCode: number) {
        // Chama o construtor da classe base Error
        super(message);
        this.statusCode = statusCode;
        // Captura o nome da classe para melhor rastreamento de erros (Stack trace)
        this.name = this.constructor.name;
    }

    /**
     * Método público para obter o status code HTTP.
     */
    getStatus(): number {
        return this.statusCode;
    }

}

export default CustomError;