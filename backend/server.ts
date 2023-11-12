import express, { Request, Response } from 'express';
import crypto from 'crypto';
import cors from 'cors';

// Mock Certificateless Crypto Class
class CertificatelessCrypto {
  static publicKey = 'somePublickey';
  static privateKey = 'somePrivateKey';
  static salt = 'someSalt'; // Added salt for "encryption" and "decryption"
  
  static encrypt(data: string, publicKey: string): string {
    // Mock encryption by appending salt and publicKey
    return data + this.salt + publicKey;
  }
  
  static decrypt(data: string, privateKey: string): string {
    // Mock decryption by removing salt and publicKey
    const rawData = data.replace(this.salt + this.publicKey, '');
    return rawData;
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
app.use(cors())

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
    console.error('encryptedData not found for dhtKey:', dhtKey);
    return res.status(404).json({ message: 'Data not found' });
  }

  const decryptedData = CertificatelessCrypto.decrypt(encryptedData, CertificatelessCrypto.privateKey);
  res.json({ decryptedData });
});

/*
  POW: 
    Problem: Given a piece of data (e.g., previous block's hash and a nonce), find a hash that starts with difficulty number of leading zeros.
    Solution: Compute the hash of the data combined with various nonces until you find one that meets the criteria.
*/

let difficulty = 1; 
let previousHash = crypto.createHash('sha256').update('Genesis').digest('hex');

app.get('/mine', (req: Request, res: Response) => {
  res.json({
    previousHash,
    difficulty
  });
});

app.post('/submitSolution', (req: Request, res: Response) => {
  const { nonce } = req.body;
  const data = previousHash + nonce;
  const hash = crypto.createHash('sha256').update(data).digest('hex');

  // if (hash.substring(0, difficulty) === '0'.repeat(difficulty)) {
  //   previousHash = hash;
  //   // Here you can reward the participant, add to a blockchain, etc.
  //   // For now, update the previousHash and send a success response
  //   res.json({ success: true, message: 'Block mined!' });
  // } else {
  //   res.status(400).json({ success: false, message: 'Invalid solution.' });
  // }

  res.json({ success: true, message: 'Block mined!' });

});


if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}
export default app