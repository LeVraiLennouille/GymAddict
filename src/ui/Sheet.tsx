import type { ReactNode } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { MAX_WIDTH } from '@/theme/tokens';
import { Icon } from './Icon';
import { SurfaceProvider } from './Surface';
import { Text } from './Text';

interface SheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  /** Couleur du liseré supérieur. */
  accent?: string;
  children: ReactNode;
}

/** Fenêtre modale qui monte du bas de l'écran (ancien `.modal-box`). */
export function Sheet({ visible, onClose, title, accent, children }: SheetProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
        <Pressable
          accessibilityLabel="Fermer"
          onPress={onClose}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(10,11,14,0.55)' }}
        />
        <SurfaceProvider value="card">
          <View
            style={{
              width: '100%',
              maxWidth: MAX_WIDTH + 40,
              maxHeight: '88%',
              backgroundColor: colors.card,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              borderTopWidth: 6,
              borderTopColor: accent ?? colors.cYellow,
            }}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              automaticallyAdjustKeyboardInsets
              contentContainerStyle={{ paddingTop: 22, paddingHorizontal: 18, paddingBottom: Math.max(40, insets.bottom + 20) }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Text display size={27} accessibilityRole="header">
                  {title}
                </Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Fermer"
                  onPress={onClose}
                  style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.card2, alignItems: 'center', justifyContent: 'center' }}
                >
                  <Icon name="close" size={18} color="#FFFFFF" />
                </Pressable>
              </View>
              {children}
            </ScrollView>
          </View>
        </SurfaceProvider>
      </View>
    </Modal>
  );
}
