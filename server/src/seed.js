import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Outfit from './models/Outfit.js';
import Feedback from './models/Feedback.js';

dotenv.config();

const runMigration = async () => {
  try {
    await connectDB();
    console.log('[Migration]: Connected to MongoDB Atlas. Reading celesticare.json...');

    // Locate celesticare.json
    let jsonPath = path.resolve('celesticare.json');
    if (!fs.existsSync(jsonPath)) {
      jsonPath = path.resolve('../celesticare.json');
    }

    if (!fs.existsSync(jsonPath)) {
      console.error(`[Migration Error]: Cannot find celesticare.json at ${jsonPath}`);
      process.exit(1);
    }

    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const parsedData = JSON.parse(rawData);

    const usersTable = parsedData.find((item) => item.name === 'users')?.data || [];
    const outfitsTable = parsedData.find((item) => item.name === 'user_outfits')?.data || [];
    const feedbackTable = parsedData.find((item) => item.name === 'user_feedback')?.data || [];

    // 1. Wipe old collections
    await User.deleteMany();
    await Outfit.deleteMany();
    await Feedback.deleteMany();
    console.log('[Migration]: Existing collections cleared.');

    // 2. Migrate Users
    const userDocs = usersTable.map((u) => ({
      legacy_id: u.id,
      username: u.username,
      name: u.name,
      email: u.email,
      password: u.password, // Pre-hashed bcrypt hashes
      role: u.is_admin === '1' ? 'admin' : 'user',
      is_admin: u.is_admin === '1',
      zodiac_sign: u.zodiac_sign,
      undertone: u.undertone,
      birthdate: u.birthdate,
      gender: u.gender,
      season: u.season,
      aesthetic_result: u.aesthetic_result,
      style_result: u.style_result,
      security_question1: u.security_question1,
      security_answer1: u.security_answer1,
      security_question2: u.security_question2,
      security_answer2: u.security_answer2,
      security_question3: u.security_question3,
      security_answer3: u.security_answer3,
      security_setup_complete: u.security_setup_complete === '1',
      created_at: u.created_at,
      updated_at: u.updated_at
    }));

    const insertedUsers = await User.insertMany(userDocs);
    console.log(`[Migration]: Successfully inserted ${insertedUsers.length} Users.`);

    // Build map from legacy ID to new MongoDB _id
    const userMap = new Map();
    insertedUsers.forEach((user) => userMap.set(user.legacy_id, user._id));

    // 3. Migrate Outfits
    const outfitDocs = outfitsTable.map((o) => {
      let parsedOutfits = [];
      try {
        parsedOutfits = typeof o.outfit_data === 'string' ? JSON.parse(o.outfit_data) : o.outfit_data;
      } catch {
        parsedOutfits = [];
      }

      return {
        legacy_id: o.id,
        user: userMap.get(o.user_id) || null,
        legacy_user_id: o.user_id,
        clothing_src: o.clothing_src,
        clothing_category: o.clothing_category,
        clothing_style: o.clothing_style,
        gender: o.gender,
        outfit_data: parsedOutfits,
        created_at: o.created_at
      };
    });

    const insertedOutfits = await Outfit.insertMany(outfitDocs);
    console.log(`[Migration]: Successfully inserted ${insertedOutfits.length} Outfits.`);

    // 4. Migrate Feedbacks
    const feedbackDocs = feedbackTable.map((f) => ({
      legacy_id: f.id,
      user: userMap.get(f.user_id) || null,
      legacy_user_id: f.user_id,
      experience: f.experience,
      fashion_match: f.fashion_match,
      favorite_feature: f.favorite_feature,
      vibe: f.vibe,
      suggestions: f.suggestions,
      created_at: f.created_at
    }));

    const insertedFeedbacks = await Feedback.insertMany(feedbackDocs);
    console.log(`[Migration]: Successfully inserted ${insertedFeedbacks.length} Feedbacks.`);

    console.log('[Migration Finished]: Atlas database is completely loaded with legacy data.');
    process.exit(0);
  } catch (err) {
    console.error(`[Migration Error]: ${err.message}`);
    process.exit(1);
  }
};

runMigration();