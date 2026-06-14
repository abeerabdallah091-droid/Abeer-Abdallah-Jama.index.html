import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export const MyComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Fade in over 2 seconds (2 * fps frames)
  const opacity = interpolate(frame, [0, fps * 2], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          fontFamily: 'SF Pro Text, Helvetica, Arial, sans-serif',
          fontSize: 80,
          color: '#fff',
          textAlign: 'center',
          opacity,
        }}
      >
        Hello Motion Graphics
      </div>
    </AbsoluteFill>
  );
};
