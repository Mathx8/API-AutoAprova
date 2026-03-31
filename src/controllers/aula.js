import * as aulaService from "../services/aula.js";

export async function createAula(req, res) {
    try {
        const data = await aulaService.CreateAula(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function updateStatusAula(req, res) {
    try {
        const data = await aulaService.UpdateStatusAula(req.body);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}