import { useState, useEffect } from 'react';
import { hiragana, katakana, kanji, syllabaryLabels } from './data/characters';
import LearnedSelector from './components/LearnedSelector';
import TestConfig from './components/TestConfig';
import TestView from './components/TestView';
import './App.css';

const STORAGE_KEYS = { hiragana: 'hiragana', katakana: 'katakana', kanji: 'kanji' };

function loadLearned() {
  const defaultLearned = {
    hiragana: [],
    katakana: [],
    kanji: [],
  };
  if (typeof window !== 'undefined' && window.electronAPI) {
    return window.electronAPI.loadLearned().then((data) => (data ? { ...defaultLearned, ...data } : defaultLearned));
  }
  try {
    const raw = localStorage.getItem('japanese-learned');
    if (raw) return Promise.resolve({ ...defaultLearned, ...JSON.parse(raw) });
  } catch (_) {}
  return Promise.resolve(defaultLearned);
}

function saveLearned(learned) {
  if (typeof window !== 'undefined' && window.electronAPI) {
    return window.electronAPI.saveLearned(learned);
  }
  try {
    localStorage.setItem('japanese-learned', JSON.stringify(learned));
    return Promise.resolve({ ok: true });
  } catch (_) {
    return Promise.resolve({ ok: false });
  }
}

function getPool(syllabary, learnedSet) {
  const lists = { hiragana, katakana, kanji };
  const list = lists[syllabary] || [];
  return list
    .filter((item) => learnedSet.has(item.char))
    .map((item) => ({ ...item, syllabary }));
}

function App() {
  const [view, setView] = useState('home'); // 'home' | 'learned' | 'test-config' | 'test'
  const [learned, setLearned] = useState({ hiragana: [], katakana: [], kanji: [] });
  const [loaded, setLoaded] = useState(false);
  const [testOptions, setTestOptions] = useState({
    syllabaries: ['hiragana'],
    mode: 'character', // 'character' | 'pronunciation'
  });

  useEffect(() => {
    loadLearned().then((data) => {
      setLearned(data);
      setLoaded(true);
    });
  }, []);

  const handleSaveLearned = (next) => {
    setLearned(next);
    saveLearned(next);
  };

  const learnedSets = {
    hiragana: new Set(learned.hiragana),
    katakana: new Set(learned.katakana),
    kanji: new Set(learned.kanji),
  };

  const testPool = (testOptions.syllabaries || [])
    .flatMap((s) => getPool(s, learnedSets[s]))
    .filter(Boolean);

  if (!loaded) {
    return (
      <div className="app-loading">
        <span>Loading…</span>
      </div>
    );
  }

  if (view === 'learned') {
    return (
      <div className="app">
        <header className="app-header">
          <button type="button" className="btn-ghost" onClick={() => setView('home')}>← Back</button>
          <h1>Mark learned characters</h1>
        </header>
        <LearnedSelector
          learned={learned}
          onSave={handleSaveLearned}
          onBack={() => setView('home')}
        />
      </div>
    );
  }

  if (view === 'test-config') {
    return (
      <div className="app">
        <header className="app-header">
          <button type="button" className="btn-ghost" onClick={() => setView('home')}>← Back</button>
          <h1>Test setup</h1>
        </header>
        <TestConfig
          learnedSets={learnedSets}
          options={testOptions}
          onChange={setTestOptions}
          onStart={() => setView('test')}
          onBack={() => setView('home')}
        />
      </div>
    );
  }

  if (view === 'test') {
    return (
      <TestView
        pool={testPool}
        mode={testOptions.mode}
        onStop={() => setView('home')}
      />
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="jp">Japanese Writing Self-Test</h1>
      </header>
      <main className="app-main">
        <section className="card">
          <h2>1. Mark learned characters</h2>
          <p>Select which hiragana, katakana, and kanji you have already learned. This is saved for future sessions.</p>
          <button type="button" className="btn-primary" onClick={() => setView('learned')}>
            Edit learned characters
          </button>
        </section>
        <section className="card">
          <h2>2. Start self-test</h2>
          <p>Choose syllabary (hiragana, katakana, kanji or combination) and mode: see character and self-check reading, or see pronunciation and self-check writing.</p>
          <button type="button" className="btn-primary" onClick={() => setView('test-config')}>
            Configure & start test
          </button>
        </section>
      </main>
    </div>
  );
}

export default App;
