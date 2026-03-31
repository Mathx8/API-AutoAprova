import { supabase } from "../config/supabase.js";

export async function CreateDisponibilidade({ professor_id, dia_semana, hora_inicio, hora_fim }) {
    if (!professor_id || dia_semana === undefined || dia_semana === null || !hora_inicio || !hora_fim) {
        throw new Error("Campos obrigatórios não enviados");
    }

    if (!Number.isInteger(dia_semana) || dia_semana < 0 || dia_semana > 6) {
        throw new Error("dia_semana deve ser um número entre 0 (domingo) e 6 (sábado)");
    }

    if (hora_inicio >= hora_fim) {
        throw new Error("Hora de início deve ser menor que a de fim");
    }

    const { data: conflitos } = await supabase
        .from("disponibilidade_professor")
        .select("*")
        .eq("professor_id", professor_id)
        .eq("dia_semana", dia_semana);

    if (conflitos && conflitos.length > 0) {
        const conflito = conflitos.find(d =>
            (hora_inicio >= d.hora_inicio && hora_inicio < d.hora_fim) ||
            (hora_fim > d.hora_inicio && hora_fim <= d.hora_fim)
        );

        if (conflito) {
            throw new Error("Já existe um horário nesse intervalo");
        }
    }

    const { data, error } = await supabase
        .from("disponibilidade_professor")
        .insert([{
            professor_id,
            dia_semana,
            hora_inicio,
            hora_fim
        }])
        .select()
        .maybeSingle();

    if (error) throw new Error(error.message);

    return data;
}

export async function UpdateDisponibilidade({ id, dia_semana, hora_inicio, hora_fim }) {
    if (!id || dia_semana === undefined || dia_semana === null || !hora_inicio || !hora_fim) {
        throw new Error("Campos obrigatórios não enviados");
    }

    if (!Number.isInteger(dia_semana) || dia_semana < 0 || dia_semana > 6) {
        throw new Error("dia_semana deve ser um número entre 0 (domingo) e 6 (sábado)");
    }

    if (hora_inicio >= hora_fim) {
        throw new Error("Hora de início deve ser menor que a de fim");
    }

    const { data: atual, error: erroAtual } = await supabase
        .from("disponibilidade_professor")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (erroAtual || !atual) {
        throw new Error("Disponibilidade não encontrada");
    }

    const professor_id = atual.professor_id;

    const { data: conflitos } = await supabase
        .from("disponibilidade_professor")
        .select("*")
        .eq("professor_id", professor_id)
        .eq("dia_semana", dia_semana)
        .neq("id", id);

    if (conflitos && conflitos.length > 0) {
        const conflito = conflitos.find(d =>
            hora_inicio < d.hora_fim && hora_fim > d.hora_inicio
        );

        if (conflito) {
            throw new Error("Já existe um horário nesse intervalo");
        }
    }

    const { data, error } = await supabase
        .from("disponibilidade_professor")
        .update({
            dia_semana,
            hora_inicio,
            hora_fim
        })
        .eq("id", id)
        .select()
        .maybeSingle();

    if (error) throw new Error(error.message);

    return data;
}

export async function DeleteDisponibilidade(id) {
    const { data: atual, error: erroAtual } = await supabase
        .from("disponibilidade_professor")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (erroAtual || !atual) {
        throw new Error("Disponibilidade não encontrada");
    }

    const { error } = await supabase
        .from("disponibilidade_professor")
        .delete()
        .eq("id", id)

    if (error) throw new Error(error.message);

    return { message: "Disponibilidade deletada com sucesso!" };
}