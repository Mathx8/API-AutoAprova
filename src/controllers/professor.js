import * as professorService from "../services/professor.js";

export async function updateProfessor(req, res) {
    try {
        const data = await professorService.UpdateProfessor(req.body);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function getDisponibilidadeProfessor(req, res) {
    try {
        const data = await professorService.GetDisponibilidadeProfessor(req.params.professor_id);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function getAulasProfessor(req, res) {
    try {
        const data = await professorService.GetAulasProfessor(req.params.professor_id);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function createCNH(req, res) {
    try {
        const data = await professorService.CreateCNH(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}