/**
 * Seed Script
 * 
 * Loads sample travel documents from the data directory,
 * processes them, and stores their embeddings in MongoDB.
 * 
 * Run this once to populate the knowledge base:
 *   node seed.js
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const TravelDocument = require('./models/TravelDocument');
const Embedding = require('./models/Embedding');
const { splitTextIntoChunks } = require('./utils/textSplitter');
const { generateEmbeddings } = require('./services/embeddingService');

const SAMPLE_DIR = path.join(__dirname, 'data', 'sample-travel-docs');

async function seed() {
  try {
    // Connect to MongoDB
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/tripgenie';
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    // Read all .txt files from sample directory
    const files = fs.readdirSync(SAMPLE_DIR).filter((f) => f.endsWith('.txt'));
    console.log(`📁 Found ${files.length} sample documents`);

    for (const file of files) {
      // Check if already seeded
      const existing = await TravelDocument.findOne({ filename: file });
      if (existing) {
        console.log(`⏭️ Skipping ${file} (already seeded)`);
        continue;
      }

      const filePath = path.join(SAMPLE_DIR, file);
      const text = fs.readFileSync(filePath, 'utf-8');

      // Split into chunks
      const chunkTexts = splitTextIntoChunks(text, 250, 50);
      const chunks = chunkTexts.map((t, i) => ({ text: t, chunkIndex: i }));

      // Save document
      const doc = await TravelDocument.create({
        filename: file,
        mimeType: 'text/plain',
        fullText: text,
        chunks,
      });

      // Generate embeddings
      console.log(`🔄 Generating embeddings for ${file} (${chunks.length} chunks)...`);
      const vectors = await generateEmbeddings(chunkTexts);

      // Store embeddings
      const embDocs = chunks.map((chunk, i) => ({
        documentId: doc._id,
        chunkText: chunk.text,
        chunkIndex: chunk.chunkIndex,
        vector: vectors[i],
      }));

      await Embedding.insertMany(embDocs);

      doc.isEmbedded = true;
      await doc.save();

      console.log(`✅ Seeded: ${file} → ${chunks.length} embeddings`);
    }

    console.log('\n🎉 Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
}

seed();
