'use client';

import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import { type CSSProperties, useEffect, useState } from 'react';
import type { GameTheme, Problem } from './gameEngine';

interface EducationalPopupProps {
  problem: Problem;
  theme: GameTheme;
  onClose: () => void;
}

type LessonPhase = 'groups' | 'moving' | 'result';

const MOVEMENT_START_MS = 1500;
const RESULT_REVEAL_MS = 7000;
const AUTO_CLOSE_MS = 10000;
const LESSON_EASE = [0.45, 0, 0.55, 1] as const;

export default function EducationalPopup({ problem, theme, onClose }: EducationalPopupProps) {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<LessonPhase>('groups');
  const isRally = theme === 'rally';
  const visiblePhase: LessonPhase = reduceMotion ? 'result' : phase;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    const movingTimer = reduceMotion ? undefined : window.setTimeout(() => setPhase('moving'), MOVEMENT_START_MS);
    const resultTimer = reduceMotion ? undefined : window.setTimeout(() => setPhase('result'), RESULT_REVEAL_MS);
    const closeTimer = window.setTimeout(onClose, AUTO_CLOSE_MS);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (movingTimer) window.clearTimeout(movingTimer);
      if (resultTimer) window.clearTimeout(resultTimer);
      window.clearTimeout(closeTimer);
    };
  }, [onClose, reduceMotion]);

  const title = isRally ? 'Pit crew breakdown' : 'Let’s build the answer';
  const objectName = isRally ? 'tyre' : 'egg';
  const description = getLessonDescription(problem, visiblePhase, objectName);
  const lessonSteps = getLessonSteps(problem);
  const currentStep = visiblePhase === 'groups' ? 0 : visiblePhase === 'moving' ? 1 : 2;

  return (
    <div className="education-backdrop" data-theme={theme}>
      <section
        aria-describedby="education-description"
        aria-labelledby="education-title"
        aria-modal="true"
        className="education-dialog"
        role="dialog"
      >
        <div className="education-timebar" aria-hidden="true"><span /></div>

        <header className="education-header">
          <div>
            <p className="eyebrow">{isRally ? 'Replay the calculation' : 'A quick counting clue'}</p>
            <h2 id="education-title">{title}</h2>
          </div>
          <button
            aria-label="Close explanation and try again"
            autoFocus
            className="education-close"
            type="button"
            onClick={onClose}
          >
            ×
          </button>
        </header>

        <ol className="education-steps" aria-label="Explanation steps">
          {lessonSteps.map((step, index) => {
            const stepState = index < currentStep ? 'done' : index === currentStep ? 'active' : 'next';

            return (
              <li aria-current={stepState === 'active' ? 'step' : undefined} data-state={stepState} key={step}>
                <span>{stepState === 'done' ? '✓' : index + 1}</span>
                <strong>{step}</strong>
              </li>
            );
          })}
        </ol>

        <div className="education-equation" aria-label={`${problem.left} ${problem.symbol} ${problem.right}`}>
          <span>{problem.left}</span>
          <b>{problem.symbol}</b>
          <span>{problem.right}</span>
          <b>=</b>
          <strong>?</strong>
        </div>

        <p className="education-description" id="education-description" aria-live="polite">
          {description}
        </p>

        <div className="education-visual">
          <OperationLesson problem={problem} phase={visiblePhase} theme={theme} reduceMotion={Boolean(reduceMotion)} />
        </div>

        <button className="education-understood" type="button" onClick={onClose}>
          {isRally ? 'Back on track' : 'Got it — try again'}
        </button>
        <p className="education-auto-close">This clue closes automatically after 10 seconds.</p>
      </section>
    </div>
  );
}

function getLessonSteps(problem: Problem) {
  if (problem.operation === 'addition') return ['See both groups', 'Move them together', 'Count everything'];
  if (problem.operation === 'subtraction') return ['See the whole', 'Move some away', 'Count what remains'];
  return ['See one group', 'Build equal groups', 'Count altogether'];
}

