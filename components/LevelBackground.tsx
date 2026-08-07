import type { GameTheme } from './gameEngine';

interface LevelBackgroundProps {
  theme: GameTheme;
}

export default function LevelBackground({ theme }: LevelBackgroundProps) {
  if (theme === 'rally') {
    return (
      <div className="level-background level-background-rally" aria-hidden="true">
        <div className="rally-horizon" />
        <div className="stadium-light stadium-light-left"><span /><span /><span /><span /></div>
        <div className="stadium-light stadium-light-right"><span /><span /><span /><span /></div>
        <div className="stadium-stands">
          {Array.from({ length: 18 }).map((_, index) => <span key={index} />)}
        </div>
        <div className="rally-track-ground" />
        <div className="track-mark track-mark-one" />
        <div className="track-mark track-mark-two" />
      </div>
    );
  }

  if (theme === 'judo') {
    return (
      <div className="level-background level-background-judo" aria-hidden="true">
        <div className="dojo-sun" />
        <div className="dojo-beam dojo-beam-one" />
        <div className="dojo-beam dojo-beam-two" />
        <div className="dojo-calligraphy">柔</div>
        <div className="dojo-window dojo-window-one"><span /><span /><span /><span /></div>
        <div className="dojo-window dojo-window-two"><span /><span /><span /><span /></div>
        <div className="dojo-wall-rail" />
        <div className="dojo-tatami" />
      </div>
    );
  }

  if (theme === 'football') {
    return (
      <div className="level-background level-background-football" aria-hidden="true">
        <div className="football-floodlight football-floodlight-left"><span /><span /><span /><span /><span /><span /></div>
        <div className="football-floodlight football-floodlight-right"><span /><span /><span /><span /><span /><span /></div>
        <div className="football-crowd">
          {Array.from({ length: 20 }).map((_, index) => <span key={index} />)}
        </div>
        <div className="football-pitch" />
        <div className="football-touchline" />
        <div className="football-center-circle" />
      </div>
    );
  }

  return (
    <div className="level-background" aria-hidden="true">
      <div className="sky-glow" />
      <Cloud className="cloud cloud-one" />
      <Cloud className="cloud cloud-two" />
      <Cloud className="cloud cloud-three" />
      <div className="distant-hill distant-hill-one" />
      <div className="distant-hill distant-hill-two" />
      <div className="ground-strip" />
    </div>
  );
}

function Cloud({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 160 72" fill="none">
      <path
        d="M31 63C14 63 3 54 3 41c0-14 13-25 30-25 5 0 10 1 14 3C54 8 67 2 82 2c21 0 39 12 43 29 17 0 31 10 31 23 0 5-2 9-5 13H31Z"
        fill="white"
        opacity="0.9"
      />
    </svg>
  );
}
