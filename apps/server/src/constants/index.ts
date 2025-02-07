import type { WeriftRtpCapabilities } from 'mediasoup-client-werift';
import {
  RTCRtpCodecParameters,
  useFIR,
  useNACK,
  usePLI,
  useREMB,
} from 'werift';

export const weriftCapabilities: WeriftRtpCapabilities = {
  codecs: {
    video: [
      new RTCRtpCodecParameters({
        mimeType: 'video/H264',
        clockRate: 90000,
        rtcpFeedback: [useFIR(), useNACK(), usePLI(), useREMB()],
        parameters:
          'level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42e01f',
      }),
    ],
    audio: [
      new RTCRtpCodecParameters({
        mimeType: 'audio/opus',
        clockRate: 48000,
        channels: 2,
      }),
    ],
  },
};