function getLessonDescription(problem: Problem, phase: LessonPhase, objectName: string) {
  const plural = (amount: number) => `${objectName}${amount === 1 ? '' : 's'}`;

  if (problem.operation === 'addition') {
    if (phase === 'groups') {
      return `${problem.left} ${plural(problem.left)} in one group and ${problem.right} ${plural(problem.right)} in another.`;
    }
    if (phase === 'moving') return `Move the ${problem.right} ${plural(problem.right)} into the first group.`;
    return 'Now count every object in the combined group.';
  }

  if (problem.operation === 'subtraction') {
    if (phase === 'groups') return `Start with ${problem.left} ${plural(problem.left)}.`;
    if (phase === 'moving') return `Move ${problem.right} ${plural(problem.right)} away.`;
    return `Now count the ${objectName}s that remain.`;
  }

  if (phase === 'result') {
    return 'Now count every object across all the equal groups.';
  }
  if (phase === 'groups') {
    return problem.left === 0
      ? `There are 0 groups, so there are no ${plural(problem.right)} to count.`
      : `First, look at one group with ${problem.right} ${plural(problem.right)}.`;
  }
  return `Now build ${problem.left} equal groups with ${problem.right} ${plural(problem.right)} in every group.`;
}

interface OperationLessonProps {
  problem: Problem;
  phase: LessonPhase;
  theme: GameTheme;
  reduceMotion: boolean;
}

function OperationLesson({ problem, phase, theme, reduceMotion }: OperationLessonProps) {
  if (problem.operation === 'addition') {
    return <AdditionLesson problem={problem} phase={phase} theme={theme} reduceMotion={reduceMotion} />;
  }
  if (problem.operation === 'subtraction') {
    return <SubtractionLesson problem={problem} phase={phase} theme={theme} reduceMotion={reduceMotion} />;
  }
  return <MultiplicationLesson problem={problem} phase={phase} theme={theme} reduceMotion={reduceMotion} />;
}

