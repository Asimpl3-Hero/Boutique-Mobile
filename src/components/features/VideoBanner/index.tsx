import React from 'react';
import { Image, View } from 'react-native';
import Video from 'react-native-video';
import { styles } from './VideoBanner.styles';

const SOURCE = require('@/assets/video/Borcelle.mp4');
const APP_LOGO = require('@/assets/images/logos/Borcelle.png');

/** Slightly sped up so the loop feels lively without reading as fast-forward. */
const PLAYBACK_RATE = 1.5;

/** Full-width brand video strip: muted, infinite loop at 1.5× speed. */
export const VideoBanner = () => (
  <View style={styles.container}>
    <Video
      source={SOURCE}
      style={styles.video}
      resizeMode="cover"
      repeat
      muted
      rate={PLAYBACK_RATE}
      playInBackground={false}
      disableFocus
      accessibilityLabel="Video de la marca Borcelle"
    />
    {/* Watermark-style brand mark over the clip. */}
    <Image
      source={APP_LOGO}
      style={styles.logoBadge}
      resizeMode="contain"
      accessibilityLabel="Borcelle"
    />
  </View>
);
