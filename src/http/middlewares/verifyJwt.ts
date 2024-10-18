import { FastifyReply, FastifyRequest } from "fastify"

export async function verifyJwt(
    req: FastifyRequest,
    rep: FastifyReply,
) {
    try {
        await req.jwtVerify()
    } catch (error) {
        return rep.status(401).send({error: 'Unauthorized'})
    }
}