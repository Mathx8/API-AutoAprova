import { Router } from "express";
import * as chatController from "../controllers/chat.js";

const router = Router();

/**
 * @swagger
 * /chat/conversas:
 *   post:
 *     summary: Criar ou retornar conversa entre aluno e professor
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [aluno_id, professor_id]
 *             properties:
 *               aluno_id:
 *                 type: string
 *                 example: d66b6630-06c5-4c45-9c46-089a81b1592e
 *               professor_id:
 *                 type: string
 *                 example: e77c7741-17d6-5d56-0d57-190b92c2603f
 *     responses:
 *       201:
 *         description: Conversa retornada ou criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 aluno_id:
 *                   type: string
 *                 professor_id:
 *                   type: string
 *                 criado_em:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Campos obrigatórios ausentes
 */

/**
 * @swagger
 * /chat/conversas/{usuario_id}/{tipo}:
 *   get:
 *     summary: Listar conversas de um usuário
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário (usuarios.id)
 *         example: d66b6630-06c5-4c45-9c46-089a81b1592e
 *       - in: path
 *         name: tipo
 *         required: true
 *         schema:
 *           type: string
 *           enum: [aluno, professor]
 *         example: aluno
 *     responses:
 *       200:
 *         description: Lista de conversas com última mensagem e contagem de não lidas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   ultima_mensagem:
 *                     type: object
 *                     nullable: true
 *                   nao_lidas:
 *                     type: integer
 *       400:
 *         description: Parâmetros inválidos
 */

/**
 * @swagger
 * /chat/conversas/{conversa_id}/mensagens:
 *   get:
 *     summary: Listar mensagens de uma conversa
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: conversa_id
 *         required: true
 *         schema:
 *           type: string
 *         example: d66b6630-06c5-4c45-9c46-089a81b1592e
 *       - in: query
 *         name: usuario_id
 *         required: false
 *         schema:
 *           type: string
 *         description: ID do usuário lendo (marca mensagens como lidas)
 *         example: d66b6630-06c5-4c45-9c46-089a81b1592e
 *     responses:
 *       200:
 *         description: Lista de mensagens em ordem cronológica
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   mensagem:
 *                     type: string
 *                   lida:
 *                     type: boolean
 *                   criado_em:
 *                     type: string
 *                     format: date-time
 *                   autor:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       nome:
 *                         type: string
 *                       foto_perfil:
 *                         type: string
 *       400:
 *         description: conversa_id ausente
 */

/**
 * @swagger
 * /chat/mensagens:
 *   post:
 *     summary: Enviar mensagem em uma conversa
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [conversa_id, autor_id, mensagem]
 *             properties:
 *               conversa_id:
 *                 type: string
 *                 example: d66b6630-06c5-4c45-9c46-089a81b1592e
 *               autor_id:
 *                 type: string
 *                 description: usuarios.id de quem envia
 *                 example: d66b6630-06c5-4c45-9c46-089a81b1592e
 *               mensagem:
 *                 type: string
 *                 maxLength: 1000
 *                 example: "Olá, qual será o ponto de encontro?"
 *     responses:
 *       201:
 *         description: Mensagem enviada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 conversa_id:
 *                   type: string
 *                 mensagem:
 *                   type: string
 *                 lida:
 *                   type: boolean
 *                 criado_em:
 *                   type: string
 *                   format: date-time
 *                 autor:
 *                   type: object
 *       400:
 *         description: Campos ausentes, mensagem longa ou usuário não participa da conversa
 */

router.post("/conversas", chatController.getOrCreateConversa);
router.get("/conversas/:usuario_id/:tipo", chatController.getConversas);
router.get("/conversas/:conversa_id/mensagens", chatController.getMensagens);
router.post("/mensagens", chatController.enviarMensagem);

export default router;