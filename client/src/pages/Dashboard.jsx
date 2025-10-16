import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard({ username }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!username) return;

    setLoading(true);
    setError('');
    setProfile(null);

    axios
      .get(`/api/leetcode/profile/${username}`)
      .then(res => {
        if (!res.data) {
          setError('Username not found');
        } else {
          setProfile(res.data);
        }
      })
      .catch(err => {
        console.error(err);
        setError('Failed to fetch data');
      })
      .finally(() => setLoading(false));
  }, [username]);

  if (!username) return <div>Enter username to view dashboard.</div>;
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!profile) return null; // still waiting

  const acStats =
    profile.submitStatsGlobal?.acSubmissionNum || []; // safe check
  const totalSolved = acStats.reduce((sum, item) => sum + (item.count || 0), 0);

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold">{profile.username} - Dashboard</h2>
      <p>Total solved: {totalSolved}</p>
      <div className="grid grid-cols-3 gap-4 mt-2">
        {acStats.map(item => (
          <div key={item.difficulty} className="card">
            <p>
              {item.difficulty}: {item.count}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
