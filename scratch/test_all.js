const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { createClient } = require('@supabase/supabase-js');

// 1. Read and load .env manually
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) {
    console.error('.env file not found at', envPath);
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
    // remove quotes if present
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.substring(1, val.length - 1);
    }
    process.env[key] = val;
  });
  console.log('--- Environment Variables Loaded ---');
}

loadEnv();

async function runTests() {
  console.log('\n--- 1. Testing MongoDB Connection ---');
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('FAIL: MONGODB_URI is not set in .env');
  } else {
    try {
      console.log('Connecting to MongoDB...');
      // Set servers to avoid DNS resolution issues on some local networks
      const dns = require('dns');
      if (dns && typeof dns.setServers === 'function') {
        dns.setServers(['8.8.8.8', '1.1.1.1']);
      }
      await mongoose.connect(uri);
      console.log('SUCCESS: Connected to MongoDB successfully.');
      
      // Let's count Resume and CareerTarget documents
      const resumeCount = await mongoose.connection.db.collection('resumes').countDocuments();
      console.log(`- Found ${resumeCount} documents in resumes collection`);
      
      const targetCount = await mongoose.connection.db.collection('careertargets').countDocuments();
      console.log(`- Found ${targetCount} documents in careertargets collection`);
      
      await mongoose.disconnect();
    } catch (err) {
      console.error('FAIL: MongoDB connection error:', err);
    }
  }

  console.log('\n--- 2. Testing Groq API Key ---');
  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey) {
    console.error('FAIL: GROQ_API_KEY is not set in .env');
  } else {
    try {
      console.log('Sending a simple test request to Groq API...');
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'user', content: 'Hello! Respond with "GROQ IS WORKING" and nothing else.' }
          ],
          temperature: 0.1,
          max_tokens: 20
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.choices?.[0]?.message?.content?.trim();
        console.log(`SUCCESS: Groq response: "${text}"`);
      } else {
        const errText = await response.text();
        console.error(`FAIL: Groq API returned status ${response.status}: ${errText}`);
      }
    } catch (err) {
      console.error('FAIL: Groq API request crashed:', err);
    }
  }

  console.log('\n--- 3. Testing Supabase Storage ---');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    console.error('FAIL: Supabase credentials are missing in .env');
  } else {
    try {
      console.log('Connecting to Supabase...');
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      console.log('Listing storage buckets...');
      const { data: buckets, error: bucketsErr } = await supabase.storage.listBuckets();
      
      if (bucketsErr) {
        console.error('FAIL: Listing buckets failed:', bucketsErr);
      } else {
        console.log('SUCCESS: Buckets found:', buckets.map(b => b.name));
        
        // check if 'resumes' bucket exists
        const resumesBucket = buckets.find(b => b.name === 'resumes');
        if (resumesBucket) {
          console.log('Bucket "resumes" exists.');
          
          // Let's try listing the root level items
          const { data: files, error: filesErr } = await supabase.storage.from('resumes').list('', { limit: 5 });
          if (filesErr) {
            console.error('Warning: could not list files in "resumes" bucket:', filesErr);
          } else {
            console.log('SUCCESS: Listed files in resumes bucket:', files.map(f => f.name));
          }
        } else {
          console.warn('Warning: "resumes" bucket does not exist. Creating one...');
          const { data, error } = await supabase.storage.createBucket('resumes', { public: true });
          if (error) {
            console.error('FAIL: Failed to create "resumes" bucket:', error);
          } else {
            console.log('SUCCESS: Programmatically created "resumes" bucket');
          }
        }
      }
    } catch (err) {
      console.error('FAIL: Supabase operation crashed:', err);
    }
  }
}

runTests().then(() => {
  console.log('\n--- Diagnostic Tests Finished ---');
});
