import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TagEditor from '../components/TagEditor';

export default function Problems({ username }) {
  const [problems, setProblems] = useState([]);
  const [tags, setTags] = useState({});
  const [recommendations, setRecommendations] = useState([]);

  // fetch problem list
  useEffect(() => {
    axios.get('/api/leetcode/problems')
      .then(res => setProblems(res.data))
      .catch(console.error);
  }, []);

  // fetch tags
  useEffect(() => {
    if (!username) return;
    axios.get(`/api/leetcode/tags/${username}`)
      .then(res => setTags(res.data))
      .catch(console.error);
  }, [username]);

  // fetch recommendations
  useEffect(() => {
    if (!username) return;
    axios.get(`/api/leetcode/recommend/${username}`)
      .then(res => setRecommendations(res.data))
      .catch(console.error);
  }, [username]);

  const updateTag = (slug, newTags, notes) => {
    axios.post(`/api/leetcode/tags/${username}`, { problemSlug: slug, tags: newTags, notes })
      .then(() => setTags(prev => ({ ...prev, [slug]: { tags: newTags, notes } })));
  };

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-2">Problems</h2>
      {problems.map(p => {
        const data = tags[p.titleSlug] || { tags: [], notes: '' };
        return (
          <div key={p.titleSlug} className="problem">
            <div>
              <strong>{p.title}</strong> ({p.difficulty})
            </div>
            <TagEditor slug={p.titleSlug} tags={data.tags} notes={data.notes} onSave={updateTag} />
          </div>
        );
      })}

      <h2 className="text-xl font-bold mt-6 mb-2">Recommended Problems</h2>
      {recommendations.map(p => (
        <div key={p.titleSlug} className="problem">
          <div>
            <strong>{p.title}</strong> ({p.difficulty})
          </div>
        </div>
      ))}
    </div>
  );
}
