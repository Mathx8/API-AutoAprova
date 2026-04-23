import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { supabase } from "../config/supabase.js";

export async function register({ nome, email, senha, tipo, telefone }) {

    if (!nome || !email || !senha || !tipo) {
        throw new Error("Campos obrigatórios não enviados");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error("Email inválido");
    }

    if (senha.length < 6) {
        throw new Error("Senha deve ter no mínimo 6 caracteres");
    }

    if (!["aluno", "professor"].includes(tipo)) {
        throw new Error("Tipo inválido. Use 'aluno' ou 'professor'");
    }

    const { data: existingUser } = await supabase
        .from("usuarios")
        .select("id")
        .eq("email", email)
        .maybeSingle();

    if (existingUser) {
        throw new Error("Email já cadastrado");
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const { data: user, error } = await supabase
        .from("usuarios")
        .insert([{ nome, email: email.toLowerCase(), tipo, telefone, senha: hashedPassword }])
        .select()
        .maybeSingle();

    if (error) throw new Error(error.message);

    if (tipo === "aluno") {
        const { error: alunoError } = await supabase
            .from("alunos")
            .insert([{ usuario_id: user.id }]);

        if (alunoError) throw new Error(alunoError.message);
    }

    if (tipo === "professor") {
        const { error: professorError } = await supabase
            .from("professores")
            .insert([{ usuario_id: user.id }]);

        if (professorError) throw new Error(professorError.message);
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const expira = new Date();
    expira.setMinutes(expira.getMinutes() + 5);

    await supabase.from("email_otps").insert([{
        usuario_id: user.id,
        codigo: otp,
        expira_em: expira
    }]);

    return {
        message: `Usuário criado. Um código foi enviado para ${user.email} .`,
        email: user.email,
        nome: user.nome,
        otp
    };
}

export async function verificarEmail({ email, codigo }) {

    email = email.toLowerCase();

    const { data: user, error } = await supabase
        .from("usuarios")
        .select("*")
        .eq("email", email)
        .maybeSingle();

    if (error) throw new Error(error.message);
    if (!user) throw new Error("Usuário não encontrado");

    const { data: otp } = await supabase
        .from("email_otps")
        .select("*")
        .eq("usuario_id", user.id)
        .eq("codigo", codigo)
        .eq("usado", false)
        .maybeSingle();

    if (!otp) throw new Error("Código inválido");

    if (new Date(otp.expira_em) < new Date()) {
        throw new Error("Código expirado");
    }

    await supabase
        .from("usuarios")
        .update({ email_verificado: true })
        .eq("id", user.id);

    await supabase
        .from("email_otps")
        .update({ usado: true })
        .eq("id", otp.id);

    return { message: "Email verificado com sucesso" };
}

export async function reenviarOTP({ email }) {

    if (!email) throw new Error("Email é obrigatório");

    email = email.toLowerCase();

    const { data: user, error } = await supabase
        .from("usuarios")
        .select("*")
        .eq("email", email)
        .maybeSingle();

    if (error) throw new Error(error.message);
    if (!user) throw new Error("Usuário não encontrado");

    if (user.email_verificado) {
        throw new Error("Email já verificado");
    }

    const { data: ultimoOtp, error: otpError } = await supabase
        .from("email_otps")
        .select("*")
        .eq("usuario_id", user.id)
        .order("criado_em", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (otpError) throw new Error(otpError.message);
    if (ultimoOtp) {
        const diff = (Date.now() - new Date(ultimoOtp.criado_em).getTime()) / 1000;

        if (diff < 60) {
            const restante = Math.ceil(60 - diff);
            throw new Error(`Aguarde ${restante}s para reenviar o código`);
        }
    }

    await supabase
        .from("email_otps")
        .update({ usado: true })
        .eq("usuario_id", user.id)
        .eq("usado", false);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const expira = new Date();
    expira.setMinutes(expira.getMinutes() + 5);

    const { error: insertError } = await supabase
        .from("email_otps")
        .insert([{
            usuario_id: user.id,
            codigo: otp,
            expira_em: expira
        }]);

    if (insertError) throw new Error(insertError.message);

    return {
        message: "Novo código gerado",
        email: user.email,
        nome: user.nome,
        otp
    };
}

export async function login({ email, senha }) {

    if (!email || !senha) {
        throw new Error("Email e senha são obrigatórios");
    }

    email = email.toLowerCase();

    const { data: user, error } = await supabase
        .from("usuarios")
        .select(`
            id,
            nome,
            email,
            senha,
            tipo,
            email_verificado,
            localizacao ( cidade, estado ),

            aluno:alunos ( id ),
            professor:professores ( id )
        `)
        .eq("email", email)
        .maybeSingle();

    if (error || !user) {
        throw new Error("Email ou senha inválidos");
    }

    if (!user.email_verificado) {
        throw new Error("Verifique seu email antes de fazer login");
    }

    const validPassword = await bcrypt.compare(senha, user.senha);

    if (!validPassword) {
        throw new Error("Email ou senha inválidos");
    }

    let tipo_id = null;

    if (user.tipo === "aluno") {
        tipo_id = user.aluno?.id || null;
    }

    if (user.tipo === "professor") {
        tipo_id = user.professor?.id || null;
    }

    const token = jwt.sign(
        { id: user.id, tipo: user.tipo },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    return {
        token,
        user: {
            id: user.id,
            tipo_id,
            email: user.email,
            nome: user.nome,
            tipo: user.tipo,
            localizacao: user.localizacao || null
        }
    };
}