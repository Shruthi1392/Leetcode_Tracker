const axios = require('axios');

const LEETCODE_GRAPHQL = 'https://leetcode.com/graphql';

const USER_STATS_QUERY = `
query userProfile($username: String!) {
  matchedUser(username: $username) {
    username
    profile {
      realName
      reputation
      ranking
    }
    submitStatsGlobal {
      acSubmissionNum {
        difficulty
        count
      }
    }
  }
}
`;

async function getPublicProfile(username) {
  try {
    const resp = await axios.post(
      LEETCODE_GRAPHQL,
      { query: USER_STATS_QUERY, variables: { username } },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return resp.data.data;
  } catch (err) {
    console.error(err);
    throw new Error('Failed to fetch LeetCode profile');
  }
}

module.exports = { getPublicProfile };
