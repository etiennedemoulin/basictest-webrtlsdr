import { Radio, RtlProvider } from "@jtarrio/webrtlsdr/radio.js"; 
import { Demodulator } from "@jtarrio/signals/demod/demodulator.js";
import { RTL2832U_Provider } from '@jtarrio/webrtlsdr/rtlsdr.js';
import { AudioPlayer } from "@jtarrio/signals/players/audioplayer.js";
import { getMode, modeParameters } from "@jtarrio/signals/demod/modes.js"; 
import { webusb } from "usb"; 
import { AudioContext } from 'isomorphic-web-audio-api';

const audioContext = new AudioContext();

let demodulator = new Demodulator({
    modeOption: {
  /**
   * The time constant for the deemphasizer, in microseconds. 50 by default.
   *
   * This should be 75 for the US and South Korea, 50 everywhere else.
   */
  deemphasizerTc: 50,
  /** Number of taps for the downsampler filter. Must be an odd number. 151 by default. */
  downsamplerTaps: 151,
  /** Number of taps for the RF filter. Must be an odd number. 151 by default. */
  rfTaps: 151,
  /** Number of taps for the audio filter. Must be an odd number. 41 by default. */
  audioTaps: 41
},
    player: new AudioPlayer({newAudioContext: () => audioContext})
});

const provider = new RtlProvider(new RTL2832U_Provider({webusb: webusb}));

let params = modeParameters(demodulator.getMode());
params.setStereo(false);
demodulator.setMode(params.mode);
console.log(params.mode.stereo);

let radio = new Radio(provider, demodulator, { bufferPerSecond : 20 });  // by default buffersPerSecond : 20 (histoires de latence)
radio.setFrequency(91.7e6);

radio.setGain(null);

demodulator.setVolume(1);
radio.start();



// gain
// frequence
// mono/stereo