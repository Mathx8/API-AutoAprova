import { Router } from "express";
import * as aulaController from "../controllers/aula.js";

const router = Router();

/**
 * @swagger
 * /aulas:
 *   post:
 *     summary: Criar aula
 *     tags: [Aulas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [aluno_id, professor_id, data]
 *             properties:
 *               aluno_id:
 *                 type: string
 *                 example: d66b6630-06c5-4c45-9c46-089a81b1592e
 *               professor_id:
 *                 type: string
 *                 example: 2
 *               data:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-04-10T10:00:00"
 *     responses:
 *       200:
 *         description: Aula criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Aula'
 *       400:
 *         description: Campos inválidos, professor indisponível ou conflito de horário
 */

/**
 * @swagger
 * /aulas/status:
 *   patch:
 *     summary: Atualizar status da aula
 *     tags: [Aulas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [aula_id, status]
 *             properties:
 *               aula_id:
 *                 type: string
 *                 example: d66b6630-06c5-4c45-9c46-089a81b1592e
 *               status:
 *                 type: string
 *                 enum: [pendente, aceito, recusado, concluido]
 *                 example: aceito
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Aula'
 *       400:
 *         description: Status inválido
 */

router.post("/", aulaController.createAula);
router.patch("/status", aulaController.updateStatusAula);

export default router;