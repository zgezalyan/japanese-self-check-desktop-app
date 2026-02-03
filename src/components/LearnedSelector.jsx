import { useState } from 'react';
import { hiragana, katakana, kanji, syllabaryLabels } from '../data/characters';

const LISTS = { hiragana, katakana, kanji };

export default function LearnedSelector({ learned, onSave, onBack }) {
  const [local, setLocal] = useState({
    hiragana: new Set(learned.hiragana),
    katakana: new Set(learned.katakana),
    kanji: new Set(learned.kanji),
  });
  const [activeTab, setActiveTab] = useState('hiragana');
  const [saved, setSaved] = useState(false);

  const toggle = (syllabary, char) => {
    setLocal((prev) => {
      const next = new Set(prev[syllabary]);
      if (next.has(char)) next.delete(char);
      else next.add(char);
      return { ...prev, [syllabary]: next };
    });
    setSaved(false);
  };

  const selectAll = (syllabary) => {
    const list = LISTS[syllabary];
    setLocal((prev) => ({
      ...prev,
      [syllabary]: new Set(list.map((c) => c.char)),
    }));
    setSaved(false);
  };

  const clearAll = (syllabary) => {
    setLocal((prev) => ({ ...prev, [syllabary]: new Set() }));
    setSaved(false);
  };

  const handleSave = () => {
    onSave({
      hiragana: [...local.hiragana],
      katakana: [...local.katakana],
      kanji: [...local.kanji],
    });
    setSaved(true);
  };

  const list = LISTS[activeTab] || [];
  const checkedSet = local[activeTab] || new Set();

  return (
    <main className="learned-selector">
      <div className="tabs">
        {Object.keys(syllabaryLabels).map((key) => (
          <button
            key={key}
            type="button"
            className={`tab ${activeTab === key ? 'active' : ''}`}
            onClick={() => setActiveTab(key)}
          >
            {syllabaryLabels[key]}
          </button>
        ))}
      </div>
      <div className="tab-actions">
        <button type="button" className="btn-ghost btn-sm" onClick={() => selectAll(activeTab)}>
          Select all
        </button>
        <button type="button" className="btn-ghost btn-sm" onClick={() => clearAll(activeTab)}>
          Clear all
        </button>
      </div>
      <div className="char-grid jp">
        {list.map(({ char }) => (
          <label key={char} className="char-cell">
            <input
              type="checkbox"
              checked={checkedSet.has(char)}
              onChange={() => toggle(activeTab, char)}
            />
            <span className="char">{char}</span>
          </label>
        ))}
      </div>
      <div className="learned-actions">
        <button type="button" className="btn-ghost" onClick={onBack}>
          Back
        </button>
        <button type="button" className="btn-primary" onClick={handleSave}>
          {saved ? 'Saved' : 'Save progress'}
        </button>
      </div>
    </main>
  );
}
