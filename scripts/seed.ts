import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

// User Schema (Inline for script simplicity)
const UserSchema = new mongoose.Schema({
  email: String,
  passwordHash: String,
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log('Connected to MongoDB');

    const email = '427rohitkumar@gmail.com';
    const password = '427rohit@';

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists, updating password...');
      existingUser.passwordHash = await bcrypt.hash(password, 10);
      await existingUser.save();
    } else {
      console.log('Creating new user...');
      const passwordHash = await bcrypt.hash(password, 10);
      await User.create({ email, passwordHash });
    }

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