function AdditionLesson({ problem, phase, theme, reduceMotion }: OperationLessonProps) {
  const isRally = theme === 'rally';

  return (
    <AnimatePresence mode="sync">
      {phase === 'result' ? (
        <motion.div
          className="lesson-result"
          key="addition-result"
          initial={reduceMotion ? undefined : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.6, ease: LESSON_EASE }}
        >
          <QuantityGroup
            amount={problem.answer}
            label={isRally ? 'Together in the main bay' : 'Together in one nest'}
            concealObjectCount
            reduceMotion={reduceMotion}
            showAmount={false}
            theme={theme}
            featured
          />
        </motion.div>
      ) : (
        <motion.div
          className="addition-groups"
          key="addition-groups"
          exit={{ opacity: 0.58, scale: 0.98 }}
          transition={{ duration: reduceMotion ? 0 : 0.3, ease: LESSON_EASE }}
        >
          <QuantityGroup amount={problem.left} label={isRally ? 'Main bay' : 'First nest'} reduceMotion={reduceMotion} theme={theme} />
          <span className="lesson-operator" aria-hidden="true">+</span>
          <QuantityGroup
            amount={problem.right}
            label={phase === 'moving' ? (isRally ? 'Rolling to the main bay' : 'Moving to the first nest') : (isRally ? 'Side bay' : 'Second nest')}
            moving={phase === 'moving'}
            reduceMotion={reduceMotion}
            theme={theme}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SubtractionLesson({ problem, phase, theme, reduceMotion }: OperationLessonProps) {
  const isRally = theme === 'rally';
  const remainingIds = createObjectIds(problem, 'remaining', problem.answer);
  const removedIds = createObjectIds(problem, 'removed', problem.right);

  return (
    <LayoutGroup id={`subtraction-${problem.id}`}>
      <motion.div className="subtraction-layout" data-phase={phase}>
        <div className="subtraction-start">
          <p>{phase === 'groups' ? (isRally ? `Start: ${problem.left} tyres` : `Start: ${problem.left} eggs`) : (isRally ? 'Count the tyres that stay in the bay' : 'Count the eggs that stay in the nest')}</p>
          <div className="subtraction-split">
            <ObjectGrid amount={problem.answer} concealCount layoutIds={remainingIds} reduceMotion={reduceMotion} theme={theme} />
            {phase === 'groups' ? (
              <div className="moving-subtraction-group">
                <ObjectGrid amount={problem.right} layoutIds={removedIds} reduceMotion={reduceMotion} theme={theme} selected />
              </div>
            ) : null}
          </div>
        </div>
        <div className="away-zone">
          {phase !== 'groups' ? (
            <ObjectGrid amount={problem.right} layoutIds={removedIds} reduceMotion={reduceMotion} theme={theme} selected />
          ) : <span aria-hidden="true">→</span>}
          <p>{isRally ? 'Rolled away' : 'Moved away'}</p>
        </div>
      </motion.div>
    </LayoutGroup>
  );
}

function MultiplicationLesson({ problem, phase, theme, reduceMotion }: OperationLessonProps) {
  const visibleGroupCount = phase === 'groups' ? Math.min(problem.left, 1) : problem.left;
  const groups = Array.from({ length: visibleGroupCount });

  return (
    <motion.div
      className="multiplication-lesson"
      data-dense={problem.left * problem.right > 48}
      animate={phase === 'moving' ? { scale: 0.96, y: -3 } : { scale: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.8 }}
    >
      <div className="multiplication-groups">
        {groups.map((_, index) => (
          <motion.div
            className="multiplication-group"
            key={index}
            initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduceMotion ? 0 : Math.min(index * 0.24, 2.4),
              duration: reduceMotion ? 0 : 0.7,
              ease: LESSON_EASE,
            }}
          >
            <span className="group-number">{index + 1}</span>
            <ObjectGrid amount={problem.right} theme={theme} compact />
            <strong>{problem.right}</strong>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

interface QuantityGroupProps {
  amount: number;
  label: string;
  theme: GameTheme;
  featured?: boolean;
  layoutIds?: string[];
  moving?: boolean;
  reduceMotion?: boolean;
  showAmount?: boolean;
  concealObjectCount?: boolean;
}

function QuantityGroup({
  amount,
  label,
  theme,
  featured = false,
  layoutIds,
  moving = false,
  reduceMotion = false,
  showAmount = true,
  concealObjectCount = false,
}: QuantityGroupProps) {
  return (
    <div className="quantity-group" data-featured={featured}>
      <p>{label}</p>
      <motion.div
        className="quantity-object-layer"
        animate={moving ? { x: '-132%' } : { x: 0 }}
        transition={{ duration: reduceMotion ? 0 : 4.2, ease: LESSON_EASE }}
      >
        <ObjectGrid amount={amount} concealCount={concealObjectCount} layoutIds={layoutIds} reduceMotion={reduceMotion} theme={theme} />
      </motion.div>
      {showAmount ? <strong className="quantity-label">{amount}</strong> : null}
    </div>
  );
}

interface ObjectGridProps {
  amount: number;
  theme: GameTheme;
  compact?: boolean;
  selected?: boolean;
  layoutIds?: string[];
  reduceMotion?: boolean;
  concealCount?: boolean;
}

function ObjectGrid({ amount, theme, compact = false, selected = false, layoutIds, reduceMotion = false, concealCount = false }: ObjectGridProps) {
  const columnLimit = compact ? 4 : amount > 20 ? 10 : 5;
  const columns = Math.max(1, Math.min(amount, columnLimit));
  const style = { '--object-columns': columns } as CSSProperties;
  const objectName = theme === 'rally' ? 'tyres' : 'eggs';

  return (
    <div
      aria-label={concealCount ? `${objectName} to count` : `${amount} ${objectName}`}
      className="object-grid"
      data-compact={compact}
      data-dense={amount > 20}
      data-selected={selected}
      style={style}
    >
      {amount === 0 ? <span className="zero-objects">0</span> : null}
      {Array.from({ length: amount }).map((_, index) => (
        <motion.span
          aria-hidden="true"
          className="counting-object"
          data-theme-object={theme}
          key={layoutIds?.[index] ?? index}
          layoutId={layoutIds?.[index]}
          transition={layoutIds ? {
            layout: {
              delay: reduceMotion ? 0 : Math.min(index * 0.07, 0.8),
              duration: reduceMotion ? 0 : 3.6,
              ease: LESSON_EASE,
            },
          } : undefined}
        >
          <i />
        </motion.span>
      ))}
    </div>
  );
}

function createObjectIds(problem: Problem, group: string, amount: number) {
  return Array.from({ length: amount }, (_, index) => `${problem.id}-${group}-${index}`);
}
