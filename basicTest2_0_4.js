import { Radio } from "@jtarrio/webrtlsdr/radio.js"; 
import { Demodulator } from "@jtarrio/webrtlsdr/demod/demodulator.js"; 
import { RTL2832U_Provider } from "@jtarrio/webrtlsdr/rtlsdr.js"; 
import { webusb } from "usb"; 
import { AudioContext } from 'isomorphic-web-audio-api';
globalThis.AudioContext = AudioContext;
globalThis.navigator.usb = webusb;

let demodulator = new Demodulator();

let radio = new Radio(new RTL2832U_Provider(), demodulator);
radio.setFrequency(91.7e6);
demodulator.setVolume(1);
radio.start();