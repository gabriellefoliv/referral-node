import { prisma } from '../lib/prisma'

interface SubscribeToEventParams {
  name: string
  email: string
}

export async function subscribeToEvent({
  name,
  email,
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

  return {
    subscriberId: subscriber.id,
  }
}
