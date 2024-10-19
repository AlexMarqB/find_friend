import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import cuid from 'cuid'
import { execSync } from 'node:child_process'
import { Environment } from 'vitest'

const prisma = new PrismaClient()

function generateDbURL(schema: string) {
    if(!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is not defined')
    }

    const url = new URL(process.env.DATABASE_URL)
    
    url.searchParams.set('schema', schema)

    return url.toString()
}

export default <Environment> {
    name: 'prisma',
    transformMode: 'web',
    setup: async () => {

        const schema = cuid()
        const dbUrl = generateDbURL(schema)

        process.env.DATABASE_URL = dbUrl

        execSync(`npx prisma migrate deploy`)
        return {
            async teardown() {
                await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)
                await prisma.$disconnect()
            }
        }
    },
}