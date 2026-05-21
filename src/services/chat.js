import { supabase } from "../config/supabase.js";

// ─── CONVERSA ────────────────────────────────────────────────────────────────

/**
 * Retorna a conversa existente entre aluno e professor,
 * criando uma nova se ainda não existir.
 * aluno_id  = alunos.id
 * professor_id = professores.id
 */
export async function GetOrCreateConversa({ aluno_id, professor_id }) {
    if (!aluno_id || !professor_id) {
        throw new Error("aluno_id e professor_id são obrigatórios");
    }

    const { data: existente, error: erroBusca } = await supabase
        .from("conversas")
        .select("*")
        .eq("aluno_id", aluno_id)
        .eq("professor_id", professor_id)
        .maybeSingle();

    if (erroBusca) throw new Error(erroBusca.message);
    if (existente) return existente;

    const { data: nova, error: erroCria } = await supabase
        .from("conversas")
        .insert([{ aluno_id, professor_id }])
        .select()
        .single();

    if (erroCria) throw new Error(erroCria.message);

    return nova;
}

/**
 * Lista todas as conversas de um usuário.
 *
 * tipo_id  = alunos.id ou professores.id  (usado para filtrar as conversas)
 * usuario_id = usuarios.id                (usado para calcular nao_lidas)
 */
export async function GetConversasDoUsuario(tipo_id, tipo, usuario_id) {
    if (!tipo_id || !tipo) {
        throw new Error("tipo_id e tipo são obrigatórios");
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
            .eq("aluno_id", tipo_id);
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
            .eq("professor_id", tipo_id);
    }

    const { data, error } = await query.order("criado_em", {
        referencedTable: "chat_mensagens",
        ascending: false
    });

    if (error) throw new Error(error.message);

    return (data || []).map(conversa => {
        const msgs = conversa.chat_mensagens || [];
        // Ordena desc para pegar a última
        const ordenadas = [...msgs].sort(
            (a, b) => new Date(b.criado_em) - new Date(a.criado_em)
        );
        const ultima = ordenadas[0] || null;

        // nao_lidas: mensagens não lidas enviadas pelo OUTRO (autor_id !== usuario_id)
        // Se usuario_id não for fornecido, conta todas as não lidas
        const naoLidas = msgs.filter(m =>
            !m.lida && (usuario_id ? m.autor_id !== usuario_id : true)
        ).length;

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
 * Lista mensagens de uma conversa e marca como lidas.
 * usuario_id = usuarios.id de quem está lendo
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

    // Marca como lidas mensagens do outro participante
    if (usuario_id && data?.length) {
        const idsParaMarcar = data
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
 * Envia uma mensagem.
 * autor_id = usuarios.id de quem envia
 *
 * A validação busca os usuarios.id do aluno e professor via join
 * usando duas queries separadas para evitar ambiguidade do Supabase
 * com joins aninhados retornando array vs objeto.
 */
export async function EnviarMensagemChat({ conversa_id, autor_id, mensagem }) {
    if (!conversa_id || !autor_id || !mensagem?.trim()) {
        throw new Error("conversa_id, autor_id e mensagem são obrigatórios");
    }

    if (mensagem.length > 1000) {
        throw new Error("Mensagem muito longa (máximo 1000 caracteres)");
    }

    // Busca a conversa para obter aluno_id e professor_id
    const { data: conversa, error: erroConversa } = await supabase
        .from("conversas")
        .select("aluno_id, professor_id")
        .eq("id", conversa_id)
        .maybeSingle();

    if (erroConversa) throw new Error(erroConversa.message);
    if (!conversa) throw new Error("Conversa não encontrada");

    // Resolve usuarios.id do aluno
    const { data: alunoRow } = await supabase
        .from("alunos")
        .select("usuario_id")
        .eq("id", conversa.aluno_id)
        .maybeSingle();

    // Resolve usuarios.id do professor
    const { data: professorRow } = await supabase
        .from("professores")
        .select("usuario_id")
        .eq("id", conversa.professor_id)
        .maybeSingle();

    const alunoUsuarioId = alunoRow?.usuario_id;
    const professorUsuarioId = professorRow?.usuario_id;

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