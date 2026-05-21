import { Router } from "express";
import * as aulaExtraController from "../controllers/aulaExtra.js";

const router = Router();

// ─── MENSAGENS DE AULA ────────────────────────────────────────────────────────

/**
 * @swagger
 * /aulas/{aula_id}/mensagens:
 *   get:
 *     summary: Listar mensagens/observações de uma aula
 *     tags: [Aulas]
 *     parameters:
 *       - in: path
 *         name: aula_id
 *         required: true
 *         schema:
 *           type: string
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
 *                   aula_id:
 *                     type: string
 *                   mensagem:
 *                     type: string
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
 *         description: aula_id ausente
 */

/**
 * @swagger
 * /aulas/mensagens:
 *   post:
 *     summary: Enviar mensagem/observação em uma aula
 *     tags: [Aulas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [aula_id, autor_id, mensagem]
 *             properties:
 *               aula_id:
 *                 type: string
 *                 example: d66b6630-06c5-4c45-9c46-089a81b1592e
 *               autor_id:
 *                 type: string
 *                 description: usuarios.id de quem envia (aluno ou professor da aula)
 *                 example: d66b6630-06c5-4c45-9c46-089a81b1592e
 *               mensagem:
 *                 type: string
 *                 maxLength: 500
 *                 example: "Ponto de encontro: Av. Paulista, 1000"
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
 *                 aula_id:
 *                   type: string
 *                 mensagem:
 *                   type: string
 *                 criado_em:
 *                   type: string
 *                   format: date-time
 *                 autor:
 *                   type: object
 *       400:
 *         description: Campos ausentes, mensagem longa ou usuário não vinculado à aula
 */

// ─── AVALIAÇÕES ───────────────────────────────────────────────────────────────

/**
 * @swagger
 * /aulas/avaliacoes:
 *   post:
 *     summary: Avaliar uma aula concluída
 *     tags: [Aulas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [aula_id, autor_id, nota]
 *             properties:
 *               aula_id:
 *                 type: string
 *                 example: d66b6630-06c5-4c45-9c46-089a81b1592e
 *               autor_id:
 *                 type: string
 *                 description: usuarios.id do aluno avaliador
 *                 example: d66b6630-06c5-4c45-9c46-089a81b1592e
 *               nota:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comentario:
 *                 type: string
 *                 example: "Ótima aula, professor muito paciente!"
 *     responses:
 *       201:
 *         description: Avaliação criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 aula_id:
 *                   type: string
 *                 nota:
 *                   type: integer
 *                 comentario:
 *                   type: string
 *                 criado_em:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Aula não concluída, nota inválida ou avaliação já existente
 */

/**
 * @swagger
 * /aulas/{aula_id}/avaliacao:
 *   get:
 *     summary: Buscar avaliação de uma aula
 *     tags: [Aulas]
 *     parameters:
 *       - in: path
 *         name: aula_id
 *         required: true
 *         schema:
 *           type: string
 *         example: d66b6630-06c5-4c45-9c46-089a81b1592e
 *     responses:
 *       200:
 *         description: Avaliação da aula (null se ainda não avaliada)
 *         content:
 *           application/json:
 *             schema:
 *               nullable: true
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 nota:
 *                   type: integer
 *                 comentario:
 *                   type: string
 *                 autor:
 *                   type: object
 *       400:
 *         description: aula_id ausente
 */

/**
 * @swagger
 * /professores/{professor_id}/avaliacoes:
 *   get:
 *     summary: Listar todas as avaliações de um professor com média
 *     tags: [Professores]
 *     parameters:
 *       - in: path
 *         name: professor_id
 *         required: true
 *         schema:
 *           type: string
 *         example: d66b6630-06c5-4c45-9c46-089a81b1592e
 *     responses:
 *       200:
 *         description: Avaliações com média calculada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 media:
 *                   type: number
 *                   nullable: true
 *                   example: 4.5
 *                 total:
 *                   type: integer
 *                   example: 12
 *                 avaliacoes:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: professor_id ausente
 */

router.get("/:aula_id/mensagens", aulaExtraController.getMensagensAula);
router.post("/mensagens", aulaExtraController.enviarMensagemAula);
router.post("/avaliacoes", aulaExtraController.createAvaliacao);
router.get("/:aula_id/avaliacao", aulaExtraController.getAvaliacaoAula);

export default router;