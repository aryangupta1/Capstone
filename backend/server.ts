import express, { Request, Response } from 'express';
import crypto from 'crypto';

// Mock Certificateless Crypto Class
class CertificatelessCrypto {
  static publicKey = 'somePublickey';
  static privateKey = 'somePrivateKey';

  static encrypt(data: string, publicKey: string): string {
    // Mock encryption using hash (just for demonstration, not real encryption)
    const hash = crypto.createHash('sha256');
    hash.update(data + publicKey);
    return hash.digest('hex');
  }

  static decrypt(data: string, privateKey: string): string {
    // Mock decryption (Note: This is just reversing our mock encryption, not real decryption)
    const hash = crypto.createHash('sha256');
    hash.update(data + privateKey);
    return hash.digest('hex');
  }

}

// Mock DHT Storage Class
class DHTStorage {
  static store: Record<string, string> = {};

  static set(key: string, value: string): void {
    this.store[key] = value;
  }

  static get(key: string): string | null {
    return this.store[key] || null;
  }
}

const app = express();
const PORT = 3001;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Mock Certificateless Crypto Service');
});

app.post('/encrypt', (req: Request, res: Response) => {
  const plaintext = req.body.plaintext;
  const encryptedData = CertificatelessCrypto.encrypt(plaintext, CertificatelessCrypto.publicKey);

  const dhtKey = `uniqueDHTKey-${Date.now()}`;
  DHTStorage.set(dhtKey, encryptedData);

  res.json({ dhtKey });
});

app.post('/decrypt', (req: Request, res: Response) => {
  const dhtKey = req.body.dhtKey;
  const encryptedData = DHTStorage.get(dhtKey);

  if (!encryptedData) {
    return res.status(404).json({ message: 'Data not found' });
  }

  const decryptedData = CertificatelessCrypto.decrypt(encryptedData, CertificatelessCrypto.privateKey);
  res.json({ decryptedData });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
