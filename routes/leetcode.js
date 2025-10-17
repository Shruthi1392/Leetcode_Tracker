const express = require('express');
const router = express.Router();
const { getPublicProfile } = require('../services/leetcodeClient');

// GET /api/leetcode/profile/:username
router.get('/profile/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const data = await getPublicProfile(username);
    if (!data.matchedUser) {
      return res.status(404).json({ error: 'Username not found' });
    }
    res.json(data.matchedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch data from LeetCode' });
  }
});

module.exports = router;
