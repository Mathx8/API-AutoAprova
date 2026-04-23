import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./src/config/swagger.js"

import auth from "./src/routes/auth.js";
import aluno from "./src/routes/aluno.js";
import aula from "./src/routes/aula.js";
import carro from "./src/routes/carro.js";
import professor from "./src/routes/professor.js";
import usuario from "./src/routes/usuario.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/auth', auth);
app.use('/alunos', aluno);
app.use("/aulas", aula);
app.use("/carros", carro);
app.use("/professores", professor);
app.use("/usuarios", usuario);

app.get('/', (req, res) => {
    res.json({ message: 'API AutoAprova rodando' });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
})