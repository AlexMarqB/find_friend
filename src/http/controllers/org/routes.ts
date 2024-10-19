import { FastifyInstance } from "fastify";
import { registerOrgHandler, refreshTokenHandler, authenticateOrgHandler } from "./orgFactory";

export async function orgRoutes(app: FastifyInstance) {
    // Public routes
    app.post("/register", registerOrgHandler());

    // Auth routes
    app.post("/authenticate", authenticateOrgHandler());
    app.patch("/token/refresh", refreshTokenHandler());
}
