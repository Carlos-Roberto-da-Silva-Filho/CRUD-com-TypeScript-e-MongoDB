import { Router, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { body, param, validationResult } from 'express-validator';
import { TYPES } from '../../config/types';
import { ProdutoService } from '../../2domain/services/ProdutoService';
import { CriarProdutoDTO, AtualizarProdutoDTO, SubstituirProdutoDTO } from '../../2domain/dtos/ProdutoDTOs';
import BadRequestException from '../../2domain/exceptions/BadRequestException';

@injectable()
export class ProdutoController {
    public router: Router = Router();

    constructor(
        @inject(TYPES.ProdutoService)
        private readonly produtoService: ProdutoService
    ) {
        this.routes();
    }

    private routes() {
        this.router.get('/', this.buscarProdutos.bind(this));
        this.router.get('/:id', [param('id').isNumeric()], this.buscarProdutoPorId.bind(this));
        this.router.post('/', [
            body('nome').exists().isString(),
            body('descricao').exists().isString(),
            body('preco').exists().isFloat({ gt: 0 }),
            body('estoque').exists().isInt({ min: 0 })
        ], this.criarProduto.bind(this));
        this.router.patch('/:id', [param('id').isNumeric()], this.atualizarProduto.bind(this));
        this.router.put('/:id', [
            param('id').isNumeric(),
            body('nome').exists().isString(),
            body('descricao').exists().isString(),
            body('preco').exists().isFloat({ gt: 0 }),
            body('estoque').exists().isInt({ min: 0 })
        ], this.substituirProduto.bind(this));
        this.router.delete('/:id', [param('id').isNumeric()], this.deletarProduto.bind(this));
    }

    private validarErros(req: Request) {
        const erros = validationResult(req);
        if (!erros.isEmpty()) throw new BadRequestException(erros.array());
    }

    /**
     * @swagger
     * /produtos:
     *   get:
     *     summary: Lista todos os produtos
     *     tags: [Produtos]
     *     security:
     *       - BasicAuth: []
     *     responses:
     *       200:
     *         description: Lista de produtos
     */
    public async buscarProdutos(req: Request, res: Response) {
        const produtos = await this.produtoService.buscarTodosProdutos();
        res.status(200).json(produtos);
    }

    /**
     * @swagger
     * /produtos/{id}:
     *   get:
     *     summary: Busca um produto pelo ID
     *     tags: [Produtos]
     *     security:
     *       - BasicAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID do produto
     *     responses:
     *       200:
     *         description: Produto encontrado
     *       400:
     *         description: ID inválido
     */
    public async buscarProdutoPorId(req: Request, res: Response) {
        this.validarErros(req);
        const id = +req.params.id;
        const produto = await this.produtoService.buscarProdutoPorId(id);
        res.status(200).json(produto);
    }

    /**
     * @swagger
     * /produtos:
     *   post:
     *     summary: Cria um novo produto
     *     tags: [Produtos]
     *     security:
     *       - BasicAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CriarProdutoDTO'
     *           example:
     *             nome: "Notebook Gamer"
     *             descricao: "Notebook com processador i7 e 16GB RAM"
     *             preco: 4999.90
     *             estoque: 10
     *     responses:
     *       201:
     *         description: Produto criado com sucesso
     *       400:
     *         description: Dados inválidos
     */
    public async criarProduto(req: Request, res: Response) {
        this.validarErros(req);
        const dados: CriarProdutoDTO = req.body;
        const produto = await this.produtoService.criarProduto(dados);
        res.status(201).json(produto);
    }

    /**
     * @swagger
     * /produtos/{id}:
     *   patch:
     *     summary: Atualiza parcialmente um produto
     *     tags: [Produtos]
     *     security:
     *       - BasicAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID do produto
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/AtualizarProdutoDTO'
     *           example:
     *             nome: "Mouse Gamer"
     *             descricao: "Mouse com DPI ajustável"
     *             preco: 199.90
     *             estoque: 25
     *     responses:
     *       200:
     *         description: Produto atualizado com sucesso
     *       400:
     *         description: Dados inválidos
     */
    public async atualizarProduto(req: Request, res: Response) {
        this.validarErros(req);
        const id = +req.params.id;
        const dados: Partial<AtualizarProdutoDTO> = req.body;
        const produto = await this.produtoService.atualizarProduto(id, dados);
        res.status(200).json({ mensagem: 'Produto atualizado com sucesso', produto });
    }

    /**
     * @swagger
     * /produtos/{id}:
     *   put:
     *     summary: Substitui completamente um produto
     *     tags: [Produtos]
     *     security:
     *       - BasicAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID do produto
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/SubstituirProdutoDTO'
     *           example:
     *             nome: "Teclado Mecânico"
     *             descricao: "Teclado mecânico RGB com switches azuis"
     *             preco: 499.90
     *             estoque: 15
     *     responses:
     *       200:
     *         description: Produto substituído com sucesso
     *       400:
     *         description: Dados inválidos
     */
    public async substituirProduto(req: Request, res: Response) {
        this.validarErros(req);
        const id = +req.params.id;
        const dados: SubstituirProdutoDTO = req.body;
        const produto = await this.produtoService.substituirProduto(id, dados);
        res.status(200).json({ mensagem: 'Produto substituído com sucesso', produto });
    }

    /**
     * @swagger
     * /produtos/{id}:
     *   delete:
     *     summary: Remove um produto pelo ID
     *     tags: [Produtos]
     *     security:
     *       - BasicAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID do produto
     *     responses:
     *       200:
     *         description: Produto excluído com sucesso
     *       400:
     *         description: ID inválido
     */
    public async deletarProduto(req: Request, res: Response) {
        this.validarErros(req);
        const id = +req.params.id;
        await this.produtoService.deletarProduto(id);
        res.status(200).json({ mensagem: 'Produto excluído com sucesso' });
    }
}
