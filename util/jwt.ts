import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

class TokenManager {
  private privateKey: string;
  memory: number;

  constructor() {
    this.privateKey = process.env.JWT_SECRET_KEY!;
    this.memory = Date.now();
  }

  createToken(id: number, username: string, email: string): string {
    const token = jwt.sign({ id, username, email }, this.privateKey);
    return token;
  }

  verifyToken(token: string) {
    const decoded = jwt.verify(token, this.privateKey, (err, decoded) => {
      if (err) {
        console.log(err);
        return err;
      }
      console.log(decoded);
      return decoded;
    });
    return decoded;
  }
}

const tokenManager = new TokenManager();

export default tokenManager;
