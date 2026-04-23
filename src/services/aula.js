import { supabase } from "../config/supabase.js";

export async function CreateAula({ aluno_id, professor_id, data }) {
    if (!aluno_id || !professor_id || !data) {
        throw new Error("Campos obrigatórios não enviados");
    }

    const dataAula = new Date(data);
    const diaSemana = dataAula.getDay();
    const hora = dataAula.toTimeString().slice(0, 5);

    const { data: conflito } = await supabase
        .from("aulas")
        .select("*")
        .eq("professor_id", professor_id)
        .eq("data", data);

    if (conflito && conflito.length > 0) {
        throw new Error("Já existe uma aula nesse horário");
    }

    const { data: aula, error } = await supabase
        .from("aulas")
        .insert([{
            aluno_id,
            professor_id,
            data,
            status: "pendente"
        }])
        .select()
        .maybeSingle();

    if (error) throw new Error(error.message);

    return aula;
}

export async function UpdateStatusAula({ aula_id, status }) {
    const statusValidos = ["pendente", "aceito", "recusado", "concluido"];

    if (!statusValidos.includes(status)) {
        throw new Error("Status inválido");
    }

    const { data, error } = await supabase
        .from("aulas")
        .update({ status })
        .eq("id", aula_id)
        .select()
        .maybeSingle();

    if (error) throw new Error(error.message);

    return data;
}