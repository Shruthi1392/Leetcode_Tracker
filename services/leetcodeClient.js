const axios = require('axios');

const LEETCODE_GRAPHQL = 'https://leetcode.com/graphql';

const USER_STATS_QUERY = `
query userProfile($username: String!) {
  matchedUser(username: $username) {
    username
    submitStatsGlobal {
      acSubmissionNum {
        difficulty
        count
        submissions
      }
    }
    recentAcSubmissionList(limit: 1000) {
      titleSlug
      title
      difficulty
    }
  }
}
`;

const ALL_PROBLEMS_QUERY = `
query problemsetQuestionList {
  problemsetQuestionList: questionList {
    questions: data {
      title
      titleSlug
      difficulty
    }
  }
}
`;

const headers = {
  'Content-Type': 'application/json',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  'Accept': 'application/json',
  'Referer': 'https://leetcode.com',
  'Origin': 'https://leetcode.com',
};

async function getPublicProfile(username) {
  try {
    const resp = await axios.post(
      LEETCODE_GRAPHQL,
      { query: USER_STATS_QUERY, variables: { username } },
      { headers }
    );
    return resp.data.data;
  } catch (err) {
    console.error("GraphQL fetch failed:", err.response?.data || err.message);
    throw new Error('Failed to fetch LeetCode profile');
  }
}

async function getAllProblems() {
  try {
    const resp = await axios.post(
      LEETCODE_GRAPHQL,
      { query: ALL_PROBLEMS_QUERY },
      { headers }
    );
    return resp.data.data.problemsetQuestionList.questions;
  } catch (err) {
    console.error("GraphQL fetch failed:", err.response?.data || err.message);
    throw new Error('Failed to fetch problem list from LeetCode');
  }
}

module.exports = { getPublicProfile, getAllProblems };
