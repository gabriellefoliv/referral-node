import { prisma } from '../lib/prisma'

interface SubscribeToEventParams {
  name: string
  email: string
}

export async function subscribeToEvent({
  name,
  email,
}: SubscribeToEventParams) {
  const subscriber = await prisma.subscription.create({
    data: {
      name,
      email,
    },
  })

  return {
    subscriberId: subscriber.id,
  }
}
