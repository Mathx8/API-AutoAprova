import { supabase } from "../config/supabase.js";

export async function UpdateProfessor({ usuario_id, descricao }) {
    if (!usuario_id) {
        throw new Error("ID do usuário não recebido.");
    }

    const { data, error } = await supabase
        .from("professores")
        .update({
            descricao: descricao || null
        })
        .eq("usuario_id", usuario_id)
        .select()
        .maybeSingle();

    if (error) throw new Error(error.message);

    return data;
}

export async function GetAulasProfessor(professor_id) {
    const { data, error } = await supabase
        .from("aulas")
        .select(`
            *,
            alunos (
                id,
                usuarios (
                    nome
                )
            )
        `)
        .eq("professor_id", professor_id);

    if (error) throw new Error(error.message);

    return data;
}

export async function CreateCNH({ professor_id, numero, categoria, data_emissao, data_validade }) {
    if (!professor_id || !numero || !categoria || !data_emissao || !data_validade) {
        throw new Error("Campos obrigatórios não enviados");
    }

    const categorias = ["A", "B", "C", "D", "E", "AB"];

    if (!categorias.includes(categoria)) {
        throw new Error("Categoria inválida");
    }

    const { data: conflitoNumero } = await supabase
        .from("cnh")
        .select("id")
        .eq("numero", numero);

    if (conflitoNumero && conflitoNumero.length > 0) {
        throw new Error("Essa CNH já foi registrada!");
    }

    const { data, error } = await supabase
        .from("cnh")
        .insert([{
            professor_id,
            numero,
            categoria,
            data_emissao,
            data_validade
        }])
        .select()
        .maybeSingle();

    if (error) throw new Error(error.message);

    return data;
}