import fs from "fs";
import keypress from "keypress";
import AudioRecorder from "node-audiorecorder";
import {
  log,
  info,
  warn,
  success,
  requiredEnvVar,
  audioToTextByFile,
  checkForRequiredAudioPrograms,
} from "./utils";

// create a new Whisper client
const OPENAPI_API_KEY = requiredEnvVar("OPENAPI_API_KEY") as string;

console.log({
  OPENAPI_API_KEY,
});

const audioRecorderBinary = checkForRequiredAudioPrograms();

const recorder = new AudioRecorder(
  {
    program: audioRecorderBinary, // or 'rec' on Linux
    silence: 2,
    thresholdStart: 0.5,
    thresholdStop: 0.2,
    keepSilence: true,
    format: "mp3",
  },
  console
);

// Log information on the following events.
recorder.on("error", function () {
  warn("Recording error.");
});

recorder.on("end", function () {
  warn("Recording ended.");
});

const filePath = "./samples/recorded.mp3";
const fileStream = fs.createWriteStream(filePath, { encoding: "binary" });
recorder.start().stream().pipe(fileStream);

setTimeout(async () => {
  recorder.stop();
  log(`Recording saved to ${filePath}`);

  try {
    const audioAsText2 = await audioToTextByFile(filePath, OPENAPI_API_KEY);
    success(`Translation: ${audioAsText2}`);
  } catch (error) {
    console.error(error);
  }
}, 5000);



// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);

// listen for the "keypress" event
process.stdin.on('keypress', function (ch, key) {
  // check if the key combination is ctrl + r
  if (key && key.ctrl && key.name === 'R') {
    if (key.down) {
      // the user has pressed down the "ctrl + r" keys, start your action here
      info('Starting action...');
    } else {
      // the user has released the "ctrl + r" keys, stop your action here
      info('Stopping action...');

    }
  }
});

// don't forget to enable "raw" mode
// process.stdin.setRawMode(true);
