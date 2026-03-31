import { Router } from "express";
import * as carroController from "../controllers/carro.js";

const router = Router();

/**
 * @swagger
 * /carros:
 *   post:
 *     summary: Criar carro
 *     tags: [Carros]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [usuario_id, marca, modelo, ano, cambio, cor, placa]
 *             properties:
 *               usuario_id:
 *                 type: string
 *                 example: d66b6630-06c5-4c45-9c46-089a81b1592e
 *               marca:
 *                 type: string
 *                 example: Toyota
 *               modelo:
 *                 type: string
 *                 example: Corolla
 *               ano:
 *                 type: integer
 *                 example: 2020
 *               cambio:
 *                 type: string
 *                 enum: [manual, automatico]
 *                 example: automatico
 *               cor:
 *                 type: string
 *                 example: Preto
 *               placa:
 *                 type: string
 *                 example: ABC1234
 *     responses:
 *       200:
 *         description: Carro criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Carro'
 *       400:
 *         description: Campos inválidos ou placa já registrada
 */

/**
 * @swagger
 * /carros:
 *   put:
 *     summary: Atualizar carro
 *     tags: [Carros]
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
 *               marca:
 *                 type: string
 *                 example: Toyota
 *               modelo:
 *                 type: string
 *                 example: Corolla
 *               ano:
 *                 type: integer
 *                 example: 2021
 *               cambio:
 *                 type: string
 *                 enum: [manual, automatico]
 *                 example: manual
 *               cor:
 *                 type: string
 *                 example: Branco
 *               placa:
 *                 type: string
 *                 example: ABC1234
 *     responses:
 *       200:
 *         description: Carro atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Carro'
 *       400:
 *         description: ID não recebido, câmbio inválido ou placa em uso
 */

/**
 * @swagger
 * /carros/{id}:
 *   delete:
 *     summary: Deletar carro
 *     tags: [Carros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: d66b6630-06c5-4c45-9c46-089a81b1592e
 *     responses:
 *       200:
 *         description: Carro deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Carro deletado com sucesso
 *       400:
 *         description: Carro vinculado a aulas ou não encontrado
 */

router.post("/", carroController.createCarro);
router.put("/", carroController.updateCarro);
router.delete("/:id", carroController.deleteCarro);

export default router;