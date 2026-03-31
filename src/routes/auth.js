import express from "express";
import * as authController from "../controllers/auth.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, email, senha, tipo]
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Matheus
 *               email:
 *                 type: string
 *                 example: teste@email.com
 *               senha:
 *                 type: string
 *                 minLength: 6
 *                 example: "123456"
 *               tipo:
 *                 type: string
 *                 enum: [aluno, professor]
 *                 example: aluno
 *               telefone:
 *                 type: string
 *                 example: "11999999999"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 email:
 *                   type: string
 *                 nome:
 *                   type: string
 *                 otp:
 *                   type: string
 *       400:
 *         description: Dados inválidos ou email já cadastrado
 */

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Verificar OTP do email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, codigo]
 *             properties:
 *               email:
 *                 type: string
 *                 example: teste@email.com
 *               codigo:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Email verificado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email verificado com sucesso
 *       400:
 *         description: Código inválido ou expirado
 */

/**
 * @swagger
 * /auth/resend-otp:
 *   post:
 *     summary: Reenviar OTP para o email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 example: teste@email.com
 *     responses:
 *       200:
 *         description: Novo código gerado e enviado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 email:
 *                   type: string
 *                 nome:
 *                   type: string
 *                 otp:
 *                   type: string
 *       400:
 *         description: Email já verificado ou aguarde para reenviar
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login do usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, senha]
 *             properties:
 *               email:
 *                 type: string
 *                 example: teste@email.com
 *               senha:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Email ou senha inválidos, ou email não verificado
 */

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Retorna o usuário autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário logado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: Token inválido ou ausente
 */

router.post("/register", authController.register);
router.post("/verify-otp", authController.verifyOTP);
router.post("/login", authController.login);
router.post("/resend-otp", authController.reenviarOTP);
router.get("/me", authMiddleware, authController.getMe);

export default router;