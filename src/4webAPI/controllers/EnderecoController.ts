import { Router, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { body, param, validationResult } from 'express-validator';
import { TYPES } from '../../config/types';
import { EnderecoService } from '../../2domain/services/EnderecoService';
import { CriarEnderecoDTO, AtualizarEnderecoDTO, SubstituirEnderecoDTO } from '../../2domain/dtos/EnderecoDTOs';
import BadRequestException from '../../2domain/exceptions/BadRequestException';

@injectable()
export class EnderecoController {
    public router: Router = Router();

    constructor(
        @inject(TYPES.EnderecoService)
        private readonly enderecoService: EnderecoService
    ) {
        this.routes();
    }

    private routes() {
        this.router.get('/', this.buscarEnderecos.bind(this));
        this.router.get('/:id', [param('id').isNumeric().withMessage('O id deve ser numérico')], this.buscarEnderecoPorId.bind(this));
        this.router.post('/', [
            body('cep').exists().isString(),
            body('logradouro').exists().isString(),
            body('numero').exists().isString(),
            body('bairro').exists().isString(),
            body('cidade').exists().isString(),
            body('estado').exists().isString(),
            body('clienteId').exists().isString(),
            body('complemento').optional().isString()
        ], this.criarEndereco.bind(this));
        this.router.patch('/:id', [
            param('id').isNumeric(),
            body('cep').optional().isString(),
            body('logradouro').optional().isString(),
            body('numero').optional().isString(),
            body('bairro').optional().isString(),
            body('cidade').optional().isString(),
            body('estado').optional().isString(),
            body('complemento').optional().isString()
        ], this.atualizarEndereco.bind(this));
        this.router.put('/:id', [
            param('id').isNumeric(),
            body('cep').exists().isString(),
            body('logradouro').exists().isString(),
            body('numero').exists().isString(),
            body('bairro').exists().isString(),
            body('cidade').exists().isString(),
            body('estado').exists().isString(),
            body('clienteId').exists().isString(),
            body('complemento').optional().isString()
        ], this.substituirEndereco.bind(this));
        this.router.delete('/:id', [param('id').isNumeric()], this.deletarEndereco.bind(this));
    }

    /**
     * @swagger
     * /enderecos:
     *   get:
     *     summary: Lista todos os endereços
     *     tags: [Endereços]
     *     security:
     *       - BasicAuth: []
     *     responses:
     *       200:
     *         description: Lista de endereços
     */
    public async buscarEnderecos(req: Request, res: Response) {
        const enderecos = await this.enderecoService.buscarTodosEnderecos();
        res.json(enderecos);
    }

    /**
     * @swagger
     * /enderecos/{id}:
     *   get:
     *     summary: Busca um endereço pelo ID
     *     tags: [Endereços]
     *     security:
     *       - BasicAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID do endereço
     *     responses:
     *       200:
     *         description: Endereço encontrado
     *       400:
     *         description: ID inválido
     */
    public async buscarEnderecoPorId(req: Request, res: Response) {
        const erros = validationResult(req);
        if (!erros.isEmpty()) throw new BadRequestException(erros.array());

        const id = +req.params.id;
        const endereco = await this.enderecoService.buscarEnderecoPorId(id);
        res.status(200).json(endereco);
    }

    /**
     * @swagger
     * /enderecos:
     *   post:
     *     summary: Cria um novo endereço
     *     tags: [Endereços]
     *     security:
     *       - BasicAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CriarEnderecoDTO'
     *           example:
     *             cep: "12345-678"
     *             logradouro: "Rua das Flores"
     *             numero: "123"
     *             bairro: "Jardim Primavera"
     *             cidade: "São Paulo"
     *             estado: "SP"
     *             clienteId: "1"
     *             complemento: "Apto 45"
     *     responses:
     *       201:
     *         description: Endereço criado com sucesso
     *       400:
     *         description: Dados inválidos
     */
    public async criarEndereco(req: Request, res: Response) {
        const erros = validationResult(req);
        if (!erros.isEmpty()) throw new BadRequestException(erros.array());

        const dados: CriarEnderecoDTO = req.body;
        const endereco = await this.enderecoService.criarEndereco(dados);
        res.status(201).json(endereco);
    }

    /**
     * @swagger
     * /enderecos/{id}:
     *   patch:
     *     summary: Atualiza parcialmente um endereço
     *     tags: [Endereços]
     *     security:
     *       - BasicAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID do endereço
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/AtualizarEnderecoDTO'
     *           example:
     *             cep: "98765-432"
     *             logradouro: "Avenida Central"
     *             numero: "456"
     *             bairro: "Centro"
     *             cidade: "Rio de Janeiro"
     *             estado: "RJ"
     *             complemento: "Sala 101"
     *     responses:
     *       200:
     *         description: Endereço atualizado com sucesso
     *       400:
     *         description: Dados inválidos
     */
    public async atualizarEndereco(req: Request, res: Response) {
        const erros = validationResult(req);
        if (!erros.isEmpty()) throw new BadRequestException(erros.array());

        const id = +req.params.id;
        const dados: AtualizarEnderecoDTO = req.body;
        const endereco = await this.enderecoService.atualizarEndereco(id, dados);
        res.status(200).json({ mensagem: 'Endereço atualizado com sucesso', endereco });
    }

    /**
     * @swagger
     * /enderecos/{id}:
     *   put:
     *     summary: Substitui completamente um endereço
     *     tags: [Endereços]
     *     security:
     *       - BasicAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID do endereço
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/SubstituirEnderecoDTO'
     *           example:
     *             cep: "11223-445"
     *             logradouro: "Rua Nova"
     *             numero: "789"
     *             bairro: "Bairro Alto"
     *             cidade: "Curitiba"
     *             estado: "PR"
     *             clienteId: "2"
     *             complemento: "Casa B"
     *     responses:
     *       200:
     *         description: Endereço substituído com sucesso
     *       400:
     *         description: Dados inválidos
     */
    public async substituirEndereco(req: Request, res: Response) {
        const erros = validationResult(req);
        if (!erros.isEmpty()) throw new BadRequestException(erros.array());

        const id = +req.params.id;
        const dados: SubstituirEnderecoDTO = req.body;
        const endereco = await this.enderecoService.substituirEndereco(id, dados);
        res.status(200).json({ mensagem: 'Endereço substituído com sucesso', endereco });
    }

    /**
     * @swagger
     * /enderecos/{id}:
     *   delete:
     *     summary: Remove um endereço pelo ID
     *     tags: [Endereços]
     *     security:
     *       - BasicAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID do endereço
     *     responses:
     *       200:
     *         description: Endereço excluído com sucesso
     *       400:
     *         description: ID inválido
     */
    public async deletarEndereco(req: Request, res: Response) {
        const erros = validationResult(req);
        if (!erros.isEmpty()) throw new BadRequestException(erros.array());

        const id = +req.params.id;
        await this.enderecoService.deletarEndereco(id);
        res.status(200).json({ mensagem: 'Endereço deletado com sucesso' });
    }
}
