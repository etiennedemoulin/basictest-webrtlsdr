import { AudioContext, OscillatorNode } from 'isomorphic-web-audio-api';
const audioContext = new AudioContext();
const osc = new OscillatorNode(audioContext);
osc.connect(audioContext.destination);
osc.frequency.value = 550;
osc.start();

