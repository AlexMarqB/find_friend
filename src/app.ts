import fastifyCookie from "@fastify/cookie";
import fastifyJwt from "@fastify/jwt";
import fastify from "fastify";
import { env } from "./env";
import { orgRoutes } from "./http/controllers/org/routes";
import { petRoutes } from "./http/controllers/pets/routes";

export const app = fastify();

app.register(fastifyCookie)

app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    cookie: {
        cookieName: 'refreshToken',
        signed: false
    },
    sign: {
        expiresIn: '15m'
    }
})

// Routes

app.register(orgRoutes)

app.register(petRoutes)