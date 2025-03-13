import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { env } from '../env'
import { accessInviteLink } from '../functions/access-invite-link'
import { redis } from '../redis/client'

export const accessInviteLinkRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/invites/:subscriberId',
    {
      schema: {
        summary: 'Access invite link and redirects user',
        tags: ['referral'],
        params: z.object({
          subscriberId: z.string(),
        }),
        response: {
          302: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { subscriberId } = request.params

      await accessInviteLink({ subscriberId })

      // Ver o ranking do redis aumentando nos logs
      console.log(await redis.hgetall('referral:access-count'))

      const redirectUrl = new URL(env.WEB_URL)

      redirectUrl.searchParams.set('referrer', subscriberId)

      // 301: redirect permanente - o browser faz um cache do redirecionamento
      // A próxima vez que eu acessar esse link, o browser vai redirecionar automaticamente
      // Então o browser não vai contabilizar próximos links, só o primeiro. E não vai contabilizar no ranking
      // 302: redirect temporário
      // Com o redirect temporário, o link sempre vai executar

      return reply.redirect(redirectUrl.toString(), 302)
    }
  )
}
