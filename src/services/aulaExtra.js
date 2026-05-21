import { supabase } from "../config/supabase.js";

// ─── MENSAGENS DE AULA ────────────────────────────────────────────────────────

/**
 * Lista todas as mensagens/observações de uma aula.
 */
export async function GetMensagensAula(aula_id) {
    if (!aula_id) throw new Error("aula_id é obrigatório");

    const { data, error } = await supabase
        .from("aula_mensagens")
        .select(`
            *,
            autor:autor_id (
                id,
                nome,
                foto_perfil
            )
        `)
        .eq("aula_id", aula_id)
        .order("criado_em", { ascending: true });

    if (error) throw new Error(error.message);

    return data || [];
}

/**
 * Adiciona uma mensagem/observação a uma aula.
 * Apenas o aluno ou professor vinculados podem enviar.
 */
export async function EnviarMensagemAula({ aula_id, autor_id, mensagem }) {
    if (!aula_id || !autor_id || !mensagem?.trim()) {
        throw new Error("aula_id, autor_id e mensagem são obrigatórios");
    }

    if (mensagem.length > 500) {
        throw new Error("Mensagem muito longa (máximo 500 caracteres)");
    }

    // Verifica se o autor pertence à aula
    const { data: aula, error: erroAula } = await supabase
        .from("aulas")
        .select(`
            alunos ( usuarios ( id ) ),
            professores ( usuarios ( id ) )
        `)
        .eq("id", aula_id)
        .maybeSingle();

    if (erroAula) throw new Error(erroAula.message);
    if (!aula) throw new Error("Aula não encontrada");

    const alunoUsuarioId = aula.alunos?.usuarios?.id;
    const professorUsuarioId = aula.professores?.usuarios?.id;

    if (autor_id !== alunoUsuarioId && autor_id !== professorUsuarioId) {
        throw new Error("Você não está vinculado a esta aula");
    }

    const { data, error } = await supabase
        .from("aula_mensagens")
        .insert([{ aula_id, autor_id, mensagem: mensagem.trim() }])
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

// ─── AVALIAÇÕES ───────────────────────────────────────────────────────────────

/**
 * Cria a avaliação de uma aula (apenas o aluno, apenas uma vez, e só após conclusão).
 */
export async function CreateAvaliacao({ aula_id, autor_id, nota, comentario }) {
    if (!aula_id || !autor_id || nota == null) {
        throw new Error("aula_id, autor_id e nota são obrigatórios");
    }

    if (!Number.isInteger(Number(nota)) || nota < 1 || nota > 5) {
        throw new Error("Nota deve ser um número inteiro entre 1 e 5");
    }

    // Busca a aula para validações
    const { data: aula, error: erroAula } = await supabase
        .from("aulas")
        .select(`
            status,
            alunos ( usuarios ( id ) )
        `)
        .eq("id", aula_id)
        .maybeSingle();

    if (erroAula) throw new Error(erroAula.message);
    if (!aula) throw new Error("Aula não encontrada");

    if (aula.status !== "concluido") {
        throw new Error("Só é possível avaliar aulas concluídas");
    }

    if (aula.alunos?.usuarios?.id !== autor_id) {
        throw new Error("Apenas o aluno da aula pode avaliá-la");
    }

    // Garante que não há avaliação duplicada (a constraint UNIQUE já protege,
    // mas melhor dar uma mensagem amigável)
    const { data: existente } = await supabase
        .from("avaliacoes")
        .select("id")
        .eq("aula_id", aula_id)
        .maybeSingle();

    if (existente) {
        throw new Error("Você já avaliou esta aula");
    }

    const { data, error } = await supabase
        .from("avaliacoes")
        .insert([{
            aula_id,
            autor_id,
            nota: Number(nota),
            comentario: comentario?.trim() || null
        }])
        .select()
        .single();

    if (error) throw new Error(error.message);

    return data;
}

/**
 * Retorna a avaliação de uma aula específica (se existir).
 */
export async function GetAvaliacaoAula(aula_id) {
    if (!aula_id) throw new Error("aula_id é obrigatório");

    const { data, error } = await supabase
        .from("avaliacoes")
        .select(`
            *,
            autor:autor_id (
                id,
                nome,
                foto_perfil
            )
        `)
        .eq("aula_id", aula_id)
        .maybeSingle();

    if (error) throw new Error(error.message);

    return data;
}

/**
 * Retorna todas as avaliações de um professor, com média calculada.
 */
export async function GetAvaliacoesProfessor(professor_id) {
    if (!professor_id) throw new Error("professor_id é obrigatório");

    const { data, error } = await supabase
        .from("avaliacoes")
        .select(`
            *,
            autor:autor_id (
                id,
                nome,
                foto_perfil
            ),
            aula:aula_id (
                id,
                data,
                professor_id
            )
        `)
        .eq("aula.professor_id", professor_id)
        .order("criado_em", { ascending: false });

    if (error) throw new Error(error.message);

    const avaliacoes = data || [];
    const media = avaliacoes.length
        ? avaliacoes.reduce((acc, a) => acc + a.nota, 0) / avaliacoes.length
        : null;

    return {
        media: media ? parseFloat(media.toFixed(1)) : null,
        total: avaliacoes.length,
        avaliacoes
    };
}