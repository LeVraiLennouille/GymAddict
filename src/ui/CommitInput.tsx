import { useEffect, useRef, useState } from 'react';
import { Platform, TextInput, type StyleProp, type TextInputProps, type TextStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { DISPLAY_FONT, figtree } from '@/theme/fonts';

type Variant = 'set' | 'note' | 'big' | 'title';

interface CommitInputProps
  extends Omit<TextInputProps, 'value' | 'onChangeText' | 'onBlur' | 'onFocus' | 'style'> {
  /** Valeur enregistrée (source de vérité : le store). */
  value: string;
  /** Appelé à la fin de la saisie (perte de focus) ou après `commitDelayMs`. */
  onCommit: (text: string) => void;
  /** Appelé à chaque frappe (ex. drapeau PR en direct). */
  onLiveChange?: (text: string) => void;
  /** Appelé à chaque perte de focus, même si rien n'a changé. */
  onEnd?: () => void;
  commitDelayMs?: number;
  /** Chiffres, virgule et point uniquement. */
  numeric?: boolean;
  /** Entiers seulement (répétitions, RPE, âge). */
  integer?: boolean;
  /**
   * `set` : gros chiffres centrés d'une série · `note` : texte libre ·
   * `big` : valeur isolée (âge, poids) · `title` : pseudo, trait en bas.
   */
  variant?: Variant;
  highlight?: string;
  style?: StyleProp<TextStyle>;
}

/**
 * Champ qui garde son brouillon en local et n'écrit dans le store qu'à la fin de la saisie :
 * pas de rendu complet à chaque frappe, pas de perte de caractères.
 */
export function CommitInput({
  value,
  onCommit,
  onLiveChange,
  onEnd,
  commitDelayMs,
  numeric = false,
  integer = false,
  variant = 'set',
  highlight,
  style,
  ...rest
}: CommitInputProps) {
  const { colors } = useTheme();
  const [draft, setDraft] = useState(value);
  const draftRef = useRef(value);
  const focused = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!focused.current) {
      setDraft(value);
      draftRef.current = value;
    }
  }, [value]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const commit = (text: string): void => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    if (text !== value) onCommit(text);
  };

  const handleChange = (raw: string): void => {
    const text = integer ? raw.replace(/[^0-9]/g, '') : numeric ? raw.replace(/[^0-9.,]/g, '') : raw;
    setDraft(text);
    draftRef.current = text;
    onLiveChange?.(text);
    if (commitDelayMs) {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => commit(draftRef.current), commitDelayMs);
    }
  };

  const focusColor = variant === 'title' ? colors.cGreen : colors.cBlue;
  const base: Record<Variant, TextStyle> = {
    set: {
      backgroundColor: colors.card2,
      borderWidth: 1.5,
      borderColor: highlight ?? (isFocused ? focusColor : 'transparent'),
      borderRadius: 12,
      minHeight: 42,
      paddingVertical: 6,
      paddingHorizontal: 6,
      textAlign: 'center',
      fontFamily: DISPLAY_FONT,
      fontSize: 20,
      width: '100%',
    },
    note: {
      backgroundColor: colors.card2,
      borderWidth: 1.5,
      borderColor: highlight ?? (isFocused ? focusColor : 'transparent'),
      borderRadius: 12,
      minHeight: 46,
      paddingVertical: 11,
      paddingHorizontal: 12,
      textAlign: 'left',
      fontFamily: figtree(400),
      fontSize: 15,
      width: '100%',
    },
    big: {
      backgroundColor: colors.card2,
      borderWidth: 1.5,
      borderColor: highlight ?? (isFocused ? focusColor : 'transparent'),
      borderRadius: 12,
      minHeight: 50,
      paddingVertical: 6,
      paddingHorizontal: 12,
      textAlign: 'center',
      fontFamily: DISPLAY_FONT,
      fontSize: 27,
      width: 88,
    },
    title: {
      backgroundColor: 'transparent',
      borderWidth: 0,
      borderBottomWidth: 2,
      borderColor: isFocused ? focusColor : colors.border,
      minHeight: 44,
      paddingVertical: 2,
      paddingHorizontal: 0,
      textAlign: 'left',
      fontFamily: DISPLAY_FONT,
      fontSize: 31,
      width: '100%',
    },
  };

  return (
    <TextInput
      {...rest}
      value={draft}
      onChangeText={handleChange}
      onFocus={() => {
        focused.current = true;
        setIsFocused(true);
      }}
      onBlur={() => {
        focused.current = false;
        setIsFocused(false);
        commit(draftRef.current);
        onEnd?.();
      }}
      keyboardType={integer ? 'number-pad' : numeric ? 'decimal-pad' : rest.keyboardType}
      selectTextOnFocus={numeric || integer}
      placeholderTextColor={colors.onCard.muted}
      style={[
        { color: '#FFFFFF', ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}) } as TextStyle,
        base[variant],
        style,
      ]}
    />
  );
}
