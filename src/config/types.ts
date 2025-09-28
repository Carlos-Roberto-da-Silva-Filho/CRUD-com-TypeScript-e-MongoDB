/**
 * Define os símbolos de injeção de dependência (tokens) para o InversifyJS.
 * Garante unicidade e segurança de tipagem.
 */

const TYPES = {
    // --- Interfaces de Repositório ---
    IClienteRepositorioInterface: Symbol.for("IClienteRepositorioInterface"),
    IEnderecoRepositorioInterface: Symbol.for("IEnderecoRepositorioInterface"),
    IProdutoRepositorioInterface: Symbol.for("IProdutoRepositorioInterface"),
    IEntregaRepositorioInterface: Symbol.for("IEntregaRepositorioInterface"),

    // --- Services ---
    ClienteService: Symbol.for("ClienteService"),
    EnderecoService: Symbol.for("EnderecoService"),
    ProdutoService: Symbol.for("ProdutoService"),
    EntregaService: Symbol.for("EntregaService"),

    // --- Controllers ---
    ClienteController: Symbol.for("ClienteController"),
    EnderecoController: Symbol.for("EnderecoController"),
    ProdutoController: Symbol.for("ProdutoController"),
    EntregaController: Symbol.for("EntregaController"),
};

export { TYPES };
