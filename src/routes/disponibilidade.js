import { Router } from "express";
import * as disponibilidadeController from "../controllers/disponibilidade.js";

const router = Router();

/**
 * @swagger
 * /disponibilidade:
 *   post:
 *     summary: Criar disponibilidade do professor
 *     tags: [Disponibilidade]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [professor_id, dia_semana, hora_inicio, hora_fim]
 *             properties:
 *               professor_id:
 *                 type: string
 *                 example: d66b6630-06c5-4c45-9c46-089a81b1592e
 *               dia_semana:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 6
 *                 description: "0 = Domingo, 1 = Segunda, 2 = Terça, 3 = Quarta, 4 = Quinta, 5 = Sexta, 6 = Sábado"
 *                 example: 1
 *               hora_inicio:
 *                 type: string
 *                 example: "08:00"
 *               hora_fim:
 *                 type: string
 *                 example: "12:00"
 *     responses:
 *       200:
 *         description: Disponibilidade criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 professor_id:
 *                   type: string
 *                 dia_semana:
 *                   type: string
 *                 hora_inicio:
 *                   type: string
 *                 hora_fim:
 *                   type: string
 *       400:
 *         description: Campos inválidos ou conflito de horário
 */

/**
 * @swagger
 * /disponibilidade:
 *   put:
 *     summary: Atualizar disponibilidade
 *     tags: [Disponibilidade]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id, dia_semana, hora_inicio, hora_fim]
 *             properties:
 *               id:
 *                 type: string
 *                 example: d66b6630-06c5-4c45-9c46-089a81b1592e
 *               dia_semana:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 6
 *                 description: "0 = Domingo, 1 = Segunda, 2 = Terça, 3 = Quarta, 4 = Quinta, 5 = Sexta, 6 = Sábado"
 *                 example: 1
 *               hora_inicio:
 *                 type: string
 *                 example: "08:00"
 *               hora_fim:
 *                 type: string
 *                 example: "17:00"
 *     responses:
 *       200:
 *         description: Disponibilidade atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 professor_id:
 *                   type: string
 *                 dia_semana:
 *                   type: string
 *                 hora_inicio:
 *                   type: string
 *                 hora_fim:
 *                   type: string
 *       400:
 *         description: Disponibilidade não encontrada ou conflito de horário
 */

/**
 * @swagger
 * /disponibilidade/{id}:
 *   delete:
 *     summary: Deletar disponibilidade
 *     tags: [Disponibilidade]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: d66b6630-06c5-4c45-9c46-089a81b1592e
 *     responses:
 *       200:
 *         description: Disponibilidade deletada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Disponibilidade deletada com sucesso!
 *       400:
 *         description: Disponibilidade não encontrada
 */

router.post("/", disponibilidadeController.createDisponibilidade);
router.put("/", disponibilidadeController.updateDisponibilidade);
router.delete("/:id", disponibilidadeController.deleteDisponibilidade);

export default router;