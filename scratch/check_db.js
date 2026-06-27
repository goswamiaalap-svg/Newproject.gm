const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) {
    console.error('.env file not found');
    process.exit(1);
  }
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    line = line.trim();
    if (!line || line.startsWith('#')) return;
    const idx = line.indexOf('=');
    if (idx === -1) return;
    const key = line.substring(0, idx).trim();
    let val = line.substring(idx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.substring(1, val.length - 1);
    }
    process.env[key] = val;
  });
}

loadEnv();

async function check() {
  const uri = process.env.MONGODB_URI;
  try {
    const dns = require('dns');
    if (dns && typeof dns.setServers === 'function') {
      dns.setServers(['8.8.8.8', '1.1.1.1']);
    }
    await mongoose.connect(uri);
    console.log('Connected to DB');

    const resumes = await mongoose.connection.db.collection('resumes')
      .find({})
      .sort({ uploadedAt: -1 })
      .limit(10)
      .toArray();

    console.log('\n--- LATEST 10 RESUMES ---');
    resumes.forEach((r, idx) => {
      console.log(`\n[${idx + 1}] ID: ${r._id}`);
      console.log(`- File Name: ${r.fileName}`);
      console.log(`- User ID: ${r.userId}`);
      console.log(`- Status: ${r.status}`);
      console.log(`- Uploaded At: ${r.uploadedAt}`);
      if (r.errorMessage) {
        console.log(`- Error Message: ${r.errorMessage}`);
      }
      if (r.reviewResult) {
        console.log(`- Review Result Keys: ${Object.keys(r.reviewResult).join(', ')}`);
        console.log(`- Overall Score: ${r.reviewResult.overallScore}`);
      }
    });

    const targets = await mongoose.connection.db.collection('careertargets')
      .find({})
      .sort({ updatedAt: -1 })
      .limit(5)
      .toArray();

    console.log('\n--- LATEST 5 CAREER TARGETS ---');
    targets.forEach((t, idx) => {
      console.log(`\n[${idx + 1}] ID: ${t._id}`);
      console.log(`- Title: ${t.targetTitle}`);
      console.log(`- Type: ${t.targetType}`);
      console.log(`- User ID: ${t.userId}`);
      console.log(`- Is Active: ${t.isActive}`);
      console.log(`- Readiness Score: ${t.readinessScore}`);
      console.log(`- Has Gap Analysis: ${!!t.gapAnalysis}`);
      console.log(`- Has Perfect Resume: ${!!t.perfectResume}`);
    });

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
}

check();
