import { FastifyInstance } from "fastify";
import { authenticateOrgController, refreshTokenController, registerOrgController } from "./orgFactory";

export async function orgRoutes(app: FastifyInstance) {
    // Public routes

    app.post("/register", await registerOrgController())

    // Auth routes

    app.post("/authenticate", await authenticateOrgController())

    app.patch("/token/refresh", await refreshTokenController())
}