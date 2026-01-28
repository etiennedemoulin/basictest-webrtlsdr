import { Radio } from "@jtarrio/webrtlsdr/radio.js"; 
import { modeParameters } from "@jtarrio/webrtlsdr/demod/modes.js"; 
import { Demodulator } from "@jtarrio/webrtlsdr/demod/demodulator.js";
import { RTL2832U_Provider } from "@jtarrio/webrtlsdr/rtlsdr.js"; 
import { webusb } from "usb"; 
import { AudioContext } from 'isomorphic-web-audio-api';
globalThis.AudioContext = AudioContext;
globalThis.navigator.usb = webusb;


let demodulator = new Demodulator({
    modeOptions: {
        "WBFM": {
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
        }
    }
});

const modeParams = modeParameters(demodulator.getMode());
modeParams.setStereo(true);
console.log(modeParams.getStereo());

let radio = new Radio(new RTL2832U_Provider(), demodulator, {buffersPerSecond:20}); // by default buffersPerSecond : 20 (histoires de latence)

radio.setFrequency(91.7e6);
demodulator.setVolume(1);
radio.start();