import type { WeriftRtpCapabilities } from 'mediasoup-client-werift';
import {
  RTCRtpCodecParameters,
  useFIR,
  useNACK,
  usePLI,
  useREMB,
} from 'werift';
import type { TCard } from '@battleground/validators';

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

export const CARD_DECK: TCard[] = [
  'A2',
  'A3',
  'A4',
  'A5',
  'A6',
  'A7',
  'A8',
  'S2',
  'S3',
  'S4',
  'S5',
  'S6',
  'S7',
  'S8',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'H7',
  'H8',
];
