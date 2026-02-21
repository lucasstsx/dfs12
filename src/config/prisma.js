// Configuração do cliente do Prisma com driver nativo do PostgreSQL (pg)
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// Criação do pool de conexões com o banco de dados via URL definida no .env
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
// Configuração do adaptador para melhor compatibilidade com ambientes serverless e desempenho
const adapter = new PrismaPg(pool);
// Exportação do cliente para ser usado em qualquer parte do projeto (Services/Controllers)
const prisma = new PrismaClient({ adapter, log: ["query"] });

export default prisma;
