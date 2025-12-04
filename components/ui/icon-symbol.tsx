// Fallback for using MaterialIcons on Android and web.

import { SymbolView, SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';


/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
// Mapping SF Symbols → Material Icons (untuk Android & Web)
const FALLBACK_MAPPING = {
  "house.fill": "home",
  "plus.circle.fill": "add-circle",
  "heart.fill": "favorite",
  "map.fill": "map",
  "list.bullet": "format-list-bulleted",
  "calendar": "calendar-today",

} as const;

type IconSymbolName = keyof typeof FALLBACK_MAPPING;


/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = 'regular',
}: {
  name: SymbolViewProps['name'];
  size?: number;
  color: string;
  style?: StyleProp<ViewStyle>;  // ← PERBAIKI
  weight?: SymbolWeight;
}) {
  return (
    <SymbolView
      weight={weight}
      tintColor={color}
      resizeMode="scaleAspectFit"
      name={name}
      style={[
        {
          width: size,
          height: size,
        },
        style,
      ]}
    />
  );
}

