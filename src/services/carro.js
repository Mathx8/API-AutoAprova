import { supabase } from "../config/supabase.js";

export async function CreateCarro({ usuario_id, marca, modelo, ano, cambio, cor, placa }) {
    if (!usuario_id || !marca || !modelo || !ano || !cambio || !cor || !placa) {
        throw new Error("Campos obrigatórios não enviados");
    }

    const cambios = ["manual", "automatico"];

    if (!cambios.includes(cambio)) {
        throw new Error("Câmbio inválido");
    }

    const { data: conflitoPlaca } = await supabase
        .from("carros")
        .select("id")
        .eq("placa", placa);

    if (conflitoPlaca && conflitoPlaca.length > 0) {
        throw new Error("Essa placa já foi registrada!");
    }

    const { data: carro, error: erroCarro } = await supabase
        .from("carros")
        .insert([{
            marca,
            modelo,
            ano,
            cambio,
            cor,
            placa
        }])
        .select()
        .maybeSingle();

    if (erroCarro) {
        throw new Error(erroCarro.message);
    }

    const { error: erroRelacao } = await supabase
        .from("usuarios_carros")
        .insert([{
            usuario_id,
            carro_id: carro.id
        }]);

    if (erroRelacao) {
        throw new Error(erroRelacao.message);
    }

    return carro;
}

export async function UpdateCarro({ id, marca, modelo, ano, cambio, cor, placa }) {
    if (!id) {
        throw new Error("ID do carro não recebido.");
    }

    if (cambio && !["manual", "automatico"].includes(cambio)) {
        throw new Error("Câmbio inválido");
    }

    if (placa) {
        const { data: conflito } = await supabase
            .from("carros")
            .select("id")
            .eq("placa", placa);

        if (conflito && conflito.length > 0 && conflito[0].id !== id) {
            throw new Error("Essa placa já está em uso!");
        }
    }

    const { data, error } = await supabase
        .from("carros")
        .update({
            marca,
            modelo,
            ano,
            cambio,
            cor,
            placa
        })
        .eq("id", id)
        .select()
        .maybeSingle();

    if (error) throw new Error(error.message);

    return data;
}

export async function DeleteCarro(id) {
    if (!id) {
        throw new Error("ID do carro não recebido.");
    }

    const { data: aulas } = await supabase
        .from("aulas")
        .select("id")
        .eq("carro_id", id);

    if (aulas && aulas.length > 0) {
        throw new Error("Não é possível deletar um carro vinculado a aulas.");
    }

    const { error: erroRelacao } = await supabase
        .from("usuarios_carros")
        .delete()
        .eq("carro_id", id);

    if (erroRelacao) throw new Error(erroRelacao.message);

    const { error } = await supabase
        .from("carros")
        .delete()
        .eq("id", id);

    if (error) throw new Error(error.message);

    return { message: "Carro deletado com sucesso" };
}