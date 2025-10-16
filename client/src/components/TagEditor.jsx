import React, { useState } from 'react';

export default function TagEditor({ slug, tags, notes, onSave }) {
  const [localTags, setLocalTags] = useState(tags || []);
  const [localNotes, setLocalNotes] = useState(notes || '');

  const handleSave = () => {
    onSave(slug, localTags, localNotes);
  };

  return (
    <div className="tag-editor">
      <input
        type="text"
        placeholder="Tags comma-separated"
        value={localTags.join(', ')}
        onChange={e => setLocalTags(e.target.value.split(',').map(t => t.trim()))}
        className="border px-1 py-1 mr-1"
      />
      <input
        type="text"
        placeholder="Notes"
        value={localNotes}
        onChange={e => setLocalNotes(e.target.value)}
        className="border px-1 py-1 mr-1"
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
}
