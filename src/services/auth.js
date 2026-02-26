import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { supabase } from "../config/supabase.js";
import { enviarOTP } from "./email.js";

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

    await enviarOTP(user.email, user.nome, otp);

    return {
        message: `Usuário criado. Um código foi enviado para ${user.email} .`
    };
}

export async function verificarEmail({ email, codigo }) {

    email = email.toLowerCase();

    const { data: user } = await supabase
        .from("usuarios")
        .select("*")
        .eq("email", email)
        .single();

    if (!user) throw new Error("Usuário não encontrado");

    const { data: otp } = await supabase
        .from("email_otps")
        .select("*")
        .eq("usuario_id", user.id)
        .eq("codigo", codigo)
        .eq("usado", false)
        .single();

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

    email = email.toLowerCase();

    const { data: user } = await supabase
        .from("usuarios")
        .select("*")
        .eq("email", email)
        .single();

    if (!user) throw new Error("Usuário não encontrado");

    if (user.email_verificado) {
        throw new Error("Email já verificado");
    }

    const { data: ultimoOtp } = await supabase
        .from("email_otps")
        .select("*")
        .eq("usuario_id", user.id)
        .order("criado_em", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (ultimoOtp) {
        const agora = new Date();
        const criado = new Date(ultimoOtp.criado_em);
        const diff = (agora - criado) / 1000;

        if (diff < 60) {
            throw new Error("Aguarde 1 minuto para reenviar o código");
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

    await supabase.from("email_otps").insert([{
        usuario_id: user.id,
        codigo: otp,
        expira_em: expira
    }]);

    await enviarOTP(user.email, user.nome, otp);

    return { message: `Novo código enviado para ${user.email}` };
}

export async function login({ email, senha }) {

    if (!email || !senha) {
        throw new Error("Email e senha são obrigatórios");
    }

    email = email.toLowerCase();

    const { data: user, error } = await supabase
        .from("usuarios")
        .select("id, nome, email, senha, tipo, email_verificado")
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

    const token = jwt.sign(
        { id: user.id, tipo: user.tipo },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            nome: user.nome,
            tipo: user.tipo
        }
    };
}