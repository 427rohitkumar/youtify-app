import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

async function check() {
  await mongoose.connect(MONGODB_URI!);
  const users = await mongoose.connection.db!.collection('users').find({}).toArray();
  console.log('Users in DB:', users.map(u => ({ email: u.email, hasPassword: !!u.passwordHash })));
  await mongoose.disconnect();
}

check();
