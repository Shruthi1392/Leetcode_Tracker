const express = require('express');
const router = express.Router();
const { getPublicProfile, getAllProblems } = require('../services/leetcodeClient');

// In-memory store for custom tags/notes
const userTags = {};

// -------------------- PROFILE --------------------
router.get('/profile/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const data = await getPublicProfile(username);
    if (!data.matchedUser) return res.status(404).json({ error: 'Username not found' });
    res.json(data.matchedUser);
  } catch (err) {
    console.error(err.message, err.response?.data);
    res.status(500).json({ error: 'Failed to fetch data from LeetCode' });
  }
});

// -------------------- TAGS / NOTES --------------------
router.post('/tags/:username', (req, res) => {
  const { username } = req.params;
  const { problemSlug, tags, notes } = req.body;

  if (!userTags[username]) userTags[username] = {};
  userTags[username][problemSlug] = { tags, notes };

  res.json({ success: true });
});

router.get('/tags/:username', (req, res) => {
  const { username } = req.params;
  res.json(userTags[username] || {});
});

// -------------------- RECOMMENDATIONS --------------------
router.get('/recommend/:username', async (req, res) => {
  const { username } = req.params;

  try {
    // 1. Fetch user profile and solved problems
    const data = await getPublicProfile(username);
    if (!data.matchedUser) return res.status(404).json({ error: 'Username not found' });

    const solvedSlugs = new Set(
      (data.matchedUser.recentAcSubmissionList || []).map(p => p.titleSlug)
    );
    if (userTags[username]) {
      Object.keys(userTags[username]).forEach(slug => solvedSlugs.add(slug));
    }

    // 2. Fetch all problems
    const allProblems = await getAllProblems();

    // 3. Filter unsolved problems
    let unsolved = allProblems.filter(p => !solvedSlugs.has(p.titleSlug));

    if (unsolved.length === 0) return res.json([]);

    // 4. Count solved problems per difficulty
    const difficultyCount = { Easy: 0, Medium: 0, Hard: 0 };
    for (let p of data.matchedUser.recentAcSubmissionList || []) {
      if (difficultyCount[p.difficulty] !== undefined) difficultyCount[p.difficulty]++;
    }

    // 5. Determine difficulty user solved least
    const minSolvedDifficulty = Object.entries(difficultyCount).sort((a,b)=>a[1]-b[1])[0][0];

    // 6. Prioritize unsolved problems of that difficulty
    const priority = unsolved.filter(p => p.difficulty === minSolvedDifficulty);
    const others = unsolved.filter(p => p.difficulty !== minSolvedDifficulty);
    unsolved = [...priority, ...others];

    // 7. Return top 5 recommendations
    res.json(unsolved.slice(0, 5));

  } catch (err) {
    console.error("Error in /recommend:", err.message, err.response?.data);
    res.status(500).json({ error: 'Failed to fetch data from LeetCode' });
  }
});

module.exports = router;
