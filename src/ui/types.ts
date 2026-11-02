import type { ComponentRef } from 'react';
import type { ScrollView } from 'react-native';

/** Type de la référence d'un `ScrollView` (indépendant de la version de React Native). */
export type ScrollViewHandle = ComponentRef<typeof ScrollView>;
