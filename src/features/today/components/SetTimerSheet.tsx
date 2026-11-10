import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { useAppStore } from '@/data/store/appStore';
import { fmtClock } from '@/domain/format/numbers';
import {
  elapsedSeconds,
  progressToTarget,
  remainingToTarget,
  stopwatchInitial,
  stopwatchPause,
  stopwatchRunning,
  stopwatchStart,
  type StopwatchState,
} from '@/domain/rules/stopwatch';
import { playGo, playTick, vibrate } from '@/services/feedback';
import { useTheme } from '@/theme/ThemeProvider';
import { Button } from '@/ui/Button';
import { Sheet } from '@/ui/Sheet';
import { Text } from '@/ui/Text';

interface Props {
  visible: boolean;
  onClose: () => void;
  exerciseName: string;
  setNumber: number;
  /** Durée visée, en secondes (`0` : simple chronomètre). */
  targetSec: number;
  /** Valide la série avec la durée tenue. */
  onValidate: (seconds: number) => void;
}

const SIZE = 220;
const RADIUS = 96;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const KEEP_AWAKE_TAG = 'set-timer';

/** Compte à rebours d'une série chronométrée (planche, gainage…) ; la durée tenue est reportée sur la série. */
export function SetTimerSheet({ visible, onClose, exerciseName, setNumber, targetSec, onValidate }: Props) {
  const { colors } = useTheme();
  const prefs = useAppStore((s) => s.data.prefs);
  const prefsRef = useRef(prefs);
  prefsRef.current = prefs;

  const [watch, setWatch] = useState<StopwatchState>(stopwatchInitial);
  const [now, setNow] = useState(() => Date.now());
  const [finished, setFinished] = useState(false);
  const lastBeep = useRef(-1);

  useEffect(() => {
    if (visible) {
      setWatch(stopwatchInitial());
      setNow(Date.now());
      setFinished(false);
      lastBeep.current = -1;
    }
  }, [visible]);

  const running = stopwatchRunning(watch);
  useEffect(() => {
    if (!running) return;
    void Promise.resolve(activateKeepAwakeAsync(KEEP_AWAKE_TAG)).catch(() => undefined);
    const id = setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (targetSec <= 0) return;
      const left = remainingToTarget(watch, t, targetSec);
      if (left <= 3 && left > 0 && lastBeep.current !== left) {
        lastBeep.current = left;
        playTick(prefsRef.current);
      }
      if (left === 0) {
        // Objectif atteint : le chrono s'arrête pile sur la durée visée.
        setWatch({ startedAt: null, accumulatedMs: targetSec * 1000 });
        setFinished(true);
        playGo(prefsRef.current);
        vibrate(prefsRef.current, 'success');
      }
    }, 200);
    return () => {
      clearInterval(id);
      void Promise.resolve(deactivateKeepAwake(KEEP_AWAKE_TAG)).catch(() => undefined);
    };
  }, [running, watch, targetSec]);

  const elapsed = elapsedSeconds(watch, now);
  const shown = targetSec > 0 ? remainingToTarget(watch, now, targetSec) : elapsed;
  const progress = targetSec > 0 ? progressToTarget(watch, now, targetSec) : 0;
  const ringColor = finished ? colors.green : colors.cBlue;

  return (
    <Sheet visible={visible} onClose={onClose} title="Chrono" accent={colors.cBlue}>
      <Text size={13} weight={700} color="#FFFFFF" style={{ marginBottom: 2 }}>
        {exerciseName}
      </Text>
      <Text size={12} tone="dim" style={{ marginBottom: 14 }}>
        {targetSec > 0 ? `Série ${setNumber} · objectif ${targetSec} s` : `Série ${setNumber}`}
      </Text>

      <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
        <View style={{ width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' }}>
          <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ position: 'absolute' }}>
            <Circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} stroke="rgba(255,255,255,0.1)" strokeWidth={12} fill="none" />
            <Circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              stroke={ringColor}
              strokeWidth={12}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${CIRCUMFERENCE}`}
              strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
              transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
            />
          </Svg>
          <Text display size={64} color="#FFFFFF" accessibilityLiveRegion="none" accessibilityLabel={`${shown} secondes`}>
            {fmtClock(shown)}
          </Text>
          <Text size={11} tone="dim">
            {finished ? 'Objectif atteint' : targetSec > 0 ? 'restant' : 'écoulé'}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Button
          label={running ? 'Pause' : elapsed > 0 ? 'Reprendre' : 'Démarrer'}
          icon={running ? 'pause' : 'play'}
          variant="solid"
          disabled={finished}
          style={{ flex: 1, alignSelf: 'stretch' }}
          onPress={() => {
            const t = Date.now();
            setNow(t);
            setWatch((w) => (stopwatchRunning(w) ? stopwatchPause(w, t) : stopwatchStart(w, t)));
          }}
        />
        <Button
          label="Zéro"
          variant="soft"
          disabled={elapsed === 0 && !running}
          onPress={() => {
            setWatch(stopwatchInitial());
            setFinished(false);
            lastBeep.current = -1;
          }}
        />
      </View>

      <Button
        label={`Valider ${elapsed} s`}
        icon="check"
        variant="green"
        fullWidth
        disabled={elapsed < 1}
        style={{ marginTop: 10 }}
        onPress={() => {
          setWatch((w) => stopwatchPause(w, Date.now()));
          onValidate(elapsed);
          onClose();
        }}
      />
    </Sheet>
  );
}
