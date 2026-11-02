import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Icon } from './Icon';
import { Sheet } from './Sheet';
import { Text } from './Text';

export interface SelectOption {
  value: string;
  label: string;
  hint?: string;
}

interface SelectFieldProps {
  value: string;
  options: readonly SelectOption[];
  onChange: (value: string) => void;
  /** Titre de la fenêtre de choix. */
  title: string;
  placeholder?: string;
  disabled?: boolean;
  accessibilityLabel?: string;
}

/** Liste déroulante : un bouton qui ouvre une fenêtre de choix (équivalent du `<select>` web). */
export function SelectField({ value, options, onChange, title, placeholder = 'Choisir…', disabled = false, accessibilityLabel }: SelectFieldProps) {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? title}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={() => setOpen(true)}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          minHeight: 44,
          backgroundColor: colors.card2,
          borderRadius: 12,
          paddingHorizontal: 12,
          opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
        })}
      >
        <Text size={14} weight={600} color={current ? '#FFFFFF' : colors.onCard.muted} numberOfLines={1} style={{ flex: 1 }}>
          {current ? current.label : placeholder}
        </Text>
        <Icon name="down" size={16} color={colors.onCard.dim} />
      </Pressable>

      <Sheet visible={open} onClose={() => setOpen(false)} title={title} accent={colors.cBlue}>
        <View style={{ gap: 6 }}>
          {options.map((o) => {
            const selected = o.value === value;
            return (
              <Pressable
                key={o.value}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  minHeight: 48,
                  backgroundColor: colors.card2,
                  borderWidth: 2,
                  borderColor: selected ? colors.cGreen : 'transparent',
                  borderRadius: 14,
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <View style={{ flex: 1 }}>
                  <Text size={15} weight={600} color="#FFFFFF">
                    {o.label}
                  </Text>
                  {o.hint ? (
                    <Text size={11} tone="dim" style={{ marginTop: 2 }}>
                      {o.hint}
                    </Text>
                  ) : null}
                </View>
                {selected ? <Icon name="check" size={18} color={colors.green} /> : null}
              </Pressable>
            );
          })}
        </View>
      </Sheet>
    </>
  );
}
