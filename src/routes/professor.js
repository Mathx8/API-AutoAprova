import { Router } from "express";
import * as professorController from "../controllers/professor.js";

const router = Router();

/**
 * @swagger
 * /professores:
 *   put:
 *     summary: Atualizar dados do professor
 *     tags: [Professores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [usuario_id]
 *             properties:
 *               usuario_id:
 *                 type: string
 *                 example: d66b6630-06c5-4c45-9c46-089a81b1592e
 *               descricao:
 *                 type: string
 *                 example: "Professor com 10 anos de experiência"
 *     responses:
 *       200:
 *         description: Professor atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 usuario_id:
 *                   type: string
 *                 descricao:
 *                   type: string
 *       400:
 *         description: ID não recebido
 */

/**
 * @swagger
 * /professores/{professor_id}/aulas:
 *   get:
 *     summary: Listar aulas do professor
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
 *         description: Lista de aulas do professor (pode ser vazia)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Aula'
 *       400:
 *         description: ID inválido
 */

/**
 * @swagger
 * /professores/cnh:
 *   post:
 *     summary: Registrar CNH do professor
 *     tags: [Professores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [professor_id, numero, categoria, data_emissao, data_validade]
 *             properties:
 *               professor_id:
 *                 type: string
 *                 example: d66b6630-06c5-4c45-9c46-089a81b1592e
 *               numero:
 *                 type: string
 *                 example: "12345678900"
 *               categoria:
 *                 type: string
 *                 enum: [A, B, C, D, E, AB]
 *                 example: B
 *               data_emissao:
 *                 type: string
 *                 format: date
 *                 example: "2015-03-10"
 *               data_validade:
 *                 type: string
 *                 format: date
 *                 example: "2030-03-10"
 *     responses:
 *       200:
 *         description: CNH registrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 professor_id:
 *                   type: string
 *                 numero:
 *                   type: string
 *                 categoria:
 *                   type: string
 *                 data_emissao:
 *                   type: string
 *                   format: date
 *                 data_validade:
 *                   type: string
 *                   format: date
 *       400:
 *         description: Campos inválidos, categoria inválida ou CNH já registrada
 */

router.put("/", professorController.updateProfessor);
router.get("/:professor_id/aulas", professorController.getAulasProfessor);
router.post("/cnh", professorController.createCNH);

export default router;