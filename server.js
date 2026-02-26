import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import auth from "./src/routes/auth.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', auth);

app.get('/', (req, res) => {
    res.json({ message: 'API AutoAprova rodando' });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
})