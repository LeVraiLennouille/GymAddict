import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import type { AvatarKey } from '@/domain/types';
import { LOGO_BARS } from './logoPaths';

const LIGHT = '#ECEDF0';
const DARK = '#14161B';

interface Look {
  bg: string;
  /** Couleurs des 4 barres du logo ; `null` = couleurs d'origine. */
  bars: readonly [string, string, string, string] | null;
  border?: boolean;
}

const LOOKS: Record<AvatarKey, Look> = {
  red: { bg: '#E5323F', bars: [LIGHT, DARK, LIGHT, DARK] },
  blue: { bg: '#1E5BD6', bars: [DARK, LIGHT, DARK, LIGHT] },
  green: { bg: '#12A150', bars: [LIGHT, DARK, LIGHT, DARK] },
  yellow: { bg: '#F5B700', bars: [DARK, LIGHT, DARK, LIGHT] },
  grey: { bg: '#0E0F13', bars: null, border: true },
  white: { bg: LIGHT, bars: null },
};

export const avatarKey = (v: string): AvatarKey => (v in LOOKS ? (v as AvatarKey) : 'red');

/** Pastille de profil : logo GymAddict aux couleurs de l'avatar choisi. */
export function Avatar({ avatar, size = 68, radius }: { avatar: AvatarKey; size?: number; radius?: number }) {
  const look = LOOKS[avatar];
  const logo = Math.round(size * 0.68);
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: radius ?? size * 0.32,
        backgroundColor: look.bg,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: look.border ? 1 : 0,
        borderColor: 'rgba(255,255,255,0.12)',
        overflow: 'hidden',
      }}
    >
      <Svg width={logo} height={logo} viewBox="36 36 428 428" accessibilityElementsHidden>
        {LOGO_BARS.map((bar, i) => (
          <Path key={i} d={bar.d} fill={look.bars?.[i] ?? bar.fill} />
        ))}
      </Svg>
    </View>
  );
}
