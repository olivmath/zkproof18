import request from 'supertest';
import app from '../app.js';

describe('API /api/data', () => {
  it('deve retornar os dados enviados com status 200', async () => {
    const payload = { nome: 'João', idade: 30 };

    const response = await request(app)
      .post('/api/data')
      .send(payload)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(response.body).toEqual({
      message: 'Dados recebidos com sucesso!',
      received: payload
    });
  });

  it('deve retornar 404 para rotas não definidas', async () => {
    const response = await request(app)
      .post('/rota-inexistente')
      .send({})
      .expect(404);

    expect(response.body).toEqual({ error: 'Rota não encontrada' });
  });
});
