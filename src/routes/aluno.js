import { Router } from "express";
import * as alunoController from "../controllers/aluno.js";

const router = Router();

/**
 * @swagger
 * /alunos:
 *   put:
 *     summary: Atualizar dados do aluno
 *     tags: [Alunos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [usuario_id, categoria_cnh]
 *             properties:
 *               usuario_id:
 *                 type: string
 *                 example: d66b6630-06c5-4c45-9c46-089a81b1592e
 *               data_nascimento:
 *                 type: string
 *                 format: date
 *                 example: "2000-05-15"
 *               categoria_cnh:
 *                 type: string
 *                 enum: [A, B, C, D, E, AB]
 *                 example: B
 *     responses:
 *       200:
 *         description: Aluno atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 usuario_id:
 *                   type: string
 *                 data_nascimento:
 *                   type: string
 *                   format: date
 *                 categoria_cnh:
 *                   type: string
 *       400:
 *         description: Dados inválidos
 */

/**
 * @swagger
 * /alunos/{aluno_id}/aulas:
 *   get:
 *     summary: Listar aulas do aluno
 *     tags: [Alunos]
 *     parameters:
 *       - in: path
 *         name: aluno_id
 *         required: true
 *         schema:
 *           type: string
 *         example: d66b6630-06c5-4c45-9c46-089a81b1592e
 *     responses:
 *       200:
 *         description: Lista de aulas do aluno (pode ser vazia)
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
 * /alunos/professores/localizacao/{estado}:
 *   get:
 *     summary: Listar professores por localização
 *     tags: [Alunos]
 *     parameters:
 *       - in: path
 *         name: estado
 *         required: true
 *         schema:
 *           type: string
 *         example: SP
 *     responses:
 *       200:
 *         description: Lista de professores por localização (pode ser vazia)
 *         content:
 *           application/json:
 *             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/Professor'
*       400:
*         description: ID inválido
 */

router.put("/", alunoController.updateAluno);
router.get("/:aluno_id/aulas", alunoController.getAulasAluno);
router.get("/professores/localizacao/:estado", alunoController.getProfessoresPorLocalizacao);

export default router;