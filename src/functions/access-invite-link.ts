import { prisma } from '../lib/prisma'
import { redis } from '../redis/client'

interface AccessInviteLinkParams {
  subscriberId: string
}

export async function accessInviteLink({
  subscriberId,
}: AccessInviteLinkParams) {
  await redis.hincrby('referral:access-count', subscriberId, 1)
}

// { 'gabriellefoliv': 1 } - isso é incrementado cada vez que a função é executada

// redis:
// chave/valor
// insert into tabela values ('name', 'gabi')

// lists (comandos que começam por l) []
// hashes (começam por h) {}
// sorted sets (começam por z) [ likes: number ]
// json
