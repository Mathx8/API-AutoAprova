import * as usuarioService from "../services/usuario.js";

export async function updateUsuario(req, res) {
    try {
        const data = await usuarioService.UpdateUsuario(req.body);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function getPerfil(req, res) {
    try {
        const data = await usuarioService.GetPerfil(req.params.id);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function getCarros(req, res) {
    try {
        const data = await usuarioService.GetCarros(req.params.usuario_id);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function createLocalizacaoUsuario(req, res) {
    try {
        const data = await usuarioService.CreateLocalizacaoUsuario(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}