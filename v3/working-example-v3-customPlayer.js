import { Radio, RtlProvider } from "@jtarrio/webrtlsdr/radio.js"; 
import { Demodulator } from "@jtarrio/signals/demod/demodulator.js";
import { RTL2832U_Provider } from '@jtarrio/webrtlsdr/rtlsdr.js';
import { getMode, modeParameters } from "@jtarrio/signals/demod/modes.js"; 
import { webusb } from "usb"; 
import { AudioContext } from 'isomorphic-web-audio-api';

export class CustomPlayer {
    constructor(options) {
        this.newAudioContext =
            options?.newAudioContext || (() => new AudioContext());
        this.demodOutRate = 48000; // the demodulator output rate in jtarrio library (à vérifier) ≠ audioSampleRate /!\
        this.timeBuffer = 0.05;
        this.lastPlayedAt = -1;
        this.ac = undefined;
    }
    newAudioContext;
    lastPlayedAt;
    ac;

    /**
     * Queues the given samples for playing at the appropriate time.
     * @param leftSamples The samples for the left speaker.
     * @param rightSamples The samples for the right speaker.
     */
    play(leftSamples, rightSamples) {
        const blockSize = leftSamples.length;
        const blockDuration = blockSize / this.demodOutRate; // defined by jtarrio library (à vérifier)
        if (this.ac === undefined) {
            this.ac = this.newAudioContext();
        }
        const buffer = this.ac.createBuffer(2, blockSize, this.demodOutRate);
        buffer.getChannelData(0).set(leftSamples);
        buffer.getChannelData(1).set(rightSamples);
        let source = this.ac.createBufferSource();
        source.buffer = buffer;
        source.connect(this.ac.destination);
        this.lastPlayedAt = Math.max(this.lastPlayedAt + blockDuration, this.ac.currentTime + this.timeBuffer);
        source.start(this.lastPlayedAt);
    }
    /**
     * Sets the volume for playing samples.
     * @param volume The volume to set, between 0 and 1.
     */
    setVolume(volume) {

    }
    getVolume() {
    }
    get sampleRate() {
        if (this.ac)
            return this.ac.sampleRate;
        return 48000;
    }
}

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
    player: new CustomPlayer({newAudioContext : () => new AudioContext()})
});

const provider = new RtlProvider(new RTL2832U_Provider({webusb: webusb}));

let params = modeParameters(demodulator.getMode());
params.setStereo(false);
demodulator.setMode(params.mode);
// console.log(params.mode.stereo);

let radio = new Radio(provider, demodulator, { bufferPerSecond : 20 });  // by default buffersPerSecond : 20 (histoires de latence)
radio.setFrequency(91.7e6);

radio.setGain(null);

demodulator.setVolume(1);
radio.start();



// gain
// frequence
// mono/stereo


// future dev 
// implement bandwidth
// essayer avec la vraie antenne, sans globalThis, puis sur la raspberry en changeant le nombre de tappsssss