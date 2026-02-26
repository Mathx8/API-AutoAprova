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

    return {
        id: user.id,
        email: user.email,
        tipo: user.tipo
    };
}

export async function login({ email, senha }) {

    if (!email || !senha) {
        throw new Error("Email e senha são obrigatórios");
    }

    email = email.toLowerCase();

    const { data: user, error } = await supabase
        .from("usuarios")
        .select("id, nome, email, senha, tipo")
        .eq("email", email)
        .maybeSingle();

    if (error || !user) {
        throw new Error("Email ou senha inválidos");
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