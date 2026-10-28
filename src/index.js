import { Midy } from "https://cdn.jsdelivr.net/gh/marmooo/midy@0.7.1/dist/midy.min.js";
import { Modal } from "https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/+esm";
import { MidiLibrary } from "https://marmooo.github.io/free-midi/midi-library.js";
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
} from "mediabunny";

const MIDI_DB_MODERN = "https://midi-db.pages.dev";
const MIDI_DB_CLASSICAL = "https://marmooo.github.io/classical-midi-db";
/** Currently selected MIDI DB base URL (modern or classical). */
let currentMidiDb = MIDI_DB_MODERN;

const MEDIABUNNY_AAC_ENCODER_URL =
  "https://cdn.jsdelivr.net/npm/@mediabunny/aac-encoder@1.62.0/dist/bundles/mediabunny-aac-encoder.mjs";
const MEDIABUNNY_FLAC_ENCODER_URL =
  "https://cdn.jsdelivr.net/npm/@mediabunny/flac-encoder@1.62.0/dist/bundles/mediabunny-flac-encoder.mjs";
const MEDIABUNNY_MP3_ENCODER_URL =
  "https://cdn.jsdelivr.net/npm/@mediabunny/mp3-encoder@1.62.0/dist/bundles/mediabunny-mp3-encoder.mjs";

function toggleDarkMode() {
  const html = document.documentElement;
  const newTheme = html.getAttribute("data-bs-theme") === "dark"
    ? "light"
    : "dark";
  html.setAttribute("data-bs-theme", newTheme);
  localStorage.setItem("darkMode", newTheme);
}

function getSoundFontPaths() {
  const paths = [];
  for (const instrument of midy.instruments) {
    const [bank, program] = instrument.split(":");
    const bankNumber = Number(bank);
    const programNumber = Number(program);
    const index = midy.soundFontTable[programNumber][bankNumber];
    if (index !== undefined) continue;
    paths.push(`${soundFontURL}/${bank}/${program}.sf3`);
  }
  return paths;
}

function toHttpURL(text) {
  try {
    const url = new URL(text);
    if (url.protocol === "http:" || url.protocol === "https:") return url.href;
  } catch { /* not a valid URL */ }
  return null;
}

function createExternalLink(href, text) {
  const a = document.createElement("a");
  a.href = href;
  a.textContent = text;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  return a;
}

// Shows "title" and "composer · maintainer [license]" of the MIDI.
// The query string is untrusted, so only http(s) links are accepted.
function setMIDIInfo(query) {
  const info = document.getElementById("midiInfo");
  const title = document.getElementById("title");
  const meta = document.getElementById("meta");
  meta.replaceChildren();
  if (!(query instanceof URLSearchParams)) {
    title.textContent = "";
    info.hidden = true;
    return;
  }
  const titleText = query.get("title") ?? "";
  const composer = query.get("composer") ?? "";
  const maintainer = query.get("maintainer") ?? "";
  const web = query.get("web") ?? "";
  const license = query.get("license") ?? "";

  const credits = [];
  if (composer) {
    const span = document.createElement("span");
    span.textContent = composer;
    credits.push(span);
  }
  if (maintainer) {
    const webURL = web ? toHttpURL(web) : null;
    if (webURL) {
      credits.push(createExternalLink(webURL, maintainer));
    } else {
      const span = document.createElement("span");
      span.textContent = maintainer;
      credits.push(span);
    }
  }
  for (let i = 0; i < credits.length; i++) {
    if (i > 0) meta.appendChild(document.createTextNode(" · "));
    meta.appendChild(credits[i]);
  }

  if (license) {
    const licenseURL = toHttpURL(license);
    let badge;
    if (licenseURL) {
      badge = createExternalLink(licenseURL, "License");
      badge.classList.add("text-decoration-none");
    } else {
      badge = document.createElement("span");
      badge.textContent = license;
    }
    badge.classList.add(
      "badge",
      "bg-body-secondary",
      "text-body",
      "border",
      "fw-normal",
    );
    if (credits.length > 0) badge.classList.add("ms-2");
    meta.appendChild(badge);
  }

  title.textContent = titleText;
  info.hidden = titleText === "" && meta.childNodes.length === 0;
}

// Convert a MIDI library row into the same query that ?url= links carry,
// so that both entry points go through setMIDIInfo().
function toInfoQuery(row) {
  const query = new URLSearchParams();
  const fields = ["title", "composer", "maintainer", "web", "license"];
  for (let i = 0; i < fields.length; i++) {
    const value = row[fields[i]];
    if (value) query.set(fields[i], value);
  }
  return query;
}

async function loadMIDIFromQuery() {
  const query = new URLSearchParams(location.search);
  const url = query.get("url");
  if (!url) return;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    await loadMIDI(await response.blob());
    setMIDIInfo(query);
  } catch (error) {
    console.error(`Failed to load ${url}:`, error);
  }
}

async function loadMIDI(file) {
  if (!file) return;
  setMIDIInfo();
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
    const { registerAacEncoder } = await import(MEDIABUNNY_AAC_ENCODER_URL);
    registerAacEncoder();
  }
  if (!(await canEncodeAudio("mp3"))) {
    const { registerMp3Encoder } = await import(MEDIABUNNY_MP3_ENCODER_URL);
    registerMp3Encoder();
  }
  if (!(await canEncodeAudio("flac"))) {
    const { registerFlacEncoder } = await import(MEDIABUNNY_FLAC_ENCODER_URL);
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
  event.srcElement.disabled = true;
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
    event.srcElement.disabled = false;
  }
}

