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
        const { usuario_id, tipo } = req.params;
        const data = await chatService.GetConversasDoUsuario(usuario_id, tipo);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function getMensagens(req, res) {
    try {
        // usuario_id via query para marcar mensagens como lidas
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