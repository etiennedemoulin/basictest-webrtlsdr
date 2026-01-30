import { Radio, RtlProvider } from "@jtarrio/webrtlsdr/radio.js"; 
import { modeParameters } from "@jtarrio/signals/demod/modes.js"; 
import { RTL2832U_Provider } from "@jtarrio/webrtlsdr/rtlsdr.js";
import { Demodulator } from "@jtarrio/signals/demod/demodulator.js";
import { AudioPlayer } from "@jtarrio/signals/players/audioplayer.js";
import { webusb } from "usb"; 
import { AudioContext } from 'isomorphic-web-audio-api';

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
    player: new AudioPlayer({newAudioContext: () => new AudioContext()})
});

let rtlProvider = new RtlProvider(new RTL2832U_Provider({webusb: webusb}));

let radio = new Radio(
    rtlProvider, 
    demodulator, 
    { buffersPerSecond: 20 }
);

let params = modeParameters(demodulator.getMode());
params.setStereo(false);
demodulator.setMode(params.mode);
console.log(demodulator.getMode());

radio.setFrequency(91.7e6);
// radio.setFrequency(94.9e6);
demodulator.setVolume(1);
radio.start();


