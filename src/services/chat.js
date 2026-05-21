import { supabase } from "../config/supabase.js";

// ─── CONVERSA ────────────────────────────────────────────────────────────────

/**
 * Retorna a conversa existente entre aluno e professor,
 * criando uma nova se ainda não existir.
 */
export async function GetOrCreateConversa({ aluno_id, professor_id }) {
    if (!aluno_id || !professor_id) {
        throw new Error("aluno_id e professor_id são obrigatórios");
    }

    // Tenta buscar conversa existente
    const { data: existente, error: erroBusca } = await supabase
        .from("conversas")
        .select("*")
        .eq("aluno_id", aluno_id)
        .eq("professor_id", professor_id)
        .maybeSingle();

    if (erroBusca) throw new Error(erroBusca.message);
    if (existente) return existente;

    // Cria conversa nova
    const { data: nova, error: erroCria } = await supabase
        .from("conversas")
        .insert([{ aluno_id, professor_id }])
        .select()
        .single();

    if (erroCria) throw new Error(erroCria.message);

    return nova;
}

/**
 * Lista todas as conversas de um usuário (aluno ou professor),
 * incluindo a última mensagem e dados do outro participante.
 */
export async function GetConversasDoUsuario(usuario_id, tipo) {
    if (!usuario_id || !tipo) {
        throw new Error("usuario_id e tipo são obrigatórios");
    }

    let query;

    if (tipo === "aluno") {
        query = supabase
            .from("conversas")
            .select(`
                *,
                professor:professor_id (
                    id,
                    usuarios (
                        id,
                        nome,
                        foto_perfil
                    )
                ),
                chat_mensagens (
                    id,
                    mensagem,
                    lida,
                    criado_em,
                    autor_id
                )
            `)
            .eq("aluno_id", usuario_id);
    } else {
        query = supabase
            .from("conversas")
            .select(`
                *,
                aluno:aluno_id (
                    id,
                    usuarios (
                        id,
                        nome,
                        foto_perfil
                    )
                ),
                chat_mensagens (
                    id,
                    mensagem,
                    lida,
                    criado_em,
                    autor_id
                )
            `)
            .eq("professor_id", usuario_id);
    }

    const { data, error } = await query.order("criado_em", {
        referencedTable: "chat_mensagens",
        ascending: false
    });

    if (error) throw new Error(error.message);

    // Retorna com última mensagem e contagem de não lidas
    return (data || []).map(conversa => {
        const msgs = conversa.chat_mensagens || [];
        const ultima = msgs[0] || null;
        const naoLidas = msgs.filter(m => !m.lida && m.autor_id !== usuario_id).length;

        return {
            ...conversa,
            chat_mensagens: undefined,
            ultima_mensagem: ultima,
            nao_lidas: naoLidas
        };
    });
}

// ─── MENSAGENS DO CHAT ────────────────────────────────────────────────────────

/**
 * Lista todas as mensagens de uma conversa em ordem cronológica.
 * Marca automaticamente como lidas as mensagens do outro participante.
 */
export async function GetMensagensConversa(conversa_id, usuario_id) {
    if (!conversa_id) throw new Error("conversa_id é obrigatório");

    const { data, error } = await supabase
        .from("chat_mensagens")
        .select(`
            *,
            autor:autor_id (
                id,
                nome,
                foto_perfil
            )
        `)
        .eq("conversa_id", conversa_id)
        .order("criado_em", { ascending: true });

    if (error) throw new Error(error.message);

    // Marca como lidas as mensagens do outro participante
    if (usuario_id) {
        const idsParaMarcar = (data || [])
            .filter(m => !m.lida && m.autor_id !== usuario_id)
            .map(m => m.id);

        if (idsParaMarcar.length > 0) {
            await supabase
                .from("chat_mensagens")
                .update({ lida: true })
                .in("id", idsParaMarcar);
        }
    }

    return data || [];
}

/**
 * Envia uma mensagem em uma conversa existente.
 */
export async function EnviarMensagemChat({ conversa_id, autor_id, mensagem }) {
    if (!conversa_id || !autor_id || !mensagem?.trim()) {
        throw new Error("conversa_id, autor_id e mensagem são obrigatórios");
    }

    if (mensagem.length > 1000) {
        throw new Error("Mensagem muito longa (máximo 1000 caracteres)");
    }

    // Verifica se o autor realmente participa da conversa
    const { data: conversa, error: erroConversa } = await supabase
        .from("conversas")
        .select(`
            aluno:aluno_id ( usuarios ( id ) ),
            professor:professor_id ( usuarios ( id ) )
        `)
        .eq("id", conversa_id)
        .maybeSingle();

    if (erroConversa) throw new Error(erroConversa.message);
    if (!conversa) throw new Error("Conversa não encontrada");

    const alunoUsuarioId = conversa.aluno?.usuarios?.id;
    const professorUsuarioId = conversa.professor?.usuarios?.id;

    if (autor_id !== alunoUsuarioId && autor_id !== professorUsuarioId) {
        throw new Error("Você não participa desta conversa");
    }

    const { data, error } = await supabase
        .from("chat_mensagens")
        .insert([{ conversa_id, autor_id, mensagem: mensagem.trim() }])
        .select(`
            *,
            autor:autor_id (
                id,
                nome,
                foto_perfil
            )
        `)
        .single();

    if (error) throw new Error(error.message);

    return data;
}