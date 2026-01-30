import { Radio, RtlProvider } from "@jtarrio/webrtlsdr/radio.js"; 
import { Demodulator } from "@jtarrio/signals/demod/demodulator.js";
import { webusb } from "usb"; 
import { AudioContext } from 'isomorphic-web-audio-api';
globalThis.AudioContext = AudioContext;
globalThis.navigator.usb = webusb;


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
});

console.log(new RtlProvider())

let radio = new Radio(new RtlProvider(), demodulator, { bufferPerSecond : 20 });  // by default buffersPerSecond : 20 (histoires de latence)
// radio.setFrequency(91.7e6);
radio.setFrequency(94.9e6);
demodulator.setVolume(1);
radio.start();


// essayer avec la vraie antenne, sans globalThis, puis sur la raspberry en changeant le nombre de tappsssss