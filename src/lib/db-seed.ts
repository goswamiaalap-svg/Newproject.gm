import DsaTopic from './models/DsaTopic'
import DsaProblem from './models/DsaProblem'
import Opportunity from './models/Opportunity'
import Teammate from './models/Teammate'
import Hackathon from './models/Hackathon'
import { mockDSATopics, mockOpportunities, mockTeamMembers, mockHackathons } from './mock-data'

const SEED_PROBLEMS = [
  // Arrays & Strings (1)
  { id: 't1p1', topicId: '1', name: 'Two Sum', difficulty: 'Easy', url: 'https://leetcode.com/problems/two-sum/' },
  { id: 't1p2', topicId: '1', name: 'Valid Anagram', difficulty: 'Easy', url: 'https://leetcode.com/problems/valid-anagram/' },
  { id: 't1p3', topicId: '1', name: 'Group Anagrams', difficulty: 'Medium', url: 'https://leetcode.com/problems/group-anagrams/' },
  // Linked Lists (2)
  { id: 't2p1', topicId: '2', name: 'Reverse Linked List', difficulty: 'Easy', url: 'https://leetcode.com/problems/reverse-linked-list/' },
  { id: 't2p2', topicId: '2', name: 'Merge Two Sorted Lists', difficulty: 'Easy', url: 'https://leetcode.com/problems/merge-two-sorted-lists/' },
  { id: 't2p3', topicId: '2', name: 'Linked List Cycle', difficulty: 'Easy', url: 'https://leetcode.com/problems/linked-list-cycle/' },
  // Stacks & Queues (3)
  { id: 't3p1', topicId: '3', name: 'Valid Parentheses', difficulty: 'Easy', url: 'https://leetcode.com/problems/valid-parentheses/' },
  { id: 't3p2', topicId: '3', name: 'Evaluate Reverse Polish Notation', difficulty: 'Medium', url: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/' },
  // Hash Maps (4)
  { id: 't4p1', topicId: '4', name: 'Two Sum II', difficulty: 'Medium', url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/' },
  { id: 't4p2', topicId: '4', name: 'Top K Frequent Elements', difficulty: 'Medium', url: 'https://leetcode.com/problems/top-k-frequent-elements/' },
  // Binary Trees (5)
  { id: 't5p1', topicId: '5', name: 'Invert Binary Tree', difficulty: 'Easy', url: 'https://leetcode.com/problems/invert-binary-tree/' },
  { id: 't5p2', topicId: '5', name: 'Maximum Depth of Binary Tree', difficulty: 'Easy', url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/' },
  { id: 't5p3', topicId: '5', name: 'Diameter of Binary Tree', difficulty: 'Easy', url: 'https://leetcode.com/problems/diameter-of-binary-tree/' },
  { id: 't5p4', topicId: '5', name: 'Binary Tree Level Order Traversal', difficulty: 'Medium', url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/' },
  // BST (6)
  { id: 't6p1', topicId: '6', name: 'Lowest Common Ancestor of a BST', difficulty: 'Medium', url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/' }
]

export async function seedDatabase() {
  try {
    // 1. Seed DSA Topics
    const topicCount = await DsaTopic.countDocuments()
    if (topicCount === 0) {
      console.log('[Seed] Seeding DSA Topics...')
      await DsaTopic.insertMany(
        mockDSATopics.map((topic) => ({
          id: topic.id,
          name: topic.name,
          category: topic.category,
          difficulty: topic.difficulty,
          problems: SEED_PROBLEMS.filter((p) => p.topicId === topic.id).length || topic.problems,
          solved: 0,
          estimatedTime: topic.estimatedTime
        }))
      )
    }

    // 2. Seed DSA Problems
    const problemCount = await DsaProblem.countDocuments()
    if (problemCount === 0) {
      console.log('[Seed] Seeding DSA Problems...')
      await DsaProblem.insertMany(SEED_PROBLEMS)
    }

    // 3. Seed Opportunities
    const opportunityCount = await Opportunity.countDocuments()
    if (opportunityCount === 0) {
      console.log('[Seed] Seeding Opportunities...')
      await Opportunity.insertMany(
        mockOpportunities.map((opp) => ({
          id: opp.id,
          title: opp.title,
          type: opp.type,
          company: opp.company,
          deadline: opp.deadline,
          logo: opp.logo,
          applyUrl: opp.applyUrl
        }))
      )
    }

    // 4. Seed Teammates
    const teammateCount = await Teammate.countDocuments()
    if (teammateCount === 0) {
      console.log('[Seed] Seeding Teammates...')
      await Teammate.insertMany(
        mockTeamMembers.map((member) => ({
          id: member.id,
          name: member.name,
          college: member.college,
          skills: member.skills,
          domains: member.domains,
          availability: member.availability,
          experience: member.experience,
          avatar: member.avatar
        }))
      )
    }

    // 5. Seed Hackathons
    const hackathonCount = await Hackathon.countDocuments()
    if (hackathonCount === 0) {
      console.log('[Seed] Seeding Hackathons...')
      await Hackathon.insertMany(
        mockHackathons.map((h) => ({
          id: h.id,
          name: h.name,
          deadline: h.deadline,
          prize: h.prize,
          participants: h.participants,
          status: h.status
        }))
      )
    }

    console.log('[Seed] Seeding check completed.')
  } catch (error) {
    console.error('[Seed] Database seeding failed:', error)
  }
}
