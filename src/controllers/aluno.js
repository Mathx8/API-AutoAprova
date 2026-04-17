import * as alunoService from "../services/aluno.js";

export async function updateAluno(req, res) {
    try {
        const data = await alunoService.UpdateAluno(req.body);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function getAulasAluno(req, res) {
    try {
        const data = await alunoService.GetAulasAluno(req.params.aluno_id);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function getProfessoresPorLocalizacao(req, res) {
    try {
        const data = await alunoService.GetProfessoresPorLocalizacao(req.params.estado);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}