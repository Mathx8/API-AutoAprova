import * as disponibilidadeService from "../services/disponibilidade.js";

export async function createDisponibilidade(req, res) {
    try {
        const data = await disponibilidadeService.CreateDisponibilidade(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function updateDisponibilidade(req, res) {
    try {
        const data = await disponibilidadeService.UpdateDisponibilidade(req.body);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function deleteDisponibilidade(req, res) {
    try {
        const data = await disponibilidadeService.DeleteDisponibilidade(req.params.id);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}