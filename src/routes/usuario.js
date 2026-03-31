import { Router } from "express";
import * as usuarioController from "../controllers/usuario.js";

const router = Router();

/**
 * @swagger
 * /usuarios:
 *   put:
 *     summary: Atualizar dados do usuário
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id]
 *             properties:
 *               id:
 *                 type: string
 *                 example: d66b6630-06c5-4c45-9c46-089a81b1592e
 *               nome:
 *                 type: string
 *                 example: Matheus 
 *               telefone:
 *                 type: string
 *                 example: "11999999999"
 *               foto_perfil:
 *                 type: string
 *                 example: "https://exemplo.com/foto.jpg"
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: Token inválido ou ausente
 *       400:
 *         description: ID não recebido
 */

/**
 * @swagger
 * /usuarios/{id}/perfil:
 *   get:
 *     summary: Obter perfil completo do usuário
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: d66b6630-06c5-4c45-9c46-089a81b1592e
 *     responses:
 *       200:
 *         description: Perfil completo do usuário
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Usuario'
 *                 - type: object
 *                   properties:
 *                     foto_perfil:
 *                       type: string
 *                     localizacao:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         cidade:
 *                           type: string
 *                         estado:
 *                           type: string
 *                         latitude:
 *                           type: number
 *                         longitude:
 *                           type: number
 *                     detalhes:
 *                       type: object
 *                       description: Dados de aluno ou professor dependendo do tipo
 *       400:
 *         description: ID não enviado ou usuário não encontrado
 */

/**
 * @swagger
 * /usuarios/{usuario_id}/carros:
 *   get:
 *     summary: Listar carros do usuário
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: string
 *         example: d66b6630-06c5-4c45-9c46-089a81b1592e
 *     responses:
 *       200:
 *         description: Lista de carros do usuário (pode ser vazia)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Carro'
 *       400:
 *         description: ID não enviado
 */

/**
 * @swagger
 * /usuarios/localizacao:
 *   post:
 *     summary: Vincular localização ao usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [usuario_id, cidade, estado]
 *             properties:
 *               usuario_id:
 *                 type: string
 *                 example: d66b6630-06c5-4c45-9c46-089a81b1592e
 *               cidade:
 *                 type: string
 *                 example: São Paulo
 *               estado:
 *                 type: string
 *                 example: SP
 *     responses:
 *       200:
 *         description: Localização vinculada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Localização vinculada com sucesso
 *                 localizacao:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     cidade:
 *                       type: string
 *                     estado:
 *                       type: string
 *       400:
 *         description: Campos obrigatórios ausentes
 */

router.put("/", usuarioController.updateUsuario);
router.get("/:id/perfil", usuarioController.getPerfil);
router.get("/:usuario_id/carros", usuarioController.getCarros);
router.post("/localizacao", usuarioController.createLocalizacaoUsuario);

export default router;