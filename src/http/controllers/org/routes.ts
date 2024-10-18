import { FastifyInstance } from "fastify";
import { authenticateOrgController, refreshTokenController, registerOrgController } from "./orgFactory";

export async function orgRoutes(app: FastifyInstance) {
    // Public routes

    app.post("/register", registerOrgController)

    // Auth routes

    app.post("/authenticate", authenticateOrgController)

    app.patch("/token/refresh", refreshTokenController)
}