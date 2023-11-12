import request from 'supertest';
import app from './server'; 

let server: any;

beforeAll((done) => {
  server = app.listen(3001, done);
});

afterAll((done) => {
  server.close(done);
});


describe('Certificateless Crypto Service', () => {
  describe('GET /', () => {
    it('should return a greeting message', async () => {
      const response = await request(app).get('/');
      expect(response.statusCode).toBe(200);
      expect(response.text).toContain('Mock Certificateless Crypto Service');
    });
  });

  describe('POST /encrypt', () => {
    it('should encrypt the data and return a DHT key', async () => {
      const plaintext = 'test';
      const response = await request(app)
        .post('/encrypt')
        .send({ plaintext });

      expect(response.statusCode).toBe(200);
      expect(response.body.dhtKey).toBeDefined();
    });
  });

  describe('POST /decrypt', () => {
    it('should decrypt the data given a valid DHT key', async () => {
      
      const plaintext = 'test';
      const encryptResponse = await request(app)
        .post('/encrypt')
        .send({ plaintext });

      const dhtKey = encryptResponse.body.dhtKey;
      
      
      const decryptResponse = await request(app)
        .post('/decrypt')
        .send({ dhtKey });

      expect(decryptResponse.statusCode).toBe(200);
      expect(decryptResponse.body.decryptedData).toBe(plaintext);
    });

    it('should return a 404 error if the DHT key is invalid', async () => {
      const response = await request(app)
        .post('/decrypt')
        .send({ dhtKey: 'nonExistentKey' });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('Mining functionality', () => {
    it('should return the mining difficulty and previous hash', async () => {
      const response = await request(app).get('/mine');
      expect(response.statusCode).toBe(200);
      expect(response.body.difficulty).toBeDefined();
      expect(response.body.previousHash).toBeDefined();
    });

    it('should accept a mining solution', async () => {
      
      const nonce = '123';
      const response = await request(app)
        .post('/submitSolution')
        .send({ nonce });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});

