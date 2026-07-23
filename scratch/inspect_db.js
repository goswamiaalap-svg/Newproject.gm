const { MongoClient } = require('mongodb')

const uri = 'mongodb+srv://goswamiaalap:Aalapniharika1@logicloops.7ra9dmp.mongodb.net/launchpad?appName=logicloops'

async function run() {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    console.log('Connected to MongoDB')
    const db = client.db('launchpad')
    const resumesCol = db.collection('resumes')

    const recentResumes = await resumesCol.find({}).sort({ uploadedAt: -1 }).limit(5).toArray()

    console.log('--- RECENT RESUMES ---')
    recentResumes.forEach((r, idx) => {
      console.log(`[${idx + 1}] ID: ${r._id}`)
      console.log(`    File Name: ${r.fileName}`)
      console.log(`    User ID: ${r.userId}`)
      console.log(`    Status: ${r.status}`)
      console.log(`    Uploaded At: ${r.uploadedAt}`)
      console.log(`    Error Message: ${r.errorMessage || 'None'}`)
      console.log(`    Has Review Result: ${!!r.reviewResult}`)
      if (r.reviewResult) {
        console.log(`    Overall Score: ${r.reviewResult.overallScore}`)
        console.log(`    ATS Score: ${r.reviewResult.atsScore}`)
      }
      console.log('----------------------')
    })

  } catch (err) {
    console.error(err)
  } finally {
    await client.close()
  }
}

run()
