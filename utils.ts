import fs from "fs";
import path from "path";
import axios from "axios";
// import fetch from 'node-fetch';
import FormData from "form-data";
// import fetch, { FormData, fileFromSync } from 'node-fetch';
import { execSync } from "child_process";

export type TFile = {
  content: Buffer;
  size: number;
  name: string;
  path: string;
};

// requiredEnvVar returns the value of the environment variable with the given name.
// If the environment variable is not set, it prints an error message and exits the program.
export function requiredEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required environment variable ${name}`);
    process.exit(1);
  }
  return value;
}

// checkForRequiredAudioPrograms checks for the required audio programs and returns the last one found.
export function checkForRequiredAudioPrograms(): string {
  const programsToCheck = ["arecord", "rec", "sox"];
  let foundProgram = false;
  let recorder = "";

  for (const program of programsToCheck) {
    try {
      execSync(`which ${program}`);
      foundProgram = true;
      recorder = program;
    } catch (error) {
      // Program not found, continue to next program
      console.warn(
        `Warning: Program ${program} not found. Please install ${program} if you want to use it.`
      );
    }
  }

  if (!foundProgram) {
    console.error(
      `Error: None of the required programs (${programsToCheck.join(
        ", "
      )}) were found. Please install at least one of these programs and try again.`
    );
    process.exit(1);
  }

  return recorder;
}

// audioToTextByFile sends an audio file to the OpenAI API and returns the transcription.
export async function audioToTextByFile(
  fileName: string,
  token: string
): Promise<string> {
  const form = new FormData();
  form.append("model", "whisper-1");
  form.append("file", fs.createReadStream(path.resolve(fileName)));

  const response = await axios.post(
    "https://api.openai.com/v1/audio/transcriptions",
    form,
    {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": `multipart/form-data; boundary=' + ${form._boundary}`,
      },
    }
  );

  // const data = await response.json() as { text: string };
  if (response.status === 200) {
    if (response.data != null && response.data.text != null) {
      return response.data.text;
    }
  }

  throw new Error(`Error: ${response.status} ${response.statusText}`);
}

export const now = (): string => {
  return new Date().toISOString().split("T")[1].split("Z")[0];
};

export let log = (...args: Array<any>): void => {
  console.log(now(), "Log:    ", ...args);
};

export let info = (...args: Array<any>): void => {
  console.log(now(), "Info:   \x1b[34m", ...args, "\x1b[0m");
};

export let warn = (...args: Array<any>): void => {
  console.log(now(), "Warning:\x1b[91m", ...args, "\x1b[0m");
};

export let error = (...args: Array<any>): void => {
  console.log(now(), "Error:  \x1b[31m", ...args, "\x1b[0m");
};

export let success = (...args: Array<any>): void => {
  console.log(now(), "Success:\x1b[32m", ...args, "\x1b[0m");
};
