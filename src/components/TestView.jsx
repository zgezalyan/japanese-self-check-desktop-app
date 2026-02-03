import { useState, useMemo } from 'react';
import { syllabaryLabels } from '../data/characters';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function TestView({ pool, mode, onStop }) {
  const [index, setIndex] = useState(0);
  const [shuffleKey, setShuffleKey] = useState(0);
  const ordered = useMemo(() => shuffle(pool), [pool, shuffleKey]);
  const current = ordered[index];
  const total = ordered.length;
  const isLast = index >= total - 1;

  if (!total) {
    return (
      <div className="app">
        <main className="test-view test-view-empty">
          <p>No learned characters in the selected syllabaries. Go back and mark learned characters or change selection.</p>
          <button type="button" className="btn-primary" onClick={onStop}>Back</button>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header test-view-header">
        <span className="progress">
          {index + 1} / {total}
        </span>
        <button type="button" className="btn-ghost" onClick={onStop}>
          Stop
        </button>
      </header>
      <main className="test-view">
        <div className="test-card jp">
          {mode === 'character' && current && (
            <>
              <p className="syllabary-label">{syllabaryLabels[current.syllabary]}</p>
              <p className="test-char">{current.char}</p>
              <p className="hint">Self-check: do you know the reading? Then press Next.</p>
            </>
          )}
          {mode === 'pronunciation' && current && (
            <>
              <p className="syllabary-label">{syllabaryLabels[current.syllabary]}</p>
              <p className="test-reading">{current.reading}</p>
              <p className="hint">Self-check: do you know how to write this? Then press Next.</p>
            </>
          )}
        </div>
        <div className="test-actions">
          <button type="button" className="btn-danger" onClick={onStop}>
            Stop
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
            if (isLast) {
              setShuffleKey((k) => k + 1);
              setIndex(0);
            } else {
              setIndex((i) => i + 1);
            }
          }}
          >
            {isLast ? 'Start over' : 'Next'}
          </button>
        </div>
      </main>
    </div>
  );
}
