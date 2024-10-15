import { env } from "@/env";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
    log: env.NODE_ENV === 'dev' ? ['query'] : [] //loga todas as queries no console
})