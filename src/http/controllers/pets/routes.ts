import { FastifyInstance } from "fastify";
import { getPetDetailsController, listPetsController, registerPetController } from "./petFactory";
import { verifyJwt } from "@/http/middlewares/verifyJwt";

export async function petRoutes(app: FastifyInstance) {
    // Public routes

    app.get('/pets/list/:city', await listPetsController())

    app.get('/pets/:id', await getPetDetailsController())

    // Protected routes

    app.post('/pets/register/:orgId', {onRequest: verifyJwt} ,await registerPetController())
}