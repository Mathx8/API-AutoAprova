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
 *                 description: alunos.id
 *               professor_id:
 *                 type: string
 *                 description: professores.id
 *     responses:
 *       201:
 *         description: Conversa retornada ou criada
 */

/**
 * @swagger
 * /chat/conversas/{tipo_id}/{tipo}:
 *   get:
 *     summary: Listar conversas de um usuário
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: tipo_id
 *         required: true
 *         schema:
 *           type: string
 *         description: alunos.id ou professores.id
 *       - in: path
 *         name: tipo
 *         required: true
 *         schema:
 *           type: string
 *           enum: [aluno, professor]
 *       - in: query
 *         name: usuario_id
 *         required: false
 *         schema:
 *           type: string
 *         description: usuarios.id — usado para calcular nao_lidas corretamente
 *     responses:
 *       200:
 *         description: Lista de conversas com última mensagem e contagem de não lidas
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
 *       - in: query
 *         name: usuario_id
 *         required: false
 *         schema:
 *           type: string
 *         description: usuarios.id de quem está lendo (marca mensagens como lidas)
 *     responses:
 *       200:
 *         description: Lista de mensagens em ordem cronológica
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
 *               autor_id:
 *                 type: string
 *                 description: usuarios.id de quem envia
 *               mensagem:
 *                 type: string
 *                 maxLength: 1000
 *     responses:
 *       201:
 *         description: Mensagem enviada com sucesso
 *       400:
 *         description: Campos ausentes ou usuário não participa da conversa
 */

router.post("/conversas", chatController.getOrCreateConversa);
router.get("/conversas/:conversa_id/mensagens", chatController.getMensagens);
router.get("/conversas/:tipo_id/:tipo", chatController.getConversas);
router.post("/mensagens", chatController.enviarMensagem);

export default router;