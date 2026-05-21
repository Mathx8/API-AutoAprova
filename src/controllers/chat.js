import * as chatService from "../services/chat.js";

export async function getOrCreateConversa(req, res) {
    try {
        const data = await chatService.GetOrCreateConversa(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function getConversas(req, res) {
    try {
        const { tipo_id, tipo } = req.params;
        // usuario_id (usuarios.id) é opcional mas necessário para nao_lidas correto
        const { usuario_id } = req.query;
        const data = await chatService.GetConversasDoUsuario(tipo_id, tipo, usuario_id);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function getMensagens(req, res) {
    try {
        const { conversa_id } = req.params;
        const { usuario_id } = req.query;
        const data = await chatService.GetMensagensConversa(conversa_id, usuario_id);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function enviarMensagem(req, res) {
    try {
        const data = await chatService.EnviarMensagemChat(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}