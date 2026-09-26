require('dotenv').config();

import Fastify from 'fastify';
import FastifyCors from '@fastify/cors';
import FastifyRateLimit from '@fastify/rate-limit';

import books from './routes/books';
import anime from './routes/anime';
import manga from './routes/manga';
import comics from './routes/comics';
import lightnovels from './routes/light-novels';
import movies from './routes/movies';
import meta from './routes/meta';

const PORT = Number(process.env.PORT || 3000);

const app = Fastify({
  logger: true,
});

app.register(FastifyCors, {
  origin: '*',
  methods: 'GET',
});

app.register(FastifyRateLimit, {
  global: true,
  max: 90,
  timeWindow: 60000,
  allowList: [],
  errorResponseBuilder(req, context) {
    return {
      message: 'if you are a human, please wait a bit before trying again.',
    };
  },
});

app.register(books, { prefix: '/books' });
app.register(anime, { prefix: '/anime' });
app.register(manga, { prefix: '/manga' });
app.register(comics, { prefix: '/comics' });
app.register(lightnovels, { prefix: '/light-novels' });
app.register(movies, { prefix: '/movies' });
app.register(meta, { prefix: '/meta' });

app.get('/', (_, rp) => {
  rp.status(200).send('Welcome to consumet api! 🎉');
});
app.get('*', (request, reply) => {
  reply.status(404).send({
    message: '',
    error: 'page not found',
  });
});

export default async function handler(request: any, response: any) {
  await app.ready();
  app.server.emit('request', request, response);
}

if (process.env.VERCEL !== '1') {
  app
    .listen({ port: PORT, host: '0.0.0.0' })
    .then((address) => console.log(`server listening on ${address}`))
    .catch((err: any) => {
      app.log.error(err);
      process.exit(1);
    });
}