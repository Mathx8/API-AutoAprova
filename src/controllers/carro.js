import * as carroService from "../services/carro.js";

export async function createCarro(req, res) {
    try {
        const data = await carroService.CreateCarro(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function updateCarro(req, res) {
    try {
        const data = await carroService.UpdateCarro(req.body);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function deleteCarro(req, res) {
    try {
        const data = await carroService.DeleteCarro(req.params.id);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}