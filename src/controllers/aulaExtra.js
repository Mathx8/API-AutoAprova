import * as aulaExtraService from "../services/aulaExtra.js";

// ─── MENSAGENS DE AULA ────────────────────────────────────────────────────────

export async function getMensagensAula(req, res) {
    try {
        const data = await aulaExtraService.GetMensagensAula(req.params.aula_id);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function enviarMensagemAula(req, res) {
    try {
        const data = await aulaExtraService.EnviarMensagemAula(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// ─── AVALIAÇÕES ───────────────────────────────────────────────────────────────

export async function createAvaliacao(req, res) {
    try {
        const data = await aulaExtraService.CreateAvaliacao(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function getAvaliacaoAula(req, res) {
    try {
        const data = await aulaExtraService.GetAvaliacaoAula(req.params.aula_id);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function getAvaliacoesProfessor(req, res) {
    try {
        const data = await aulaExtraService.GetAvaliacoesProfessor(req.params.professor_id);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}