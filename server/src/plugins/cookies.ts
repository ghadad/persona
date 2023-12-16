import fp from 'fastify-plugin'
import type { FastifyCookieOptions } from '@fastify/cookie'
import cookie from '@fastify/cookie'

export default fp<FastifyCookieOptions>(async (fastify) => {
    fastify.register(cookie, {
        secret: "my-secret", // for cookies signature
        parseOptions: {}     // options for parsing cookies
    } as FastifyCookieOptions)
})
