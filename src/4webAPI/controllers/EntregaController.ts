import { Router, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { body, param, validationResult } from 'express-validator';
import { TYPES } from '../../config/types';
import { EntregaService } from '../../2domain/services/EntregaService';
import { CriarEntregaDTO, AtualizarEntregaDTO, SubstituirEntregaDTO } from '../../2domain/dtos/EntregaDTOs';
import BadRequestException from '../../2domain/exceptions/BadRequestException';
import { StatusEntrega } from '../../1entidades/Entrega';

@injectable()
export class EntregaController {
    public router: Router = Router();

    constructor(
        @inject(TYPES.EntregaService)
        private readonly entregaService: EntregaService
    ) {
        this.routes();
    }

    private routes() {
        this.router.get('/', this.buscarTodasEntregas.bind(this));
        this.router.get('/:id', [param('id').isNumeric()], this.buscarEntregaPorId.bind(this));
        this.router.get('/endereco/:enderecoId', [param('enderecoId').isNumeric()], this.buscarPorEndereco.bind(this));
        this.router.post('/', [
            body('enderecoEntregaId').exists().isNumeric(),
            body('dataPrevista').exists().isISO8601(),
            body('valorFrete').exists().isFloat({ gt: 0 }),
            body('produtosNestaEntregaIds').exists().isArray({ min: 1 }),
            body('produtosNestaEntregaIds.*').isNumeric()
        ], this.criarEntrega.bind(this));
        this.router.patch('/:id', [param('id').isNumeric()], this.atualizarEntrega.bind(this));
        this.router.put('/:id', [param('id').isNumeric()], this.substituirEntrega.bind(this));
        this.router.delete('/:id', [param('id').isNumeric()], this.deletarEntrega.bind(this));
        this.router.patch('/:id/status', [
            param('id').isNumeric(),
            body('status').exists().isIn(Object.values(StatusEntrega))
        ], this.atualizarStatus.bind(this));
    }

    private validarErros(req: Request) {
        const erros = validationResult(req);
        if (!erros.isEmpty()) throw new BadRequestException(erros.array());
    }

    /**
     * @swagger
     * /entregas:
     *   get:
     *     summary: Lista todas as entregas
     *     tags: [Entregas]
     *     security:
     *       - BasicAuth: []
     *     responses:
     *       200:
     *         description: Lista de entregas
     */
    public async buscarTodasEntregas(req: Request, res: Response) {
        const entregas = await this.entregaService.buscarTodasEntregas();
        res.status(200).json(entregas);
    }

    /**
     * @swagger
     * /entregas/{id}:
     *   get:
     *     summary: Busca uma entrega pelo ID
     *     tags: [Entregas]
     *     security:
     *       - BasicAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID da entrega
     *     responses:
     *       200:
     *         description: Entrega encontrada
     *       400:
     *         description: ID inválido
     */
    public async buscarEntregaPorId(req: Request, res: Response) {
        this.validarErros(req);
        const id = +req.params.id;
        const entrega = await this.entregaService.buscarEntregaPorId(id);
        res.status(200).json(entrega);
    }

    /**
     * @swagger
     * /entregas/endereco/{enderecoId}:
     *   get:
     *     summary: Busca entregas por endereço
     *     tags: [Entregas]
     *     security:
     *       - BasicAuth: []
     *     parameters:
     *       - in: path
     *         name: enderecoId
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID do endereço
     *     responses:
     *       200:
     *         description: Entregas encontradas
     *       400:
     *         description: ID inválido
     */
    public async buscarPorEndereco(req: Request, res: Response) {
        this.validarErros(req);
        const enderecoId = +req.params.enderecoId;
        const entregas = await this.entregaService.buscarPorEndereco(enderecoId);
        res.status(200).json(entregas);
    }

    /**
     * @swagger
     * /entregas:
     *   post:
     *     summary: Cria uma nova entrega
     *     tags: [Entregas]
     *     security:
     *       - BasicAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CriarEntregaDTO'
     *           example:
     *             enderecoEntregaId: 2
     *             dataPrevista: "2025-10-15T15:00:00.000Z"
     *             valorFrete: 29.90
     *             produtosNestaEntregaIds: [1, 3, 5]
     *     responses:
     *       201:
     *         description: Entrega criada com sucesso
     *       400:
     *         description: Dados inválidos
     */
    public async criarEntrega(req: Request, res: Response) {
        this.validarErros(req);
        const dados: CriarEntregaDTO = req.body;
        const entrega = await this.entregaService.criarEntrega(dados);
        res.status(201).json(entrega);
    }

    /**
     * @swagger
     * /entregas/{id}:
     *   patch:
     *     summary: Atualiza parcialmente uma entrega
     *     tags: [Entregas]
     *     security:
     *       - BasicAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID da entrega
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/AtualizarEntregaDTO'
     *           example:
     *             valorFrete: 34.90
     *             produtosNestaEntregaIds: [2, 4]
     *     responses:
     *       200:
     *         description: Entrega atualizada com sucesso
     *       400:
     *         description: Dados inválidos
     */
    public async atualizarEntrega(req: Request, res: Response) {
        this.validarErros(req);
        const id = +req.params.id;
        const dados: Partial<AtualizarEntregaDTO> = req.body;
        const entrega = await this.entregaService.atualizarEntrega(id, dados);
        res.status(200).json({ mensagem: 'Entrega atualizada com sucesso', entrega });
    }

    /**
     * @swagger
     * /entregas/{id}:
     *   put:
     *     summary: Substitui completamente uma entrega
     *     tags: [Entregas]
     *     security:
     *       - BasicAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID da entrega
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/SubstituirEntregaDTO'
     *           example:
     *             enderecoEntregaId: 3
     *             dataPrevista: "2025-10-20T12:00:00.000Z"
     *             valorFrete: 39.90
     *             produtosNestaEntregaIds: [1, 2, 3]
     *     responses:
     *       200:
     *         description: Entrega substituída com sucesso
     *       400:
     *         description: Dados inválidos
     */
    public async substituirEntrega(req: Request, res: Response) {
        this.validarErros(req);
        const id = +req.params.id;
        const dados: SubstituirEntregaDTO = req.body;
        const entrega = await this.entregaService.substituirEntrega(id, dados);
        res.status(200).json({ mensagem: 'Entrega substituída com sucesso', entrega });
    }

    /**
     * @swagger
     * /entregas/{id}:
     *   delete:
     *     summary: Remove uma entrega pelo ID
     *     tags: [Entregas]
     *     security:
     *       - BasicAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID da entrega
     *     responses:
     *       200:
     *         description: Entrega excluída com sucesso
     *       400:
     *         description: ID inválido
     */
    public async deletarEntrega(req: Request, res: Response) {
        this.validarErros(req);
        const id = +req.params.id;
        await this.entregaService.deletarEntrega(id);
        res.status(200).json({ mensagem: 'Entrega excluída com sucesso' });
    }

    /**
     * @swagger
     * /entregas/{id}/status:
     *   patch:
     *     summary: Atualiza o status de uma entrega
     *     tags: [Entregas]
     *     security:
     *       - BasicAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID da entrega
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               status:
     *                 type: string
     *                 enum: [PENDENTE, EM_TRANSITO, ENTREGUE, CANCELADA]
     *           example:
     *             status: "EM_TRANSITO"
     *     responses:
     *       200:
     *         description: Status da entrega atualizado
     *       400:
     *         description: Dados inválidos
     */
    public async atualizarStatus(req: Request, res: Response) {
        this.validarErros(req);
        const id = +req.params.id;
        const { status } = req.body;
        const entrega = await this.entregaService.atualizarStatusEntrega(id, status);
        res.status(200).json({ mensagem: 'Status da entrega atualizado', entrega });
    }
}
