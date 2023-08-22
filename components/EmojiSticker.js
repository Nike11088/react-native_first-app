import { useState } from "react";
import { View, Image } from "react-native";
import { PanGestureHandler, TapGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  useAnimatedGestureHandler,
  withSpring,
} from 'react-native-reanimated';

export default function EmojiSticker({ imageSize, stickerSource }) {  
  const AnimatedImage = Animated.createAnimatedComponent(Image);
  const AnimatedView = Animated.createAnimatedComponent(View);
  
  const scaleImage = useSharedValue(imageSize);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const initImageSize = imageSize

  const onDoubleTap = useAnimatedGestureHandler({
    onActive: () => {
      if (scaleImage.value !== imageSize * 2) {       
        scaleImage.value = scaleImage.value * 2;         
      }
    },
  });

  const onDrag = useAnimatedGestureHandler({
    onStart: (event, context) => {
      context.translateX = translateX.value;
      context.translateY = translateY.value;
    },
    onActive: (event, context) => {
      translateX.value = event.translationX + context.translateX;
      translateY.value = event.translationY + context.translateY;
    },
  });  

  const imageStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(scaleImage.value),
      height: withSpring(scaleImage.value),
    };
  });

  const containerStyle = useAnimatedStyle(() => {
    const maxX = scaleImage.value > initImageSize ? 238 : 280
    const maxY = scaleImage.value > initImageSize ? 270 : 305

    let x = translateX.value
    if (x < 0) {
      x = 0
    } else if (x > maxX) {
      x = maxX
    }

    let y = translateY.value
    if (y < -90) {
      y = -90
    } else if (y > maxY) {
      y = maxY
    }

    return {
      transform: [
        {
          translateX: x
        },
        {
          translateY: y
        },
      ],
    };
  });

  return (
    <PanGestureHandler onGestureEvent={onDrag}>
      <AnimatedView style={[containerStyle, { top: -350 }]}>
       <TapGestureHandler onGestureEvent={onDoubleTap} numberOfTaps={2}>
          <AnimatedImage
            source={stickerSource}
            resizeMode="contain"
            style={[imageStyle, { width: imageSize, height: imageSize }]}
          />
        </TapGestureHandler>
      </AnimatedView>
    </PanGestureHandler>
  );
}
