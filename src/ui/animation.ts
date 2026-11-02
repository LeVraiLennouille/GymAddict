import { Platform } from 'react-native';

/** Le moteur d'animation natif n'existe pas dans le navigateur : on l'y désactive pour éviter les avertissements. */
export const USE_NATIVE_DRIVER: boolean = Platform.OS !== 'web';
