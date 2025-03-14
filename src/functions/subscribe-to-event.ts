import { prisma } from '../lib/prisma'
import { redis } from '../redis/client'

interface SubscribeToEventParams {
  name: string
  email: string
  referrerId?: string | null
}

export async function subscribeToEvent({
  name,
  email,
  referrerId,
}: SubscribeToEventParams) {
  const subscribers = await prisma.subscription.findMany({
    where: {
      email,
    },
  })

  if (subscribers.length > 0) {
    // Ao invés de passar um erro de email já cadastrado, ele reaproveita o email já usado
    return { subscriberId: subscribers[0].id }
  }

  const subscriber = await prisma.subscription.create({
    data: {
      name,
      email,
    },
  })

  if (referrerId) {
    // sorted sets -> ordenação automática (zincrby)
    await redis.zincrby('referral:ranking', 1, referrerId)
  }

  return {
    subscriberId: subscriber.id,
  }
}
