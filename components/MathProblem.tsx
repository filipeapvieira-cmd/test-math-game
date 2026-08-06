interface MathProblemProps {
  left: number;
  right: number;
  symbol: '+' | '−' | '×';
  hint: string;
  showHint: boolean;
}

export default function MathProblem({ left, right, symbol, hint, showHint }: MathProblemProps) {
  return (
    <section className="problem-card" aria-label={`${left} ${symbol} ${right} equals what?`}>
      <p className="problem-prompt">What is the answer?</p>
      <div className="equation" aria-hidden="true">
        <span>{left}</span>
        <span className="equation-symbol">{symbol}</span>
        <span>{right}</span>
        <span className="equation-symbol">=</span>
        <span className="equation-answer">?</span>
      </div>
      <div className="hint-space">
        {showHint ? (
          <p className="hint"><span aria-hidden="true">💡</span>{hint}</p>
        ) : (
          <p className="hint-placeholder" aria-hidden="true">Pick the best answer</p>
        )}
      </div>
    </section>
  );
}