const htmlLang = document.documentElement.lang;
let soundFontURL = "https://soundfonts.pages.dev/GeneralUser_GS_v2.0.3";
const configuration = {
  reverbAlgorithm: "Schroeder",
  reverbType: 4,
  chorusType: 1,
  outputFormat: "opus",
};
setConfigurationEvents();

initEncoders();

const audioContext = new AudioContext();
if (audioContext.state === "running") await audioContext.suspend();
const midy = new Midy(audioContext);
midy.cacheMode = "audio";

// ---------------------------------------------------------------------------
// midi library
// ---------------------------------------------------------------------------

const libraryModal = Modal.getOrCreateInstance(
  document.getElementById("screenLibrary"),
);
Modal.getOrCreateInstance(
  document.getElementById("soundFontLibraryModal"),
);

const midiLibrary = new MidiLibrary({
  midiDB: currentMidiDb,
  table: "libraryTable",
  pagination: "libraryPagination",
  columns: "libraryColumns",
  collections: "libraryCollections",
  instruments: "libraryInstruments",
  lang: htmlLang,
  onSelect: async (row) => {
    const response = await fetch(`${midiLibrary.midiDB}/${row.file}`);
    const blob = await response.blob();
    await loadMIDI(blob);
    setMIDIInfo(toInfoQuery(row));
    libraryModal.hide();
  },
});
midiLibrary.load();

/** Switch MIDI library between modern and classical collections. */
let switchMidiCategoryBusy = false;
async function switchMidiCategory(category) {
  const nextDb = category === "classical" ? MIDI_DB_CLASSICAL : MIDI_DB_MODERN;
  if (midiLibrary.midiDB === nextDb && midiLibrary.fullData) return;
  if (switchMidiCategoryBusy) return;
  switchMidiCategoryBusy = true;
  try {
    currentMidiDb = nextDb;
    midiLibrary.midiDB = nextDb;
    midiLibrary.collections.clear();
    midiLibrary.fullData = null;
    midiLibrary.destroy();
    await midiLibrary.load();
  } catch (err) {
    console.error("Failed to switch MIDI category:", err);
  } finally {
    switchMidiCategoryBusy = false;
  }
}

function initMidiCategoryRadios() {
  const radios = document.querySelectorAll('input[name="midiLibraryCategory"]');
  for (const radio of radios) {
    radio.addEventListener("change", () => {
      if (!radio.checked) return;
      switchMidiCategory(radio.value).catch((err) =>
        console.error("switchMidiCategory failed:", err)
      );
    });
  }
}
initMidiCategoryRadios();

// ---------------------------------------------------------------------------
// soundfont library
// ---------------------------------------------------------------------------

const SOUNDFONT_BASE = "https://soundfonts.pages.dev/";
let soundFontListLoaded = false;

async function loadSoundFontLibrary() {
  const el = document.getElementById("soundFontLibraryList");
  try {
    const list = await (await fetch(`${SOUNDFONT_BASE}list.json`)).json();
    el.innerHTML = "";
    list.forEach((sf, i) => {
      const id = `soundFontLibraryItem-${i}`;
      const checked = sf.name === "GeneralUser_GS_v2.0.3";
      const wrap = document.createElement("div");
      wrap.className = "form-check";
      wrap.innerHTML =
        `<input class="form-check-input" type="radio" name="soundFontLibrary" id="${id}" value="${sf.name}" ${
          checked ? "checked" : ""
        }>` +
        `<label class="form-check-label" for="${id}">${sf.name}</label>`;
      el.appendChild(wrap);
      if (checked) soundFontURL = SOUNDFONT_BASE + sf.name;
    });
    soundFontListLoaded = true;
  } catch (err) {
    console.error("Failed to load SoundFont library:", err);
    el.textContent = "Failed to load SoundFont library.";
  }
}

document.getElementById("soundFontLibraryList").addEventListener(
  "change",
  (e) => {
    if (e.target.name !== "soundFontLibrary") return;
    soundFontURL = SOUNDFONT_BASE + e.target.value;
  },
);

document.getElementById("openSoundFontLibrary").addEventListener(
  "click",
  () => {
    if (!soundFontListLoaded) loadSoundFontLibrary();
  },
);

document.getElementById("toggleDarkMode").onclick = toggleDarkMode;
document.getElementById("convert").onclick = convert;
document.getElementById("selectFile").onclick = () => {
  document.getElementById("inputFile").click();
};
document.getElementById("inputFile").addEventListener("change", (event) => {
  loadFile(event.target.files[0]);
  event.target.value = "";
});
document.addEventListener("paste", (e) => {
  const f = e.clipboardData?.items[0]?.getAsFile();
  if (f) loadFile(f);
});

const selectPanel = document.getElementById("selectPanel");
let dragN = 0;
selectPanel.addEventListener("dragenter", (e) => {
  e.preventDefault();
  if (++dragN === 1) {
    selectPanel.classList.add("drag-active");
  }
});
selectPanel.addEventListener("dragleave", (e) => {
  e.preventDefault();
  if (--dragN === 0) {
    selectPanel.classList.remove("drag-active");
  }
});
selectPanel.addEventListener("dragover", (e) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = "copy";
});
selectPanel.addEventListener("drop", (e) => {
  e.preventDefault();
  dragN = 0;
  selectPanel.classList.remove("drag-active");
  loadFile(e.dataTransfer.files[0]);
});

loadMIDIFromQuery();
