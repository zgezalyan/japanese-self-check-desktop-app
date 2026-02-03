import { syllabaryLabels } from '../data/characters';

export default function TestConfig({ learnedSets, options, onChange, onStart, onBack }) {
  const syllabaries = options.syllabaries || [];
  const mode = options.mode || 'character';

  const toggleSyllabary = (key) => {
    const set = new Set(syllabaries);
    if (set.has(key)) set.delete(key);
    else set.add(key);
    onChange({ ...options, syllabaries: [...set] });
  };

  const count = (key) => (learnedSets[key] ? learnedSets[key].size : 0);
  const total = syllabaries.reduce((acc, key) => acc + count(key), 0);
  const canStart = total > 0;

  return (
    <main className="test-config">
      <section className="card">
        <h2>Syllabary</h2>
        <p>Choose which writing systems to include (only learned characters are used).</p>
        <div className="checkbox-group">
          {Object.keys(syllabaryLabels).map((key) => (
            <label key={key} className="checkbox-row">
              <input
                type="checkbox"
                checked={syllabaries.includes(key)}
                onChange={() => toggleSyllabary(key)}
              />
              <span>{syllabaryLabels[key]}</span>
              <span className="muted">({count(key)} learned)</span>
            </label>
          ))}
        </div>
      </section>
      <section className="card">
        <h2>Mode</h2>
        <p>Character: see the character and self-check if you know its reading. Pronunciation: see reading + syllabary and self-check if you know how to write it.</p>
        <div className="radio-group">
          <label className="radio-row">
            <input
              type="radio"
              name="mode"
              value="character"
              checked={mode === 'character'}
              onChange={() => onChange({ ...options, mode: 'character' })}
            />
            <span>Character → self-check reading</span>
          </label>
          <label className="radio-row">
            <input
              type="radio"
              name="mode"
              value="pronunciation"
              checked={mode === 'pronunciation'}
              onChange={() => onChange({ ...options, mode: 'pronunciation' })}
            />
            <span>Pronunciation + syllabary → self-check writing</span>
          </label>
        </div>
      </section>
      <div className="test-config-actions">
        <button type="button" className="btn-ghost" onClick={onBack}>
          Back
        </button>
        <button
          type="button"
          className="btn-primary"
          onClick={onStart}
          disabled={!canStart}
        >
          Start test {total > 0 ? `(${total} items)` : ''}
        </button>
      </div>
    </main>
  );
}
