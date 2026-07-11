import React from 'react';
import { ActivityIndicator, Modal, Text, View } from 'react-native';
import { Button, CheckIcon } from '@components/ui';
import Svg, { Path } from 'react-native-svg';
import { colors, moderateScale } from '@theme';
import { styles } from './StatusScreen.styles';

export type StatusScreenState = 'loading' | 'done' | 'denied';

export interface StatusScreenProps {
  visible: boolean;
  status: StatusScreenState;
  title: string;
  message?: string;
  /** Shown on terminal states only. */
  actionLabel?: string;
  onAction?: () => void;
}

const CrossIcon = ({ size, color }: { size: number; color: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="m6.5 6.5 11 11m0-11-11 11"
      stroke={color}
      strokeWidth={2.4}
      strokeLinecap="round"
    />
  </Svg>
);

/** Full-screen process status: loading spinner, green done or red denied. */
export const StatusScreen = ({
  visible,
  status,
  title,
  message,
  actionLabel,
  onAction,
}: StatusScreenProps) => (
  <Modal visible={visible} animationType="fade" onRequestClose={() => {}}>
    <View style={styles.container}>
      <View
        style={[
          styles.iconCircle,
          status === 'loading' && styles.iconLoading,
          status === 'done' && styles.iconDone,
          status === 'denied' && styles.iconDenied,
        ]}
      >
        {status === 'loading' ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : status === 'done' ? (
          <CheckIcon size={moderateScale(48)} color={colors.onPrimary} />
        ) : (
          <CrossIcon size={moderateScale(44)} color={colors.onPrimary} />
        )}
      </View>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {status !== 'loading' && actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} style={styles.action} />
      ) : null}
    </View>
  </Modal>
);
