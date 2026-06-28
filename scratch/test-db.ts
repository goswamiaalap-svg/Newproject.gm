import { connect } from 'mongoose'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'

// Load env vars from .env.local
const envPath = path.resolve(__dirname, '../.env.local')
if (fs.existsSync(envPath)) {
  const envConfig = dotenv.parse(fs.readFileSync(envPath))
  for (const k in envConfig) {
    process.env[k] = envConfig[k]
  }
}

import Opportunity from '../src/lib/models/Opportunity'
import OpportunityState from '../src/lib/models/OpportunityState'
import { connectToDatabase } from '../src/lib/mongoose'

async function runTests() {
  console.log('Starting Mongoose Integration Tests...')
  
  await connectToDatabase()
  console.log('✅ Connected to MongoDB successfully.')

  // 1. Create a test opportunity
  const testId = 'test-opp-123'
  console.log(`\nTesting POST (Create) opportunity with ID: ${testId}...`)
  await Opportunity.deleteOne({ id: testId }) // Clean up first
  const newOpp = await Opportunity.create({
    id: testId,
    title: 'Test SDE Role',
    type: 'internship',
    company: 'Test Company LLC',
    deadline: new Date('2026-12-31'),
    logo: '🔍',
    applyUrl: 'https://testcompany.jobs/apply'
  })
  console.log('✅ Test Opportunity Created:', newOpp.toJSON())

  // 2. Read (Get) the opportunity
  console.log(`\nTesting GET (Retrieve) opportunity with ID: ${testId}...`)
  const retrievedOpp = await Opportunity.findOne({ id: testId })
  if (!retrievedOpp) throw new Error('GET Failed: Opportunity not found')
  console.log('✅ Test Opportunity Retrieved:', retrievedOpp.toJSON())

  // 3. Update (Put) the opportunity
  console.log(`\nTesting PUT (Update) opportunity with ID: ${testId}...`)
  const updatedOpp = await Opportunity.findOneAndUpdate(
    { id: testId },
    { $set: { title: 'Updated Test SDE Role', applyUrl: 'https://testcompany.jobs/apply-updated' } },
    { new: true }
  )
  if (!updatedOpp || updatedOpp.title !== 'Updated Test SDE Role') {
    throw new Error('PUT Failed: Title did not update')
  }
  console.log('✅ Test Opportunity Updated:', updatedOpp.toJSON())

  // 4. Test state operations (Applied / Reminded toggles)
  console.log(`\nTesting OpportunityState CRUD...`)
  const testUserId = 'test-user-999'
  await OpportunityState.deleteOne({ userId: testUserId, opportunityId: testId })
  
  const newState = await OpportunityState.create({
    userId: testUserId,
    opportunityId: testId,
    applied: true,
    reminded: false
  })
  console.log('✅ Test OpportunityState Created:', newState.toJSON())

  const retrievedState = await OpportunityState.findOne({ userId: testUserId, opportunityId: testId })
  if (!retrievedState || !retrievedState.applied) {
    throw new Error('OpportunityState GET Failed')
  }
  console.log('✅ Test OpportunityState Retrieved successfully')

  // 5. Delete the opportunity
  console.log(`\nTesting DELETE opportunity with ID: ${testId}...`)
  const deleteResult = await Opportunity.deleteOne({ id: testId })
  if (deleteResult.deletedCount === 0) throw new Error('DELETE Failed: Opportunity not deleted')
  console.log('✅ Test Opportunity Deleted')

  // Clean up state
  await OpportunityState.deleteOne({ userId: testUserId, opportunityId: testId })
  console.log('✅ Test OpportunityState Deleted')

  console.log('\n🎉 All DB CRUD checks completed successfully!')
  process.exit(0)
}

runTests().catch(err => {
  console.error('❌ Integration check failed:', err)
  process.exit(1)
})
