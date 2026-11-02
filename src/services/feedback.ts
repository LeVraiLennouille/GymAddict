import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { createAudioPlayer, type AudioPlayer } from 'expo-audio';
import type { Prefs } from '@/domain/types';

type SoundName = 'tick' | 'go1' | 'go2';
type FeedbackPrefs = Pick<Prefs, 'sound' | 'vibrate'>;

const SOURCES: Record<SoundName, number> = {
  tick: require('../../assets/sounds/tick.wav') as number,
  go1: require('../../assets/sounds/go-1.wav') as number,
  go2: require('../../assets/sounds/go-2.wav') as number,
};

const players: Partial<Record<SoundName, AudioPlayer>> = {};

function play(name: SoundName): void {
  try {
    let player = players[name];
    if (!player) {
      player = createAudioPlayer(SOURCES[name]);
      players[name] = player;
    }
    void player.seekTo(0);
    player.play();
  } catch {
    /* un son manquant ne doit jamais bloquer une série */
  }
}

/** Petit bip du compte à rebours (3, 2, 1). */
export function playTick(prefs: FeedbackPrefs): void {
  if (prefs.sound) play('tick');
}

/** Fin du repos : deux notes montantes. */
export function playGo(prefs: FeedbackPrefs): void {
  if (!prefs.sound) return;
  play('go1');
  setTimeout(() => play('go2'), 180);
}

export type HapticKind = 'tap' | 'success' | 'finish';

/** Vibration (retour haptique natif, `navigator.vibrate` sur le web quand il existe). */
export function vibrate(prefs: FeedbackPrefs, kind: HapticKind): void {
  if (!prefs.vibrate) return;
  try {
    if (Platform.OS === 'web') {
      const pattern = kind === 'finish' ? [120, 60, 120] : kind === 'success' ? [200, 100, 200, 100, 400] : [30];
      if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') navigator.vibrate(pattern);
      return;
    }
    if (kind === 'tap') void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    else void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {
    /* appareil sans moteur haptique */
  }
}

/** « Tester l'alerte » du profil : compte à rebours puis sonnerie, avec les réglages en cours. */
export function testAlert(prefs: FeedbackPrefs): void {
  playTick(prefs);
  setTimeout(() => playTick(prefs), 400);
  setTimeout(() => {
    playGo(prefs);
    vibrate(prefs, 'success');
  }, 800);
}
