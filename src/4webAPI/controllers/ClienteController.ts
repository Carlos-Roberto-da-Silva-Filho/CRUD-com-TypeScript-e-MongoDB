import { Router, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { body, param, validationResult } from 'express-validator';
import { TYPES } from '../../config/types';
import { ClienteService } from '../../2domain/services/ClienteService';
import { CriarClienteDTO, AtualizarClienteDTO, SubstituirClienteDTO } from '../../2domain/dtos/ClienteDTOs';
import BadRequestException from '../../2domain/exceptions/BadRequestException';

@injectable()
export class ClienteController {
    public router: Router = Router();

    constructor(
        @inject(TYPES.ClienteService)
        private readonly clienteService: ClienteService
    ) {
        this.routes();
    }

    private routes() {
        this.router.get('/', this.buscarClientes.bind(this));
        this.router.get('/:id', [
            param('id').isNumeric().withMessage('O id deve ser numérico')
        ], this.buscarClientePorId.bind(this));
        this.router.post('/', [
            body('nome').exists().isString(),
            body('email').exists().isEmail(),
            body('senha').exists().isString(),
            body('telefone').optional().isString()
        ], this.criarCliente.bind(this));
        this.router.patch('/:id', [
            param('id').isNumeric(),
            body('nome').optional().isString(),
            body('email').optional().isEmail(),
            body('senha').optional().isString(),
            body('telefone').optional().isString()
        ], this.atualizarClienteParcial.bind(this));
        this.router.put('/:id', [
            param('id').isNumeric(),
            body('nome').exists().isString(),
            body('email').exists().isEmail(),
            body('senha').exists().isString(),
            body('telefone').exists().isString()
        ], this.substituirCliente.bind(this));
        this.router.delete('/:id', [
            param('id').isNumeric()
        ], this.deletarClientePorId.bind(this));
    }

    /**
     * @swagger
     * /clientes:
     *   get:
     *     summary: Lista todos os clientes
     *     tags: [Clientes]
     *     security:
     *       - BasicAuth: []
     *     responses:
     *       200:
     *         description: Lista de clientes
     */
    public async buscarClientes(req: Request, res: Response) {
        const clientes = await this.clienteService.buscarTodosClientes();
        res.json(clientes);
    }

    /**
     * @swagger
     * /clientes/{id}:
     *   get:
     *     summary: Busca um cliente pelo ID
     *     tags: [Clientes]
     *     security:
     *       - BasicAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID do cliente
     *     responses:
     *       200:
     *         description: Cliente encontrado
     *       400:
     *         description: ID inválido
     */
    public async buscarClientePorId(req: Request, res: Response) {
        const erros = validationResult(req);
        if (!erros.isEmpty()) throw new BadRequestException(erros.array());
        const id = +req.params.id;
        const cliente = await this.clienteService.buscarClientePorId(id);
        res.status(200).json(cliente);
    }

    /**
     * @swagger
     * /clientes:
     *   post:
     *     summary: Cria um novo cliente
     *     tags: [Clientes]
     *     security:
     *       - BasicAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CriarClienteDTO'
     *           example:
     *             nome: "Emanuel"
     *             email: "emanuel@example.com"
     *             senha: "123"
     *             telefone: "(11) 98765-4321"
     *     responses:
     *       201:
     *         description: Cliente criado com sucesso
     *       400:
     *         description: Dados inválidos
     */
    public async criarCliente(req: Request, res: Response) {
        const erros = validationResult(req);
        if (!erros.isEmpty()) throw new BadRequestException(erros.array());
        const dados: CriarClienteDTO = req.body;
        const cliente = await this.clienteService.criarCliente(dados);
        res.status(201).json(cliente);
    }

    /**
     * @swagger
     * /clientes/{id}:
     *   patch:
     *     summary: Atualiza parcialmente um cliente
     *     tags: [Clientes]
     *     security:
     *       - BasicAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID do cliente
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/AtualizarClienteDTO'
     *           example:
     *             nome: "Emanuel"
     *             email: "emanuel@example.com"
     *             senha: "123"
     *             telefone: "(11) 98765-4321"
     *     responses:
     *       200:
     *         description: Cliente atualizado com sucesso
     *       400:
     *         description: Dados inválidos
     */
    public async atualizarClienteParcial(req: Request, res: Response) {
        const erros = validationResult(req);
        if (!erros.isEmpty()) throw new BadRequestException(erros.array());
        const id = +req.params.id;
        const dados: Partial<AtualizarClienteDTO> = req.body;
        const cliente = await this.clienteService.atualizarCliente(id, dados);
        res.status(200).json({ mensagem: 'Cliente atualizado com sucesso', cliente });
    }

    /**
     * @swagger
     * /clientes/{id}:
     *   put:
     *     summary: Substitui completamente um cliente
     *     tags: [Clientes]
     *     security:
     *       - BasicAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID do cliente
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/SubstituirClienteDTO'
     *           example:
     *             nome: "Emanuel"
     *             email: "emanuel@example.com"
     *             senha: "123"
     *             telefone: "(11) 98765-4321"
     *     responses:
     *       200:
     *         description: Cliente substituído com sucesso
     *       400:
     *         description: Dados inválidos
     */
    public async substituirCliente(req: Request, res: Response) {
        const erros = validationResult(req);
        if (!erros.isEmpty()) throw new BadRequestException(erros.array());
        const id = +req.params.id;
        const dados: SubstituirClienteDTO = req.body;
        const cliente = await this.clienteService.substituirCliente(id, dados);
        res.status(200).json({ mensagem: 'Cliente substituído com sucesso', cliente });
    }

    /**
     * @swagger
     * /clientes/{id}:
     *   delete:
     *     summary: Remove um cliente pelo ID
     *     tags: [Clientes]
     *     security:
     *       - BasicAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID do cliente
     *     responses:
     *       200:
     *         description: Cliente excluído com sucesso
     *       400:
     *         description: ID inválido
     */
    public async deletarClientePorId(req: Request, res: Response) {
        const erros = validationResult(req);
        if (!erros.isEmpty()) throw new BadRequestException(erros.array());
        const id = +req.params.id;
        await this.clienteService.deletarCliente(id);
        res.status(200).json('Cliente excluído com sucesso');
    }
}
