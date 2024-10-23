import { FastifyInstance } from "fastify";
import { getPetDetailsHandler, listPetsHandler, registerPetHandler } from "./petFactory";
import { verifyJwt } from "@/http/middlewares/verifyJwt";

export async function petRoutes(app: FastifyInstance) {
    // Public routes

    app.get('/pets/list/:city', await listPetsHandler())

    app.get('/pets/:id', await getPetDetailsHandler())

    // Protected routes

    app.post('/pets/register', {onRequest: verifyJwt} ,await registerPetHandler())
}