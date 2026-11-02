import { Link } from 'expo-router';
import { View } from 'react-native';
import { Text } from '@/ui/Text';

export default function NotFound() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <Text display size={34}>
        Page introuvable
      </Text>
      <Link href="/">
        <Text weight={700} size={15}>
          Retour à la séance
        </Text>
      </Link>
    </View>
  );
}
