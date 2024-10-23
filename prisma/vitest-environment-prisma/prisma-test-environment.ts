import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import cuid from "cuid";
import { execSync } from "node:child_process";
import { Environment } from "vitest/environments";
import { randomUUID } from "node:crypto";

const prisma = new PrismaClient();

function generateDbURL(schema: string) {
	if (!process.env.DATABASE_URL) {
		throw new Error("DATABASE_URL is not defined");
	}

	const url = new URL(process.env.DATABASE_URL);

	url.searchParams.set("schema", schema);

	return url.toString();
}

export default <Environment>{
	name: "prisma",
	transformMode: "ssr",
	async setup() {
		console.log("Setting up Prisma environment");
		const schema = randomUUID();
		const dbUrl = generateDbURL(schema);

		try {
			process.env.DATABASE_URL = dbUrl;
			execSync(`npx prisma migrate deploy`);

			return {
				async teardown() {
					console.log("Tearing down Prisma environment");
					await prisma.$executeRawUnsafe(
						`DROP SCHEMA IF EXISTS "${schema}" CASCADE`
					);
					await prisma.$disconnect();
				},
			};
		} catch (error) {
			console.error("Error setting up database:", error);
			throw error; // Rejeita para que o Vitest saiba que houve um erro
		}
	},
};
