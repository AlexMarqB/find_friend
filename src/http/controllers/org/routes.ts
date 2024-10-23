import { FastifyInstance } from "fastify";
import { registerOrgHandler, refreshTokenHandler, authenticateOrgHandler, orgDataHandler } from "./orgFactory";
import { verifyJwt } from "@/http/middlewares/verifyJwt";

export async function orgRoutes(app: FastifyInstance) {
    // Public routes
    app.post("/register", registerOrgHandler());

    // Auth routes
    app.post("/authenticate", authenticateOrgHandler());
    app.patch("/token/refresh", refreshTokenHandler());

    // Public routes
    app.get("/org", {onRequest: verifyJwt}, orgDataHandler());
}
