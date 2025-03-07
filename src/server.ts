import { fastifyCors } from '@fastify/cors'
import { fastifySwagger } from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import {
  type ZodTypeProvider,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { env } from './env'
import { subscribeToEventRoute } from './routes/subscribe-to-event-route'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifyCors, {
  origin: true, // também permite qualquer frontend, porém dá pra limitar com string com a url do frontend
})

// deixar qualquer frontend acessar a aplicação
// app.register(fastifyCors)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Referrals API',
      version: '0.0.1',
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(subscribeToEventRoute)

app.get('/hello', () => {
  return 'Hello World'
})

app.listen({ port: env.PORT }).then(() => {
  console.log('HTTP server running!')
})
