import { supabase } from "../config/supabase.js";

export async function UpdateAluno({ usuario_id, data_nascimento, categoria_cnh }) {
    if (!usuario_id) {
        throw new Error("ID do usuário não recebido.");
    }

    const categoriasCNH = ["A", "B", "C", "D", "E", "AB"];

    if (!categoriasCNH.includes(categoria_cnh)) {
        throw new Error("Categoria inválida");
    }

    const { data, error } = await supabase
        .from("alunos")
        .update({
            data_nascimento: data_nascimento || null,
            categoria_cnh: categoria_cnh || null
        })
        .eq("usuario_id", usuario_id)
        .select()
        .maybeSingle();

    if (error) throw new Error(error.message);

    return data;
}

export async function GetAulasAluno(aluno_id) {
    const { data, error } = await supabase
        .from("aulas")
        .select(`
            *,
            professores (
                id,
                descricao,
                usuarios (
                    localizacao (
                        cidade,
                        estado
                    )
                )
            )
        `)
        .eq("aluno_id", aluno_id);

    if (error) throw new Error(error.message);

    return data;
}

export async function GetProfessoresPorLocalizacao(estado) {
    const { data, error } = await supabase
        .from("professores")
        .select(`
            *,
            usuarios (
                localizacao (
                    cidade,
                    estado
                )
            )
        `)
        .eq("localizacao.estado", estado);

    if (error) throw new Error(error.message);

    return data;
}