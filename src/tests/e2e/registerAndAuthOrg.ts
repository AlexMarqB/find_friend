import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import request from "supertest";

export async function RegisterAndAuthOrg(app: FastifyInstance, city: string = "Testville") {
	const org = await prisma.org.create({
		data: {
			cnpj: "98.436.729/0001-00",
			responsable_name: "Test Org",
			email: "testorg@example.com",
			password: "securepassword",
			whatsapp: "1234567890",
			cep: "22461-040",
			city,
			street: "123 Test St",
			neighborhood: "Test Neighborhood",
			number: "123",
		},
	});

	await request(app.server).post("/register").send(org);

	//@ts-ignore
	const authResponse = await request(app.server).post("/authenticate").send({
		cnpj: "98.436.729/0001-00",
		email: "testorg@example.com",
		password: "securepassword",
	});

	return authResponse.body;
}
