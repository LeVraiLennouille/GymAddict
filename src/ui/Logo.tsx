import Svg, { Path } from 'react-native-svg';
import { LOGO_BARS } from './logoPaths';

export function Logo({ size = 40 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="36 36 428 428">
      {LOGO_BARS.map((bar, i) => (
        <Path key={i} d={bar.d} fill={bar.fill} />
      ))}
    </Svg>
  );
}
