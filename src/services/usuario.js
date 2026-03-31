import { supabase } from "../config/supabase.js";

export async function UpdateUsuario({ id, nome, telefone, foto_perfil }) {
    if (!id) {
        throw new Error("ID do usuário não recebido.");
    }

    const { data, error } = await supabase
        .from("usuarios")
        .update({
            nome: nome || null,
            telefone: telefone || null,
            foto_perfil: foto_perfil || null
        })
        .eq("id", id)
        .select()
        .maybeSingle();

    if (error) throw new Error(error.message);

    return data;
}

export async function GetPerfil(id) {
    if (!id) {
        throw new Error("ID do usuário não enviado");
    }

    const { data, error } = await supabase
        .from("usuarios")
        .select(`
            id,
            nome,
            email,
            telefone,
            foto_perfil,
            tipo,

            localizacao:localizacao_id (
                id,
                cidade,
                estado,
                latitude,
                longitude
            ),

            aluno:alunos (
                id,
                data_nascimento,
                categoria_cnh
            ),

            professor:professores (
                id,
                descricao,
                created_at,
                cnh:cnh (
                    id,
                    numero,
                    categoria,
                    data_emissao,
                    data_validade
                )
            )
        `)
        .eq("id", id)
        .single();

    if (error) throw new Error(error.message);

    let perfil = {
        ...data,
        detalhes: null
    };

    if (data.tipo === "aluno") {
        perfil.detalhes = data.aluno;
    }

    if (data.tipo === "professor") {
        perfil.detalhes = data.professor;
    }

    delete perfil.aluno;
    delete perfil.professor;

    return perfil;
}

export async function GetCarros(usuario_id) {
    if (!usuario_id) {
        throw new Error("ID do usuário não enviado");
    }

    const { data, error } = await supabase
        .from("usuarios_carros")
        .select(`
            carro:carro_id (
                id,
                marca,
                modelo,
                ano,
                cambio,
                cor,
                placa
            )
        `)
        .eq("usuario_id", usuario_id);

    if (error) throw new Error(error.message);

    return data.map(item => item.carro);
}

export async function CreateLocalizacaoUsuario({ usuario_id, cidade, estado }) {
    if (!usuario_id) {
        throw new Error("ID do usuário é obrigatório");
    }

    if (!cidade || !estado) {
        throw new Error("Cidade e estado são obrigatórios");
    }

    const { data: existente, error: erroBusca } = await supabase
        .from("localizacao")
        .select("*")
        .eq("cidade", cidade)
        .eq("estado", estado)
        .maybeSingle();

    if (erroBusca) throw new Error(erroBusca.message);

    let localizacao = existente;

    if (!localizacao) {
        const { data: nova, error: erroCreate } = await supabase
            .from("localizacao")
            .insert([{ cidade, estado }])
            .select()
            .single();

        if (erroCreate) throw new Error(erroCreate.message);

        localizacao = nova;
    }

    const { error: erroUpdate } = await supabase
        .from("usuarios")
        .update({ localizacao_id: localizacao.id })
        .eq("id", usuario_id);

    if (erroUpdate) throw new Error(erroUpdate.message);

    return {
        message: "Localização vinculada com sucesso",
        localizacao
    };
}