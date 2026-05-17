import { Midy } from "https://cdn.jsdelivr.net/gh/marmooo/midy@0.5.1/dist/midy.min.js";
import {
  // AdtsOutputFormat,
  AudioBufferSource,
  BufferTarget,
  canEncodeAudio,
  FlacOutputFormat,
  Mp3OutputFormat,
  Mp4OutputFormat,
  OggOutputFormat,
  Output,
  QUALITY_HIGH,
  WavOutputFormat,
} from "https://cdn.jsdelivr.net/npm/mediabunny@1.45.2/+esm";
// import { registerMp3Encoder } from "https://cdn.jsdelivr.net/npm/@mediabunny/mp3-encoder@1.45.2/+esm";
// import { registerAacEncoder } from "https://cdn.jsdelivr.net/npm/@mediabunny/aac-encoder@1.45.2/+esm";
// import { registerFlacEncoder } from "https://cdn.jsdelivr.net/npm/@mediabunny/flac-encoder@1.45.2/+esm";

function toggleDarkMode() {
  const html = document.documentElement;
  const newTheme = html.getAttribute("data-bs-theme") === "dark"
    ? "light"
    : "dark";
  html.setAttribute("data-bs-theme", newTheme);
  localStorage.setItem("darkMode", newTheme);
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function shuffle(array) {
  for (let i = array.length; 1 < i; i--) {
    const k = Math.floor(Math.random() * i);
    [array[k], array[i - 1]] = [array[i - 1], array[k]];
  }
  return array;
}

function setSampleEvents() {
  document.getElementById("samples").addEventListener("change", (event) => {
    const target = event.target;
    switch (target.name) {
      case "sampleMIDI": {
        getSampleMIDI("https://midi-db.pages.dev/" + target.value);
        break;
      }
      case "sampleSoundFont":
        soundFontURL = "https://soundfonts.pages.dev/" + target.value;
    }
  });
}

async function getSampleMIDI(url) {
  const response = await fetch(url);
  const file = await response.blob();
  await loadMIDI(file);
}

async function getSampleMIDIList() {
  const root = document.getElementById("sampleMIDI");
  const homepageResponse = await fetch(
    "https://midi-db.pages.dev/collections.json",
  );
  const homepageList = await homepageResponse.json();
  const homepage = homepageList[getRandomInt(0, homepageList.length)];
  const { license: homepageLicense, maintainer: homepageMaintainer } = homepage;
  const license = (homepageLicense.startsWith("http"))
    ? `<a href="${homepageLicense}">custom</a>`
    : homepageLicense;
  const fileResponse = await fetch(
    `https://midi-db.pages.dev/json/${homepage.id}/${htmlLang}.json`,
  );
  const fileList = await fileResponse.json();
  const longFileList = fileList.filter((file) => !file.time.startsWith("0:"));
  shuffle(longFileList);

  let html = "";
  for (let i = 0; i < 15; i++) {
    const file = longFileList[i];
    const maintainer = !homepageMaintainer
      ? file.maintainer
      : homepageMaintainer;
    html += `
<div class="form-check">
  <label class="form-check-label">
    <input class="form-check-input" type="radio" name="sampleMIDI" value="${file.file}">
    ${file.title}, ${maintainer} (${license})
  </label>
</div>
    `;
    root.innerHTML = html;
  }
}

async function getSampleSoundFontList() {
  const root = document.getElementById("sampleSoundFont");
  const response = await fetch("https://soundfonts.pages.dev/list.json");
  const list = await response.json();
  let html = "";
  for (let i = 0; i < list.length; i++) {
    const soundFont = list[i];
    const checked = (soundFont.name === "GeneralUser_GS_v1.471")
      ? "checked"
      : "";
    const license = (soundFont.license.startsWith("http"))
      ? `<a href="${soundFont.license}">custom</a>`
      : soundFont.license;
    html += `
<div class="form-check">
  <label class="form-check-label">
    <input class="form-check-input" type="radio" name="sampleSoundFont" value="${soundFont.name}" ${checked}>
    ${soundFont.name} (${license})
  </label>
</div>
    `;
  }
  root.innerHTML = html;
}

function getSoundFontPaths() {
  const paths = [];
  for (const instrument of midy.instruments) {
    const [bank, program] = instrument.split(":");
    const bankNumber = Number(bank);
    const programNumber = Number(program);
    const index = midy.soundFontTable[programNumber][bankNumber];
    if (index !== undefined) continue;
    const baseName = bankNumber === 128 ? "128" : program;
    paths.push(`${soundFontURL}/${baseName}.sf3`);
  }
  return paths;
}

async function loadMIDI(file) {
  if (!file) return;
  await midy.stop();
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  await midy.loadMIDI(uint8Array);
}

async function loadSoundFont(file) {
  if (!file) return;
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  await midy.loadSoundFont(uint8Array);
}

async function loadFile(file) {
  const extName = file.name.split(".").at(-1).toLowerCase();
  switch (extName) {
    case "mid":
    case "midi":
      return await loadMIDI(file);
    case "sf2":
    case "sf3":
      return await loadSoundFont(file);
  }
}

function setConfigurationEvents() {
  document.getElementById("configuration").addEventListener(
    "change",
    (event) => {
      const target = event.target;
      switch (target.name) {
        case "reverbType":
        case "chorusType":
          configuration[target.name] = Number(target.value);
          break;
        case "reverbAlgorithm":
        case "outputFormat":
          configuration[target.name] = target.value;
      }
    },
  );
}

const FORMAT_MAP = {
  wav: {
    mime: "audio/wav",
    codec: "pcm-f32",
    fmt: () => new WavOutputFormat(),
  },
  mp3: {
    mime: "audio/mpeg",
    codec: "mp3",
    fmt: () => new Mp3OutputFormat(),
  },
  aac: {
    // mime: "audio/aac",
    mime: "audio/x-m4a",
    codec: "aac",
    // fmt: () => new AdtsOutputFormat(),
    fmt: () => new Mp4OutputFormat(),
  },
  flac: {
    mime: "audio/flac",
    codec: "flac",
    fmt: () => new FlacOutputFormat(),
  },
  opus: {
    mime: "audio/ogg",
    codec: "opus",
    fmt: () => new OggOutputFormat(),
  },
};

async function initEncoders() {
  if (!(await canEncodeAudio("aac"))) {
    const { registerAacEncoder } = await import(
      "https://cdn.jsdelivr.net/npm/@mediabunny/aac-encoder@1.45.2/+esm"
    );
    registerAacEncoder();
  }
  if (!(await canEncodeAudio("mp3"))) {
    const { registerMp3Encoder } = await import(
      "https://cdn.jsdelivr.net/npm/@mediabunny/mp3-encoder@1.45.2/+esm"
    );
    registerMp3Encoder();
  }
  if (!(await canEncodeAudio("flac"))) {
    const { registerFlacEncoder } = await import(
      "https://cdn.jsdelivr.net/npm/@mediabunny/flac-encoder@1.45.2/+esm"
    );
    registerFlacEncoder();
  }
  document.getElementById("convert").disabled = false;
}

async function audioBufferToAudio(audioBuffer, format) {
  const { mime, codec, fmt } = FORMAT_MAP[format];
  const output = new Output({ format: fmt(), target: new BufferTarget() });
  const isPcm = codec.startsWith("pcm-");
  const srcCfg = isPcm ? { codec } : { codec, bitrate: QUALITY_HIGH };
  const audioSource = new AudioBufferSource(srcCfg);
  output.addAudioTrack(audioSource);

  await output.start();
  await audioSource.add(audioBuffer);
  await output.finalize();
  return { output, mime };
}

function setAudioTag(audioData) {
  const buffer = audioData.output.target.buffer;
  const blob = new Blob([buffer], { type: audioData.mime });
  const resultAudio = document.getElementById("resultAudio");
  const prevSrc = resultAudio.src;
  if (prevSrc?.startsWith("blob:")) URL.revokeObjectURL(prevSrc);
  const url = URL.createObjectURL(blob);
  resultAudio.src = url;
  document.getElementById("convertStatus").classList.remove("d-none");
}

async function convert(event) {
  event.target.disabled = true;
  const convertText = document.getElementById("convertText");
  const convertSpinner = document.getElementById("convertSpinner");
  const convertAlert = document.getElementById("convertAlert");
  document.getElementById("convertStatus").classList.add("d-none");
  try {
    if (midy.instruments.size === 0) {
      convertAlert.classList.remove("d-none");
    } else {
      convertText.classList.add("d-none");
      convertSpinner.classList.remove("d-none");
      convertAlert.classList.add("d-none");
      const paths = getSoundFontPaths();
      await midy.loadSoundFont(paths);
      await midy.render();
      const audioData = await audioBufferToAudio(
        midy.renderedAudioBuffer,
        configuration.outputFormat,
      );
      setAudioTag(audioData);
    }
  } finally {
    convertText.classList.remove("d-none");
    convertSpinner.classList.add("d-none");
    event.target.disabled = false;
  }
}

function setDragEvent() {
  const selectPanel = document.getElementById("selectPanel");
  let dragCounter = 0;
  selectPanel.addEventListener("dragenter", (event) => {
    event.preventDefault();
    dragCounter++;
    selectPanel.classList.add("border", "border-secondary");
  });
  selectPanel.addEventListener("dragleave", (event) => {
    event.preventDefault();
    dragCounter--;
    if (dragCounter === 0) {
      selectPanel.classList.remove("border", "border-secondary");
    }
  });
  selectPanel.addEventListener("dragover", (event) => {
    event.preventDefault();
  });
  selectPanel.addEventListener("drop", (event) => {
    event.preventDefault();
    selectPanel.classList.remove("border", "border-secondary");
    const file = event.dataTransfer.files[0];
    loadFile(file);
  });
}

const htmlLang = document.documentElement.lang;
let soundFontURL = "https://soundfonts.pages.dev/GeneralUser_GS_v1.471";
const configuration = {
  reverbAlgorithm: "Schroeder",
  reverbType: 4,
  chorusType: 1,
  outputFormat: "opus",
};
await getSampleMIDIList();
await getSampleSoundFontList();
setSampleEvents();
setConfigurationEvents();
setDragEvent();

initEncoders();

const audioContext = new AudioContext();
if (audioContext.state === "running") await audioContext.suspend();
const midy = new Midy(audioContext);
midy.cacheMode = "audio";

document.getElementById("toggleDarkMode").onclick = toggleDarkMode;
document.getElementById("convert").onclick = convert;
document.getElementById("selectFile").onclick = () => {
  document.getElementById("inputFile").click();
};
document.getElementById("inputFile").addEventListener("change", (event) => {
  loadFile(event.target.files[0]);
});
globalThis.addEventListener("paste", (event) => {
  const item = event.clipboardData.items[0];
  const file = item.getAsFile();
  if (!file) return;
  loadFile(file);
});
