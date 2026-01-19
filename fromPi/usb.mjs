import { Radio } from "@jtarrio/webrtlsdr/radio.js"; 
import { Demodulator } from "@jtarrio/webrtlsdr/demod/demodulator.js"; 
import { RTL2832U_Provider } from "@jtarrio/webrtlsdr/rtlsdr.js"; 
import { AudioContext } from 'isomorphic-web-audio-api';
import { findByIds , WebUSBDevice, webusb, getDeviceList } from 'usb';

globalThis.navigator.usb = webusb;

const devices = getDeviceList();

for (const device of devices) {
    // console.log(device); // Legacy device
}


const device = await findByIds(3034, 10296);
const webDevice = await WebUSBDevice.createInstance(device);

globalThis.AudioContext = AudioContext;
globalThis.navigator.usb = webusb;
let demodulator = new Demodulator();
let radio = new Radio(new RTL2832U_Provider(webDevice), demodulator, {buffersPerSecond:60});
radio.setFrequency(91.7e6);
demodulator.setVolume(1);
radio.start();
