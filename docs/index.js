// https://cdn.jsdelivr.net/gh/marmooo/midy@0.5.2/dist/midy.min.js
var ti = Object.create;
var qn = Object.defineProperty;
var si = Object.getOwnPropertyDescriptor;
var ri = Object.getOwnPropertyNames;
var ni = Object.getPrototypeOf;
var oi = Object.prototype.hasOwnProperty;
var lr = (i22, e) => () => (e || i22((e = { exports: {} }).exports, e), e.exports);
var ii = (i22, e, t, s) => {
  if (e && typeof e == "object" || typeof e == "function") for (let r of ri(e)) !oi.call(i22, r) && r !== t && qn(i22, r, { get: () => e[r], enumerable: !(s = si(e, r)) || s.enumerable });
  return i22;
};
var Kn = (i22, e, t) => (t = i22 != null ? ti(ni(i22)) : {}, ii(e || !i22 || !i22.__esModule ? qn(t, "default", { value: i22, enumerable: true }) : t, i22));
var Wn = lr((wa, Qn) => {
  function ai(i22) {
    var e = new ee(i22), t = e.readChunk();
    if (t.id != "MThd") throw "Bad MIDI file.  Expected 'MHdr', got: '" + t.id + "'";
    for (var s = ci(t.data), r = [], n = 0; !e.eof() && n < s.numTracks; n++) {
      var o = e.readChunk();
      if (o.id != "MTrk") throw "Bad MIDI file.  Expected 'MTrk', got: '" + o.id + "'";
      var a = li(o.data);
      r.push(a);
    }
    return { header: s, tracks: r };
  }
  function ci(i22) {
    var e = new ee(i22), t = e.readUInt16(), s = e.readUInt16(), r = { format: t, numTracks: s }, n = e.readUInt16();
    return n & 32768 ? (r.framesPerSecond = 256 - (n >> 8), r.ticksPerFrame = n & 255) : r.ticksPerBeat = n, r;
  }
  function li(i22) {
    for (var e = new ee(i22), t = []; !e.eof(); ) {
      var s = n();
      t.push(s);
    }
    return t;
    var r;
    function n() {
      var o = {};
      o.deltaTime = e.readVarInt();
      var a = e.readUInt8();
      if ((a & 240) === 240) if (a === 255) {
        o.meta = true;
        var c = e.readUInt8(), l = e.readVarInt();
        switch (c) {
          case 0:
            if (o.type = "sequenceNumber", l !== 2) throw "Expected length for sequenceNumber event is 2, got " + l;
            return o.number = e.readUInt16(), o;
          case 1:
            return o.type = "text", o.text = e.readString(l), o;
          case 2:
            return o.type = "copyrightNotice", o.text = e.readString(l), o;
          case 3:
            return o.type = "trackName", o.text = e.readString(l), o;
          case 4:
            return o.type = "instrumentName", o.text = e.readString(l), o;
          case 5:
            return o.type = "lyrics", o.text = e.readString(l), o;
          case 6:
            return o.type = "marker", o.text = e.readString(l), o;
          case 7:
            return o.type = "cuePoint", o.text = e.readString(l), o;
          case 32:
            if (o.type = "channelPrefix", l != 1) throw "Expected length for channelPrefix event is 1, got " + l;
            return o.channel = e.readUInt8(), o;
          case 33:
            if (o.type = "portPrefix", l != 1) throw "Expected length for portPrefix event is 1, got " + l;
            return o.port = e.readUInt8(), o;
          case 47:
            if (o.type = "endOfTrack", l != 0) throw "Expected length for endOfTrack event is 0, got " + l;
            return o;
          case 81:
            if (o.type = "setTempo", l != 3) throw "Expected length for setTempo event is 3, got " + l;
            return o.microsecondsPerBeat = e.readUInt24(), o;
          case 84:
            if (o.type = "smpteOffset", l != 5) throw "Expected length for smpteOffset event is 5, got " + l;
            var u = e.readUInt8(), h = { 0: 24, 32: 25, 64: 29, 96: 30 };
            return o.frameRate = h[u & 96], o.hour = u & 31, o.min = e.readUInt8(), o.sec = e.readUInt8(), o.frame = e.readUInt8(), o.subFrame = e.readUInt8(), o;
          case 88:
            if (o.type = "timeSignature", l != 2 && l != 4) throw "Expected length for timeSignature event is 4 or 2, got " + l;
            return o.numerator = e.readUInt8(), o.denominator = 1 << e.readUInt8(), l === 4 ? (o.metronome = e.readUInt8(), o.thirtyseconds = e.readUInt8()) : (o.metronome = 36, o.thirtyseconds = 8), o;
          case 89:
            if (o.type = "keySignature", l != 2) throw "Expected length for keySignature event is 2, got " + l;
            return o.key = e.readInt8(), o.scale = e.readUInt8(), o;
          case 127:
            return o.type = "sequencerSpecific", o.data = e.readBytes(l), o;
          default:
            return o.type = "unknownMeta", o.data = e.readBytes(l), o.metatypeByte = c, o;
        }
      } else if (a == 240) {
        o.type = "sysEx";
        var l = e.readVarInt();
        return o.data = e.readBytes(l), o;
      } else if (a == 247) {
        o.type = "endSysEx";
        var l = e.readVarInt();
        return o.data = e.readBytes(l), o;
      } else throw "Unrecognised MIDI event type byte: " + a;
      else {
        var f;
        if ((a & 128) === 0) {
          if (r === null) throw "Running status byte encountered before status byte";
          f = a, a = r, o.running = true;
        } else f = e.readUInt8(), r = a;
        var d = a >> 4;
        switch (o.channel = a & 15, d) {
          case 8:
            return o.type = "noteOff", o.noteNumber = f, o.velocity = e.readUInt8(), o;
          case 9:
            var p = e.readUInt8();
            return o.type = p === 0 ? "noteOff" : "noteOn", o.noteNumber = f, o.velocity = p, p === 0 && (o.byte9 = true), o;
          case 10:
            return o.type = "noteAftertouch", o.noteNumber = f, o.amount = e.readUInt8(), o;
          case 11:
            return o.type = "controller", o.controllerType = f, o.value = e.readUInt8(), o;
          case 12:
            return o.type = "programChange", o.programNumber = f, o;
          case 13:
            return o.type = "channelAftertouch", o.amount = f, o;
          case 14:
            return o.type = "pitchBend", o.value = f + (e.readUInt8() << 7) - 8192, o;
          default:
            throw "Unrecognised MIDI event type: " + d;
        }
      }
    }
  }
  function ee(i22) {
    this.buffer = i22, this.bufferLen = this.buffer.length, this.pos = 0;
  }
  ee.prototype.eof = function() {
    return this.pos >= this.bufferLen;
  };
  ee.prototype.readUInt8 = function() {
    var i22 = this.buffer[this.pos];
    return this.pos += 1, i22;
  };
  ee.prototype.readInt8 = function() {
    var i22 = this.readUInt8();
    return i22 & 128 ? i22 - 256 : i22;
  };
  ee.prototype.readUInt16 = function() {
    var i22 = this.readUInt8(), e = this.readUInt8();
    return (i22 << 8) + e;
  };
  ee.prototype.readInt16 = function() {
    var i22 = this.readUInt16();
    return i22 & 32768 ? i22 - 65536 : i22;
  };
  ee.prototype.readUInt24 = function() {
    var i22 = this.readUInt8(), e = this.readUInt8(), t = this.readUInt8();
    return (i22 << 16) + (e << 8) + t;
  };
  ee.prototype.readInt24 = function() {
    var i22 = this.readUInt24();
    return i22 & 8388608 ? i22 - 16777216 : i22;
  };
  ee.prototype.readUInt32 = function() {
    var i22 = this.readUInt8(), e = this.readUInt8(), t = this.readUInt8(), s = this.readUInt8();
    return (i22 << 24) + (e << 16) + (t << 8) + s;
  };
  ee.prototype.readBytes = function(i22) {
    var e = this.buffer.slice(this.pos, this.pos + i22);
    return this.pos += i22, e;
  };
  ee.prototype.readString = function(i22) {
    var e = this.readBytes(i22);
    return String.fromCharCode.apply(null, e);
  };
  ee.prototype.readVarInt = function() {
    for (var i22 = 0; !this.eof(); ) {
      var e = this.readUInt8();
      if (e & 128) i22 += e & 127, i22 <<= 7;
      else return i22 + e;
    }
    return i22;
  };
  ee.prototype.readChunk = function() {
    var i22 = this.readString(4), e = this.readUInt32(), t = this.readBytes(e);
    return { id: i22, length: e, data: t };
  };
  Qn.exports = ai;
});
var $n = lr((Ma, zn) => {
  function ui(i22, e) {
    if (typeof i22 != "object") throw "Invalid MIDI data";
    e = e || {};
    var t = i22.header || {}, s = i22.tracks || [], r, n = s.length, o = new z();
    for (hi(o, t, n), r = 0; r < n; r++) di(o, s[r], e);
    return o.buffer;
  }
  function hi(i22, e, t) {
    var s = e.format == null ? 1 : e.format, r = 128;
    e.timeDivision ? r = e.timeDivision : e.ticksPerFrame && e.framesPerSecond ? r = -(e.framesPerSecond & 255) << 8 | e.ticksPerFrame & 255 : e.ticksPerBeat && (r = e.ticksPerBeat & 32767);
    var n = new z();
    n.writeUInt16(s), n.writeUInt16(t), n.writeUInt16(r), i22.writeChunk("MThd", n.buffer);
  }
  function di(i22, e, t) {
    var s = new z(), r, n = e.length, o = null;
    for (r = 0; r < n; r++) (t.running === false || !t.running && !e[r].running) && (o = null), o = fi(s, e[r], o, t.useByte9ForNoteOff);
    i22.writeChunk("MTrk", s.buffer);
  }
  function fi(i22, e, t, s) {
    var r = e.type, n = e.deltaTime, o = e.text || "", a = e.data || [], c = null;
    switch (i22.writeVarInt(n), r) {
      case "sequenceNumber":
        i22.writeUInt8(255), i22.writeUInt8(0), i22.writeVarInt(2), i22.writeUInt16(e.number);
        break;
      case "text":
        i22.writeUInt8(255), i22.writeUInt8(1), i22.writeVarInt(o.length), i22.writeString(o);
        break;
      case "copyrightNotice":
        i22.writeUInt8(255), i22.writeUInt8(2), i22.writeVarInt(o.length), i22.writeString(o);
        break;
      case "trackName":
        i22.writeUInt8(255), i22.writeUInt8(3), i22.writeVarInt(o.length), i22.writeString(o);
        break;
      case "instrumentName":
        i22.writeUInt8(255), i22.writeUInt8(4), i22.writeVarInt(o.length), i22.writeString(o);
        break;
      case "lyrics":
        i22.writeUInt8(255), i22.writeUInt8(5), i22.writeVarInt(o.length), i22.writeString(o);
        break;
      case "marker":
        i22.writeUInt8(255), i22.writeUInt8(6), i22.writeVarInt(o.length), i22.writeString(o);
        break;
      case "cuePoint":
        i22.writeUInt8(255), i22.writeUInt8(7), i22.writeVarInt(o.length), i22.writeString(o);
        break;
      case "channelPrefix":
        i22.writeUInt8(255), i22.writeUInt8(32), i22.writeVarInt(1), i22.writeUInt8(e.channel);
        break;
      case "portPrefix":
        i22.writeUInt8(255), i22.writeUInt8(33), i22.writeVarInt(1), i22.writeUInt8(e.port);
        break;
      case "endOfTrack":
        i22.writeUInt8(255), i22.writeUInt8(47), i22.writeVarInt(0);
        break;
      case "setTempo":
        i22.writeUInt8(255), i22.writeUInt8(81), i22.writeVarInt(3), i22.writeUInt24(e.microsecondsPerBeat);
        break;
      case "smpteOffset":
        i22.writeUInt8(255), i22.writeUInt8(84), i22.writeVarInt(5);
        var l = { 24: 0, 25: 32, 29: 64, 30: 96 }, u = e.hour & 31 | l[e.frameRate];
        i22.writeUInt8(u), i22.writeUInt8(e.min), i22.writeUInt8(e.sec), i22.writeUInt8(e.frame), i22.writeUInt8(e.subFrame);
        break;
      case "timeSignature":
        i22.writeUInt8(255), i22.writeUInt8(88), i22.writeVarInt(4), i22.writeUInt8(e.numerator);
        var h = Math.floor(Math.log(e.denominator) / Math.LN2) & 255;
        i22.writeUInt8(h), i22.writeUInt8(e.metronome), i22.writeUInt8(e.thirtyseconds || 8);
        break;
      case "keySignature":
        i22.writeUInt8(255), i22.writeUInt8(89), i22.writeVarInt(2), i22.writeInt8(e.key), i22.writeUInt8(e.scale);
        break;
      case "sequencerSpecific":
        i22.writeUInt8(255), i22.writeUInt8(127), i22.writeVarInt(a.length), i22.writeBytes(a);
        break;
      case "unknownMeta":
        e.metatypeByte != null && (i22.writeUInt8(255), i22.writeUInt8(e.metatypeByte), i22.writeVarInt(a.length), i22.writeBytes(a));
        break;
      case "sysEx":
        i22.writeUInt8(240), i22.writeVarInt(a.length), i22.writeBytes(a);
        break;
      case "endSysEx":
        i22.writeUInt8(247), i22.writeVarInt(a.length), i22.writeBytes(a);
        break;
      case "noteOff":
        var f = s !== false && e.byte9 || s && e.velocity == 0 ? 144 : 128;
        c = f | e.channel, c !== t && i22.writeUInt8(c), i22.writeUInt8(e.noteNumber), i22.writeUInt8(e.velocity);
        break;
      case "noteOn":
        c = 144 | e.channel, c !== t && i22.writeUInt8(c), i22.writeUInt8(e.noteNumber), i22.writeUInt8(e.velocity);
        break;
      case "noteAftertouch":
        c = 160 | e.channel, c !== t && i22.writeUInt8(c), i22.writeUInt8(e.noteNumber), i22.writeUInt8(e.amount);
        break;
      case "controller":
        c = 176 | e.channel, c !== t && i22.writeUInt8(c), i22.writeUInt8(e.controllerType), i22.writeUInt8(e.value);
        break;
      case "programChange":
        c = 192 | e.channel, c !== t && i22.writeUInt8(c), i22.writeUInt8(e.programNumber);
        break;
      case "channelAftertouch":
        c = 208 | e.channel, c !== t && i22.writeUInt8(c), i22.writeUInt8(e.amount);
        break;
      case "pitchBend":
        c = 224 | e.channel, c !== t && i22.writeUInt8(c);
        var d = 8192 + e.value, p = d & 127, y = d >> 7 & 127;
        i22.writeUInt8(p), i22.writeUInt8(y);
        break;
      default:
        throw "Unrecognized event type: " + r;
    }
    return c;
  }
  function z() {
    this.buffer = [];
  }
  z.prototype.writeUInt8 = function(i22) {
    this.buffer.push(i22 & 255);
  };
  z.prototype.writeInt8 = z.prototype.writeUInt8;
  z.prototype.writeUInt16 = function(i22) {
    var e = i22 >> 8 & 255, t = i22 & 255;
    this.writeUInt8(e), this.writeUInt8(t);
  };
  z.prototype.writeInt16 = z.prototype.writeUInt16;
  z.prototype.writeUInt24 = function(i22) {
    var e = i22 >> 16 & 255, t = i22 >> 8 & 255, s = i22 & 255;
    this.writeUInt8(e), this.writeUInt8(t), this.writeUInt8(s);
  };
  z.prototype.writeInt24 = z.prototype.writeUInt24;
  z.prototype.writeUInt32 = function(i22) {
    var e = i22 >> 24 & 255, t = i22 >> 16 & 255, s = i22 >> 8 & 255, r = i22 & 255;
    this.writeUInt8(e), this.writeUInt8(t), this.writeUInt8(s), this.writeUInt8(r);
  };
  z.prototype.writeInt32 = z.prototype.writeUInt32;
  z.prototype.writeBytes = function(i22) {
    this.buffer = this.buffer.concat(Array.prototype.slice.call(i22, 0));
  };
  z.prototype.writeString = function(i22) {
    var e, t = i22.length, s = [];
    for (e = 0; e < t; e++) s.push(i22.codePointAt(e));
    this.writeBytes(s);
  };
  z.prototype.writeVarInt = function(i22) {
    if (i22 < 0) throw "Cannot write negative variable-length integer";
    if (i22 <= 127) this.writeUInt8(i22);
    else {
      var e = i22, t = [];
      for (t.push(e & 127), e >>= 7; e; ) {
        var s = e & 127 | 128;
        t.push(s), e >>= 7;
      }
      this.writeBytes(t.reverse());
    }
  };
  z.prototype.writeChunk = function(i22, e) {
    this.writeString(i22), this.writeUInt32(e.length), this.writeBytes(e);
  };
  zn.exports = ui;
});
var Xn = lr((sn) => {
  sn.parseMidi = Wn();
  sn.writeMidi = $n();
});
var uo = lr((ic, lo) => {
  lo.exports = Worker;
});
var Jo = Kn(Xn());
var Be = class {
  constructor(e, t) {
    Object.defineProperty(this, "data", { enumerable: true, configurable: true, writable: true, value: e }), Object.defineProperty(this, "offset", { enumerable: true, configurable: true, writable: true, value: t });
  }
  readString(e) {
    let t = this.offset, s = t + e, r = this.data, n = r.subarray(t, s).indexOf(0);
    n < 0 && (n = e);
    let o = new Array(n);
    for (let a = 0; a < n; a++) o[a] = r[t + a];
    return this.offset = s, String.fromCharCode(...o);
  }
  readWORD() {
    return this.data[this.offset++] | this.data[this.offset++] << 8;
  }
  readDWORD(e = false) {
    return e ? (this.data[this.offset++] << 24 | this.data[this.offset++] << 16 | this.data[this.offset++] << 8 | this.data[this.offset++]) >>> 0 : (this.data[this.offset++] | this.data[this.offset++] << 8 | this.data[this.offset++] << 16 | this.data[this.offset++] << 24) >>> 0;
  }
  readByte() {
    return this.data[this.offset++];
  }
  readAt(e) {
    return this.data[this.offset + e];
  }
  readUInt8() {
    return this.readByte();
  }
  readInt8() {
    return this.readByte() << 24 >> 24;
  }
  readUInt16() {
    return this.readWORD();
  }
  readInt16() {
    return this.readWORD() << 16 >> 16;
  }
  readUInt32() {
    return this.readDWORD();
  }
};
function nn(i22, e, t) {
  let s = new Be(i22, e), r = s.readString(4), n = s.readDWORD(t);
  return new rn(r, n, s.offset);
}
function on(i22, e = 0, t, { padding: s = true, bigEndian: r = false } = {}) {
  let n = [], o = t + e, a = e;
  for (; a < o; ) {
    let c = nn(i22, a, r);
    a = c.offset + c.size, s && (a - e & 1) === 1 && a++, n.push(c);
  }
  return n;
}
var rn = class {
  constructor(e, t, s) {
    Object.defineProperty(this, "type", { enumerable: true, configurable: true, writable: true, value: e }), Object.defineProperty(this, "size", { enumerable: true, configurable: true, writable: true, value: t }), Object.defineProperty(this, "offset", { enumerable: true, configurable: true, writable: true, value: s });
  }
};
var Ee = ["startAddrsOffset", "endAddrsOffset", "startloopAddrsOffset", "endloopAddrsOffset", "startAddrsCoarseOffset", "modLfoToPitch", "vibLfoToPitch", "modEnvToPitch", "initialFilterFc", "initialFilterQ", "modLfoToFilterFc", "modEnvToFilterFc", "endAddrsCoarseOffset", "modLfoToVolume", void 0, "chorusEffectsSend", "reverbEffectsSend", "pan", void 0, void 0, void 0, "delayModLFO", "freqModLFO", "delayVibLFO", "freqVibLFO", "delayModEnv", "attackModEnv", "holdModEnv", "decayModEnv", "sustainModEnv", "releaseModEnv", "keynumToModEnvHold", "keynumToModEnvDecay", "delayVolEnv", "attackVolEnv", "holdVolEnv", "decayVolEnv", "sustainVolEnv", "releaseVolEnv", "keynumToVolEnvHold", "keynumToVolEnvDecay", "instrument", void 0, "keyRange", "velRange", "startloopAddrsCoarseOffset", "keynum", "velocity", "initialAttenuation", void 0, "endloopAddrsCoarseOffset", "coarseTune", "fineTune", "sampleID", "sampleModes", void 0, "scaleTuning", "exclusiveClass", "overridingRootKey"];
var _ = class i {
  constructor(e, t, s, r, n) {
    Object.defineProperty(this, "type", { enumerable: true, configurable: true, writable: true, value: e }), Object.defineProperty(this, "polarity", { enumerable: true, configurable: true, writable: true, value: t }), Object.defineProperty(this, "direction", { enumerable: true, configurable: true, writable: true, value: s }), Object.defineProperty(this, "cc", { enumerable: true, configurable: true, writable: true, value: r }), Object.defineProperty(this, "index", { enumerable: true, configurable: true, writable: true, value: n });
  }
  get controllerType() {
    return this.cc << 7 | this.index;
  }
  static parse(e) {
    let t = e >> 10 & 63, s = e & 127, r = e >> 7 & 1, n = e >> 8 & 1, o = e >> 9 & 1;
    return new i(t, o, n, r, s);
  }
  map(e) {
    let t = e;
    switch (this.polarity === 1 ? (t = (t - 0.5) * 2, this.direction === 1 && (t *= -1)) : this.direction === 1 && (t = 1 - t), this.type) {
      case 0:
        break;
      case 1:
        t = Math.sign(t) * Math.log(Math.abs(t));
        break;
      case 2:
        t = Math.sign(t) * Math.exp(-Math.abs(t));
        break;
      case 3:
        t = t >= 0.5 ? 1 : 0;
        break;
      default:
        console.warn(`unexpected type: ${this.type}`);
        break;
    }
    return t;
  }
};
var an = class i2 {
  constructor(e, t) {
    Object.defineProperty(this, "major", { enumerable: true, configurable: true, writable: true, value: e }), Object.defineProperty(this, "minor", { enumerable: true, configurable: true, writable: true, value: t });
  }
  static parse(e) {
    let t = e.readInt8(), s = e.readInt8();
    return new i2(t, s);
  }
};
var ur = class i3 {
  constructor(e, t, s, r, n, o, a, c, l, u, h) {
    Object.defineProperty(this, "comment", { enumerable: true, configurable: true, writable: true, value: e }), Object.defineProperty(this, "copyright", { enumerable: true, configurable: true, writable: true, value: t }), Object.defineProperty(this, "creationDate", { enumerable: true, configurable: true, writable: true, value: s }), Object.defineProperty(this, "engineer", { enumerable: true, configurable: true, writable: true, value: r }), Object.defineProperty(this, "name", { enumerable: true, configurable: true, writable: true, value: n }), Object.defineProperty(this, "product", { enumerable: true, configurable: true, writable: true, value: o }), Object.defineProperty(this, "software", { enumerable: true, configurable: true, writable: true, value: a }), Object.defineProperty(this, "version", { enumerable: true, configurable: true, writable: true, value: c }), Object.defineProperty(this, "soundEngine", { enumerable: true, configurable: true, writable: true, value: l }), Object.defineProperty(this, "romName", { enumerable: true, configurable: true, writable: true, value: u }), Object.defineProperty(this, "romVersion", { enumerable: true, configurable: true, writable: true, value: h });
  }
  static parse(e, t) {
    function s(v) {
      for (let S = 0; S < t.length; S++) if (t[S].type === v) return t[S];
    }
    function r(v) {
      return new Be(e, v.offset);
    }
    function n(v) {
      let S = s(v);
      return S ? r(S).readString(S.size) : null;
    }
    function o(v) {
      let S = s(v);
      return S ? an.parse(r(S)) : null;
    }
    let a = n("ICMT"), c = n("ICOP"), l = n("ICRD"), u = n("IENG"), h = n("INAM"), f = n("IPRD"), d = n("ISFT"), p = o("ifil"), y = n("isng"), m = n("irom"), b = o("iver");
    return new i3(a, c, l, u, h, f, d, p, y, m, b);
  }
};
var cs = class i4 {
  constructor(e, t) {
    Object.defineProperty(this, "generatorIndex", { enumerable: true, configurable: true, writable: true, value: e }), Object.defineProperty(this, "modulatorIndex", { enumerable: true, configurable: true, writable: true, value: t });
  }
  static parse(e) {
    let t = e.readWORD(), s = e.readWORD();
    return new i4(t, s);
  }
};
var hr = class i5 {
  constructor(e, t, s, r, n, o, a) {
    Object.defineProperty(this, "presetName", { enumerable: true, configurable: true, writable: true, value: e }), Object.defineProperty(this, "preset", { enumerable: true, configurable: true, writable: true, value: t }), Object.defineProperty(this, "bank", { enumerable: true, configurable: true, writable: true, value: s }), Object.defineProperty(this, "presetBagIndex", { enumerable: true, configurable: true, writable: true, value: r }), Object.defineProperty(this, "library", { enumerable: true, configurable: true, writable: true, value: n }), Object.defineProperty(this, "genre", { enumerable: true, configurable: true, writable: true, value: o }), Object.defineProperty(this, "morphology", { enumerable: true, configurable: true, writable: true, value: a });
  }
  get isEnd() {
    let { presetName: e, preset: t, bank: s, library: r, genre: n, morphology: o } = this;
    return e === "EOP" || e === "" && t + s + r + n + o === 0;
  }
  static parse(e) {
    let t = e.readString(20), s = e.readWORD(), r = e.readWORD(), n = e.readWORD(), o = e.readDWORD(), a = e.readDWORD(), c = e.readDWORD();
    return new i5(t, s, r, n, o, a, c);
  }
};
var xt = class i6 {
  constructor(e, t) {
    Object.defineProperty(this, "lo", { enumerable: true, configurable: true, writable: true, value: void 0 }), Object.defineProperty(this, "hi", { enumerable: true, configurable: true, writable: true, value: void 0 }), this.lo = e, this.hi = t;
  }
  in(e) {
    return this.lo <= e && e <= this.hi;
  }
  static parse(e) {
    let t = e.readByte(), s = e.readByte();
    return new i6(t, s);
  }
};
var X = class i7 {
  constructor(e, t, s, r, n) {
    Object.defineProperty(this, "sourceOper", { enumerable: true, configurable: true, writable: true, value: e }), Object.defineProperty(this, "destinationOper", { enumerable: true, configurable: true, writable: true, value: t }), Object.defineProperty(this, "amount", { enumerable: true, configurable: true, writable: true, value: s }), Object.defineProperty(this, "amountSourceOper", { enumerable: true, configurable: true, writable: true, value: r }), Object.defineProperty(this, "transOper", { enumerable: true, configurable: true, writable: true, value: n });
  }
  transform(e) {
    let t = this.amount * e;
    switch (this.transOper) {
      case 0:
        return t;
      case 2:
        return Math.abs(t);
      default:
        return t;
    }
  }
  static parse(e) {
    let t = e.readWORD(), s = e.readWORD(), r = e.readInt16(), n = e.readWORD(), o = e.readWORD(), a = _.parse(t), c = _.parse(n);
    return new i7(a, s, r, c, o);
  }
};
var ls = class i8 {
  constructor(e, t) {
    Object.defineProperty(this, "code", { enumerable: true, configurable: true, writable: true, value: e }), Object.defineProperty(this, "value", { enumerable: true, configurable: true, writable: true, value: t });
  }
  get type() {
    return Ee[this.code];
  }
  get isEnd() {
    return this.code === 0 && this.value === 0;
  }
  static parse(e) {
    let t = e.readWORD(), s = Ee[t], r;
    switch (s) {
      case "keyRange":
      case "velRange":
        r = xt.parse(e);
        break;
      case "instrument":
      case "sampleID":
        r = e.readUInt16();
        break;
      default:
        r = e.readInt16();
        break;
    }
    return new i8(t, r);
  }
};
var dr = class i9 {
  constructor() {
    Object.defineProperty(this, "instrumentName", { enumerable: true, configurable: true, writable: true, value: void 0 }), Object.defineProperty(this, "instrumentBagIndex", { enumerable: true, configurable: true, writable: true, value: void 0 });
  }
  get isEnd() {
    return this.instrumentName === "EOI";
  }
  static parse(e) {
    let t = new i9();
    return t.instrumentName = e.readString(20), t.instrumentBagIndex = e.readWORD(), t;
  }
};
var fr = class i10 {
  constructor(e, t, s, r, n, o, a, c, l, u) {
    Object.defineProperty(this, "sampleName", { enumerable: true, configurable: true, writable: true, value: e }), Object.defineProperty(this, "start", { enumerable: true, configurable: true, writable: true, value: t }), Object.defineProperty(this, "end", { enumerable: true, configurable: true, writable: true, value: s }), Object.defineProperty(this, "loopStart", { enumerable: true, configurable: true, writable: true, value: r }), Object.defineProperty(this, "loopEnd", { enumerable: true, configurable: true, writable: true, value: n }), Object.defineProperty(this, "sampleRate", { enumerable: true, configurable: true, writable: true, value: o }), Object.defineProperty(this, "originalPitch", { enumerable: true, configurable: true, writable: true, value: a }), Object.defineProperty(this, "pitchCorrection", { enumerable: true, configurable: true, writable: true, value: c }), Object.defineProperty(this, "sampleLink", { enumerable: true, configurable: true, writable: true, value: l }), Object.defineProperty(this, "sampleType", { enumerable: true, configurable: true, writable: true, value: u });
  }
  get isEnd() {
    return this.sampleName === "EOS";
  }
  static parse(e, t) {
    let s = e.readString(20), r = e.readDWORD(), n = e.readDWORD(), o = e.readDWORD(), a = e.readDWORD(), c = e.readDWORD(), l = e.readByte(), u = e.readInt8(), h = e.readWORD(), f = e.readWORD();
    return t || (o -= r, a -= r), new i10(s, r, n, o, a, c, l, u, h, f);
  }
};
var w = class {
  constructor(e, t, s) {
    Object.defineProperty(this, "min", { enumerable: true, configurable: true, writable: true, value: void 0 }), Object.defineProperty(this, "max", { enumerable: true, configurable: true, writable: true, value: void 0 }), Object.defineProperty(this, "defaultValue", { enumerable: true, configurable: true, writable: true, value: void 0 }), this.min = e, this.defaultValue = t, this.max = s;
  }
  clamp(e) {
    return Math.max(this.min, Math.min(e, this.max));
  }
};
var pi = ["pcm16", "pcm24", "compressed"];
var mi = new Set(pi);
var pr = class {
  constructor(e, t, s) {
    if (Object.defineProperty(this, "type", { enumerable: true, configurable: true, writable: true, value: void 0 }), Object.defineProperty(this, "sampleHeader", { enumerable: true, configurable: true, writable: true, value: void 0 }), Object.defineProperty(this, "data", { enumerable: true, configurable: true, writable: true, value: void 0 }), !mi.has(e)) throw new Error(`Invalid AudioDataType: ${e}`);
    this.type = e, this.sampleHeader = t, this.data = s;
  }
  decodePCM(e) {
    let { type: t } = this;
    if (t === "pcm16") {
      let r = e.byteLength / 2, n = new Float32Array(r), o = new Int16Array(e.buffer, e.byteOffset, e.byteLength / 2);
      for (let a = 0; a < r; a++) n[a] = o[a] / 32768;
      return n;
    } else {
      let r = e.byteLength / 3, n = new Float32Array(r);
      for (let o = 0; o < r; o++) {
        let a = o * 3, c = e[a] | e[a + 1] << 8 | e[a + 2] << 16;
        c & 8388608 && (c |= 4278190080), n[o] = c / 8388608;
      }
      return n;
    }
  }
};
function cn(i22, e = {}) {
  let t = on(i22, 0, i22.length, e);
  if (t.length !== 1) throw new Error("wrong chunk length");
  let s = t[0];
  if (s === null) throw new Error("chunk not found");
  function r(c, l, u = {}) {
    let h = mr(c, l, "RIFF", "sfbk", u);
    if (h.length !== 3) throw new Error("invalid sfbk structure");
    let f = bi(h[0], l), d = f.version.major === 3;
    return d && h[2].type !== "LIST" && (h[2] = nn(l, h[2].offset - 9, false)), { info: f, samplingData: gi(h[1], l), ...n(h[2], l, d) };
  }
  function n(c, l, u) {
    let h = mr(c, l, "LIST", "pdta");
    if (h.length !== 9) throw new Error("invalid pdta chunk");
    return { presetHeaders: yi(h[0], l), presetZone: vi(h[1], l), presetModulators: wi(h[2], l), presetGenerators: Pi(h[3], l), instruments: Si(h[4], l), instrumentZone: xi(h[5], l), instrumentModulators: Mi(h[6], l), instrumentGenerators: Ci(h[7], l), sampleHeaders: Ti(h[8], l, u) };
  }
  let o = r(s, i22, e), a = o.info.version.major === 3;
  return { ...o, samples: Fi(o.sampleHeaders, o.samplingData.offsetMSB, o.samplingData.offsetLSB, i22, a) };
}
function mr(i22, e, t, s, r = {}) {
  if (i22.type !== t) throw new Error("invalid chunk type:" + i22.type);
  let n = new Be(e, i22.offset), o = n.readString(4);
  if (o !== s) throw new Error("invalid signature:" + o);
  return on(e, n.offset, i22.size - 4, r);
}
function bi(i22, e) {
  let t = mr(i22, e, "LIST", "INFO");
  return ur.parse(e, t);
}
function gi(i22, e) {
  let t = mr(i22, e, "LIST", "sdta");
  return { offsetMSB: t[0].offset, offsetLSB: t[1]?.offset };
}
function qe(i22, e, t, s, r, n) {
  let o = [];
  if (i22.type !== t) throw new Error("invalid chunk type:" + i22.type);
  let a = new Be(e, i22.offset), c = i22.offset + i22.size;
  for (; a.offset < c; ) {
    let l = s.parse(a, n);
    if (r && r(l)) break;
    o.push(l);
  }
  return o;
}
var yi = (i22, e) => qe(i22, e, "phdr", hr, (t) => t.isEnd);
var vi = (i22, e) => qe(i22, e, "pbag", cs);
var Si = (i22, e) => qe(i22, e, "inst", dr, (t) => t.isEnd);
var xi = (i22, e) => qe(i22, e, "ibag", cs);
var wi = (i22, e) => qe(i22, e, "pmod", X);
var Mi = (i22, e) => qe(i22, e, "imod", X);
var Pi = (i22, e) => qe(i22, e, "pgen", ls, (t) => t.isEnd);
var Ci = (i22, e) => qe(i22, e, "igen", ls);
var Ti = (i22, e, t) => qe(i22, e, "shdr", fr, (s) => s.isEnd, t);
function Fi(i22, e, t, s, r) {
  let n = new Array(i22.length), o = r ? 1 : 2, a = r ? "compressed" : t ? "pcm24" : "pcm16";
  for (let c = 0; c < i22.length; c++) {
    let { start: l, end: u } = i22[c], h = e + l * o, f = e + u * o, d = s.subarray(h, f);
    n[c] = new pr(a, i22[c], d);
  }
  return n;
}
var eo = /* @__PURE__ */ new Map();
for (let i22 = 0; i22 < Ee.length; i22++) eo.set(Ee[i22], i22);
var Ei = ["instrument", "sampleID"];
var to = ["keyRange", "velRange"];
var so = ["keynum", "velocity"];
var ro = ["startAddrsOffset", "endAddrsOffset", "startloopAddrsOffset", "endloopAddrsOffset", "startAddrsCoarseOffset", "endAddrsCoarseOffset", "startloopAddrsCoarseOffset", "endloopAddrsCoarseOffset", "sampleModes", "exclusiveClass", "overridingRootKey"];
var Jn = [...ro, ...so];
var no = /* @__PURE__ */ new Set();
for (let i22 = 0; i22 < Jn.length; i22++) {
  let e = Jn[i22], t = eo.get(e);
  t !== void 0 && no.add(t);
}
function oo(i22) {
  let e = {}, t = Object.keys(i22);
  for (let s of t) {
    let r = i22[s];
    if (us(s)) e[s] = r;
    else {
      let n = r;
      e[s] = n.clamp(n.defaultValue);
    }
  }
  return e;
}
var Zn = [["keynum", "keyRange"], ["velocity", "velRange"]];
var ki = new Set(to);
function us(i22) {
  return ki.has(i22);
}
var Di = /* @__PURE__ */ new Set([...Ei, ...to, ...so, ...ro]);
function Ii() {
  let i22 = [], e = Ee.length;
  for (let t = 0; t < e; t++) {
    let s = Ee[t];
    s !== void 0 && !Di.has(s) && i22.push(s);
  }
  return i22;
}
var gr = Ii();
var Hi = new Set(gr);
function ln(i22) {
  return Hi.has(i22);
}
function io(i22) {
  let e = {};
  for (let t = 0; t < i22.length; t++) {
    let s = i22[t], r = s.type;
    if (r !== void 0 && !no.has(s.code)) if (us(r)) e[r] = s.value;
    else {
      let n = r;
      e[n] = s.value;
    }
  }
  return e;
}
function ao(i22) {
  let e = {};
  for (let t = 0; t < i22.length; t++) {
    let s = i22[t], r = s.type;
    if (r !== void 0) if (us(r)) e[r] = s.value;
    else {
      let n = r;
      e[n] = s.value;
    }
  }
  for (let t = 0; t < Zn.length; t++) {
    let [s, r] = Zn[t], n = e[s];
    n !== void 0 && (e[r] = new xt(n, n));
  }
  return e;
}
var Lt = -32768;
var Ut = 32767;
var Yn = 0;
var br = 65535;
var yr = { startAddrsOffset: new w(0, 0, Ut), endAddrsOffset: new w(Lt, 0, 0), startloopAddrsOffset: new w(Lt, 0, Ut), endloopAddrsOffset: new w(Lt, 0, Ut), startAddrsCoarseOffset: new w(0, 0, Ut), modLfoToPitch: new w(-12e3, 0, 12e3), vibLfoToPitch: new w(-12e3, 0, 12e3), modEnvToPitch: new w(-12e3, 0, 12e3), initialFilterFc: new w(1500, 13500, 13500), initialFilterQ: new w(0, 0, 960), modLfoToFilterFc: new w(-12e3, 0, 12e3), modEnvToFilterFc: new w(-12e3, 0, 12e3), endAddrsCoarseOffset: new w(Lt, 0, 0), modLfoToVolume: new w(-960, 0, 960), chorusEffectsSend: new w(0, 0, 1e3), reverbEffectsSend: new w(0, 0, 1e3), pan: new w(-500, 0, 500), delayModLFO: new w(-12e3, -12e3, 5e3), freqModLFO: new w(-16e3, 0, 4500), delayVibLFO: new w(-12e3, -12e3, 5e3), freqVibLFO: new w(-16e3, 0, 4500), delayModEnv: new w(-12e3, -12e3, 5e3), attackModEnv: new w(-12e3, -12e3, 8e3), holdModEnv: new w(-12e3, -12e3, 5e3), decayModEnv: new w(-12e3, -12e3, 8e3), sustainModEnv: new w(0, 0, 1e3), releaseModEnv: new w(-12e3, -12e3, 8e3), keynumToModEnvHold: new w(-1200, 0, 1200), keynumToModEnvDecay: new w(-1200, 0, 1200), delayVolEnv: new w(-12e3, -12e3, 5e3), attackVolEnv: new w(-12e3, -12e3, 8e3), holdVolEnv: new w(-12e3, -12e3, 5e3), decayVolEnv: new w(-12e3, -12e3, 8e3), sustainVolEnv: new w(0, 0, 1440), releaseVolEnv: new w(-12e3, -12e3, 8e3), keynumToVolEnvHold: new w(-1200, 0, 1200), keynumToVolEnvDecay: new w(-1200, 0, 1200), instrument: new w(Yn, br, br), keyRange: new xt(0, 127), velRange: new xt(0, 127), startloopAddrsCoarseOffset: new w(Lt, 0, Ut), keynum: new w(-1, -1, 127), velocity: new w(-1, -1, 127), initialAttenuation: new w(0, 0, 1440), endloopAddrsCoarseOffset: new w(Lt, 0, Ut), coarseTune: new w(-120, 0, 120), fineTune: new w(-99, 0, 99), sampleID: new w(Yn, br, br), sampleModes: new w(0, 0, 3), scaleTuning: new w(0, 100, 100), exclusiveClass: new w(0, 0, 127), overridingRootKey: new w(-1, -1, 127) };
function Se(i22) {
  return Math.pow(2, i22 / 1200);
}
var vr = class {
  constructor(e, t, s, r, n) {
    Object.defineProperty(this, "key", { enumerable: true, configurable: true, writable: true, value: e }), Object.defineProperty(this, "generators", { enumerable: true, configurable: true, writable: true, value: t }), Object.defineProperty(this, "modulators", { enumerable: true, configurable: true, writable: true, value: s }), Object.defineProperty(this, "sample", { enumerable: true, configurable: true, writable: true, value: r }), Object.defineProperty(this, "sampleHeader", { enumerable: true, configurable: true, writable: true, value: n }), Object.defineProperty(this, "controllerToDestinations", { enumerable: true, configurable: true, writable: true, value: /* @__PURE__ */ new Map() }), Object.defineProperty(this, "destinationToModulators", { enumerable: true, configurable: true, writable: true, value: /* @__PURE__ */ new Map() }), Object.defineProperty(this, "voiceHandlers", { enumerable: true, configurable: true, writable: true, value: { modLfoToPitch: (o, a) => {
      o.modLfoToPitch = this.clamp("modLfoToPitch", a);
    }, vibLfoToPitch: (o, a) => {
      o.vibLfoToPitch = this.clamp("vibLfoToPitch", a);
    }, modEnvToPitch: (o, a) => {
      o.modEnvToPitch = this.clamp("modEnvToPitch", a);
    }, initialFilterFc: (o, a) => {
      o.initialFilterFc = this.clamp("initialFilterFc", a);
    }, initialFilterQ: (o, a) => {
      o.initialFilterQ = this.clamp("initialFilterQ", a);
    }, modLfoToFilterFc: (o, a) => {
      o.modLfoToFilterFc = this.clamp("modLfoToFilterFc", a);
    }, modEnvToFilterFc: (o, a) => {
      o.modEnvToFilterFc = this.clamp("modEnvToFilterFc", a);
    }, modLfoToVolume: (o, a) => {
      o.modLfoToVolume = this.clamp("modLfoToVolume", a);
    }, chorusEffectsSend: (o, a) => {
      o.chorusEffectsSend = this.clamp("chorusEffectsSend", a) / 1e3;
    }, reverbEffectsSend: (o, a) => {
      o.reverbEffectsSend = this.clamp("reverbEffectsSend", a) / 1e3;
    }, pan: (o, a) => {
      o.pan = this.clamp("pan", a) / 1e3;
    }, delayModLFO: (o, a) => {
      o.delayModLFO = Se(this.clamp("delayModLFO", a));
    }, freqModLFO: (o, a) => {
      o.freqModLFO = this.clamp("freqModLFO", a);
    }, delayVibLFO: (o, a) => {
      o.delayVibLFO = Se(this.clamp("delayVibLFO", a));
    }, freqVibLFO: (o, a) => {
      o.freqVibLFO = this.clamp("freqVibLFO", a);
    }, delayModEnv: (o, a) => {
      o.modDelay = Se(this.clamp("delayModEnv", a));
    }, attackModEnv: (o, a) => {
      o.modAttack = Se(this.clamp("attackModEnv", a));
    }, holdModEnv: (o, a) => {
      let c = this.clamp("holdModEnv", a), l = this.clamp("keynumToModEnvHold", a);
      o.modHold = this.getModHold(c, l);
    }, decayModEnv: (o, a) => {
      let c = this.clamp("decayModEnv", a), l = this.clamp("keynumToModEnvDecay", a);
      o.modDecay = this.getModDecay(c, l);
    }, sustainModEnv: (o, a) => {
      o.modSustain = this.clamp("sustainModEnv", a) / 1e3;
    }, releaseModEnv: (o, a) => {
      o.modRelease = Se(this.clamp("releaseModEnv", a));
    }, keynumToModEnvHold: (o, a) => {
      let c = this.clamp("holdModEnv", a), l = this.clamp("keynumToModEnvHold", a);
      o.modHold = this.getModHold(c, l);
    }, keynumToModEnvDecay: (o, a) => {
      let c = this.clamp("decayModEnv", a), l = this.clamp("keynumToModEnvDecay", a);
      o.modDecay = this.getModDecay(c, l);
    }, delayVolEnv: (o, a) => {
      o.volDelay = Se(this.clamp("delayVolEnv", a));
    }, attackVolEnv: (o, a) => {
      o.volAttack = Se(this.clamp("attackVolEnv", a));
    }, holdVolEnv: (o, a) => {
      let c = this.clamp("holdVolEnv", a), l = this.clamp("keynumToVolEnvHold", a);
      o.volHold = this.getVolHold(c, l);
    }, decayVolEnv: (o, a) => {
      let c = this.clamp("decayVolEnv", a), l = this.clamp("keynumToVolEnvDecay", a);
      o.volDecay = this.getVolDecay(c, l);
    }, sustainVolEnv: (o, a) => {
      o.volSustain = this.clamp("sustainVolEnv", a) / 1e3;
    }, releaseVolEnv: (o, a) => {
      o.volRelease = Se(this.clamp("releaseVolEnv", a));
    }, keynumToVolEnvHold: (o, a) => {
      let c = this.clamp("holdVolEnv", a), l = this.clamp("keynumToVolEnvHold", a);
      o.modHold = this.getVolHold(c, l);
    }, keynumToVolEnvDecay: (o, a) => {
      let c = this.clamp("decayVolEnv", a), l = this.clamp("keynumToVolEnvDecay", a);
      o.modDecay = this.getVolDecay(c, l);
    }, initialAttenuation: (o, a) => {
      o.initialAttenuation = this.clamp("initialAttenuation", a);
    }, coarseTune: (o, a) => {
      o.detune = this.getDetune(a);
    }, fineTune: (o, a) => {
      o.detune = this.getDetune(a);
    }, scaleTuning: (o, a) => {
      o.playbackRate = this.getPlaybackRate(a);
    } } }), this.setControllerToDestinations(), this.setDestinationToModulators();
  }
  setControllerToDestinations() {
    for (let e = 0; e < this.modulators.length; e++) {
      let t = this.modulators[e], s = t.sourceOper.controllerType, r = t.destinationOper, n = this.controllerToDestinations.get(s);
      n ? n.add(t.destinationOper) : this.controllerToDestinations.set(s, /* @__PURE__ */ new Set([r]));
    }
  }
  setDestinationToModulators() {
    for (let e = 0; e < this.modulators.length; e++) {
      let t = this.modulators[e], s = t.destinationOper, r = this.destinationToModulators.get(s);
      r ? r.push(t) : this.destinationToModulators.set(s, [t]);
    }
  }
  getModHold(e, t) {
    return Se(e + (this.key - 60) * t);
  }
  getModDecay(e, t) {
    return Se(e + (this.key - 60) * t);
  }
  getVolHold(e, t) {
    return Se(e + (this.key - 60) * t);
  }
  getVolDecay(e, t) {
    return Se(e + (this.key - 60) * t);
  }
  getPlaybackRate(e) {
    let t = this.clamp("overridingRootKey", e), s = this.clamp("scaleTuning", e), r = t === -1 ? this.sampleHeader.originalPitch : t;
    return Math.pow(2, (this.key - r) * s / 1200);
  }
  getDetune(e) {
    let t = this.clamp("coarseTune", e) * 100, s = this.clamp("fineTune", e), r = this.sampleHeader.pitchCorrection;
    return t + s + r;
  }
  transformParams(e, t) {
    let s = {}, r = this.controllerToDestinations.get(e);
    if (!r) return s;
    for (let n of r) {
      let o = Ee[n];
      if (!o || !ln(o)) continue;
      let a = this.destinationToModulators.get(n);
      if (a) {
        s[o] = this.generators[o];
        for (let c of a) {
          let l = c.sourceOper, u = l.map(t[l.controllerType]), h = 1, f = c.amountSourceOper;
          if (!(f.cc === 0 && f.index === 0)) {
            let p = t[f.controllerType];
            h = f.map(p);
          }
          let d = c.transform(u * h);
          Number.isNaN(d) || (s[o] += d);
        }
      }
    }
    return s;
  }
  transformAllParams(e) {
    let t = structuredClone(this.generators);
    for (let s of this.modulators) {
      let r = s.sourceOper.controllerType, n = e[r];
      if (!n) continue;
      let o = Ee[s.destinationOper];
      if (!o || !ln(o)) continue;
      let c = s.sourceOper.map(n), l = 1, u = s.amountSourceOper;
      if (!(u.cc === 0 && u.index === 0)) {
        let f = e[u.controllerType];
        l = u.map(f);
      }
      let h = s.transform(c * l);
      Number.isNaN(h) || (t[o] += h);
    }
    return t;
  }
  clamp(e, t) {
    return yr[e].clamp(t[e]);
  }
  getParams(e, t) {
    let s = {}, r = structuredClone(this.generators), n = this.transformParams(e, t), o = Object.keys(n);
    for (let a of o) r[a] = n[a];
    for (let a of o) this.voiceHandlers[a](s, r);
    return s;
  }
  getAllParams(e) {
    let t = { start: this.generators.startAddrsCoarseOffset * 32768 + this.generators.startAddrsOffset, end: this.generators.endAddrsCoarseOffset * 32768 + this.generators.endAddrsOffset, loopStart: this.sampleHeader.loopStart + this.generators.startloopAddrsCoarseOffset * 32768 + this.generators.startloopAddrsOffset, loopEnd: this.sampleHeader.loopEnd + this.generators.endloopAddrsCoarseOffset * 32768 + this.generators.endloopAddrsOffset, instrument: this.generators.instrument, sampleID: this.generators.sampleID, sample: this.sample, sampleRate: this.sampleHeader.sampleRate, sampleName: this.sampleHeader.sampleName, sampleModes: this.generators.sampleModes, exclusiveClass: this.clamp("exclusiveClass", this.generators) }, s = this.transformAllParams(e);
    for (let r = 0; r < gr.length; r++) {
      let n = gr[r];
      this.voiceHandlers[n](t, s);
    }
    return t;
  }
};
var co = [new X(_.parse(1282), 48, 960, _.parse(0), 0), new X(_.parse(258), 8, -2400, _.parse(0), 0), new X(_.parse(13), 6, 50, _.parse(0), 0), new X(_.parse(129), 6, 50, _.parse(0), 0), new X(_.parse(1415), 48, 960, _.parse(0), 0), new X(_.parse(650), 48, 1, _.parse(0), 0), new X(_.parse(1419), 48, 960, _.parse(0), 0), new X(_.parse(219), 16, 0.2, _.parse(0), 0), new X(_.parse(221), 15, 0.2, _.parse(0), 0), new X(_.parse(526), 51, 127, _.parse(16), 0)];
var Sr = class {
  constructor(e, t) {
    Object.defineProperty(this, "generators", { enumerable: true, configurable: true, writable: true, value: e }), Object.defineProperty(this, "modulators", { enumerable: true, configurable: true, writable: true, value: t });
  }
};
var xr = class {
  constructor(e, t) {
    Object.defineProperty(this, "generators", { enumerable: true, configurable: true, writable: true, value: e }), Object.defineProperty(this, "modulators", { enumerable: true, configurable: true, writable: true, value: t });
  }
};
var hs = class {
  constructor(e) {
    Object.defineProperty(this, "parsed", { enumerable: true, configurable: true, writable: true, value: e });
  }
  getGeneratorParams(e, t, s, r) {
    let n = new Array(r - s);
    for (let o = s; o < r; o++) {
      let a = t[o].generatorIndex, c = t[o + 1].generatorIndex;
      n[o - s] = e.slice(a, c);
    }
    return n;
  }
  getPresetGenerators(e) {
    let t = this.parsed.presetHeaders[e], s = this.parsed.presetHeaders[e + 1], r = s ? s.presetBagIndex : this.parsed.presetZone.length - 1;
    return this.getGeneratorParams(this.parsed.presetGenerators, this.parsed.presetZone, t.presetBagIndex, r);
  }
  getInstrumentGenerators(e) {
    let t = this.parsed.instruments[e], s = this.parsed.instruments[e + 1], r = s ? s.instrumentBagIndex : this.parsed.instrumentZone.length - 1;
    return this.getGeneratorParams(this.parsed.instrumentGenerators, this.parsed.instrumentZone, t.instrumentBagIndex, r);
  }
  getModulators(e, t, s, r) {
    let n = new Array(r - s);
    for (let o = s; o < r; o++) {
      let a = t[o].modulatorIndex, c = t[o + 1].modulatorIndex;
      n[o - s] = e.slice(a, c);
    }
    return n;
  }
  getPresetModulators(e) {
    let t = this.parsed.presetHeaders[e], s = this.parsed.presetHeaders[e + 1], r = s ? s.presetBagIndex : this.parsed.presetZone.length - 1;
    return this.getModulators(this.parsed.presetModulators, this.parsed.presetZone, t.presetBagIndex, r);
  }
  getInstrumentModulators(e) {
    let t = this.parsed.instruments[e], s = this.parsed.instruments[e + 1], r = s ? s.instrumentBagIndex : this.parsed.instrumentZone.length - 1;
    return this.getModulators(this.parsed.instrumentModulators, this.parsed.instrumentZone, t.instrumentBagIndex, r);
  }
  findInstrumentZone(e, t, s) {
    let r = this.getInstrumentGenerators(e), n = this.getInstrumentModulators(e), o, a = [];
    for (let c = 0; c < r.length; c++) {
      let l = ao(r[c]);
      if (l.sampleID === void 0) {
        o = l, a = n[c];
        continue;
      }
      if (!(l.keyRange && !l.keyRange.in(t)) && !(l.velRange && !l.velRange.in(s))) if (o) {
        let u = { ...o, ...l }, h = [...a, ...n[c]];
        return new Sr(u, h);
      } else return new Sr(l, n[c]);
    }
  }
  findInstrument(e, t, s) {
    let r = this.getPresetGenerators(e), n = this.getPresetModulators(e), o, a = [];
    for (let c = 0; c < r.length; c++) {
      let l = io(r[c]);
      if (l.instrument === void 0) {
        o = l, a = n[c];
        continue;
      }
      if (l.keyRange && !l.keyRange.in(t) || l.velRange && !l.velRange.in(s)) continue;
      let u = this.findInstrumentZone(l.instrument, t, s);
      if (u) if (o) {
        let h = { ...o, ...l }, f = [...a, ...n[c]], d = new xr(h, f);
        return this.createVoice(t, d, u);
      } else {
        let h = new xr(l, n[c]);
        return this.createVoice(t, h, u);
      }
    }
    return null;
  }
  createVoice(e, t, s) {
    let r = oo(yr);
    Object.assign(r, s.generators);
    let n = Object.keys(t.generators);
    for (let u = 0; u < n.length; u++) {
      let h = n[u];
      us(h) || (r[h] += t.generators[h]);
    }
    let o = [...co, ...t.modulators, ...s.modulators], a = r.sampleID, c = this.parsed.samples[a], l = this.parsed.sampleHeaders[a];
    return new vr(e, r, o, c, l);
  }
  getVoice(e, t, s, r) {
    let n = this.parsed.presetHeaders.findIndex((a) => a.preset === t && a.bank === e);
    if (n < 0) return console.warn("preset not found: bank=%s instrument=%s", e, t), null;
    let o = this.findInstrument(n, s, r);
    return o || (console.warn("instrument not found: bank=%s instrument=%s", e, t), null);
  }
  getPresetNames() {
    let e = {}, t = this.parsed.presetHeaders;
    for (let s = 0; s < t.length; s++) {
      let r = t[s];
      e[r.bank] || (e[r.bank] = {}), e[r.bank][r.preset] = r.presetName;
    }
    return e;
  }
};
var Ni = (i22, e = 4294967295, t = 79764919) => {
  let s = new Int32Array(256), r, n, o, a = e;
  for (r = 0; r < 256; r++) {
    for (o = r << 24, n = 8; n > 0; --n) o = 2147483648 & o ? o << 1 ^ t : o << 1;
    s[r] = o;
  }
  for (r = 0; r < i22.length; r++) a = a << 8 ^ s[255 & (a >> 24 ^ i22[r])];
  return a;
};
var un = (i22, e = Ni) => {
  let t = (m) => new Uint8Array(m.length / 2).map(((b, v) => parseInt(m.substring(2 * v, 2 * (v + 1)), 16))), s = (m) => t(m)[0], r = /* @__PURE__ */ new Map();
  [, 8364, , 8218, 402, 8222, 8230, 8224, 8225, 710, 8240, 352, 8249, 338, , 381, , , 8216, 8217, 8220, 8221, 8226, 8211, 8212, 732, 8482, 353, 8250, 339, , 382, 376].forEach(((m, b) => r.set(m, b)));
  let n = new Uint8Array(i22.length), o, a, c, l = false, u = 0, h = 42, f = i22.length > 13 && i22.substring(0, 9) === "dynEncode", d = 0;
  f && (d = 11, a = s(i22.substring(9, d)), a <= 1 && (d += 2, h = s(i22.substring(11, d))), a === 1 && (d += 8, c = ((m) => new DataView(t(m).buffer).getInt32(0, true))(i22.substring(13, d))));
  let p = 256 - h;
  for (let m = d; m < i22.length; m++) if (o = i22.charCodeAt(m), o !== 61 || l) {
    if (o === 92 && m < i22.length - 5 && f) {
      let b = i22.charCodeAt(m + 1);
      b !== 117 && b !== 85 || (o = parseInt(i22.substring(m + 2, m + 6), 16), m += 5);
    }
    if (o > 255) {
      let b = r.get(o);
      b && (o = b + 127);
    }
    l && (l = false, o -= 64), n[u++] = o < h && o > 0 ? o + p : o - h;
  } else l = true;
  let y = n.subarray(0, u);
  if (f && a === 1) {
    let m = e(y);
    if (m !== c) {
      let b = "Decode failed crc32 validation";
      throw console.error("`simple-yenc`\n", b + `
`, "Expected: " + c + "; Got: " + m + `
`, "Visit https://github.com/eshaz/simple-yenc for more information"), Error(b);
    }
  }
  return y;
};
function U() {
  let i22 = Uint8Array, e = Float32Array;
  U.modules || Object.defineProperties(U, { modules: { value: /* @__PURE__ */ new WeakMap() }, setModule: { value(t, s) {
    U.modules.set(t, Promise.resolve(s));
  } }, getModule: { value(t, s) {
    let r = U.modules.get(t);
    return r || (s ? r = WebAssembly.compile(un(s)) : (s = t.wasm, r = U.inflateDynEncodeString(s).then((n) => WebAssembly.compile(n))), U.modules.set(t, r)), r;
  } }, concatFloat32: { value(t, s) {
    let r = new e(s), n = 0, o = 0;
    for (; n < t.length; ) r.set(t[n], o), o += t[n++].length;
    return r;
  } }, getDecodedAudio: { value: (t, s, r, n, o) => ({ errors: t, channelData: s, samplesDecoded: r, sampleRate: n, bitDepth: o }) }, getDecodedAudioMultiChannel: { value(t, s, r, n, o, a) {
    let c = [], l, u;
    for (l = 0; l < r; l++) {
      let h = [];
      for (u = 0; u < s.length; ) h.push(s[u++][l] || []);
      c.push(U.concatFloat32(h, n));
    }
    return U.getDecodedAudio(t, c, n, o, a);
  } }, inflateDynEncodeString: { value(t) {
    return t = un(t), new Promise((s) => {
      let r = String.raw`dynEncode012804c7886d()((()>+*§§)§,§§§§)§+§§§)§+.-()(*)-+)(.7*§)i¸¸,3§(i¸¸,3/G+.¡*(,(,3+)2å:-),§H(P*DI*H(P*@I++hH)H*r,hH(H(P*<J,i)^*<H,H(P*4U((I-H(H*i0J,^*DH+H-H*I+H,I*4)33H(H*H)^*DH(H+H)^*@H+i§H)i§3æ*).§K(iHI/+§H,iHn,§H+i(H+i(rCJ0I,H*I-+hH,,hH(H-V)(i)J.H.W)(i)c)(H,i)I,H-i*I-4)33i(I.*hH(V)(H+n5(H(i*I-i(I,i)I.+hH,i*J+iHn,hi(I-i*I,+hH,H/H-c)(H,iFn,hi(I,+hH,H0n5-H*V)(J(,hH/H(i)J(H(V)(J(i)c)(H)H(i)H,c)(3H*i*I*H,i)I,4(3(-H(H,W)(H-I-H,i*I,4)3(3(3H,H-I1H+I,H.i)H1V)(J.i(v5(33H.-H(H,i(c)(H,i*I,4)333)-§i*I*+§H*iHn,hi73H,H(i)8(H+J+H)P*(H*V)(J-r,§H)P*,H.i)H+H,i)V)(-H*i*I*H+i)I+H-H.I.H,H-i)I,4)333Ã+)-§iø7i(^*(iü7I,*h+hH+iDn,h*hilI+i)I,+hH+,hH+iô7H,c)(i)H+i´8W)(H,I,H+i*I+4)-+hH(H)8*J-i(p5.*h*h*hH-i')u,hH(P*(J+,hH(P*0J,H(P*,n50H+H,H-b((3H(P*0i)I.4)3H-i¨*n5*H-iÅ*s,hi73H-i)J+V)&+I,H(H+V)æ,8(I.H(H*8*J-i(p51H-i)J+i¸7V)(H(H+iø7V)(8(J/H(P*0J+s,hi73H+H,H.J,I.H(P*(m5(H.H(P*,s5.+hH,m5*H(P*(J.H+H.H+H/U((b((H(H(P*0i)J+^*0H,i)I,4(3(3H(H.^*03H-i¨*o5)33i(73(3(3-H,H+i)c)(H,i*I,H+i)I+4)33i)I-3H-3!2)0§K(i2J,L(H,H(^*(H,H*^*4H,i(^*0H,i(^*DH,j(_*<H,H)P*(^*,H,H+P*(^*8*h*h+hH,i)8(I3i§I**h*h*h*h*h*h*hH,i*8(6+(),03H,j(_*@i*I-H,P*<J.i,J(H,P*8J/s50H,H.i+J0^*<i¦I*H.H,P*4J1J.U(*H.U((J2i')o5/H.U()I.H,H(^*<H0H1U((H.i0J.i§i0i')o5/H/H.H2J*H(J.q50H,P*0J/H*I-H,P*(J0,hH,P*,H-q,hi)I-423+hH*m5+H/H0H(H1U((b((H/i)I/H(i)I(H*i)I*4(3(3H,H.^*<H,H-^*04*3iØ1U((5+i(I(i¨7i1^*(i$6iè1^*(i°7iè6^*(i¬7iÈ6^*(+hH(iÈ*n,hiÈ*I(+hH(i¨,n,hi¨,I(+hH(iØ,n,hiØ,I(+hH(iè,o,hH,i-H(i0c)(H(i*I(4)33iè1i1H,i-iÈ*8)Bi(I(+hH(ido,hH,i-H(i-c)(H(i*I(4)33iÈ6iè6H,i-iF8)BiØ1i)b((41-H,i-H(i/c)(H(i*I(4)3(3(-H,i-H(i1c)(H(i*I(4)3(3(-H,i-H(i0c)(H(i*I(4)3(3(3H,H/^*0H,H(^*<3i(I*4*3H,H,i¸)^*TH,H,iø-^*PH,H,iX^*LH,H,i(^*HH,i-8(I(H,i-8(I-i¥I*H,i,8(I.H(iErH-iEr5)H(i©*I1H-i)I0i(i;H.i,J(i(H(i(rCJ(J*H*i;sCI*i¨1I-H(I/+hH/,hH,i-H-V)(i)H,i+8(c)(H/i)I/H-i*I-H*i)I*4)-H(i)i¨1I/+hH(H*o,hH,i-H/V)(i)i(c)(H/i*I/H(i)I(4)33i¤I*H,iø-H,i¸)H,i-i;8)5+H0H1I2i(I-+hH-H2p,hH,H,iP8*J*i(p5-H*i7u,hH,i-H-i)H*c)(H-i)I-4*3i(I/i+I.i+I(*h*h*hH*i86*(*)3H-m,hi£I*403H-i)H,W)-I/i*I(4)3i3I.i/I(3H2H,H(8(H.J(H-J.p,hi¢I*4.3H,i-H-i)I*+hH(,hH*H/c)(H*i*I*H(i)I(4)-H.I-4+3(3(33H,W)1m,hiI*4,3H,iø-H,i¸)H,i-H18)J(,hi¡I*H(i(p5,H1H,V)ú-H,V)ø-o5,3H,i(H,iXH,i-H1i)H08)J(,hi I*H(i(p5,H0H,V)H,V)o5,3H,H,iPH,iH8+I*4+3(3(3H,i$6i¬78+I*3H*H3m5(3i)I-H*i(r5)3H)H,P*0^*(H+H,P*<^*(H*I-3H,i2L(H-33Á)+(i¨03b+(,(-(.(/(0(1(2(3(5(7(9(;(?(C(G(K(S([(c(k({(((«(Ë(ë((*)(iø03O)()()()(*(*(*(*(+(+(+(+(,(,(,(,(-(-(-(-(i¨13M8(9(:(((0(/(1(.(2(-(3(,(4(+(5(*(6()(7(T7*S7US0U `;
      U.getModule(U, r).then((n) => WebAssembly.instantiate(n, {})).then(({ exports: n }) => {
        let o = new Map(Object.entries(n)), a = o.get("puff"), c = o.get("memory").buffer, l = new i22(c), u = new DataView(c), h = o.get("__heap_base"), f = t.length, d = h;
        h += 4, u.setInt32(d, f, true);
        let p = h;
        h += f, l.set(t, p);
        let y = h;
        h += 4, u.setInt32(y, l.byteLength - h, true), a(h, y, p, d), s(l.slice(h, h + u.getInt32(y, true)));
      });
    });
  } } }), Object.defineProperty(this, "wasm", { enumerable: true, get: () => this._wasm }), this.getOutputChannels = (t, s, r) => {
    let n = [], o = 0;
    for (; o < s; ) n.push(t.slice(o * r, o++ * r + r));
    return n;
  }, this.allocateTypedArray = (t, s, r = true) => {
    let n = this._wasm.malloc(s.BYTES_PER_ELEMENT * t);
    return r && this._pointers.add(n), { ptr: n, len: t, buf: new s(this._wasm.HEAP, n, t) };
  }, this.free = () => {
    this._pointers.forEach((t) => {
      this._wasm.free(t);
    }), this._pointers.clear();
  }, this.codeToString = (t) => {
    let s = [], r = new Uint8Array(this._wasm.HEAP);
    for (let n = r[t]; n !== 0; n = r[++t]) s.push(n);
    return String.fromCharCode.apply(null, s);
  }, this.addError = (t, s, r, n, o, a) => {
    t.push({ message: s, frameLength: r, frameNumber: n, inputBytes: o, outputSamples: a });
  }, this.instantiate = (t, s) => (s && U.setModule(t, s), this._wasm = new t(U).instantiate(), this._pointers = /* @__PURE__ */ new Set(), this._wasm.ready.then(() => this));
}
var ho = Kn(uo(), 1);
var Vi = () => globalThis.Worker || ho.default;
var Gt = class extends Vi() {
  constructor(e, t, s, r) {
    U.modules || new U();
    let n = U.modules.get(s);
    if (!n) {
      let o = "text/javascript", a, c = `'use strict';(${((l, u, h) => {
        let f, d, p = new Promise((y) => {
          d = y;
        });
        self.onmessage = ({ data: { id: y, command: m, data: b } }) => {
          let v = p, S = { id: y }, M;
          m === "init" ? (Object.defineProperties(l, { WASMAudioDecoderCommon: { value: u }, EmscriptenWASM: { value: h }, module: { value: b.module }, isWebWorker: { value: true } }), f = new l(b.options), d()) : m === "free" ? f.free() : m === "ready" ? v = v.then(() => f.ready) : m === "reset" ? v = v.then(() => f.reset()) : (Object.assign(S, f[m](Array.isArray(b) ? b.map((x) => new Uint8Array(x)) : new Uint8Array(b))), M = S.channelData ? S.channelData.map((x) => x.buffer) : []), v.then(() => self.postMessage(S, M));
        };
      }).toString()})(${s}, ${U}, ${r})`;
      try {
        a = typeof process.versions.node < "u";
      } catch {
      }
      n = a ? `data:${o};base64,${Buffer.from(c).toString("base64")}` : URL.createObjectURL(new Blob([c], { type: o })), U.modules.set(s, n);
    }
    super(n, { name: t }), this._id = Number.MIN_SAFE_INTEGER, this._enqueuedOperations = /* @__PURE__ */ new Map(), this.onmessage = ({ data: o }) => {
      let { id: a, ...c } = o;
      this._enqueuedOperations.get(a)(c), this._enqueuedOperations.delete(a);
    }, new r(U).getModule().then((o) => {
      this.postToDecoder("init", { module: o, options: e });
    });
  }
  async postToDecoder(e, t) {
    return new Promise((s) => {
      this.postMessage({ command: e, id: this._id, data: t }), this._enqueuedOperations.set(this._id++, s);
    });
  }
  get ready() {
    return this.postToDecoder("ready");
  }
  async free() {
    await this.postToDecoder("free").finally(() => {
      this.terminate();
    });
  }
  async reset() {
    await this.postToDecoder("reset");
  }
};
var wr = (i22, e) => {
  Object.defineProperty(i22, "name", { value: e });
};
var G = Symbol;
var fo = ", ";
var F = (() => {
  let i22 = "front", e = "side", t = "rear", s = "left", r = "center", n = "right";
  return ["", i22 + " ", e + " ", t + " "].map((o) => [[s, n], [s, n, r], [s, r, n], [r, s, n], [r]].flatMap((a) => a.map((c) => o + c).join(fo)));
})();
var Ae = "LFE";
var st = "monophonic (mono)";
var rt = "stereo";
var ds = "surround";
var q = (i22, ...e) => `${[st, rt, `linear ${ds}`, "quadraphonic", `5.0 ${ds}`, `5.1 ${ds}`, `6.1 ${ds}`, `7.1 ${ds}`][i22 - 1]} (${e.join(fo)})`;
var fs = [st, q(2, F[0][0]), q(3, F[0][2]), q(4, F[1][0], F[3][0]), q(5, F[1][2], F[3][0]), q(6, F[1][2], F[3][0], Ae), q(7, F[1][2], F[2][0], F[3][4], Ae), q(8, F[1][2], F[2][0], F[3][0], Ae)];
var po = 192e3;
var mo = 176400;
var Mr = 96e3;
var Pr = 88200;
var bo = 64e3;
var nt = 48e3;
var jt = 44100;
var qt = 32e3;
var Kt = 24e3;
var Qt = 22050;
var Wt = 16e3;
var Cr = 12e3;
var Tr = 11025;
var zt = 8e3;
var go = 7350;
var ke = "absoluteGranulePosition";
var D = "bandwidth";
var te = "bitDepth";
var se = "bitrate";
var ps = se + "Maximum";
var ms = se + "Minimum";
var bs = se + "Nominal";
var _e = "buffer";
var gs = _e + "Fullness";
var R = "codec";
var re = R + "Frames";
var ys = "coupledStreamCount";
var $t = "crc";
var vs = $t + "16";
var Ss = $t + "32";
var O = "data";
var T = "description";
var Oe = "duration";
var Xt = "emphasis";
var xs = "hasOpusPadding";
var fe = "header";
var ot = "isContinuedPacket";
var ws = "isCopyrighted";
var it = "isFirstPage";
var Ms = "isHome";
var pe = "isLastPage";
var Ke = "isOriginal";
var Qe = "isPrivate";
var Ps = "isVbr";
var ue = "layer";
var g = "length";
var k = "mode";
var We = k + "Extension";
var Fr = "mpeg";
var ze = Fr + "Version";
var Cs = "numberAACFrames";
var Ts = "outputGain";
var wt = "preSkip";
var Fs = "profile";
var Er = G();
var $e = "protection";
var hn = "rawData";
var xe = "segments";
var I = "subarray";
var at = "version";
var Mt = "vorbis";
var Es = Mt + "Comments";
var Jt = Mt + "Setup";
var kr = "block";
var ks = kr + "ingStrategy";
var Dr = G();
var Xe = kr + "Size";
var ct = kr + "size0";
var lt = kr + "size1";
var Ds = G();
var Ir = "channel";
var Je = Ir + "MappingFamily";
var Is = Ir + "MappingTable";
var ne = Ir + "Mode";
var Hs = G();
var C = Ir + "s";
var yo = "copyright";
var Ns = yo + "Id";
var Vs = yo + "IdStart";
var Ze = "frame";
var Ye = Ze + "Count";
var he = Ze + "Length";
var Hr = "Number";
var et = Ze + Hr;
var Re = Ze + "Padding";
var E = Ze + "Size";
var vo = "Rate";
var Bs = "inputSample" + vo;
var dn = "page";
var Pt = dn + "Checksum";
var Zt = G();
var ut = dn + "SegmentTable";
var W = dn + "Sequence" + Hr;
var fn = "sample";
var As = fn + Hr;
var H = fn + vo;
var Le = G();
var N = fn + "s";
var Nr = "stream";
var _s = Nr + "Count";
var Os = Nr + "Info";
var Ue = Nr + "Serial" + Hr;
var pn = Nr + "StructureVersion";
var mn = "total";
var Ct = mn + "BytesOut";
var Tt = mn + "Duration";
var Ft = mn + "Samples";
var V = G();
var we = G();
var Rs = G();
var ht = G();
var De = G();
var Vr = G();
var bn = G();
var dt = G();
var B = G();
var Me = G();
var Pe = G();
var Ge = G();
var ft = G();
var Br = G();
var Ie = G();
var He = G();
var Ce = G();
var Ar = G();
var oe = Uint8Array;
var pt = DataView;
var A = "reserved";
var ie = "bad";
var Yt = "free";
var Ls = "none";
var _r = "16bit CRC";
var gn = (i22, e, t) => {
  for (let s = 0; s < i22[g]; s++) {
    let r = e(s);
    for (let n = 8; n > 0; n--) r = t(r);
    i22[s] = r;
  }
  return i22;
};
var Ai = gn(new oe(256), (i22) => i22, (i22) => i22 & 128 ? 7 ^ i22 << 1 : i22 << 1);
var K = [gn(new Uint16Array(256), (i22) => i22 << 8, (i22) => i22 << 1 ^ (i22 & 32768 ? 32773 : 0))];
var Q = [gn(new Uint32Array(256), (i22) => i22, (i22) => i22 >>> 1 ^ (i22 & 1) * 3988292384)];
for (let i22 = 0; i22 < 15; i22++) {
  K.push(new Uint16Array(256)), Q.push(new Uint32Array(256));
  for (let e = 0; e <= 255; e++) K[i22 + 1][e] = K[0][K[i22][e] >>> 8] ^ K[i22][e] << 8, Q[i22 + 1][e] = Q[i22][e] >>> 8 ^ Q[0][Q[i22][e] & 255];
}
var xo = (i22) => {
  let e = 0, t = i22[g];
  for (let s = 0; s !== t; s++) e = Ai[e ^ i22[s]];
  return e;
};
var wo = (i22) => {
  let e = i22[g], t = e - 16, s = 0, r = 0;
  for (; r <= t; ) s ^= i22[r++] << 8 | i22[r++], s = K[15][s >> 8] ^ K[14][s & 255] ^ K[13][i22[r++]] ^ K[12][i22[r++]] ^ K[11][i22[r++]] ^ K[10][i22[r++]] ^ K[9][i22[r++]] ^ K[8][i22[r++]] ^ K[7][i22[r++]] ^ K[6][i22[r++]] ^ K[5][i22[r++]] ^ K[4][i22[r++]] ^ K[3][i22[r++]] ^ K[2][i22[r++]] ^ K[1][i22[r++]] ^ K[0][i22[r++]];
  for (; r !== e; ) s = (s & 255) << 8 ^ K[0][s >> 8 ^ i22[r++]];
  return s;
};
var Mo = (i22) => {
  let e = i22[g], t = e - 16, s = 0, r = 0;
  for (; r <= t; ) s = Q[15][(i22[r++] ^ s) & 255] ^ Q[14][(i22[r++] ^ s >>> 8) & 255] ^ Q[13][(i22[r++] ^ s >>> 16) & 255] ^ Q[12][i22[r++] ^ s >>> 24] ^ Q[11][i22[r++]] ^ Q[10][i22[r++]] ^ Q[9][i22[r++]] ^ Q[8][i22[r++]] ^ Q[7][i22[r++]] ^ Q[6][i22[r++]] ^ Q[5][i22[r++]] ^ Q[4][i22[r++]] ^ Q[3][i22[r++]] ^ Q[2][i22[r++]] ^ Q[1][i22[r++]] ^ Q[0][i22[r++]];
  for (; r !== e; ) s = Q[0][(s ^ i22[r++]) & 255] ^ s >>> 8;
  return s ^ -1;
};
var Gs = (...i22) => {
  let e = new oe(i22.reduce((t, s) => t + s[g], 0));
  return i22.reduce((t, s) => (e.set(s, t), t + s[g]), 0), e;
};
var me = (i22) => String.fromCharCode(...i22);
var So = [0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15];
var Us = (i22) => So[i22 & 15] << 4 | So[i22 >> 4];
var Or = class {
  constructor(e) {
    this._data = e, this._pos = e[g] * 8;
  }
  set position(e) {
    this._pos = e;
  }
  get position() {
    return this._pos;
  }
  read(e) {
    let t = Math.floor(this._pos / 8), s = this._pos % 8;
    return this._pos -= e, (Us(this._data[t - 1]) << 8) + Us(this._data[t]) >> 7 - s & 255;
  }
};
var Po = (i22, e) => {
  try {
    return i22.getBigInt64(e, true);
  } catch {
    let t = i22.getUint8(e + 7) & 128 ? -1 : 1, s = i22.getUint32(e, true), r = i22.getUint32(e + 4, true);
    return t === -1 && (s = ~s + 1, r = ~r + 1), r > 1048575 && console.warn("This platform does not support BigInt"), t * (s + r * 2 ** 32);
  }
};
var js = class {
  constructor(e, t) {
    this._onCodecHeader = e, this._onCodecUpdate = t, this[Ie]();
  }
  [He]() {
    this._isEnabled = true;
  }
  [Ie]() {
    this._headerCache = /* @__PURE__ */ new Map(), this._codecUpdateData = /* @__PURE__ */ new WeakMap(), this._codecHeaderSent = false, this._codecShouldUpdate = false, this._bitrate = null, this._isEnabled = false;
  }
  [Br](e, t) {
    if (this._onCodecUpdate) {
      this._bitrate !== e && (this._bitrate = e, this._codecShouldUpdate = true);
      let s = this._codecUpdateData.get(this._headerCache.get(this._currentHeader));
      this._codecShouldUpdate && s && this._onCodecUpdate({ bitrate: e, ...s }, t), this._codecShouldUpdate = false;
    }
  }
  [B](e) {
    let t = this._headerCache.get(e);
    return t && this._updateCurrentHeader(e), t;
  }
  [Me](e, t, s) {
    this._isEnabled && (this._codecHeaderSent || (this._onCodecHeader({ ...t }), this._codecHeaderSent = true), this._updateCurrentHeader(e), this._headerCache.set(e, t), this._codecUpdateData.set(t, s));
  }
  _updateCurrentHeader(e) {
    this._onCodecUpdate && e !== this._currentHeader && (this._codecShouldUpdate = true, this._currentHeader = e);
  }
};
var $ = /* @__PURE__ */ new WeakMap();
var J = /* @__PURE__ */ new WeakMap();
var ae = class {
  constructor(e, t) {
    this._codecParser = e, this._headerCache = t;
  }
  *[bn]() {
    let e;
    do {
      if (e = yield* this.Frame[Pe](this._codecParser, this._headerCache, 0), e) return e;
      this._codecParser[we](1);
    } while (true);
  }
  *[dt](e) {
    let t = yield* this[bn](), s = J.get(t)[g];
    if (e || this._codecParser._flushing || (yield* this.Header[B](this._codecParser, this._headerCache, s))) return this._headerCache[He](), this._codecParser[we](s), this._codecParser[ht](t), t;
    this._codecParser[De](`Missing ${Ze} at ${s} bytes from current position.`, `Dropping current ${Ze} and trying again.`), this._headerCache[Ie](), this._codecParser[we](1);
  }
};
var Et = class {
  constructor(e, t) {
    J.set(this, { [fe]: e }), this[O] = t;
  }
};
var be = class extends Et {
  static *[Pe](e, t, s, r, n) {
    let o = yield* e[B](s, r, n);
    if (o) {
      let a = $.get(o)[he], c = $.get(o)[N], l = (yield* s[V](a, n))[I](0, a);
      return new t(o, l, c);
    } else return null;
  }
  constructor(e, t, s) {
    super(e, t), this[fe] = e, this[N] = s, this[Oe] = s / e[H] * 1e3, this[et] = null, this[Ct] = null, this[Ft] = null, this[Tt] = null, J.get(this)[g] = t[g];
  }
};
var yn = "unsynchronizationFlag";
var vn = "extendedHeaderFlag";
var Sn = "experimentalFlag";
var xn = "footerPresent";
var qs = class i11 {
  static *getID3v2Header(e, t, s) {
    let n = {}, o = yield* e[V](3, s);
    if (o[0] !== 73 || o[1] !== 68 || o[2] !== 51 || (o = yield* e[V](10, s), n[at] = `id3v2.${o[3]}.${o[4]}`, o[5] & 15) || (n[yn] = !!(o[5] & 128), n[vn] = !!(o[5] & 64), n[Sn] = !!(o[5] & 32), n[xn] = !!(o[5] & 16), o[6] & 128 || o[7] & 128 || o[8] & 128 || o[9] & 128)) return null;
    let a = o[6] << 21 | o[7] << 14 | o[8] << 7 | o[9];
    return n[g] = 10 + a, new i11(n);
  }
  constructor(e) {
    this[at] = e[at], this[yn] = e[yn], this[vn] = e[vn], this[Sn] = e[Sn], this[xn] = e[xn], this[g] = e[g];
  }
};
var ge = class {
  constructor(e) {
    $.set(this, e), this[te] = e[te], this[se] = null, this[C] = e[C], this[ne] = e[ne], this[H] = e[H];
  }
};
var ko = { 0: [Yt, Yt, Yt, Yt, Yt], 16: [32, 32, 32, 32, 8], 240: [ie, ie, ie, ie, ie] };
var Rr = (i22, e, t) => 8 * ((i22 + t) % e + e) * (1 << (i22 + t) / e) - 8 * e * (e / 8 | 0);
for (let i22 = 2; i22 < 15; i22++) ko[i22 << 4] = [i22 * 32, Rr(i22, 4, 0), Rr(i22, 4, -1), Rr(i22, 8, 4), Rr(i22, 8, 0)];
var _i = 0;
var Oi = 1;
var Ri = 2;
var Li = 3;
var Co = 4;
var Lr = "bands ";
var Ur = " to 31";
var To = { 0: Lr + 4 + Ur, 16: Lr + 8 + Ur, 32: Lr + 12 + Ur, 48: Lr + 16 + Ur };
var kt = "bitrateIndex";
var Ks = "v2";
var Qr = "v1";
var Gr = "Intensity stereo ";
var jr = ", MS stereo ";
var qr = "on";
var Kr = "off";
var Ui = { 0: Gr + Kr + jr + Kr, 16: Gr + qr + jr + Kr, 32: Gr + Kr + jr + qr, 48: Gr + qr + jr + qr };
var wn = { 0: { [T]: A }, 2: { [T]: "Layer III", [Re]: 1, [We]: Ui, [Qr]: { [kt]: Ri, [N]: 1152 }, [Ks]: { [kt]: Co, [N]: 576 } }, 4: { [T]: "Layer II", [Re]: 1, [We]: To, [N]: 1152, [Qr]: { [kt]: Oi }, [Ks]: { [kt]: Co } }, 6: { [T]: "Layer I", [Re]: 4, [We]: To, [N]: 384, [Qr]: { [kt]: _i }, [Ks]: { [kt]: Li } } };
var Mn = "MPEG Version ";
var Fo = "ISO/IEC ";
var Gi = { 0: { [T]: `${Mn}2.5 (later extension of MPEG 2)`, [ue]: Ks, [H]: { 0: Tr, 4: Cr, 8: zt, 12: A } }, 8: { [T]: A }, 16: { [T]: `${Mn}2 (${Fo}13818-3)`, [ue]: Ks, [H]: { 0: Qt, 4: Kt, 8: Wt, 12: A } }, 24: { [T]: `${Mn}1 (${Fo}11172-3)`, [ue]: Qr, [H]: { 0: jt, 4: nt, 8: qt, 12: A } }, length: g };
var ji = { 0: _r, 1: Ls };
var qi = { 0: Ls, 1: "50/15 ms", 2: A, 3: "CCIT J.17" };
var Eo = { 0: { [C]: 2, [T]: rt }, 64: { [C]: 2, [T]: "joint " + rt }, 128: { [C]: 2, [T]: "dual channel" }, 192: { [C]: 1, [T]: st } };
var Dt = class i12 extends ge {
  static *[B](e, t, s) {
    let r = {}, n = yield* qs.getID3v2Header(e, t, s);
    n && (yield* e[V](n[g], s), e[we](n[g]));
    let o = yield* e[V](4, s), a = me(o[I](0, 4)), c = t[B](a);
    if (c) return new i12(c);
    if (o[0] !== 255 || o[1] < 224) return null;
    let l = Gi[o[1] & 24];
    if (l[T] === A) return null;
    let u = o[1] & 6;
    if (wn[u][T] === A) return null;
    let h = { ...wn[u], ...wn[u][l[ue]] };
    if (r[ze] = l[T], r[ue] = h[T], r[N] = h[N], r[$e] = ji[o[1] & 1], r[g] = 4, r[se] = ko[o[2] & 240][h[kt]], r[se] === ie || (r[H] = l[H][o[2] & 12], r[H] === A) || (r[Re] = o[2] & 2 && h[Re], r[Qe] = !!(o[2] & 1), r[he] = Math.floor(125 * r[se] * r[N] / r[H] + r[Re]), !r[he])) return null;
    let f = o[3] & 192;
    if (r[ne] = Eo[f][T], r[C] = Eo[f][C], r[We] = h[We][o[3] & 48], r[ws] = !!(o[3] & 8), r[Ke] = !!(o[3] & 4), r[Xt] = qi[o[3] & 3], r[Xt] === A) return null;
    r[te] = 16;
    {
      let { length: d, frameLength: p, samples: y, ...m } = r;
      t[Me](a, r, m);
    }
    return new i12(r);
  }
  constructor(e) {
    super(e), this[se] = e[se], this[Xt] = e[Xt], this[Re] = e[Re], this[ws] = e[ws], this[Ke] = e[Ke], this[Qe] = e[Qe], this[ue] = e[ue], this[We] = e[We], this[ze] = e[ze], this[$e] = e[$e];
  }
};
var Qs = class i13 extends be {
  static *[Pe](e, t, s) {
    return yield* super[Pe](Dt, i13, e, t, s);
  }
  constructor(e, t, s) {
    super(e, t, s);
  }
};
var Ws = class extends ae {
  constructor(e, t, s) {
    super(e, t), this.Frame = Qs, this.Header = Dt, s(this[R]);
  }
  get [R]() {
    return Fr;
  }
  *[Ge]() {
    return yield* this[dt]();
  }
};
var Ki = { 0: "MPEG-4", 8: "MPEG-2" };
var Qi = { 0: "valid", 2: ie, 4: ie, 6: ie };
var Wi = { 0: _r, 1: Ls };
var zi = { 0: "AAC Main", 64: "AAC LC (Low Complexity)", 128: "AAC SSR (Scalable Sample Rate)", 192: "AAC LTP (Long Term Prediction)" };
var $i = { 0: Mr, 4: Pr, 8: bo, 12: nt, 16: jt, 20: qt, 24: Kt, 28: Qt, 32: Wt, 36: Cr, 40: Tr, 44: zt, 48: go, 52: A, 56: A, 60: "frequency is written explicitly" };
var Do = { 0: { [C]: 0, [T]: "Defined in AOT Specific Config" }, 64: { [C]: 1, [T]: st }, 128: { [C]: 2, [T]: q(2, F[0][0]) }, 192: { [C]: 3, [T]: q(3, F[1][3]) }, 256: { [C]: 4, [T]: q(4, F[1][3], F[3][4]) }, 320: { [C]: 5, [T]: q(5, F[1][3], F[3][0]) }, 384: { [C]: 6, [T]: q(6, F[1][3], F[3][0], Ae) }, 448: { [C]: 8, [T]: q(8, F[1][3], F[2][0], F[3][0], Ae) } };
var It = class i14 extends ge {
  static *[B](e, t, s) {
    let r = {}, n = yield* e[V](7, s), o = me([n[0], n[1], n[2], n[3] & 252 | n[6] & 3]), a = t[B](o);
    if (a) Object.assign(r, a);
    else {
      if (n[0] !== 255 || n[1] < 240 || (r[ze] = Ki[n[1] & 8], r[ue] = Qi[n[1] & 6], r[ue] === ie)) return null;
      let l = n[1] & 1;
      r[$e] = Wi[l], r[g] = l ? 7 : 9, r[Er] = n[2] & 192, r[Le] = n[2] & 60;
      let u = n[2] & 2;
      if (r[Fs] = zi[r[Er]], r[H] = $i[r[Le]], r[H] === A) return null;
      r[Qe] = !!u, r[Hs] = (n[2] << 8 | n[3]) & 448, r[ne] = Do[r[Hs]][T], r[C] = Do[r[Hs]][C], r[Ke] = !!(n[3] & 32), r[Ms] = !!(n[3] & 8), r[Ns] = !!(n[3] & 8), r[Vs] = !!(n[3] & 4), r[te] = 16, r[N] = 1024, r[Cs] = n[6] & 3;
      {
        let { length: h, channelModeBits: f, profileBits: d, sampleRateBits: p, frameLength: y, samples: m, numberAACFrames: b, ...v } = r;
        t[Me](o, r, v);
      }
    }
    if (r[he] = (n[3] << 11 | n[4] << 3 | n[5] >> 5) & 8191, !r[he]) return null;
    let c = (n[5] << 6 | n[6] >> 2) & 2047;
    return r[gs] = c === 2047 ? "VBR" : c, new i14(r);
  }
  constructor(e) {
    super(e), this[Ns] = e[Ns], this[Vs] = e[Vs], this[gs] = e[gs], this[Ms] = e[Ms], this[Ke] = e[Ke], this[Qe] = e[Qe], this[ue] = e[ue], this[g] = e[g], this[ze] = e[ze], this[Cs] = e[Cs], this[Fs] = e[Fs], this[$e] = e[$e];
  }
  get audioSpecificConfig() {
    let e = $.get(this), t = e[Er] + 64 << 5 | e[Le] << 5 | e[Hs] >> 3, s = new oe(2);
    return new pt(s[_e]).setUint16(0, t, false), s;
  }
};
var zs = class i15 extends be {
  static *[Pe](e, t, s) {
    return yield* super[Pe](It, i15, e, t, s);
  }
  constructor(e, t, s) {
    super(e, t, s);
  }
};
var $s = class extends ae {
  constructor(e, t, s) {
    super(e, t), this.Frame = zs, this.Header = It, s(this[R]);
  }
  get [R]() {
    return "aac";
  }
  *[Ge]() {
    return yield* this[dt]();
  }
};
var mt = class i16 extends be {
  static _getFrameFooterCrc16(e) {
    return (e[e[g] - 2] << 8) + e[e[g] - 1];
  }
  static [Ar](e) {
    let t = i16._getFrameFooterCrc16(e), s = wo(e[I](0, -2));
    return t === s;
  }
  constructor(e, t, s) {
    t[Os] = s, t[vs] = i16._getFrameFooterCrc16(e), super(t, e, $.get(t)[N]);
  }
};
var Io = "get from STREAMINFO metadata block";
var Xi = { 0: "Fixed", 1: "Variable" };
var Ho = { 0: A, 16: 192 };
for (let i22 = 2; i22 < 16; i22++) Ho[i22 << 4] = i22 < 6 ? 576 * 2 ** (i22 - 2) : 2 ** i22;
var Ji = { 0: Io, 1: Pr, 2: mo, 3: po, 4: zt, 5: Wt, 6: Qt, 7: Kt, 8: qt, 9: jt, 10: nt, 11: Mr, 15: ie };
var Zi = { 0: { [C]: 1, [T]: st }, 16: { [C]: 2, [T]: q(2, F[0][0]) }, 32: { [C]: 3, [T]: q(3, F[0][1]) }, 48: { [C]: 4, [T]: q(4, F[1][0], F[3][0]) }, 64: { [C]: 5, [T]: q(5, F[1][1], F[3][0]) }, 80: { [C]: 6, [T]: q(6, F[1][1], Ae, F[3][0]) }, 96: { [C]: 7, [T]: q(7, F[1][1], Ae, F[3][4], F[2][0]) }, 112: { [C]: 8, [T]: q(8, F[1][1], Ae, F[3][0], F[2][0]) }, 128: { [C]: 2, [T]: `${rt} (left, diff)` }, 144: { [C]: 2, [T]: `${rt} (diff, right)` }, 160: { [C]: 2, [T]: `${rt} (avg, diff)` }, 176: A, 192: A, 208: A, 224: A, 240: A };
var Yi = { 0: Io, 2: 8, 4: 12, 6: A, 8: 16, 10: 20, 12: 24, 14: A };
var bt = class i17 extends ge {
  static _decodeUTF8Int(e) {
    if (e[0] > 254) return null;
    if (e[0] < 128) return { value: e[0], length: 1 };
    let t = 1;
    for (let o = 64; o & e[0]; o >>= 1) t++;
    let s = t - 1, r = 0, n = 0;
    for (; s > 0; n += 6, s--) {
      if ((e[s] & 192) !== 128) return null;
      r |= (e[s] & 63) << n;
    }
    return r |= (e[s] & 127 >> t) << n, { value: r, length: t };
  }
  static [Ce](e, t) {
    let s = { [V]: function* () {
      return e;
    } };
    return i17[B](s, t, 0).next().value;
  }
  static *[B](e, t, s) {
    let r = yield* e[V](6, s);
    if (r[0] !== 255 || !(r[1] === 248 || r[1] === 249)) return null;
    let n = {}, o = me(r[I](0, 4)), a = t[B](o);
    if (a) Object.assign(n, a);
    else {
      if (n[Dr] = r[1] & 1, n[ks] = Xi[n[Dr]], n[Ds] = r[2] & 240, n[Le] = r[2] & 15, n[Xe] = Ho[n[Ds]], n[Xe] === A || (n[H] = Ji[n[Le]], n[H] === ie) || r[3] & 1) return null;
      let l = Zi[r[3] & 240];
      if (l === A || (n[C] = l[C], n[ne] = l[T], n[te] = Yi[r[3] & 14], n[te] === A)) return null;
    }
    n[g] = 5, r = yield* e[V](n[g] + 8, s);
    let c = i17._decodeUTF8Int(r[I](4));
    if (!c || (n[Dr] ? n[As] = c.value : n[et] = c.value, n[g] += c[g], n[Ds] === 96 ? (r[g] < n[g] && (r = yield* e[V](n[g], s)), n[Xe] = r[n[g] - 1] + 1, n[g] += 1) : n[Ds] === 112 && (r[g] < n[g] && (r = yield* e[V](n[g], s)), n[Xe] = (r[n[g] - 1] << 8) + r[n[g]] + 1, n[g] += 2), n[N] = n[Xe], n[Le] === 12 ? (r[g] < n[g] && (r = yield* e[V](n[g], s)), n[H] = r[n[g] - 1] * 1e3, n[g] += 1) : n[Le] === 13 ? (r[g] < n[g] && (r = yield* e[V](n[g], s)), n[H] = (r[n[g] - 1] << 8) + r[n[g]], n[g] += 2) : n[Le] === 14 && (r[g] < n[g] && (r = yield* e[V](n[g], s)), n[H] = ((r[n[g] - 1] << 8) + r[n[g]]) * 10, n[g] += 2), r[g] < n[g] && (r = yield* e[V](n[g], s)), n[$t] = r[n[g] - 1], n[$t] !== xo(r[I](0, n[g] - 1)))) return null;
    if (!a) {
      let { blockingStrategyBits: l, frameNumber: u, sampleNumber: h, samples: f, sampleRateBits: d, blockSizeBits: p, crc: y, length: m, ...b } = n;
      t[Me](o, n, b);
    }
    return new i17(n);
  }
  constructor(e) {
    super(e), this[vs] = null, this[ks] = e[ks], this[Xe] = e[Xe], this[et] = e[et], this[As] = e[As], this[Os] = null;
  }
};
var ea = 2;
var ta = 512 * 1024;
var Ht = class extends ae {
  constructor(e, t, s) {
    super(e, t), this.Frame = mt, this.Header = bt, s(this[R]);
  }
  get [R]() {
    return "flac";
  }
  *_getNextFrameSyncOffset(e) {
    let t = yield* this._codecParser[V](2, 0), s = t[g] - 2;
    for (; e < s; ) {
      if (t[e] === 255) {
        let n = t[e + 1];
        if (n === 248 || n === 249) break;
        n !== 255 && e++;
      }
      e++;
    }
    return e;
  }
  *[Ge]() {
    do {
      let e = yield* bt[B](this._codecParser, this._headerCache, 0);
      if (e) {
        let t = $.get(e)[g] + ea;
        for (; t <= ta; ) {
          if (this._codecParser._flushing || (yield* bt[B](this._codecParser, this._headerCache, t))) {
            let s = yield* this._codecParser[V](t);
            if (this._codecParser._flushing || (s = s[I](0, t)), mt[Ar](s)) {
              let r = new mt(s, e);
              return this._headerCache[He](), this._codecParser[we](t), this._codecParser[ht](r), r;
            }
          }
          t = yield* this._getNextFrameSyncOffset(t + 1);
        }
        this._codecParser[De](`Unable to sync FLAC frame after searching ${t} bytes.`), this._codecParser[we](t);
      } else this._codecParser[we](yield* this._getNextFrameSyncOffset(1));
    } while (true);
  }
  [ft](e) {
    return e[W] === 0 ? (this._headerCache[He](), this._streamInfo = e[O][I](13)) : e[W] === 1 || (e[re] = J.get(e)[xe].map((t) => {
      let s = bt[Ce](t, this._headerCache);
      if (s) return new mt(t, s, this._streamInfo);
      this._codecParser[De]("Failed to parse Ogg FLAC frame", "Skipping invalid FLAC frame");
    }).filter((t) => !!t)), e;
  }
};
var Nt = class i18 {
  static *[B](e, t, s) {
    let r = {}, n = yield* e[V](28, s);
    if (n[0] !== 79 || n[1] !== 103 || n[2] !== 103 || n[3] !== 83 || (r[pn] = n[4], n[5] & 248)) return null;
    r[pe] = !!(n[5] & 4), r[it] = !!(n[5] & 2), r[ot] = !!(n[5] & 1);
    let a = new pt(oe.from(n[I](0, 28))[_e]);
    r[ke] = Po(a, 6), r[Ue] = a.getInt32(14, true), r[W] = a.getInt32(18, true), r[Pt] = a.getInt32(22, true);
    let c = n[26];
    r[g] = c + 27, n = yield* e[V](r[g], s), r[he] = 0, r[ut] = [], r[Zt] = oe.from(n[I](27, r[g]));
    for (let l = 0, u = 0; l < c; l++) {
      let h = r[Zt][l];
      r[he] += h, u += h, (h !== 255 || l === c - 1) && (r[ut].push(u), u = 0);
    }
    return new i18(r);
  }
  constructor(e) {
    $.set(this, e), this[ke] = e[ke], this[ot] = e[ot], this[it] = e[it], this[pe] = e[pe], this[ut] = e[ut], this[W] = e[W], this[Pt] = e[Pt], this[Ue] = e[Ue];
  }
};
var Xs = class i19 extends Et {
  static *[Pe](e, t, s) {
    let r = yield* Nt[B](e, t, s);
    if (r) {
      let n = $.get(r)[he], o = $.get(r)[g], a = o + n, c = (yield* e[V](a, 0))[I](0, a), l = c[I](o, a);
      return new i19(r, l, c);
    } else return null;
  }
  constructor(e, t, s) {
    super(e, t), J.get(this)[g] = s[g], this[re] = [], this[hn] = s, this[ke] = e[ke], this[Ss] = e[Pt], this[Oe] = 0, this[ot] = e[ot], this[it] = e[it], this[pe] = e[pe], this[W] = e[W], this[N] = 0, this[Ue] = e[Ue];
  }
};
var es = class extends be {
  constructor(e, t, s) {
    super(t, e, s);
  }
};
var No = { 0: fs.slice(0, 2), 1: fs };
var Te = "SILK-only";
var Z = "CELT-only";
var Wr = "Hybrid";
var gt = "narrowband";
var zr = "medium-band";
var yt = "wideband";
var ts = "super-wideband";
var ss = "fullband";
var sa = { 0: { [k]: Te, [D]: gt, [E]: 10 }, 8: { [k]: Te, [D]: gt, [E]: 20 }, 16: { [k]: Te, [D]: gt, [E]: 40 }, 24: { [k]: Te, [D]: gt, [E]: 60 }, 32: { [k]: Te, [D]: zr, [E]: 10 }, 40: { [k]: Te, [D]: zr, [E]: 20 }, 48: { [k]: Te, [D]: zr, [E]: 40 }, 56: { [k]: Te, [D]: zr, [E]: 60 }, 64: { [k]: Te, [D]: yt, [E]: 10 }, 72: { [k]: Te, [D]: yt, [E]: 20 }, 80: { [k]: Te, [D]: yt, [E]: 40 }, 88: { [k]: Te, [D]: yt, [E]: 60 }, 96: { [k]: Wr, [D]: ts, [E]: 10 }, 104: { [k]: Wr, [D]: ts, [E]: 20 }, 112: { [k]: Wr, [D]: ss, [E]: 10 }, 120: { [k]: Wr, [D]: ss, [E]: 20 }, 128: { [k]: Z, [D]: gt, [E]: 2.5 }, 136: { [k]: Z, [D]: gt, [E]: 5 }, 144: { [k]: Z, [D]: gt, [E]: 10 }, 152: { [k]: Z, [D]: gt, [E]: 20 }, 160: { [k]: Z, [D]: yt, [E]: 2.5 }, 168: { [k]: Z, [D]: yt, [E]: 5 }, 176: { [k]: Z, [D]: yt, [E]: 10 }, 184: { [k]: Z, [D]: yt, [E]: 20 }, 192: { [k]: Z, [D]: ts, [E]: 2.5 }, 200: { [k]: Z, [D]: ts, [E]: 5 }, 208: { [k]: Z, [D]: ts, [E]: 10 }, 216: { [k]: Z, [D]: ts, [E]: 20 }, 224: { [k]: Z, [D]: ss, [E]: 2.5 }, 232: { [k]: Z, [D]: ss, [E]: 5 }, 240: { [k]: Z, [D]: ss, [E]: 10 }, 248: { [k]: Z, [D]: ss, [E]: 20 } };
var rs = class i20 extends ge {
  static [Ce](e, t, s) {
    let r = {};
    if (r[C] = e[9], r[Je] = e[18], r[g] = r[Je] !== 0 ? 21 + r[C] : 19, e[g] < r[g]) throw new Error("Out of data while inside an Ogg Page");
    let n = t[0] & 3, o = n === 3 ? 2 : 1, a = me(e[I](0, r[g])) + me(t[I](0, o)), c = s[B](a);
    if (c) return new i20(c);
    if (a.substr(0, 8) !== "OpusHead" || e[8] !== 1) return null;
    r[O] = oe.from(e[I](0, r[g]));
    let l = new pt(r[O][_e]);
    if (r[te] = 16, r[wt] = l.getUint16(10, true), r[Bs] = l.getUint32(12, true), r[H] = nt, r[Ts] = l.getInt16(16, true), r[Je] in No && (r[ne] = No[r[Je]][r[C] - 1], !r[ne])) return null;
    r[Je] !== 0 && (r[_s] = e[19], r[ys] = e[20], r[Is] = [...e[I](21, r[C] + 21)]);
    let u = sa[248 & t[0]];
    switch (r[k] = u[k], r[D] = u[D], r[E] = u[E], n) {
      case 0:
        r[Ye] = 1;
        break;
      case 1:
      case 2:
        r[Ye] = 2;
        break;
      case 3:
        r[Ps] = !!(128 & t[1]), r[xs] = !!(64 & t[1]), r[Ye] = 63 & t[1];
        break;
      default:
        return null;
    }
    {
      let { length: h, data: f, channelMappingFamily: d, ...p } = r;
      s[Me](a, r, p);
    }
    return new i20(r);
  }
  constructor(e) {
    super(e), this[O] = e[O], this[D] = e[D], this[Je] = e[Je], this[Is] = e[Is], this[ys] = e[ys], this[Ye] = e[Ye], this[E] = e[E], this[xs] = e[xs], this[Bs] = e[Bs], this[Ps] = e[Ps], this[k] = e[k], this[Ts] = e[Ts], this[wt] = e[wt], this[_s] = e[_s];
  }
};
var Js = class extends ae {
  constructor(e, t, s) {
    super(e, t), this.Frame = es, this.Header = rs, s(this[R]), this._identificationHeader = null, this._preSkipRemaining = null;
  }
  get [R]() {
    return "opus";
  }
  [ft](e) {
    return e[W] === 0 ? (this._headerCache[He](), this._identificationHeader = e[O]) : e[W] === 1 || (e[re] = J.get(e)[xe].map((t) => {
      let s = rs[Ce](this._identificationHeader, t, this._headerCache);
      if (s) {
        this._preSkipRemaining === null && (this._preSkipRemaining = s[wt]);
        let r = s[E] * s[Ye] / 1e3 * s[H];
        return this._preSkipRemaining > 0 && (this._preSkipRemaining -= r, r = this._preSkipRemaining < 0 ? -this._preSkipRemaining : 0), new es(t, s, r);
      }
      this._codecParser[Vr]("Failed to parse Ogg Opus Header", "Not a valid Ogg Opus file");
    })), e;
  }
};
var ns = class extends be {
  constructor(e, t, s) {
    super(t, e, s);
  }
};
var Pn = {};
for (let i22 = 0; i22 < 8; i22++) Pn[i22 + 6] = 2 ** (6 + i22);
var Zs = class i21 extends ge {
  static [Ce](e, t, s, r) {
    if (e[g] < 30) throw new Error("Out of data while inside an Ogg Page");
    let n = me(e[I](0, 30)), o = t[B](n);
    if (o) return new i21(o);
    let a = { [g]: 30 };
    if (n.substr(0, 7) !== "vorbis") return null;
    a[O] = oe.from(e[I](0, 30));
    let c = new pt(a[O][_e]);
    if (a[at] = c.getUint32(7, true), a[at] !== 0 || (a[C] = e[11], a[ne] = fs[a[C] - 1] || "application defined", a[H] = c.getUint32(12, true), a[ps] = c.getInt32(16, true), a[bs] = c.getInt32(20, true), a[ms] = c.getInt32(24, true), a[lt] = Pn[(e[28] & 240) >> 4], a[ct] = Pn[e[28] & 15], a[ct] > a[lt]) || e[29] !== 1) return null;
    a[te] = 32, a[Jt] = r, a[Es] = s;
    {
      let { length: l, data: u, version: h, vorbisSetup: f, vorbisComments: d, ...p } = a;
      t[Me](n, a, p);
    }
    return new i21(a);
  }
  constructor(e) {
    super(e), this[ps] = e[ps], this[ms] = e[ms], this[bs] = e[bs], this[ct] = e[ct], this[lt] = e[lt], this[O] = e[O], this[Es] = e[Es], this[Jt] = e[Jt];
  }
};
var Ys = class extends ae {
  constructor(e, t, s) {
    super(e, t), this.Frame = ns, s(this[R]), this._identificationHeader = null, this._setupComplete = false, this._prevBlockSize = null;
  }
  get [R]() {
    return Mt;
  }
  [ft](e) {
    e[re] = [];
    for (let t of J.get(e)[xe]) if (t[0] === 1) this._headerCache[He](), this._identificationHeader = e[O], this._setupComplete = false;
    else if (t[0] === 3) this._vorbisComments = t;
    else if (t[0] === 5) this._vorbisSetup = t, this._mode = this._parseSetupHeader(t), this._setupComplete = true;
    else if (this._setupComplete) {
      let s = Zs[Ce](this._identificationHeader, this._headerCache, this._vorbisComments, this._vorbisSetup);
      s ? e[re].push(new ns(t, s, this._getSamples(t, s))) : this._codecParser[logError]("Failed to parse Ogg Vorbis Header", "Not a valid Ogg Vorbis file");
    }
    return e;
  }
  _getSamples(e, t) {
    let r = this._mode.blockFlags[e[0] >> 1 & this._mode.mask] ? t[lt] : t[ct], n = this._prevBlockSize === null ? 0 : (this._prevBlockSize + r) / 4;
    return this._prevBlockSize = r, n;
  }
  _parseSetupHeader(e) {
    let t = new Or(e), s = { count: 0, blockFlags: [] };
    for (; (t.read(1) & 1) !== 1; ) ;
    let r;
    for (; s.count < 64 && t.position > 0; ) {
      Us(t.read(8));
      let n = 0;
      for (; t.read(8) === 0 && n++ < 3; ) ;
      if (n === 4) r = t.read(7), s.blockFlags.unshift(r & 1), t.position += 6, s.count++;
      else {
        ((Us(r) & 126) >> 1) + 1 !== s.count && this._codecParser[De]("vorbis derived mode count did not match actual mode count");
        break;
      }
    }
    return s.mask = (1 << Math.log2(s.count)) - 1, s;
  }
};
var Cn = class {
  constructor(e, t, s) {
    this._codecParser = e, this._headerCache = t, this._onCodec = s, this._continuedPacket = new oe(), this._codec = null, this._isSupported = null, this._previousAbsoluteGranulePosition = null;
  }
  get [R]() {
    return this._codec || "";
  }
  _updateCodec(e, t) {
    this._codec !== e && (this._headerCache[Ie](), this._parser = new t(this._codecParser, this._headerCache, this._onCodec), this._codec = e);
  }
  _checkCodecSupport({ data: e }) {
    let t = me(e[I](0, 8));
    switch (t) {
      case "fishead\0":
        return false;
      case "OpusHead":
        return this._updateCodec("opus", Js), true;
      case (/^\x7fFLAC/.test(t) && t):
        return this._updateCodec("flac", Ht), true;
      case (/^\x01vorbis/.test(t) && t):
        return this._updateCodec(Mt, Ys), true;
      default:
        return false;
    }
  }
  _checkPageSequenceNumber(e) {
    e[W] !== this._pageSequenceNumber + 1 && this._pageSequenceNumber > 1 && e[W] > 1 && this._codecParser[De]("Unexpected gap in Ogg Page Sequence Number.", `Expected: ${this._pageSequenceNumber + 1}, Got: ${e[W]}`), this._pageSequenceNumber = e[W];
  }
  _parsePage(e) {
    this._isSupported === null && (this._pageSequenceNumber = e[W], this._isSupported = this._checkCodecSupport(e)), this._checkPageSequenceNumber(e);
    let t = J.get(e), s = $.get(t[fe]), r = 0;
    if (t[xe] = s[ut].map((n) => e[O][I](r, r += n)), this._continuedPacket[g] && (t[xe][0] = Gs(this._continuedPacket, t[xe][0]), this._continuedPacket = new oe()), s[Zt][s[Zt][g] - 1] === 255 && (this._continuedPacket = Gs(this._continuedPacket, t[xe].pop())), this._previousAbsoluteGranulePosition !== null && (e[N] = Number(e[ke] - this._previousAbsoluteGranulePosition)), this._previousAbsoluteGranulePosition = e[ke], this._isSupported) {
      let n = this._parser[ft](e);
      return this._codecParser[ht](n), n;
    } else return e;
  }
};
var er = class extends ae {
  constructor(e, t, s) {
    super(e, t), this._onCodec = s, this.Frame = Xs, this.Header = Nt, this._streams = /* @__PURE__ */ new Map(), this._currentSerialNumber = null;
  }
  get [R]() {
    let e = this._streams.get(this._currentSerialNumber);
    return e ? e.codec : "";
  }
  *[Ge]() {
    let e = yield* this[dt](true);
    this._currentSerialNumber = e[Ue];
    let t = this._streams.get(this._currentSerialNumber);
    return t || (t = new Cn(this._codecParser, this._headerCache, this._onCodec), this._streams.set(this._currentSerialNumber, t)), e[pe] && this._streams.delete(this._currentSerialNumber), t._parsePage(e);
  }
};
var Tn = () => {
};
var tr = class {
  constructor(e, { onCodec: t, onCodecHeader: s, onCodecUpdate: r, enableLogging: n = false, enableFrameCRC32: o = true } = {}) {
    this._inputMimeType = e, this._onCodec = t || Tn, this._onCodecHeader = s || Tn, this._onCodecUpdate = r, this._enableLogging = n, this._crc32 = o ? Mo : Tn, this[Ie]();
  }
  get [R]() {
    return this._parser ? this._parser[R] : "";
  }
  [Ie]() {
    this._headerCache = new js(this._onCodecHeader, this._onCodecUpdate), this._generator = this._getGenerator(), this._generator.next();
  }
  *flush() {
    this._flushing = true;
    for (let e = this._generator.next(); e.value; e = this._generator.next()) yield e.value;
    this._flushing = false, this[Ie]();
  }
  *parseChunk(e) {
    for (let t = this._generator.next(e); t.value; t = this._generator.next()) yield t.value;
  }
  parseAll(e) {
    return [...this.parseChunk(e), ...this.flush()];
  }
  *_getGenerator() {
    if (this._inputMimeType.match(/aac/)) this._parser = new $s(this, this._headerCache, this._onCodec);
    else if (this._inputMimeType.match(/mpeg/)) this._parser = new Ws(this, this._headerCache, this._onCodec);
    else if (this._inputMimeType.match(/flac/)) this._parser = new Ht(this, this._headerCache, this._onCodec);
    else if (this._inputMimeType.match(/ogg/)) this._parser = new er(this, this._headerCache, this._onCodec);
    else throw new Error(`Unsupported Codec ${mimeType}`);
    for (this._frameNumber = 0, this._currentReadPosition = 0, this._totalBytesIn = 0, this._totalBytesOut = 0, this._totalSamples = 0, this._sampleRate = void 0, this._rawData = new Uint8Array(0); ; ) {
      let e = yield* this._parser[Ge]();
      e && (yield e);
    }
  }
  *[V](e = 0, t = 0) {
    let s;
    for (; this._rawData[g] <= e + t; ) {
      if (s = yield, this._flushing) return this._rawData[I](t);
      s && (this._totalBytesIn += s[g], this._rawData = Gs(this._rawData, s));
    }
    return this._rawData[I](t);
  }
  [we](e) {
    this._currentReadPosition += e, this._rawData = this._rawData[I](e);
  }
  [Rs](e) {
    this._sampleRate = e[fe][H], e[fe][se] = e[Oe] > 0 ? Math.round(e[O][g] / e[Oe]) * 8 : 0, e[et] = this._frameNumber++, e[Ct] = this._totalBytesOut, e[Ft] = this._totalSamples, e[Tt] = this._totalSamples / this._sampleRate * 1e3, e[Ss] = this._crc32(e[O]), this._headerCache[Br](e[fe][se], e[Tt]), this._totalBytesOut += e[O][g], this._totalSamples += e[N];
  }
  [ht](e) {
    if (e[re]) {
      if (e[pe]) {
        let t = e[N];
        e[re].forEach((s) => {
          let r = s[N];
          t < r && (s[N] = t > 0 ? t : 0, s[Oe] = s[N] / s[fe][H] * 1e3), t -= r, this[Rs](s);
        });
      } else e[N] = 0, e[re].forEach((t) => {
        e[N] += t[N], this[Rs](t);
      });
      e[Oe] = e[N] / this._sampleRate * 1e3 || 0, e[Ft] = this._totalSamples, e[Tt] = this._totalSamples / this._sampleRate * 1e3 || 0, e[Ct] = this._totalBytesOut;
    } else this[Rs](e);
  }
  _log(e, t) {
    if (this._enableLogging) {
      let s = [`${R}:         ${this[R]}`, `inputMimeType: ${this._inputMimeType}`, `readPosition:  ${this._currentReadPosition}`, `totalBytesIn:  ${this._totalBytesIn}`, `${Ct}: ${this._totalBytesOut}`], r = Math.max(...s.map((n) => n[g]));
      t.push(`--stats--${"-".repeat(r - 9)}`, ...s, "-".repeat(r)), e("codec-parser", t.reduce((n, o) => n + `
  ` + o, ""));
    }
  }
  [De](...e) {
    this._log(console.warn, e);
  }
  [Vr](...e) {
    this._log(console.error, e);
  }
};
var Vo = tr;
var $r = re;
var Xr = O;
var Bo = fe;
var Ao = pe;
var _o = Jt;
var Oo = Ft;
function tt(i22) {
  var e = e;
  function t() {
  }
  e = {};
  function s(P) {
    throw P;
  }
  var r, n, o, a, c, l, u, h, f, d, p;
  function y() {
    var P = p.buffer;
    r = new Int8Array(P), n = new Int16Array(P), a = new Uint8Array(P), c = new Uint16Array(P), o = new Int32Array(P), l = new Uint32Array(P), u = new Float32Array(P), h = new Float64Array(P), f = new BigInt64Array(P), d = new BigUint64Array(P);
  }
  for (var m = (P) => {
    for (var ve, as, Rt = 0, ir = 0, ar = P.length, cr = new Uint8Array((ar * 3 >> 2) - (P[ar - 2] == "=") - (P[ar - 1] == "=")); Rt < ar; Rt += 4, ir += 3) ve = de[P.charCodeAt(Rt + 1)], as = de[P.charCodeAt(Rt + 2)], cr[ir] = de[P.charCodeAt(Rt)] << 2 | ve >> 4, cr[ir + 1] = ve << 4 | as >> 2, cr[ir + 2] = as << 6 | de[P.charCodeAt(Rt + 3)];
    return cr;
  }, b = () => s(""), v = () => {
  }, S = {}, M = (P) => P(), x = () => performance.now(), L = (P, ve) => {
    if (S[P] && (clearTimeout(S[P].id), delete S[P]), !ve) return 0;
    var as = setTimeout(() => {
      delete S[P], M(() => jn(P, x()));
    }, ve);
    return S[P] = { id: as, timeout_ms: ve }, 0;
  }, j = Math.atan, ce = Math.cos, le = Math.exp, Fe = Math.log, je = Math.pow, Ot = Math.sin, St = (P) => {
    var ve = a.length;
    return P >>>= 0, false;
  }, Ve = (P) => {
    throw `exit(${P})`;
  }, de = new Uint8Array(123), ye = 25; ye >= 0; --ye) de[48 + ye] = 52 + ye, de[65 + ye] = ye, de[97 + ye] = 26 + ye;
  de[43] = 62, de[47] = 63;
  var en = { e: b, d: v, f: L, b: j, a: ce, i: le, h: Fe, g: je, c: Ot, k: St, j: Ve };
  function tn(P) {
    An = P.n, _n = P.o, On = P.p, Rn = P.q, Ln = P.r, Un = P.s, Gn = P.t, jn = P.v;
  }
  var An, _n, On, Rn, Ln, Un, Gn, jn;
  function Yo(P) {
    P.m();
  }
  tt.wasm || Object.defineProperty(tt, "wasm", { get: () => String.raw`dynEncode012091253f87dì%nä= 4& ¿nÝØäÂLÚªã9ÚØ[äº\ ¼¡³R=}L]Èÿ2 ÿù¶J1jj¡é,zäV|i¸Qk¹= 
¨¨%ýv²±»oúâLa:ê±ÊäÌÓ.÷Øý×>àW>z¯°8¯ñ\Ñós9\§ôÊ@Ü (tÃø4° ¢7fqÓg²Jè6x[zç®&4=} p.(°tÍÞã¾>÷CõË"*k?¿~7~H2ÛÜâ.ÏQä;6{ÜãFÑá'DD¤±°HQ>MínÎÏÎöÊµÑÓÞÌP¼P¨Þ* X²E=MÂ¦qíxMÃ±=MÌë4/<gNO/¢	¢>a~Ï®ììììì0ìaç¬¡çëOÓÇM	Q9tùµyuéµµÞÏ/±Óõò}E{òÓJ¹Û|·ôfÒ c¬WêaûÿlÊ½p¹|)ÖEL¦	}ypÕSÏ¹I]¢ºãæ°ÿo¶7ÛRq¾ÔÅEßØ]æËwÚ{óçVwó1¾E­Øpàe"Æùû¡Áª Ààð´LõÎxEÓ¢N¦9ëùi&	Ò§Ø!ÇFçS=MbäO?ß·ç¸ª7ùa}5ðûÕtsUþ£KïgN¾)ø§\V0uSIö:ÌU4Ð¶¯´Õn9ÔèE£ZÆ¼{hµmÙ¾6ÆÑ+xñ´«þ¸=Mß¤·å®«ïÆGFÝì|H?ä E"þ!9«Æïpæ'][¯ù·£W÷O§&#ax$qf=}ø ô bÏ×W÷LôoÝWQÕÓ)u÷½èV|¥Gà¨Ö¸@ê|ÇK5ò	A·Â9CS2¸¼¿,äÝÑÝy!ÑR%ÆÝÎ0Âv§ qTcó±hØÉã=}Z=}Ælü­ën¯ð(-°ÜwVÏï.th¥í­S~SÏ»ZZÔZ 
3BÌÛ¬<éæO)ÎyÚ¯O*®uìÛ$öI¥Ý9ôø³\¤ò³Ù¹ÇP¸J×y@ÔyOÇmô½ü¾|S?2àú¤F?½ûoo3ô;<àáûÜ8ì²7ïë¨RäY¹|ÓºÌF,Ð-¸*\P!FJÒ8= o6HwLrúº¶ÐÛ\Ù¬o¢9IqÝ.ôf¶ÎÈ{Äª×N|Mfs¤ÉÝàâ§*+ã§­ô¯î¬7ç×§ä)!Z¨É,Äp~ý·wsSGóäsE\ýïé§Ö:Ò'Cç(_X$\¦½eÒ8$ XF|eíÙÓ¡¤Û<ØÞÛ¸9¿ðÃÎ#b~× 4éîÿÏq
 ód|0wU&®è·vh6¨{ÚçÚ18Ó(ÓY\0¦= çèíß)Ø=}[xü-v?N(Kkg 0}âÚ´ð¬ÕQNÍ¢usÑ³=}.	ëgû= ÍMBp'²¨ x4è@9t§eÝµ¾âð½ z?Z¹FH'Ì¯¿<K,üµ<{	¶JãývåàÆeù0Ð"F¥ÃÒÞþÔÉvCzl}ðN£	Í^P%²¸FX»WÎêô¶äÉJ^g×SÃã.Ät*'ªG«ÒB<ÜÓ¿ºp­\àuV¯£ÅÝ½áÞ ùß=}ÎÚ^ÿí>¥! ¨ â=M·?*/¤"å)â·ÿîÿî*(%*2[½"üríÔ4l½»a}¯CwpCÓèìGc-ã6®=M32k?Êg­!So-x>³G+ã@ò, ÁïáåN0þÙè.~È÷¡vTr¶­Ã[üB±º»ávëw¹{pÜºû"Aæ±9Æ^¹³òïRIAy5GÂwÉf4@Tù|qý7ðªwBL|Ôqv!ª°|]KiÐJVQ5¸åõ§å"H¼0e¬<óBîÚSÏUìHPÙA+çÉ'seÌNf°@ÈM,ð½egÖ¬x©û½2~«Ò1;Ö«¯°4&90èE»Ó×ºçÊ§J<Æ¿&~Nu¼ãÙµ¢.UÇä(qQô^ö·%!É
w¬= Îôª«Ù×ªJIS;õa rx×£.6¤°>5²Åà,õ°°h6ûUp©²v#}%é= R¢hõ@ëQiJÙ\Ûp»©[vsiÙLE UG*sGÄ%V­¸§;º_]cØp#¡:oZ{ãS5I¥]ÓaÎg+n×ýÿTxy]²ö°k¦kêju¼xÐTá©#h>Ù]u\EA+§í¤u¦üØlQPdëNòzyÞ¼XÐ]ÝøÝg¸BI¿BÕð_Ël¶Cuyºr|<¾¨Támo5êÿú>Æ[ã±G¨²)ü&áòüåBFou!Íí.jÖìß½8¥YëìáÈÁi)qÀ:ÎüÐÖ¤GÍ³ô>°ú¯øâ?R£k~&ÑãÞ~A¢;Ð'àÆUÀ»L­×)-!ÿkýíÙ
§Û\{¤ólW^næzk?G~?_5uÝñ7-ß«6YPðGßÚù\Êê -ûp¥èÓtM ×hKÈ¯ÒBAê"ïx×HÍ0Ôcè+èçÛÅf (§¢õ®%K£7éÞQ'MxãxÐúÑ2!8_6Ì¶Ì6ÌrûùS¥ZóAIüå6¿jÿ_°(ÿä9©CCÄ!bq5Öô×x{ÍbÆÚmÒ@«µ××~ÒD;*ü ùeÀÞ·xv¾;¤7¾[W\ýüb@'qãµÙâÉE¾}}tq-g=}Üs¢5Ó=}$Ä§£Ó~SFÎgÑnN>1§/¥¸G5àM8#Ò;2¢/K%xVÓ(XH>µ¬ü;_j~Æw<¾ô*»ô= fAËbM¼iÀIIp'c*:oY¡VÖ3ûIdû®4ÚûýÆð}ûN¥ûI
¥ÎÛK*]Ø=M>t×ý³MwEè®"Û4­]]ÓgØ×EÈ.pN°¡»¤ç/I.ÿ+6r@«Âz@§Bz@¯ÂIê-tíÜ«°·GföjÏÕì:gÕUÖ=}÷¦|§EõÌ$a*¸s¬´«£¯JÞàãËt$ GSÚ³Ë1¯©&|±c!\åvçÏ·Ñ¸ãßÃ±]á¸?ùää%6´= #e¬Â;IÚ¡õckCÀò*\ï0À¿<>ªÈåJA'ï´¾ME.@OüÐ0ex÷#2ÒùúµÇ½>o{«ó= Ôï;Ç½¶óÐ/ÔÍÜ¤±¢Êw>ÃâÐ¡¯®Üa£¹6Vý váÂhôàÍ8D!Æ!ÆI;¢áÜ!oÑÙ OÏKôò=}w <0rT= 5J_±3×Ì;ôYÐ<aÞê¹¾7ßz\Ë¼ÛÛ@>Â{å%K¯º'ÊmÚòÁjRÒ×úw@'(	=}­QU«ÐÁÑ,/?úYEyºQì¬ {ÇLÕæõNáð#f>_ò#Îv] /øÏ¾TUà/øÀA Ô'w]Ã]Ww]Ã] X­÷Þnð·TbAåÉ	r¨4?t²>1Ç[áüx $-ÒÂMÄ§·µwsú>üÂ&³÷.dgA¦h²*G×	öcG×µF5¸Êqª$ñ?¦vÿ<ã;ÿs­ÒiÇXòku®vUòõcuæÊ¦á«þ¸Í
ÑÊuã E"þ!6Ø Êæ­}}onË:W½¶«ÊFuÃÝUS-1ÀÕHòzµö?ov»®¦
CyÈçaÆ
pÛ¢&{µ¨«±1EXÆÂu.7÷²ÛJÊÂy[å²µ»bL?·×øèìCp:æÕé§·rUèésÜ[o²ÛòDòDÞ]ªä#çN;Ïð)â´ *z80Úèóª1çE¯´Rì,D4H(øË)gp=Mý«û»=Mþt8º-HxH}Æ3Rt?ïÉ¤C
§ßìéõmõ,;æðk=M6Ð¦uSÝ^è´®Ù6=}æóO«>
yÒîÐ7a'ûLUöø>ò  -6Y(¬ÀMZ¾ZHpu°c«à±[t*Ç*jwÇÍ$Áíqx©SwÑËR¥é®[XJÓ8=}üµnt9ÚÏ3z½¼¢[Q2Þ¸/=MP§Y&y=}ÚÛwëý¡àß¥Û§ÃþòýÁÝÈìûê(±¹4'ïÌ:Ûùk=}eªãä	ÒCKA¤Æy×nvÈ§mÿ;=M]¿ÕÕjÔª	sF>úÔ©áÄ:cÀÆ<$|ê'!×Sb¢V¿oÇåGð¢UÊ	u¤ZJýæÔÿÿ	2çì¯h£f¾QZãÁ	®	ì­Ç'ÎÅ[¸¨{?¢ÉhS5oU½c¢ÈÂÜ»JZmUí\áùµV6Bète~Ãw÷0Õà®ísÆk,{ý¦ûiK+xvÅåºñ	a[Sé»Û	Nõòý¬ßà¨= 7på^ÿÃW,¿*M½áR±Ì³FcË<üiÏ2|ö^vKÏHò¹uYbk¿mZ¡O^ÿç©~ïj°È7	l©¨ç_ó¼'½ßªåÏn\ O,wòi,Åª-¿?ð­}òÁá=MÍ®ÿÂ²EÍñÂ}¨³ô-ýÆ³úù56MÃ6ÓJz=}p³ûê9õàå«TM×Ve>G~Ù»Vü²öHByf<õ©+QWF+.ßAGÔ¦ÏèÚ½3âÏYÀ¿T¢¸6ÌéÉÐ*¸ÖªÏrÍëá=}6/U´Ã×ZþðóW.½ÞQ¼¾ÆqÅ½oâäB-ÓUJ¬má8øªK.y±>.Q¡a0Þ#!,¥BÞ¼­S?Ìr^¿_Ö.¹ó{=}/äÈAt}ÆèÌ¼4¡Ôîgl]ÌUEý{}|DÏä:°-Ñÿ°=}àØ éÕ}Êñøðº~¹¯4Yqm¹]!ºÿ=Mõ« :Nl"SÇps¸GåÈ§á+'M¿ÓîÁ.î¤=}mÅ8)¶rrHá"ÈøÂìËøÍí4ô72bbßºq¿2ô=}A5.YV¬ÑÚã«Þ[F
)ºhXûÇÓ>È?p¤ðoUÊÓ(³FpÊi¡Ð}SÚ~E !|ðí,Ç9½Ãë¸Üì!¤ÓÃX%DBãu&dÔËôg¥á¾l¿AÉ)Á±ÑßÈßý¹ód;|Â¤Z»#ñscµ|¡ÝOOe^ãÂxÝÍ]¯òbÏ£÷ð4½ïÖ³;û/ºsñÆðFØIn²q¢©*× kdO+Ã·åÒiÉÝ±îBr]LÜ|8~7vts÷9l|aë»EânÓ´GGò$ÍR,<e0i¿ª
±¾àsÓZJ¨?&%Æ~-Çµªö±;ól"=MLgÿt#
ü2 <Àn¬ÉäÍôÿ®É1SÄà= ôñZ¥-@z;¯üà¹ìJÍ=}ÊSe BÞ¯´~¢smÿ-¨CozÀ/;Çël&uñZÖPV«¤¼´ÀïYÒ~=}DrâgC	§ýçrÆ7âÃ$ÿ¤Ý~ÞÝo@°³Ùs;ozûÀ~R§ú"¶ü/ôcæ<°^Ôã/éow×ër¦_UgûÀøäâkHÈ{&ÏMëqÀYÈLÁÊGbÙé:·q]ä\PÔëÒ¤a£1è]á^Y[Sw¶å²¹gÒ0ód^ÈT.WÄÜ[ÕÙ*Hi®z¹µu}ýuý}#ú=}ÇÌRSûçMø=}¹¹>±ÿì¨áØ[R?ÿ^¦ñê¾xZRS^PSSSç1ù}ÝZá4fffdf¨ÕËw&eÜ$hä'{»Moöyg8¹ê¶@ìÛª0-ó¯:¹ e{%<ÎÖ}Þ¤vª6¡Àõ÷Gh8= FºKVñ.ºHÅ)<Ñ= xs¥BE;;áF¡·!¡-ÀYÔå^Ö'lÌ¯ßûç¥køÞ?[ë>" -9±/ÊÛGÇ	6OY4VÕ»º[öBÿ:B¡WÍ&½ÇÎç»Î= 0yæ§§5àÁFiAÍ²®Ê\¿<î!xÞ³E =M¬U/Ã¾ssæ¶µ·OÌ0§Gûúñò¯{^/~ä×«ÊB= ;4¤þû^Öï÷L÷ï_ñíx<õ;ó5ËÇ~¾V+äl¼Ñ°«Ôí¾)ÂfÅ¼o¼ÖùWa1køìFvûëûRQø]q | ï0gºúîy["FÐþ7^ÒRµÚèæøÔyÚ
«ãi Þ@U¾¸»* è#ò-ì¶HÛé¢ùL;}·O77ÅsLæþý8¿Óùñ£}.= 	<¾=M£ðQKTà^O|¸üggH «0³i£im¼_2ÿöúÕ¨LaO+&]L¤Þ+,k Þ¶Ñ~T¤ÂHì ÊèèÕÀíÒ³MÜô~J<¤0Yð¢´."»âèÄxqe%oÝyåæâ¹25UÐ/Þe.×´Øì_æ¯_zRÏíÑ@ÿôLc¥Íðy@YÎ¦}µZ:ÑÂgZÒÒ(©¢9ß	Y«¦:vÙëÎZJâÀVsOtUÖ Ò¬¹1ûÚG´OÃóG©)niÇí
Ô}½3:.k]ý²ÂB=M~	ùÚYp95½qýãë ÐÞ/¡(ä'§úºE/ê«Ì9ý%Ú!<ÏJP&|[,gzÄ¹±¡\o0Ôhûóþ¶[KêÍð= TjÃVñ¸D¼Ð_Ò
î£¥0Ø_1dPðt  ýtZ¾rù àJf^;Ô2éÐ=}Ã¨¤B~Dñ7ûÓÁ9³ýbA6ZØ´èÃg½ñóø.:~ï ]bªZì¿Ö²2QÄßo¥-¼Öá5uu/u³òD;gjÀêÃÇ|eÁ9¬u$*ÐÁ'ÓDelÀëäì¥Ò¤Zí6OÂ@âF0-J÷¤=}_Õß¬ÒlÚM½Çôó~ð76DEÖ'ds´ÙïÝßøaÊbÑ «^Í}&àØå?¾ÍF\2HD5òèÁÆdËdÈ·6ÙPÑ|¬Ôq*Ê>0¸Cì(ÛXYV²ýIpÑíM	kÖÅ¯}Íóôc7ÅbrñÐeQXæ© Æ¯ü_Û»ÂÝMþ©.ckg fq ôo@qRL°ÅYÎÈ»d'<±+±î,Z­-GG»ø$âGvÇû	µA~YF5"§)ðfßÐé¸oJRRÅ¿ôXÝaú.QMw1 1þøiSo¾®È²¸hÌ/Î })fBr.G1£º×cÎð¥°¹&WÈüAno#g ÃàLi²¥8ó=}dä¥$Å(³0h¢0OjfÀr¡6*#àæ"ãûQ?ñ±«²Xóä*hïx=}ÎÞ¬výÞV÷{u²cöê¡h¯QÏY aêL$¦ûÈçIGßþEýWöºýëÛßý×Ïði G´ì=M¦ßÁý'þºeâNÖ7Ï/Ñu·6rÛF¾¾aUÌÓiÜÃºÒ]¶éUY*= g[ 2-_	c:ðY)
¼9îK¨£8oSå¶K4U>+¯Ãî[H\wâRVê/÷~Ðnm¨s8CÏö©Ø%ÀaªS]ý¼§ r_¸k
ªµfÄéÒQæ2¹Ão¹&3Ç¢ u c5ë6}Í:B£´1uièÑfa&]ävCOx·"³LTè.I.ÊÍzB!:FÏëxS´Q{ÊõZ7Uh8yÝfDÎ	dÔX3QÂ±	½=MnØnÅc"@;f?ª¬nû0Lp´h,¸#Mà->+C= Ê¡±­^Ù= ®Â ¬QôÅùî
öqòbß=}±ÕAË/8RzT³ÃÌ/_îMvÛ«;7S	ìN4
ìo7è_¤ÀÜñÜ©è^U±A{Éö ìXtnÝÇvz
 ½½Ùo¨çaúâ?EHÄ»ë"±cÀÁEB]acgdck
ËÁEvÇÚM:¸2¼"ûc³Ï1mA]ø[à= Ý|«oÒ&¡® ¡K$ÚiPÚÛaº!ÊI#?3ÄLoxJò¹<$$»¢¸h.ÕY¡g Û30× ¶~ÃtéR0 ni6ôeìaz(¸9°Ù=}ocî#üR{¶ù*×<Ç\Èsa>#¿]¤(R F×X#¢¯mVRòºÃ 0ã51ïíDÅVst°YÎ=}ø´·ÇF ØÕÓ¡ð(B
YS= '0#×KB<rÔôþMz8ï³tíY­S\¿©æ s¢3~ÏcÉÜ[öÝ-y£îu(´{©ueØÝª	g×»c*5ì£¡Ð>¢9®ïîêzr{½¢j|W¯Cú²"Æ¼¦Xçt,òYCIVµX#¥_æ)3è "9ûã)e0ß¸ÛÍ¤³.¥>å*ÁpepQkîtÎÚ Å¶ïoÔ¸>³55Î= Á¿rà3S\ÌÒªs0 iæméQúR|ë²­FAè	Áç-ÚýFå3$qÏ3+wØ<üªUþvü£b)Ný¯j;0õ}áª[6k	WÇíH®	¨{2 Jþ!y+(-òÉýÎl  SÆ_¼òu8¼z¸Rîùq_fGHî?{vTgeÒU<S^£(îl=MéáDÛ¶­ùM·Ä7^õÿ
Ø£ $\ öv=M¦px6+ã*àÀìî{ølÊEy9² hÏ³!ÕÑjú¸ò5pG£¸fëp N_::û\RQ[â£®M¿L#8¢ÑPk5]ý«¢zg»güåÐÒöí<ôâ~ÂÔîtýXÙñµE®:¼VBÍ¼çtnHç­|Ï0[óoûM>h}ìAö":Vk=M©l\äÓröQR}8qeV<J"ÈFäíûI_Óã«DûëôzïåJNHeÛpµ×8æÆPI¦û-t£sp£i¼äsç)ç%0eq#ôFør\ÃÁs×CP÷ú½ÿqH²}EéÏtjTi.Òþ¡=M%ä¸ÕÙe½_ëÝ;+ÏÁ9ó+ä·9:×´irxb@åÄä*Ý
²íC­KÝ»@;ö4Päü
cãJ1«õãLPµêYàn12È¯ÙIr+= ¶/gýZ³#³}~å0´ú¾dÈwû{èÒY­uvëNôºô[í&öõ¼[9Ø6
>ßNçRÆÛeíu?ìýhWõM^8<ã*lkê@uú.FzFë=M-ûhêlT±ÏÌÚ®Eã¾d¹P±¨à<ÛÉÊ6åÉìÎ7Qv¬ÎÊýì$ºÑzØ'¨mÐØÒº´ZM°o9=}óÃQ·»¾LW·:+¯©p §àÕ<Ïí2gþá1é9|RówàutHý8ºï@¬^¢W¶©ê	]ð½6ÏOô¼<±GãQ~V§xâ­ü1éUM&CÞÍ|A<^ES¸34
Z!¡ÚÜa7Î0¤q1çÖ'©~É ÙWüã­)¼ðÁê1¡é)&n¬'eÚ!6¹¾P;<dm-T©ÂñPÿoà¿§Úì4¢Î³¬¬iTÑ9ËÀêIqþdiÉNì=MW­H&¨rÅ«q,ì9C6/¤t«ô= ªK5Â#f¿%Î)¦k Aù4jFv7üÃ*-Ð\éÌ:Ä²21 .¨½ü,= åÔ3VI¯¾¸þ¼¥ÂÆÏç^g°(QÿiÕ¬ª|ï
Êáu¹ÎÖ¥UUÁ­YE¸ã²öÌÐm®~wø%þzêÑ5\5oFn$»9³mi6zj1séGd¯ÉØå2(0¬>nE¥âVÇú°ÜéÕî£]þ´Ýs×7ãû<Þë§¶§V"íÙC'aÓX K£¯üYü­úl^~¦¡Rû!=MÜPa´_Cë.0£\}À±QP9woÙæQù§jKõ û@É+gI4wÖü.Û_é4GÆ·#ÛxEh6;L]¥2¥á5üP4ÃµuÅ	>çò-ç»ëé;]÷ÑÑY¶	v Pö%!Ì§8÷PÛ'rö§ÙßÏËí»kæ@æ{¨ËC4¬P¶ óÚÈsåÍý£Îx)ÜØNóÐ3õÜMüB¡Åø×½»#»Ã-á;Ì'Æz{ã­MòÆ0Ð²>v©Ø¯³û#iàBé]á¹F{srPZá:óöCÜ±ÀÃÊõp ^kñþv1_Lç9Î½dØ¶+u¥æÌ·ól~«Ùîû­µÕÔebyÞ«880L²5ìæôvZÉQ¦HV/ïF{8M*Áý¶ºÂØO~ü3|Øx¨>¹çûÖú;ê$hÌz~ç1Hún41eÆOXØ&É¡:h'¢yÓSvðxåÊ:µÆ-Ð)ì_ä;k@%"w¨s
ËØJÂ­V+á~àé4È'QØÇÝøÄ|^	Ç)"¥0Ç¤Ðñ kÂe\ 0¤|>ÿI÷äÒÝýÔ]¶;L	qìÅR¥-bE]ÂrÊý#8n°»ØÑGø,RmâAê_Ãpá%/BU#tÎq>ò*öú(Â$âeò|=M)!Ð'¼¹¼RÐzsÑx
ß+.¼¢7â%²0ÿPàiÝPñ¸MÏå:Lå-ügß=MÅ#MÚ+üfmi®= µ¬³ñ} $¨9<og"Ø[x«Æ¯+_Ð N×æjV¦­¥#Dw$¢ø"ÂK**¨N]EB®°ËßSâ^í%Í(æé¸ÞögÝ¢´Q{Ý»b§Õ× ±±hÙ^6«GàýQÃe]tÉ¡Q¯¡ñâ¸¸a·12À I¼Æ÷nZQ:bùh<c£5yÞ§è~xWÀÛý$õAXÁÓ4KóÝ×¼µ@ßºøz¶Ñ1s7=MÇ5ö¹k±R%×¶Hâð/
+Å»ºDó(=Mj$×JD	ò¡Æÿ¼"@ºqJº&ÏþIÑKÍPçüzDjIö
¼ììoìì¯íì÷;#¶º8l¾k#:âõØ÷¢ ü_WNì¹tjÏuÐÆ>I¿y Hø@u¬BÄÃ5Ûy:LU&ùð£RnÌµ5ZGù<§h¿ËhÙâ²zí¾¸?JàçªIx6ìÚËìV£áø¡h²'ºéÞXQÍÐSÝdÖ8ÙßM9S}À4To0ömeÎ¦\Ü³tQÖç'Ñ"Á©là¿ö&.ÓÚçï±í¥­£ds¿ý= ìZÔOäþr;Z©êÜÔÐó>B:½î-t®«d¶L­Ó¨$QèÔDÏ:!ì Ûq*sª4xã´®X&(\À¾ÊØXA¸¨Åe2PB*S{éÔce YÆB º©¦lÍX;O²:Àd¿fQCnMË-ÂÂðÇ£ï¶¡SÚÁdC,KÂÍõÞ=}=}ß 2y3R¤Ö3=}cÐ'Z®¦}±)\(YàP8?ÈÚÂÔºÇ¶ïiXEßÊè= êèÅDÐ&sÙ¦R÷_{Ù±4Ë2 	ÆzãT!gU¯CÀ@¼û7"ÌfÆúX«à-öRÄ êP$#¹oü³ãq¿«í³= sü§{ÿ«·=}ßÍ q?¡ÏÙ¨½Ãç×å?gÆôÝi,×¾Ö³G¾»= ÙM9jA¿¬R¶Æ'sÖæe4æ+6ªÀUùxGÂ+YbçÅÉM"äéÁZ]&ý¡9å(¡nn¶1Í^¡<ÞÍeæ:WæéÓ#4ÒªzBËÿ:°5G¬ÛÂÒ(âÄGÿö*ë¶.ï\¶l^Iì°ÔüZÖKXSý¨'	M¾b]±>0lùX(^^¼òçHÂSîÃçàó +!mû¤Âp= w¢·nHµÔHÅpÈXw]©5"1ü>
±XZ^Î9â¦gþ=}oäíçY÷Wé[~ÑÍ¾=Mãª¶&$óÅßah
ÂãtÛókÿ^Û7z¶#X@ùrÏ8FG"5ÄÐÄ~áUÒ8Ì­ËÌe3ÎñA´ºÌ=M¸óÆ~2Î,ô®dmÖ=}»u¸Æw:á!@- ¾ *ïr±F¿/Í;öMÅÂ1¨:4>&YÏ= ¬]ÜèÁ/4&øö0aMÞjR»5bãXq=}A%è9= i©¸¡l¥nô@ÃOPz»wÓÝlX
:ÎÛÝ(.TÉ¬|©Î¾²ð¬ðÉçiå_*&F×[	oô8B¦Brþ=M¼-ò»ËÍF?<@üønÍ|ãxÔr6hÚpÌöç#5íl÷.à@]ð{¹ø÷ì<Î<ÂuwNLO"_u7°Ïa ÿ\ÌrîÔdðó¶§Ô67¤p£"ªCËu@ïfcOò¯x¸3	²#lf1}U¬q±ýx¾jõ×»ó±ñ	ÀR³.ÙýåÐéIcÎÿ;F? ÛÝkØýóÎóø6¸'áû=}t8Ô]&ã°¿|%BÆ<þ·ÎÜ«ëÍ>YUÐgæE¡ã(Á
8ÔXÀ­vÏÊ¨¿6bnµ¤GÔÁ¹§\)é«®~î¿w"Þñ£à/o¯ëOïr(ÿ
õOá4¥àyáz¼}·æÌ²ìB#Ùø }JÏìN\]=}Înü4VáaÉlIA	Í<â:^&q/nõ×n5;=}Ù,ìâ­|0Bõ=}l;Á¶®äÓ=}a&¼½óß@ÂU¨¯ÜüHÝØ¯Cþ6ýjÒX_16¿X]~Y~;×*½ÿÊí²2
=MQ ·ämòjyÂbá]ÜÍl#à(Kð5ÅôÄ²ßqE|sª±×ÿe¼SÐo^[ØÞôXYá4ô@1³¢[#ïQ½,CèoJ	9Û«ÐKvnC&Â0 »¼°SäcÑ07 »4NòÚhr/#ÉReÊø?°Oíÿójà!c³hziÕ§nËGY³ÿòò,8ä¹àø¸¡µ¨X[|.ôóv3<÷£Û1²a<>G¦»=Mlf*-¨>9C1TQÂñ¬ì(*ø×d²¬p	?n=}ê{ÕÊd\ø\*·×RéÕR_Y>7Û!èc.¢V;$|òè¯+/UcMX? é9ÀÌéZm&,ôvõÓé¶ZÍ<VÓü°	Ti{êC§)ÐCU·RsV$gÖ¦îÁ ÖPö4fÃÑ>×¤kc1W\åÅ$Çp,%j1âÂ>¦¹Ð¨XþùïäRÜJ¿o{FúÐ¹ÝÚ³ó£ëî¸QE@mj6¹e¢Ñír»{Sg½ÍRâl¦í"C÷Ö]§@¸±ë:Â(íQó9È«Ëîqw±º{i"ÁjêévVÏ¿KÐ÷±ñ´ìp¦o.è<wÕÊ¾­Ø/iºdr2S£ú~&Oãè.¹
x*qT·gÀúÛx¢/Ã}ÜYñ-XlEìøöt¢Ù6À ùG
;%eU	àQ-ðÁÆô+wcq÷æÍ¸S©l¹¾!Û¬O ISüu9=MÊ-	!²;ÅUº¿v¶å±ØÆá¾ @ë]Lke1³,#o¸ òÄéÎ¾$ê¯3eI Nö+ãsQøÙöá9¬Çì<= 	!#\]ôÅvÉplñEÚt^ÍUMA Ï¼ÆüÓú}Sú",Ú}Î>P=M¡nOcùÀÑþQ{¹ËÂM{ppÝ5o;Úþ¨Wå7°S'1Ê= Eºg"¦^H m?P¾ æcà à°!£!f fT(Ø#ö%P!»3àc= ic   ðü3p £"Øä¨3ðE= "(	Íè±Sàçg>W 9Î¼5'¹ñ3!©Ý¬kD«êíSãEèí«òªý+Lo~EhÿÙ%á¸ÞÓ®©ÆPq²@¨Ø@ù£u/§>®\è¹'ÙÞ'ë>Ï°cLX«züèCõ­NÃöq«OëÞk^ÁÞO}a=}¼eaþ²ï.5pf°²/²Ú±Ë=}lZOÁÐÊSy5xLQSSOwø¹¹Aìì¸;ÔZ$O0\6kÃÎrÉÅÆlØ2²_(z¤&ìL¥âð¼[¬ºIPN¬¸/3ö¸4=}s¦Sgù0ÆíÛàÆ¹(â¬Ôÿ²ÍÒÁOøVSä®PþWì»9wx^Ôx<Ô¥KL¹ihx\ÜpÿÕ;<V³¨Ðòõ«çÛ®6¥ÃXF<ÿCà)Ss¼4n9ÁÆ¤%çÊe×X&¼1öÜe¯¢«.iXÉ¾Hù;%wìØJ|ûCàS-(Wú®{®û®Zñ¢0Zå¤Â,Yðu@­lð T*¨%­ëXæ¤%tÑMÌ¾¨ÒsH*sHµ= Í¨_T5t|Ìö¯ö" XöNV£mYöÇzÿqovÕÀþ.V	*z©æJ:ó4pÝH®qû§ÃE¬\Ú®T±*W¯2¦<Û¸àÄaxâPf<§PªQçhÐù*öÑXªìX»$vÐ
X©eL	Ø¤óa³ÝÆõLÕæÔº¬ôô»ÿ4)D=}¯)3ÈÃ¸d;=}ý­ÐNÀ"=}{Ó¬IC¬¼õâh@±óRF¢òZbs9°ö§¦1­³az8ì>+âTªH[Ql|¸ç6¶¥å@i§CË¾LêËGdÔð3Ö¤]äp2ºþW¾d¿µ(H&b3Õ;ë°9Ûeôó®jdúQÂÑTÆûd7.uo{Ø<Züºæ:'!î»Ø­:iÄ4ÓÂÀ,¬ôQÁ]v=}/·tæ5&06,ø$Ê¸t¶ØMõô[ªVÓÆ=}Éæ¨@A¬K¢§«Kä>N¬È]w5øÚ®dC{¼æs	ÿÛ3_ÆOSLMÔkí¦ú¿{¦YæÕ»QÿE­L$1îì4:6Æ=MrZ¾6Ày{øA<(Ål1 dbm7ÎN !¬Ûlî1_= ©néµÂåÅd¹¬Vk.d,4Þ3~LòôÞ1ú¦·½d=}q©7vzaY6én±Æó¯Ã=Mµ\^F>ÞªëàwÞ»ÏÂËþúækéy¡½ãyÝ÷¥³jp'ò°;c9¡Zs&×]Ñ]ÝUî« ­>_<(¬Ov Q×*xuòRN*k;*0ä«¦øÄüÐ©{ÖÔYå!1è;å&ÜÃFUfmü&r3ÄèÄQñb)2ãT#À·ÿ¼%TqËZs>cU´zuÏ	¸ÚuQ=}óÐ-G»ªM(e²ZVê¬½v¸ Í¦OT·S°{@R0MðaÀfÈµÌ_Òú|â<ñ¡îÐ¹AéÜb+!¡O#*¾ï3¨0âO"ÍxÔûÝ
ÃÝ'´Güír-|zþçWæ¯$×[ÙÉJuøAD!>'o0K¸5×=}þ\e8
?»þÆüÜ=M3íúPþræ	M×Öq&@ýÑWnBÓ>7ÜÉTùÜQ¿^®ñ-,å!'9ìsùÃ4?BTu&éçãÃ,?(&ój /¤£Eà'â£= R(/Â¤¼=}Íf÷I³HZépôSGÅQ¦+^@]ñïGXg¶ò¤ssÀ	­/µ¨/6ÊbÏ´%°/³~å¨5|e¦U9¢$BFp´¢cë±²êÒý´f]ð®ÆÆÓÎa.$ªó=}´Y_óì õ Xó¢Ëï|3;-%ÏS)÷ iTlWôáµa6m u¢Þ>q9 'I ±N}ÞC>hïGÒ*Æ·¸PØ¨)Åéø¯Ë¡yèZ?1^B\püõôÞç¹Ã Ôð4ÚIsmQÚÆû¡u°|î(®±Ø¬$©+=M­°8ggÒòCÆKâåþ6Ä¬Ú \Yý°-Ð´XÇÌíÁÚË2ñ=MdÑkhhÉÃd6ñ«Qt»|Z³ÜuÖUhÏ½çØÛ}½SýË}©)Û ÑÛÇwßC ¾ã't¡a.ÍJãpa/	ÁâÿTVÚ´­ý·ñ¬?{«<
M2I©O}³&ÿ¬øu®:º}ëßGnêtF@1«=MÉØ &Õeî%~ïNõI'Oöz:?*<á°TEÅ²{Ï¡xÔ©ä¬É®ò%}Iù$§	= s~;ÀíT/¢¤öìpg ££»¬údl°yçðÖïfÊ¶úÜÃï¸F÷ÌìÊÝ}}yÑ^Ö½Ì~Hí­ÒÈÙ¥¶kmzkk£%&¡ËmsÖ>ÀA}Ô?ºRË%]\:&DÂ¾[,¦Ñ$ÃÐÎìn´cÓ5ÆÑO [}=}áÖ(N¡ñígµâ9c&=}Ä®ÒÎ¾Q,öÔ?è³K'VL¡](ÂVÚCê0ø##{ºÿ3¡6®L(¡mÕ"ÕlÆzÉØÌÝ;Aª¸_ÛÕñXã0î|ò IUÂâwÄ¼Ãú®[,ÊZH«§/nPäõ]eÿõuóuqú´Å³n=}¸@Ö,ñ«À7¸£Å½ïoàõ .® <òò£àzÏq=}þõaé¼ù^Ò\¡Êáä®ù!MGÓ& adePõUáßá=M	tï¸
¿.Ç_ò$U+å¯
w§ÆËp;t'Q$2%$}­¬ ^(f%e_0^ Ò¯°j¸kª2{m4c@U4N-LCæª!3gâùã¾Fm¬EÇtîÏ6Þ¤ äxN8a©Y(O}=}­ÔWñµÖê= W¹5(¹~o»%V´¼ÒJÓ°ú:ÎÅ³§0V÷zî!°¦¡øðÃL!¦]èd< ÛN´= C¤(Æý>ñmÇs=}ïû&NK<ë'»é_È!ôâ[õ³"¸ÐNVìºª6­°Â*v=}7%ÇHßDÌ/2Þ= 5ßK9'ën"?¿lØdmçþ¼S3µ­¡BÁÞø|4ìX6!ôE¢z@ù}ï<|à@T¢#\âCËêéÙdUè®8ÂrãÚ·AÙvq¤A4ÌÈAäv¤ Ä,½ÛVq^ºÞéçÐ3'Á69÷[ÎxÈ»áTyþÎÍe úî<=}ÕØq¿ñ²9y×m²càSÀÌëxé c¢b9¤¡1c7ÈHD À!xÚÁáò-[xÚ¡xÚÁ¥Å;úxÚÁ¥Å;zxÚ¦Â:zÚÁ¥ÇëîAÓûäd¢í"äü;ö'¦&Úlvs¥æ~cQ±¡K¤ÐáXÕnIÆÛ!£à¿N;Ý&T,){lH:_}3 Ãø½óÿ{ÎÝxöD= eËjv)j-KtÚF7ÀÍãÃòeS³1Ð{!ëwH«1¬È¸Øýi¸0mOPüéyMmOXÂh¡º<¡!øÎÀ+ÓÿÀU!4¹nð?4¬²Ôj FØ»ãw;pÃøÐ"ËT'b[[Ý¹?°#O·Õ·O%·¹¾É³ä,}èÚöÝvýÝsÁÝÑ*z¼wôõÆãúÛ³~t±üOá±Ë2¸[
ÁÔ(û6ùé2oeÅê½úLÁVqR ÔI7ÐHh=M*àCY¬Ñ­p#¸ÞYvGà¹8	<co [³KiRGj&õÕu6:ÿ¹C;´ÕÝèÂËjÒOõ*W±[Åk¤íknXâ±vRa¢¯IC¶Ñh}£]ÆãZµ*StÂmÔkøòÖ¾Ö¯w<
­¥ñÍªÊw)*èÑ;fy>6z'ÚsFaãì(¶õêÁöcÔ@ni±c'ëA>QÐ¾ñBù$JCvb9|U3q³Ø 8:Lw(ô¾îMàaSåÁ®bGÎÎ²ÖÍÞ= 
<Ò!¯É."îRUéwºÌÊaq_Ë;e]¼.ã1ØÄ~qØ´¨
©pz½¬ÓsÐü¹Ø:2R%3§ü+ f=}?@Õ,zèz%øíaj*MôÈÍ$w§îyfhEáeD¬
ÿtáÐ¾ÁÚãÃ¨V¦eÖ>I[Bë+V(mÀ®TBã:ê{AÓà½WWºÎ.®yj{µ¶y/5kÙ×¹wð ¾ÒäÄ-¦ pþ*-+i} Ë}}ÈiÅa<ûceÒ¢]ùá¾vÿ¡+øtÂçm=}qI7hyPÄH±ÒlØ¸juOÔ×ûÊ86
%W=MñàÎ{_bØÓçõÓÿ%$|Dì£ZL3F8VãWu";¼×H°×kyPøÑâëp®=M1¿ëAp:U>2{íØíwK1-<êJÜÌùksöK&êB.3_g§%ÄÅBÆ_®Õ¡o8C@Ao= #±®Pïf|§áÓñØ)¿G4¦ÎïVYÿjMa9)õç[\Ã]= QßÃ\pn,ra7©ô35 õH¬mµ[ÁÏ¿¨îÂëqç¸ñïy>°ã¨áP4ú¬Pi;Ò_çÂø^büZ°d!j©^/i¼CpÏ b0üö¬FE´ôU$­iÀâ´v+)ñ×"¢:Ë=M¦.Ur{	å=MÕ
IÝFÆFÄÄãç©Tùýl=}<Azào.ûy2£xá3yhUuj½ù¹c-¦&í-tüßùo¹ÊËElßµÕx¬îfF­eþ|)¬æ«Ô¬æ=}f[8mí ÝÁ¡Þ¼]"dÃ>PÅß?F^ßÁVä¬Õ¾F ¶»,L±>4"=}8º¦ÁØØJ:Ø¹J%ã­JÙ/WuØ©*ã¥<^|M½©­S3<sd#ÖXæ<@ÍÃNÚÿõú^úÑ]þ¦ÀÿÓ³ÜÃBåç¥ð	òS,çT à@ àÖ d"r°¦öFUlëü9Æ[,óÒ=}¦ùîùÆªÌ(@zØ[«+ì=}æýûÔQ9iÅí)X&7­Ø%µ²´Ã_	@´ê>ìÎÝc {À·ÖÇ³C /zïç %ZzßÔ,NØ/Sw,¥¬$µ²*¬^S=}ÆØ ã:iÈ#eEÈ¬Íþ	õ{É;^c÷Ô§ìgÁ°^ºø»´ömìéÆxÿ%3&.·ÉÆ±l·Ó=}-p,Cóó£l[dNÆT¥R³=M¾¹5Ùýb6Ýr¸MéWB$Á/í1ðm¿ÁOñÔXLþ4¾kK½É¢PgsáäÜðSö¤ö9ÍKzotõ= ó}O,LàænÐ6®=M^5;{°fÚ['[Ö^Äýª¯Í´M"&¸´¥øM½&}þýç;ÇÈ¬vyÀÆV= mFyÖpc½o(±Òk.Óv%ÌôpÚvÜ¢®Â5?I].íý¹2RúHåÑ':ô¦	T°éåXñë(xj¬3B¦_×'~H>¶ãðy©'+XÅÜËXùêñ·w¹Ï-	¨	rF}tÐrJlxËã¶&¹Ð?Ðî±lqýànïm.^Î\RðÐÄÉ?ÒÔ]hûîqç¯WH÷CJvÞFñîBÙ®Ô|Z@ä}#Püt'-F:¿&¨8§F"¶Q+à-æU|ÎÍ£ùu+y£¶ý.Ø¢Z\:
-ï*°s .ç$áås¦.
Á89¦cRY4Uh©Ñj|:èÑô½9®MY<¥<ÝX®W·cm#ôU	»UDaI	²ùlZùqä¨RÍ³Î 'SA¹g(ò©bÕÿKáFÒm¸\Å?Ë¼â®E7g6ö3«úå6][éæLÁóöó]ct5Ëig×nò¦Ï	¦r·îêÆr= Ö´"6s´×QÙÇøñúõ^mÄDÏ)ûÈåRªÚFÅágéôIQ¨Ã æKÄ_¥Ì®ð¾=}y4äò-I¿= 9Õß»BrºÈùÁ=}ýôQ÷ÃKì|Õ0ó+öËÔq\@ªÕ§brZ"/O­b Xð iðÝQ53ï Ú>Úm¶= Ô­pî<S  e¨ö}ªJ=MEÖü|£gUáfÙY¤"kï|¯V{ôeøÃ~gøæhKw=}®G>Öâ±þZç7ÛÐ¹_õ'@bS(õzáh)f[9ï¤ ¨mH¦a^,Çxs®35ðúÃàí%*J6ÎdÆ2í<e<KìXãX<X©ö#®
\.«Ï<ÕÅ<SZ.3ç½6.ÃV®YYrtÊtúOêóð?H}ÿ[³´u>µ8[¶iä7Åï^¸iO¯°nØ²HõÒè·KÕ8øºB2RF;*gÚ(sW+ÿÒ(×½1ú9ý4W)¯_+g(¯ZÒe]yóÔAL÷XT«eEí±>ËxqÖ5¾Ü±¼Õt£jÂ¸ö ììYÒM©õþovÐ7¹ù^«Pâ·Òé¸¬Vó±~	jî]pz0%d¯À!Hù2	½n2åÅ²hþ"Ò¬SÄ÷ð¿4sÑyo&Zñå"/ú²oÏ¤òÍ;Hû+-ÊùnÎq1D»2c½þÆÜ	H[lc»¯q¿Û²_±ù%¼²= 
ýNóÈÒÄL¹"³óÈùà#Ú3¤íÁÄ-ï	»5I{ºÙ	CEj×B+Èo)U<ÉÀÇrb-9üÀKzhÿ~-§¼ú­g(½@¢n>ýàm3îýÑâÞGæzæhÞðV§ïT FÂaÐ<^$¯U¦AÐX<)íÚØTTµñR>NsFÛé8*F>1¦ý?]3_ÁùÝv?õÅhØL£9aö"H/ï¥¦!Ì>ï§Ú¥(Ò(kÀI|L¶Á÷ÓðKÑìJLÒ&¦®ÑIí(åz ¢aÑÆù,#L0Þì2ÞÁvÐZ­5/öã Ë-DÖð/o'8¤G=M¬gMî8}
¢ï|é-Bü¡×s]1û©ìû~ÐµC¶/·!ìº§w_àV  DG%Àª"Aî,düª@¸_sQ,æÝ¬¼¼E£9dýcðE@$WcÐfHêCcHB¦ÆP8¦áÉÏ<}mP]H§{Þ
ýc!éb%æ§J= *äÜs= o})ãIj48IQXd©îg´Ø³Â¤	{EJHÑs«ãT§Ý´CE§â®¶_çí<­ÛXfå,ªÈÚîNg3.<fXpá±sÌj{îÑßºuMçî.ïf®ÚF.Ý6®ùÍ<=MúX®ÊëÌjEgÅpÅfÅeÿ¯ÀIóýÆA³¹NH¯
'µ	wÅj;íDCºCDV3EZE=}ËiÌ	O½Ë0iÕ;jÛ<±¶^ùL=MKùK9oÕ	.ÃïøOòÀOUò¬ã¨~â[ñpA^Ü¾¾PÞ°Áßf¸¹C?6lûÓïAx¬PÁaâ)áG¢ð_ªp÷Em3pÈFûnXºcÖÖjÎýHLú¾}^ó¹ÅÎ÷Ën³&ÒB:î­ÅÉ3ùÂQóyv¢¸ùÎ!ËÓ°¥~æ~vÎ_õMxÊä®­¨}º¸õ69ûÂÝ¡Uö»ªÖÓ^%1LÖZ¦-
Ú·%«.Ò+®gùÉG¸¶¡Åüoëø5Öá-vºê~TýÝO^'½R¹ÑI3îÂW
ç¯lWöppäI:CQýU}lSótC÷!=}È^s½2WÁÍð@ÿ.ýéE×Gù<cKñ¤µ#ÉdT¤#¦óG=}ûPªþ:k_G°ÂRí3±¿ölºÌS»l%)µxPÞ.¨SÀÀ+p¯ÅtØY]þÞªÎÏÅ³m¨û¹3Î{qÞÆMmÀEyîÄIG¯ã~ùõ¯Ò¡´pCÃ^*å
fÚãW³åâÍôÑçÚ'¹½-Çú hrN¨ÆÒ[åNz±Ñ§.ÃÏ'êcU	(-÷Xf»ê¯3ï]a:·oòÇ	ÒLÅX¼ÇÉKNrwÂñ©ÈEúÿ*½µÊÞG§»ô6}Ý½jÁwóò« é^ehZQ¯IZ\³Ò×s|ªü¬z+:àÅR¿fWôâÿ±	æ/TGù¥f#C°gAÉNÆ/jÉ pY?ÏDÇ³õ´7ipbrMËGfZ½öl÷Õò'x¡:¾5Ö£üH	 Å=}Æl=}Ûë[aÓÂSuáªÎèJ¦^:xÆ©#Ezrô=}Û*À{oü+f?»^ÒOÒÕá¾£nf$Æ.à#<_(n-æ­ãcpÑH"×-ãÐ>¡÷CÁTö¡ãB}2¯âËÃR,ô[¯å§ºÑèV.õÙQ
ö$¾º¨7±³PGRòLÇ &s¼(KÔÆATÌê»®÷Þ¹(-¸¥UXV*UäzDæÞð[DaÂ¯4­+%/{íU£@ú+Zìaà¬Ù¸ý>îca#Õ»¯37 %Hj~¨Ãªe½Ó8½[LaEÞIZíUdËAþDOcÜÿ,¹Ø"ÞÏà#KñØ*¹ËPòÓy£ý÷
zàù(îÝ¬QHå8÷h3Øæ¹ v¸ÕIQTù<¯ÒìQýé"CõLÑÀEÖmÕb#KVÕ¦ÙUaã&§Ð¬M¶}ÖeÆä.¯SÐ©]6]Õgö'\ï É±C<<qÓê)}½±Sÿ¦Ûø%§3}Ðf÷5ÛâÆ«;²Xv¦¾æ³®Ó3]°Ý÷#{z\âî3÷>bTñ+ÃÜps	¥YëÝQAî;÷[ »½/NÇ¬ÖO,\ñMã7äõ/ÉHóç+Ý ¯zõ C"ð²7 #£#q;¨a"ñÅ\0	³£Ðø[(ÑiaèÊ*bÄ:,ÃSáH2,¡R¼Mã=}RØKcï:9Tæ¥Àþ\$Bc°[$ªê0L92ªÞkc]H4÷o¦H¢
c^B,^«ã0=}¦´po-£·PôÖ·äY7éBç¾=}´¾³ã±<Â"YæÔsàÈ"¹%5t êV%¤x%ütÝ¿J°|À= d³
ýc©Ã´¸DvbÈädE6H±Óq©¬ýj¬_ÅdçËjÌëpb¥ruß2ÓKµøüÄ¤®Ä^<§¾èñm¯ä<®üÅ<Û­X{t[d\-ØîY,ÖèÃYô?GYäYj3Xö~°E¸ÿix¨{6gàs®OYîôÜðÈê¹
Wu%ÊB®â2u¾R®ê*®ÔJ.÷¿<ßX<üÌÈÊðÈùàñÆÚ±h3çÒ®*5«JßªwKg¾êÄV®0µûJJ38ÉètËDÉüwésÊrÆkÅnÅiÅuÅ=MýMÎ§ö =M:ÓßÆïO-gåÉÁ!õìå=MB+ßE
»¾ì÷7fÊi&ø·D=M4iD9j~ý±äþL©QþK1]X(¢' Q¢H*ÕûVËûÖÖûÖûÖ[o2ÙÄrNgWÇ[¹)ý¿ï|íNoúáöN^ê4ìïQ[÷öÞ7Cê6ÆèRIÌ~h¯E=MSWWXÐO×]ùª°@ s,{K­ÝàöuÑÛÍÌ 3»= Æ±þYÔBÚÐ%MÜÔ®d´×°Nz@½~ìqoöIZ ±Z}ð¡äôX	YÍ®"RßrìÇßäÍ2ÄÉÜÔÇT ±ÇLEÁnÕ§!*»ð´R+Zû¶Æ[rKWúY
e&nÔ(<ªÄehÛO©6ÖÇ³.ïIÂÛ§êés-ZVrï;ßÁÂ´ajÖ9'3±êÆ 	óR3e9;R?¹«âIîÙÌ ÔÌ©{§y;+êW= ôýý´û§ñ'Ñq<Ýçaâ&¸[T*~½ceüe\5fNW÷=}ß¯Ã¬ßï°5^î§þ?ñKJwdw?ÌQáËÏ"YA"õyØ\L!¥IüÌ·¡nµ<~tJàÖz)ÿ;u úÅ¦UU;W¢¯QÁAöW¦Á®I"íqq)ÙVHX§ß=}ïö)%NÐx=M®¾­3Þ°X0 ax²>¢W»ãQaX2ýÙñXD.©Ú)Ð?jbÛt¼kkçð©LÛ ø¶¹4ª2ôO£êjìQÏ¦ZhW= |SbzÑ{'|FÍyOæ(¢' Ð"  ¢ùÖûÝ|ÓûÖûÖ[ûÖ=M(
(,ì*<ßc(<ÀMj÷\QÞ©C8hRÅ4®©ò<±aYI:Ìè¤j¬ösA³J)?Âaäm~ùÄ.ªòtÍôGÄâ )fnTÆÃ×I&ìØáÝ7¶Ø{sè&W7[Ò>ùsè7n$ÛÐÓKfÝýQl=MXOÜêÜ	×ü·×]:à5+ð9dn¿0úc¹ÒB<#ÅhìfÑ\ÄWù}ý/½!<Y°^Ã&3úQ¤õ§q7R¢ËÅCYTÜæÂ·W®çFÐî2*GtÄcÆÔ&Ïîâä<ÜQþN¨Û5Oûå¬9Ó¢ÞzË8¾Øºu§÷ðÚuVT3óæâ+ÓµÖqßµMiû8[×ï=M½DïøåýÛ1ü0ÏÛ73ñ´·=MãI_uÏ/@.ñÔP'F?|ßÃ8<cõXKtnðÏ$§Jn2¶ªÉ_ns,Ewï2<Ê{ï3Ö"¹sO²Q2!±·1Ù¢Ýýu¾;|²êåØ&çKò¼«g©×.?ò>ÊÓò#Bn^¡gû¸¿ÐsÒ_ó¬Lº¢ÛÃ~\5}Ã:¦á±gÍÔ|_ÐáCvV¿pÔ¬Ûé7n8åc;*zÿQráLµ¿´KÂèÖúEÑvB:'8åñ1­Ðh\ï¥b¥$ú2iiBÍG9ÁG¥ÞbJÏ¤TÂdR6éË6åÒF¾cªdNÊrl·îGnÆ á¥´ê7hÑ¸êEÊ¶òÌvf¾fY	z5trÅw¥ÄUöæU,TÍÝ=}¯LIÑàøÎ±q.m<·k+ýÍXÖQêÛ½Þ=}¼~7ï£Ú:òãõP¡ÏB)¢'àX4$ ¢Ñ{«øÑyûÞÊÛ­ûÖû¾Á¹*3]t±ÍpEôk­Kõø ÍnóT%:ì{Ã¡§p³eUQ0ÁöÓh»/íúØ¨¨ñAyÌkt«N.]¾WÑ|ÄofÓ^w¤&ÏUÀsèõ¦¨¬hydÒ·Q¢5æÜW	r3b}myªÆ³9)íÈÓSÇÖYÑv6¸á\skFyòïàªöÌøÏíÆy·ª-ãxõ&Ó!ÖÞÓÅÊ§=}Iïð²ùÓÎ]fU.4À±CÇ<èçG¼±°+µMN8ÙR±K¯üð»
æo]ï½¼?Ì	á7><±R¦Gvå~XåÄd¦æ_à§¶µ^Ü0Ê ZbÚ­0Ý°*1×ª¸tHfÐ¸âú gß¹òP¦ßgÕQ ´+!ÄÇ&Â×E°¢@®í-°PC§%	eP^UAx½,lH>MÁDú§_V¬ÖOµ¥bXû3C¨ÀêQ2æfsD¢ÆH"ngBJººµñ¬Q­Áx,ï?å@N¨åLg]¿8gàX~õa=M1810oî®g}¾à£³)/iüd¶ÉD1OküD7°¬fRãÞFSÔF%ÝI¬hÄ2Lµ©ùlkCùD½eÝóyN½Â ,zÆð^£ªÂlz÷ÒæT«¼~yì]µåDVÂÑù¼me.ï6 S'µª|ú°k§>ÃÚ	= >î¼;´oäÙ2e%Ü!IW*¨-I
Øb7CÒ¨mNÂ=Mq1cªQÅ8µçå®Ná)&/jx;~êÑÅ¼Úyjq= 9£ç´±Á¬6ïÖ,HgØ¼-ö5L·w0ÚÙ"¥vEñEµÔOË ûj¦råÙu<Ýze£wUtówUOðNÉÿÂ:<¿õ3rëÕÜ^tëZòë°LÎãi=}C9ZÀ>»½´ÈW0¼ñ= ä&n¿¢mCOÊ;ÞØ±Ñ/:YýäúNm({»èý¤À¤¾DyOá£¤ê0I³Ý´7Ä(´øk¦»¬ïØ(8ëLzJMYë=M4øµJ(¼Â %zjrµ\:ÌdØ~©é+?&ä!ªÍM¨Â;ÕûæÎû®qûÖûÖûV®¹´Ñ;zøÔ;ÉÞ¸¯¢?¥ØågæwSwÙÚüïæûªE.ðÆ ¼JàÔ!öý,ä/Þ°{°ñ¢\Z7A¦7*Åc¨sb$§xRäìô*÷(zî/¸_âäî1Ã(eøØTbÅ+16Å®H:déý]jÂ%q6½¨c´,Bµ-V&-¶­SÈÓõ£yºôéÒÜÞé6÷ä¹·ém®qC·¥ÌñâÐ^îÂàf«·MîÑè»êÆl»_zû¨>Vøÿ³¦mçß¸êAei§!í<6Ù.æ[DxðôO^h8ãÅ6·}fÕéMNvÙÔY
 ÞkÖÿ\RÇØqðÃM¯¡½]ü¾>¹F¬|Ñ	°çÌ{>u^L¯KX»eÐÉÔÀmcá¿ Oáå)¢^ë$Ï+ò}4DFX»Äbi²ÅEUiN´=McE	h.Î²4üK	~òÁDëéú8ªrIÒväcÑ×ÖÂ;åÀÐo¥:ÉèRsQ¥åûªSw5]¿HÞrtwóJÑÆfí¯º¡õðäÆÇÓÌÁQ-õ¿ÄIWo³µvm£ºGTùj]öÇÙc³=M( b) PûìÖïÖûGûÖûÖûíU<Þëúy /¡ø'Òe-Ä®?Ræ= ü¡Îe"Kê&Öu+ìË?üB= ¡k#¬(ä¸0f ü= ¡¿ö'º+Ìþ;ØDÅ= ß»¡/"¾Yï'ÂìWîoü?ÂùBa4Ñ[Æö©åiä§ÉdâB{±Y§¨¶wüIådÒòqo5qË¦8g@V1{¨qÍd÷nw±ÒÇ¸ùgU= 49L,ýCåºQQ²[u½A~ì=}SkLxDÂL5½¶«cKådÎ£ÝiøBâVq§hÓkÕgûKz7±.ª5§¼¨øôçå3³sÂø÷f¼\KÞ_O²0eOªº·dóëÂ5qÊHíßÞÿ0þ4[ÌÿM±Ö®x5ª¯©ñ¶ÞxY?¨}¶Áx©>Yþ^LÊûF©=MÛÇÂ¨-ÓûS±ïZú2Û_]7ÉÍ²ÑÖõNû§Oä¶ðÒziËMÍ§-ÓiV÷vøfû'¸½Ñ«õø=}Û/=M±]ÑÇÏ=MÍ÷ÝD(> ã¦âP îÖûkþíÖûVúÆÖûÖûÖýÛ¸q×y+¼©*üwÙ}Ûîî ?u[÷&L,§|§èGkØótN	@þl~pýä_[á-ê¯L1¿ýtl1û]ÊñÓúÎvþCXSÛ_¹)ßÓSöÐñR;ï£g>Z¶¬ã¶´ªSÍe*Ìs£½]èÄ/{QÛîìËê§y¦Ñb"®yLI[3pïìmÚøËAi4]Û_¡®½½fsíÁ©eP%u]}(ýjFO9ùgíS¯rüS4ÓRiÝeK*?²ý·ôù¡öÀQhQr¬þÅi²o³LÝ{Àdª÷ô®©6­óÃço¬u¡Y½c.´jËqé2:ò1lBY1HA¶L²³yZ½<µkV1]~nBqUôÙÚ©ÂTúÉfOxM:¦°Ö1°l9­nï¸^19úshZ
ìâ<«ÙÝ «È9,¶Î¢ñÅÕXFß!Ê)»AV[\N¨Ðé>xhgçA(®ÁÌDê_¼¥PBbõÎà-ìëØ­ÂqÑQØx
*vÿA
G¨Ì¦Ôßç8/ÛWÂ0þ(xa"ÊÿÅ0KF£X5Y¸K½¿2DRtûÆ&ÍyºXÝ{;qoQ~u?Sã,qþ¬{í°æ"½vèÖ¡DùÃ}äÊTì=M¦ô_>X»%9î7rzX^H(qïbPV],®fBöG:ÇÖçaæQ!²»³èU5Þè= 6êNbÕR?£6¼r¬H§éÕJõÔe]²NVâvèÖÛNÌ|ÿ+ÁÆ?#$á#5  = áûÖ=M·ûÓ=}^ÒÖûÖû±ÒæÍ7zS¾vÅ!$-áÚáÄ9.ääl[¼þÝgC8åÙñ$È¬påXKnråduFÄ*¢]#Ù×SÙ^Vk­0Ù>Û¢òbìÊ72ÎïxfÓDîÍdÛ5v÷ZÅÍGáfÆLøì®¸M0ÅáÞD=MÀN¶úã
êÝõÿ¯Å£¬9¸ñgØ8K/¿@èIg½áÓ\ß¾«SOò|©;®w:?oþ )ª;Dù1J­ÄÖLgèóÄBâÅêØ/rEÀd­OÁ:LÔð	çû8þÞë»bö?0Ø^5?>@A¡/>ñw¸Ùºo¸Ï´¡*ï(·®Êô+
E~~5E~C&	×8éÝc~	]£õ_gjå¿xSÛþ¡9Ã­0ó|a¸oFdwqçj¦ézw
¯N¢+\rög
©!Ó;äPdFºÂWñ<ñz+¶¿Ôämåª	ÌÙ£z¤MwK=M¸]â!u®ÌYä¡Sú}9 ªÙ;cç«GIr~ÝÆõõ§ðbtfsÒ] J¡|7äñèæ¥×B¬ù2h« D÷ÛÂ¸ØV&¥xåÑTM¾E2[²äÏ7é,o¯TN°î&&¥N¹hÔÙQ§aNöhsÒÓ°mï«X?~ìîqÅÔ¼OcÄ}nx%¥KË(7vC.ÌÁ=}ûÎöìÌ¡eM­dë6ô«zqÿðîÆw=}¤ÆRÒ» ,ba Ó{èV¶ëÖ]ûÖ=MºûÖÍÛ§i£¸=}\(£ÙW(.ácøHÛÆ,ãI8/¿.çö(æ¯= ýhÎM9åyÃxÄT:­~Q&ãÑù[.ÉÎxØ(¢@Ï$¥/4B=MÉP+eî6ásc4¡=}d¨q?R÷æãÄ)Üª¿ Ðdf»ä¥¶i(ÛnÖì4ÔÇnr
t´õÇAÒZ=M£Ð	,R¾ïDõL¶öîÂðVmRØXN+Òÿ>ñ_!YI+ØÇÓ°Óç6IÜ8©äåõz¢öñÅ¨«LR|·ô*þl|iöj\ív1UÛÎå:ÖÛÎãÍ{oh÷%¡fî?ødÙèBRWSÙ%»{Ü;Î=}ûø:Ø½¹ê@|¼êÉ2ä¶iPük2½Wr\ýÕ#G½Ìîý©ÀóNÖ»©]8)EHOû½Qå¶=M\ Åa«.æ0e?/(S¯Rð4·àX?Çú)ô÷½¨s¾büT³_¼aøyî³cÇTÚÑÓZ¯+øßhìkHÖ}ìLÍÏPõuÊ."90k³eðZGpFa;qA»Óu×1+ÙãDÛü¯¡I| ÑÃ>ÁA{">¡	t^éÇÌæláÈô\ô+öYÞÉKZ~3J¦ÔùyV=}±¥)oÂõ'ÖhûÊo\Ôäxñïd¬së¼ß0»%Á]K]«ÐQµÎ \G_êÑi>E9%²ó4øÞw±èª\{Î¤Øµ2kä´yÇÀìÅN¼É@rÈ¢)uDBt9Ñu­:/U:ÈCÈîÑ:ôeË&q×T²Ç©M.g»VºþúNð×¹.BÚ\vôm¿Nâo8}ÅçÌë<oóç !¢-ðùèocz;1d°¸QiJæ.Va
Õ)Ö­FìÜª¡I÷ï¸ÑJá¬ìOà¼;MØ¡ûbkdÍLñ¾åKÒg{å:Å>¾ùtcø-{æ4úsú®ü[?ÔgPü¾'LZÀÜö1ug6Z±=MäôîÜVÆnø¥·ÊNl:jGwl|â­mÙ®¥[÷\x²¡ºÔGcò\ñX
åªxOª2­ÂØ/OÃOÞÞ$ÌÃÿõ¯Ã«×PæÉIÿ9½(Ñ?¸ «àoþÊdOÌ1_W"?ÑW~uç?¾Ê>ãÜ?÷&ÐÁJ IW#1L+ddF¨eaÞ<ìëÜ¼/(Òcij/àÉPrsâØ\<Äb®d@7?ác±L¯­¡HæfgAÐOº	±ñú3ãõ8å²>:ë¼½Ü-©Ã= J¾CádkFLH¡©d^&FÒ= B©ì Dä³Y?°ìR4f&ÄpcJùriF­´³nß¤äSx?°¡¬FF!¹©QKP«g2ùd$Ó= R'ÕÀ<ÚE4¼kÍt>¯bþ±¯^508v b$C*ÛÇ¨Ç±eÌøwlctQk8sâ±£Åì«KÅp9Y[r®}Y:çJ¿|áã3µèÆvt5ò	lUSËÙB}ãÍ:¾¼ÏcM
7ÐèÏã]Á¥ÀÉØ¡QÒ­ìM¤;mhwTvSúuíØÿAÚÆ¥Í,ÍãVÖVÖ[¯ºûqú¡'_¾2ÿþiëNz[Û8Æ;ñ¾Üq/K_ÒÀ·-¿xWØ¿uyT 	#¯@ #  @xçÕÍøÓûÖûÖûåûÖWJà¯ßeVì¯ÇçÈ9ï©¸gS¤_¡A!ÔJ9àù±!n%Pj0è£r¡Øf'R@¥aê$ñl0§î$1H.Æù¦®-ù^ªcèN7bÕA,ì-¥dàÉ"¾®3 ¿G@nJd}~¨Ü0¤4³ªHv~dî1Ö\1É¸è¬3Kwì©¤éDT=}Gá¸KËxêÒrÚ¯µÂ]K¶hæèRRÔ¼]MÃÉP´OÅb9RJ4áÉpf¥¤wR¬ÎCâØ\¬aLI6î¯Á´Y:îT(Î4®@$E.eð$Ó*eÒÃDÙBÙS²'H>®ÎHn­Ó]ºiýÃÕM:çç¸øÿI¦Î;h3ã)LmûæLc¾å2È¨= XþL­Ã£XÖÆåC8oÕìØ9oa"F°UC!NEpUB±Úµ2ÉSA±ªÙ©ØeiD´jD?mÀR®¼>k¾rßEÓþ¶¢Ñ*ËVÅ0F¥¾ºt*zÅ²ØBµ/s¹²¶æüº³æÛË«j¾nhGZK$9K¾¡h&Ï.P&VFGÛrFG~qQÕe6o·Ø»e»äõìïô+ÒÙB¶ÞÄ¼£cL\HÇoYN§¢/}4LøÀàba~Ö²j­µ¼¸ÇdméÈh5·JÈ¨<ÃÂ5MÉqSØ§ºþ»õTÅFgÁaòdãù:~õ°<ÁsYMÖ±zö>ö2kk;Û®Í½Ü~ÃCÑ.Ê¾âÕ4ºÊg»Çg< F&Qp»¡wÏ-w8ûèhYfN~T²MUñÒ¤©ù#mýBÝ©Õ¹cmíL¾ÆëS¹¥'EL,>A·¥)LrzÉõøêÒùv¾×B4ùèLcóçfæ6;¢7VÅûytûnµé^¾ÒS¿½.'=M[ZXÙâa=}'ÅÂ½HèpGãX	þiuÅ«ô¦NlQD÷e| »NWÒnúÏÓ¶»ï1>²kÐ,ÿaòcpÚ·UÜ¬:eäëÏ~*cPëgå\?9*'àX  ¨íÖûÖÖûÖ}íÖûÖh¦Æoy³$²úEÐ"sOG0ë±hu2ÙôM±®Ë3K±XB¥aÙ1Z\ ¡e$u)(/4ðLyà×ç"v47²È5Ð°fÉbF_5Í¤¨üZ1Õ¦¨¶JÂs1%j¨ÙÇ1S°8aÒ¸¯ä«jhujèú¢Ã¤nD,K@¸djç¾rDËÅÞAEIÇ,e¢¬3=}T}Lò97RèûpnñÈ¼2S[JþwYëÊIPZ5\?ÃÀý.%÷~HÈwriwÕ²¥´ÄÍ»j¶tñÓÅªF=Mtü»ËÂ)5?ÞËuwÓáÁHU×ÊIdm©â:¨U¼
Ê2-uîhÿÕÕ¬YSfkÚzj]ñrÁ°®B=}OZ	xß= §Ä®WÿÔÏÂÒyoµA¢;¬ÜÉzV#;;7Rð²¡Ç[-,@{CÝ¤fîP²Î±g¬^8±·Qqkg/3ikl8o»Øí¤Æ²¹µSOºIÒòlÍR³ßÊ¥f+{ÑêâÁ6ºÒPÕªµK&K9yIÖâj±ÓvÓÊ¢­:;µúxßèf¹VÐÑÃÄ½ç2[ÿZøTóîÕÝv\Óê {'#c.~­@nPÆ£U9½Ï	Déj_GÎn¾Ò£³êE|l2ÚØÿúeééN2×ÚpüñRÓ»BÕü|WÙ9ñçmÑåÆ?=Mµ;ia/Ý»¸P¤§±\ØïHõãr~tBO~jm2jR	Ê·5ßÜLMÔì§Í½¯¼³ÌiqÚ¯%ßLÇÞì¯ÃÍ¿ød_¾_MÏiãïÆò!â §B!®.ð} í"¼? jÁ@§»&¹*:0D@³/$éXh\¨­õcüv§üAäÇiAE¥xQd¨¬eã¬6ÇS¬Ù¸ãú=}ô½P§¦yyNbg¤Á(û§fÑLâ£1^_¬pWs4sÅH>i4}Djq~M«R´º/ÃÌê0C¥8¬¡8Ë'åøØPæÜýQÚüªq¬Kåd»åÙ«óÒg¼óÄFX<À ê"@Ú»;'ùöíÖ^ûÖûÖûÖQ¾.¼Zó¡óÏZÐUÆãì.JX\ðÑß¾8ýû7§S©|îù|ý¨rÈëÝ¥Ná^·[×|ª	³ä>¯#õ]>ë&»±×çÅ>M_|¬³K»o*^«zÓÊï²-^ýn] ³F nÁ 
$,-#,)Ø\O æ® ·"Ý)5]Dæ°Yåbrö/	Gcî--©^_Dû®°b7cÒß*©5eQ­aaº¢å®@_¡¸FxÛn¸ ýÝFØ>ÒJÓäKE©÷hRoir-µ½CYÓy2ÔDëCi¡¿²)5ÒHÎµt¬ÀèA4{'JÒîp,ÇXd1ÖBge¶8ºô	Tÿuñ¸vºØ}T³gÂî÷ÔùÂyr¾ûíÑ,ó9îWlÉÈôâä:ôpã£¹¦ò,C/9}SüßaëÁì¶åMµy~×Õ
Zâò®íëëc¶ä÷L¹¦å!pÈH&ãùÖûûÖ­Ë£ûÖûÖûö»è=}çZ§%=}ºwþôÁ/§/#<n¸Ùô§¯G=}bÿöH·M|¼NI+ØË rÔ±ëÊîN±ÌkÍQNãÚÌxÒßëÆ+NÓ>Ú²G¼ç>FÝgø">a¯;]R¬>Ñºç²>sÖ^qºç·Ç>Sß« ÓZÞo²^^¿]^õiðúGsO¿¬®[ç¿ÎÛ½yýGíS¿~§-H8GÀgÊ ÉY"v6+x{Y~ã =M#ÊY!q&&97pnàÕµ!õ×'^20	r= õ!ÿ$ì9«Èx3oQKÕâïÁHst×¢}e	vª³ýbÖvÌ8Ê(Uiq¾âÎrLøÆøhÑ|¨¶âSeûoªl4×ÂFðäjÃ¹´}3ÁÐÆsyí:º­Uû
òÖº>ãTFJîñÄxÎÜqS¯Æíí«Aü=}í½º*?U+þfP­´ô0ÄW¬è8yøë8zvSýòÐÉÓÁÉF¦aã,ÁG8îT|xh×æðË^ãñ¦7,Ï:~^RüøåPÏÁdk¬x¶=}©Ls{¾ÖìÙ}ärÆ¬5ëZ¶¬mM-ûzwëDçRçz,Ö¬8	RùrÖEë±u6³EáNë
£¶GMOxrýÐ,ÚÙì²½Åõwëä_¶¤q¥[bZÑAµÐCÃPU§ð^ß°Å¸ÈÔPÎ²°ËÆÄÞpÝ¹Ú­pÂÓÐÄÇ0ê7ªP°¤¼°Ê°ÖpÁpÙpÍ°Ó0Ç¿Ð ¨ð´0¢ÐÊðÖ¡¿)ß~+]_*Wß)e(âGí>"åh£@ Ï5ûÖtûÖ=MåÖûÖGïÖíÚMæÍûì¦Ïß:ÆRÔk6ã¼¦K,¯*;¾µP\LØxéÐÃÚZ,Í:8ÒTUxþîpÝÓáÁÛr?ãO#È¯q&;¹^ýÐ¯¦ÐÙ¦«,³·9®ÎRx¨ùhßýp×Ác©ã¦ç-o;Bï9þ~R<Ü8ëp¾AÁàscû·Zxá°«È£Á´«ÀÛAÛ×¾¿áKðpOôÐ^â <H8³x#âWÇ´d®Tddl²µH±£èµ»M? |¸øq¬8y²Èt¦¨Lg¼ÌhÏbÄÉn¼ÏiÔ§¾ÍkìÀØæäÆdª6äüvô×/ñÛ]×C±Ï+QÕ;Ô'±ÅWñÃOÑÕ_À¦0µ§1]g0<Å¨óô$]_©U¥Ymì@Î;6Ñ.Q>ñ!q1ã2ryi|Íü¨å¨;(×­äÂídñÍäÝd×=}
Çúmß·¸×¯ Xh¤>ò¬gtHqXÑ$1²ºX¦¨[kT]oÌÙ= ÜhÝlÜÂùÏÊªßnÞiTÞe,ßmLÛc<ÚË¨/)Ï'däcB	13÷ÇäOïôçõ± 7¤kíªXºø¦ {Â[ÂæB'âwÎtíoºSq +Cçß2Cß1E<(/ùhÔòîä9	ÂÎä)f¤é:ÂÔ'pÊ¹eFi?åjuÊôó~Ê3ÇÅx Ñsò'JnâÄo0lJ%Ë'^¤8H/ÄpHQw<Å8ÑjÜÄfXÑb¼Ä$Qc>i¦hÂÛ5?I5e¬¶ó2LÂ©1p|D¬³em¢ELñ~ê9¶´ºaê2YC¿Ei*æ3mØL·|"De"qt:j?¹N¤\4g©°´©d^ÉLíÄÇ¬±YÒnëÙOämbDqrD1yÅÀ´±:òpzkw	OC¢ì°Òlöê6ùE'¸¼±«mëBOÕÜ·om¼äeüåsäo"Dh¢EtâDbBEjÂEfEn$Bh0aD'ÍO/PÅbßeIJÛr;¿zµOfË|¦Ra HV4e!Öûÿ]ÓûÖûÖûÖûl	$Ïúgýñ|yÙC¹áÝS¢wQ¿¯ñüáï^ç©í_Ì0·^tK2MKî»7ö®Ô4®¢1y«¹¹r¶Ô3[Ô½açùÒËl3öS¸CäêÅøÌêÐ©Vç¤É~Ò>LËã¿xdÒ
éuNûÖÉ¢ÑôFÖÿÛ·M<e¬FðôoóäãYô1ÏÀ Kïùm÷d©ö¾]bí[n³Þkþmú *gÞ@ÑÔí*Og{jdÈÅh¢VêpezëtI§F­-õEçÅf´Bf?g{³Ä¢]Mxb²]èfú·N'ñê-T,)®mÄÇ³óHeVÉ¿HÀ²_Å9peS:h{K¥wñËw#hè¼?#¥UìDdömaôÅì¢f|NàÂªå}&	%Ë°Mªþ ©ñLíÿ¦KÝÈ-Ü2\$ô<eôÝ³¸²&³= hé=}WÇüæ~§¨ß(«æ]ãªà·H4«ËG^bîw\É¡Þ¸_XL ­iâ¸0Kªðüª³dªTë¢Ëµ'÷Ï¨yÓt0Õy-×î@Í6æIÍ¯>¶u:À¾Q,ï¹ÍØYD£M1\â&	ç=M0B ¹Gü *Óhäê^xÇ §Qí!Ý9¬SAÁù>¡v³Hlz0«^µ¤ooâkµ44íkçnlüýº£¡øÍ0åG}¦¸-µ8ªÏæ´?~ñ(Û<0£%Zqþù­~¯^t>äPa 8$  = PûÖÓûÖýûÖûÖûÛkö;à¢Á£ØP_r¦@Ú8¦îhöê¬ÂÄT¿çRÕ<R¯Fp·S±ýWGQ*j÷ÇÁ»Y=}ÅÛSt\+~ïÁÞNR"¹RABÚ«èß¤EakÙYO
vr5·7Ï¥zjÎgÊ#Ó,WÁ+mõ{ùÃÒ½B}Õ+%-O·ÛQé >¯/î1s®RXïî¾dïÏ.Ë7V2kOµCÎ
FCüx=M=}~%þ»#~Þä³o8Ú9V£= ñk<£SîM7þgÄfwîÂE_©º»»ã2ÿ¯=}ùöBàéfaî÷+Ân¸ÍBlÎ7ÅÄa,«ÕkPÂg2aò:I£$y¶î´c±\¥4xÓc±§µpÝÀ¬]5BþÊ2w­YÌ-T0örØ63Ô)ôh]z6Ç!-7-Ùæ(g¬mø9êÓSdìq»©KÄ>znä¦ã6Ö¬ªÕCÀé¾7Ó<9ð)É·î,s£ÏKQ5ìºáÕc¾¨âhÿ;§?<&Áßù¿o#XÏ9è¤Ø@"¦¤H­?ã5nq$§gÁSºDõ8&GçÒr\;ODÐaA±©ionAJBºìkGiFw1¸í®Î</±J»ï¸ì"VLKðÇ®$´Ðb9s·s¡ÀJn}ÉÆøÜ¦÷]Õ4~ÌÈe#:#ºèÜþì(ç6¶®ãÓv&Pa7åÚQí*X[ïÞÞ¢ !Ð-   ûÖ´ÖûVûÖû<rûÖG ÃO¶ÿíÙÑ)ã¨/ñ}ö/Ãülqïð£#E8è)¡x\:äY£i;ì#A>8êö^ãX[¬÷ãÉzQ¢§CØV²¨ÃP¿ZºñâõæP xg®ÃL<Q[T¡ÕcGÒQBnÒ³PZ\¹CÆ°³X¥µJsZ]­u³Æ³·Q½¡fSPÝ]3×åÓørS«-ÓÑT'|j'ïã[>ýúÞÙ ÒÅ+qz¨ BVèLë¹EØîzªqrOC}YoÍÀöjÆöÌDü5¥Ë-·ÍÅÝM5XØ¾åOVfVoøäÓÒmlÿìMäþùjê6XZ;ûª××½Ê[(Ø³?â}Øm1Éaè»ØýÕ0Ã]ÚØ·û1\_êµ7 Y£\ä¹§Ù×(5ó®rø´9çx¼ÚG0²ïwnÑçä¿ÿÓÄ5¿ìYV[¼g}"×ÿ}äEN*Oñ5Æ®ÜêâËx}cSZ=MWhòØéÄ× V¢óPø7çåxS^«_= Ñ
!ó?:¨¯QTânµÇ¼,ñäá3O9AåÕÏ9_-â©é;®îÜÎïÝâ/äÆäX3EA¿Qb´ãwv½¦gW~?îãaÏ ?8é[ï¿hÎe²O®ÏíÿÔO1¾ÕX+E¸Aaý\iZlEùVw*o3I>ì±´©Tè°BãíÙÒLS³Yyè±Öp¾¿öüzÊà%wJæe±)µ8ÅäÖÍê¸%HC4ÊPYb¥%'u¼ÀjùiUehvçNo½!TðÊô ækmÖÂu«áÕ´õf¬.FúZtïò¥µNkw	Qík/Ñ½¸e	Ó¤!#ó-8ë°µ¦ßQÆà8ÁÔQ7æºÁâ²eÆ4Ù¸Bú¦@ú¬ËÇíìQG±%ÁM6ÒéHKæ
{qÛøºÞ¾ö<1ÓA^ù¦ÿ÷~«úG[Ê&ûeë>b'ÖX¯C=}û©ã­n¼=M¬X7f¸Û Óþ5(wüïÙñ×ì-É¯(§Ðúà£Ë\)9O¦´Q ³W»f#99=MëäK¼ÎCrü¿s"X8àÑ= Ìó"yL¨Ôá$$³ÓJ¤õ±A)Hãp¸3nÙX¿ndÐËL"d4iîq\X8íÆ¢Ö®x<Þ_®S|<¯á¤$æXG H1­dLDqYM¹Û~é¬[½bkm*ãñd±Ý¯·ýpðoF1W«¸Zµ!ò¸´æ§Ã	ÎjçoV#ÛE¹DfÒ a6î£Òµí­Yh¶°GµëóåÌ¨éîÃ.,KàìÞ Õç*ÌMÄlÅ¨Q«BJÆc)!ój-LE9;'´3}®±*^÷uÊ~iJÓËXËº=M«Ø=}£ÿëzoÊ= = =}í×
¹\Ä¡n-Ô¼äÅË1cÓF"/USÚÁ9-½6.+{ùpþê)µV,ÖÔSÃÀ½Dù.üö2³õé8éNvÓIÝ;ù}¢Ê:¢5¢>¦á!@,%!ÀÙûÖÍ·ûÖÍùÖ=MûÖû#O%¿Iè¢X$(Æ0\7BQp8ÏùßIlrÐ(í51¼ãdyÕ= ´ÀÂÜ©42Q6¼X&åùc<ñ´1L?ái1)òÓDÖv¢­r²¬I´ÄËD=}jrìÈ´~IôÕÅ	²ëQF¹è= ¯,B7ØGëqÒ\ÚM«¼·<QóN§È\7ée¾÷©*~Îà°ØB£ªøÊè5E¼
´¸d))3Je¹ÏîJ¼¾Èâ®GJ-vöButÞÉ²¿ÊæUéÊÖ|½¾
9ÀùÍ¡ô-´}T¾ÌiõmÖ¦XÀåBA|ÕÙÓu»!=}öÁ	¬.]ÚL<ÇëåçÚ¸¥
QÞo/IA6
3Õ}?M#¾Ô9¢!¼-1¾¨cfæ:Ù1ÅòæÎPé*ìm?¢	#3L£m)SÅuø¬}%=MQÚ¡Y&ºÓ¶Y]6äNÒàuà2Ç\kâyòÀåú_Ì°ÚeÛßUÿ7{Skè¦b;ùâø¶[ú¡MR$-ûQyò¾µô<×§Í#kGY°æ!§DgTVXÂÆ¤u§3é÷¼¸¦So6Y³BâÅ7/ÙÀêíÎêÂ;ëVØÑã½}ýfÀ'£>¬·äÂæ³ËÇ]yeïO
Þñ¶íþ<Ôa¢/uØ±"E{axÿ·òø·¬8_B÷±Èo×_«PT  !Ìu,äÃM°Ó÷#[P¨ð@,¢±.fP¶AÄ.¦P{F´w­Á~)Ê8Õ£è¦ÑI¼Ël*¨ü$Cùý:é÷;±¤§dÑ4¦JñLªF
~T"qQ<z;c¿vLó®îóxöFæ<¦æÔ­«ÛÓ3Ý_¡¹Ö©äïldo@)áD^¾nbàK9ýÞr¸þ²â«»I¦ÇmJúÈ·æù·LmoßÝ	ùÿì,$SY¹©¥l:ÒØßLÒtÒù»íÔGùdGÀÙK§ï¶Ù\»¾ë;¡\ÄÊÛ¸g= ^g¶Çqàð_%XßJ lA<LDüÉ(¥ehi5SÂÕ8Ûåå¶pßÕ¤MÅÈlK¡R¤Ëë¸Ù,°þÏI·~%çuP%³jJ	_{éQßJävt±ÀuíÊqõ8ÈÆÏÐ&¯óUüÆ¶YÏÅdÓ®ÀqXÈãÍÈ¾èSôUPÜÂ¡×ú­ä­çfêºXÁ©æ ì÷UòÐ¥c³{xKðêêúvÖÿ;Òûû¨ÓÇ[²r=}õñ¡³.ò[©[ü©¬çO¦ã!Þ*f¡¿½íÕïÖùÖÖ=MûÖûÖZ^IÔjàXJãÙ;/ßsµ½¹gäÙ	Onñ)æ¿° ¤Ì$úá2´kÐÕDE96hLw²
rü_Le«¤42rì°BÙThSýdºìLæèÀ,;å¸ Gc»,5ëéÙMkÆÑLyÒt¯± À<óDø	Oç.Yìvèsw¾%"~ê3S~¡%g5p´vÀWh¡Ç]*ô«I±Bc6ª6IÒÊ2¹Ç´0wtcÄ2cjrfÅR=}´1Ër|5¦OÉðÊÉbÂ*­ßËòÝkµ_^ËBÅêÎ6u>LucÖ:éF·Ëæù)
(¯ÉóMËî¹PÜ'ô1ýÈ¡+-æZÀ~Åá,1mÏÒgg³Ò4möãM
ß=MÏåÃÎ?l»_>sÅmÉVÖSðÛÀ£Ò¦.*©ZÈÁ«á>}<Þ
2	Ëk§NÎöC]~x	xÊgëlÖ|ôgis¿ªD =M^#F©;@?àï]&hÍU¿¦8ú9BvhÂ¨1ïÏ9Q}ÿ¨Ø,Cäç:ÓÈQßè9³<¬ø¸/{mØî¤=MFLVæRsFþsÆ7»Ò¦ í7$¼ö4Ry þÿbB/(	±4B6Bå 0Ïmæ¬ÎXUºr~þUÇðì¼3ådíÐe+ÔLX³aß¶XéykâMÙQé¸=MvdÐ»·5[ûÍÕU¯ÍÑÐÕkµUwdøý¦EæVlëÓßIÖö¶ßô9·ëß=Mxð®£òü-Ócø.´ÐÒ×]G[q5@É#<<v= bgd[BNÄÆè±SS½¨Øäv}GÜS¼øTþ¹ 3î<qÆ@î¹wØPß+N²N|(Ç7ü×Ù ÃK+|ÉåÍ;ØÑÿù­9­NGÞ[^v¸uØÃVï#é>R cá¯¾©äeot\QíäÜ7éGÝrÂ7{áA¬Ýi¯ìO^¼ü=M£?ª£xY£v_Òáç7ýN&÷µ?yÎ<CÅ_û¿3ï¾Z26'~ ­¶!hv$P{T°À;¡ü0$@~Ó¢ØU¨9¦a&Á^U¸ó7¢¹Ê3lfPî3b0_=}â%0ärb8SF´öÁK¥2:?ª(/¥ÁK7¦8Êß¥ÃÞO<=}É$X4aðÎ(òßgð0<á?ã1Lþ1éñO±Ü*¨äÔ_²ÄMq¬¨£4ïÂü8móûöeÉSºÈQl=}ã8¢ú¸ÒF¶÷Oé©skLÆËy<¼È¬
ªò?çüA¾¤®Mk@=M"·=M2ÈÈm ²d°¨ÎmBË2©}´äýi½¤}u2G7FóG9KëîuF¢4"ÇúB¥u5IT¨ÆKµÉHo~:WóðSkay:ûÅSZ-âjóÑ2é= f&/¥9¼LíÓhFÂWR9GìÔD³Ùyô|ïÂx°ei6¹Óiß¾m¦@»²*p]§Fa.EYI²ë;ÙL7ÒËT·kBÜÜ±§ÒP/ò\dØ±ïxÓö·~!ÒW+SKÀÄÌ QÂ¥Úuèbë+I1Mú=MBîz4ÁvqdòÛsìiëÔJ«é}pâ¼ÛEü×JáÍÊ¤Á¥Å<Ùwª¡IõÅ{|¦úRJêøz{¦²:>´àÎ<Úf·vq%A5ìÈ= EÕ¯KYx©EÓvvAÔª6ÇJÎVw1ÛÊº-ïËÑÉrUÒUÞÈÑ{-EU¼{{kâËzôÿqëÚXÝÉÑw=}6}¨Ìç}]S
QÉæ&,_TPóÏ!³Þ&dÖVÉ±å!­X,TBÖÝ)Om/BÈ©C[»iöìµ°JfºÒË¥6äãzvÔRoÊ5ç¨vVúfôÞVnëÔq<õæÿû	]ð®¬|[3ûQÓ£u§[(t 'G}j½hGRßN¤çÛxÍúep7gç³Ò»
ýÅCYÞ§Pñyf/^3ùÎ·t=M~Îr[Ù¯W78ñ=McAÇ¯ióQÝôï£|ùR ÐK#<V:@Õ «Ó&IÚVèM³aª&\¨¶-jPdé0d¦	ÞQìÓ?}Vì{ñ1ú­ü¤æª1O8ÅîHwÍféÌ:åoÛê÷¿ K! H8ûn~¬Í=MVû{ûÖûÖûÎûÖ=MY<1b1ÕÚ«¸R}äÑ=MBD7e4HÂ»mìúüö0IÆâlQcªùiìÓoÜ.)µj8rkâÖ~2ï²ùMÁ5)}Þhx´B¿´OÕÅdhÉTgj¿$IkÏjYuê·,!9ôµñÒÏ¬Ñl´º¬/ÿø\7´sÃ¾¼l½G²¼÷\N¯g¡Ë°¢5´	ÏÀñ%]²5¬ÙÁ/%»$E*IY{é½j~íw]y©Æ2ëoE~Ïªx|e&J-pq¡ªst4ÙÉÂo5EÜjäõ4ÀÆè U%ÅÈésm¦¿b~-îØ&}#-_ã£-7øcãFaëÜbzfö÷òÉß¶zÕä³Õ¤±ðäÃa=}
	8õogÓZ*G	~÷»®C]+*	rwoÑÞÌ\hðÓÊ¾¡´9PWÕÖ¡åÝ-T¿ ßý&¾~VÐÓ¡¶.CÜfõTRËÇ±jS­è:iØÄýgC¢íä|FtW1=MT3ÝÖ¹¾WÑ½©6Sª<vvQsÜ«¹[³íýææì
÷&+ÇÓx|ñâ.6oÐÀüê)+î766Ì$SzyvöjØÍµåÌ(Ìì\eäê¥­OQ;júØúâfÉ1VÖM×A<ÐQÞ­[5bV5ÑÃÇý[§6ù)Äù	ëî¿~'=}+YhÉ= õïaÕÙ.FXØåa«£6.GëXÙsã©Ç§³ó½¬ùD¼³w½mNêñÝ²«=}}» 7ª3NÂï}4uÛÉ¿þmòæÔSÄ»KüD>Þ»ó/·¢>ÎfC/÷'ØÒàã/çÏøíãV·àÒ"s)Ið¦= Ù=M"yï+8ÿ)ÜRY¶õëÒª~rÜ·àZOÏ®iØâgÙ¸/c)?º¸Tÿ·°±ëgÇ¿^"¢¿s%ÍGüûïñ¹úÃÛ ý[_Em!-ðÍ § Sæ%(Í-Ðh ¼¯#²%é?)ÒË°¼m¢Ì;4DØPè@òaÚ-ý1Â¾0KË§p+ñj¨]»bXo¥BdºZ¬^¸ÚÅâL1	ÐP¹¶¦ßGì
{(dH¿_bz1ö¨z¤{BîdHJb´~9ÂlL=}ëH{§gùÓTêÑ]qîþªg´k8åXySæ¡Qo­Ñ¬9Ç,1ë X Ð1àpÔÓÛÖîÓûÖûÖûÖûéW­sIðtDÈ_];9Òko;*ó\«¡U>#=Mê;Ð×U´¡K,tZ@3#;29Éyàh"¬LÊdtCýV;iñè¼fLmÑ¸¨6WÑÏ©)&¹øYÿ¤Ï©×lxVS?ÜÊwPÓËÍ¹üÃí}üqS¥?»	¼ðâ¡6rçLtÈrw+7GyhÛá¢öb×w6¶ÅÐi·Å= Kr?Kz	Öíê¸ëvÐÒZ½­v;ªûøÿäæþ¡VìÓÑ×­åWlÃ[m}j¶ÑGùP[6ùùÔÿîÀ[êÔ³SÛ£[~'ë[Èõæa¶±.nLð°#'[²óiÖ ³m5½´áHG=}·[ñ=}R¡³Ô½¬éBuðåÀjNÞÕñÔ«Kë}ä¯ØxàeâßN
ÓE FEWUúÙyRêí¼§ýÔÝåWè@uðÊ­§)C\z!/Oð°^»·\>OeêQÕïÁbOÙióëO~¾æ})?Ã»Ràg®¯t[|Ý?-òIkSÁ¾?Å·¿sìø§ÓÞóS ¬%#L®%v/ÐÇs | cK#¨g#0àGàÌ<a²¢ÔN7ë@öÁa&O(0@=}_%ù±NäO¨°6Âc0k¥ØRUd¢­A¬b´>ÂP¥¹4.ÓÐ¸U=Mâ:9ë²P;§yKìüÏæ¬ðí6ÁnÑ(T¬°Ëo¤¯óB<þ8ò¹(Õ¿gH¸Xê£Üq§ÂtÊ4EiûH;¦gÉÙHê¿]q"¿Â¼j;ÃÖIæSYfûZQþ«ñ¬ÇËô\6£8¾ÿQÆ«ý5ÇrÉXK»äõOn¹æ®	¼lO´j,âÚ@üÌ ÚöpHäcÅ½ðR+]s(MDð[FðÅÊ= «"Uf*H«%ì%r~7aw±ñ±:¢h¡:B¯Zªì?MrÉhºB[¨TD²\Íär£¤Hj|ÉAñÄ³äñ2}·jûGñ¦ä«¯2Uóè<õëX$¹õþ°qgél{L¯¬ºlRsJ\KÄ°[ÆpÒªbÇÖ*ó§I»Ï§â³«*~I²ÊDé¿a5}µïíu¾,pY_sëFµÉÇuZ\qIwEg­çn­µåUzUðPôØSqJ­è­'×U&ñè·ÎH{,eIJ4?£ eu0eñûÖ}kîlÖûÖûÖûÖ­ëÃ«õTÔ÷ØU|Ãú"­Ó[Tê~ôxrC,½n9î·ðé=MÌØ×nIZî:½gþñeGc£Ù-:ð×ÊáÖ&k¦:Ì¿Ð]ÐÉáÒß&ór»,LòlSñº¬éñEF¸ÈKFIþ¸¼©Q@Ãeñ²6W«^­LRÒø\ñb e=M;6þNÑñêøòUÕ	õçú»bË>ÒYóFég;_¾ãèÌ.êXÜ¼y§h?§ú³=}ÚÌ8ð
-§=}6æ¹·ùI·®k·fNÕÚdFØÄ}ÏëÞKNC~ÛQ\2ÇX~ôÃ×±ßÎçÅî>}gÄ|ÑÛ'\n^(|lY|öÇu¿ÙÍ,XãZ¿Dg
üyñü |y"·*8'0ß{= ôÑ!96'4ù9p Tà=}E/É°WÄDAùthü¶AO¥<¹2Ruhë#ÝA_~§¯N¿v°ÓÐ bea:¢=M=d{'+¼¹¢[$í®(~ÿ4ÔO2kr]£qiAmRÞ¶i¥Á²iÓD÷kÒ?µTÜE¹~V¶eîÂ*ÍÒÂmeª1£5³HÆÏul[Ä¸}Q­çÀX (µ= qWûÖ;ÿÖûÖûÖûª®q%´t"+ÄÊLv0øûj¡Ús$Î4XÜwÀE¡Ìï%n6½xD.±ùdU0ù
ª´	NÒÔhá%B+×¨DXIòÎèµ¯±zl©áEN5´hwuâ´D×®EÂm±HØbÂù>©î7Dæ^±xc}¹¹4·ùrkµNSË£ìðARMèô|C³ ìÇëR¿ë,MsC±b´*ûjJ$42º*;[JT8Ê¦b×U*q/H,ßÌ0Ùâ *¿3ÈXytn4wé{k¸ÆÛ½jÞaJ}ÇÊ|Á×jáJCµQuVåöØ¼na­HuT2):ÉzÄ	Í±¼f¥:V\_ÆÆæÊW:£ó1²
éÁÂ´îªZZ¾Á³Ê£îÑaZ=MÇ
DyÁÓ·nÓZ÷ø¿¾fWs9üíðÈÜáþ&&ù<£A½-/UH^ãJ£S,2½WÈP²Vø2ãJ³mÒµWIÿàÄÁÂR§¸$ól5FâN³l*üSiá}4«ÃéLÆÐjyÊlÕ¸ÿæÂ_«GxLqÓå³C6]ÏyäQ	ÇeªV³óûäMóÇÂífV|»U½,ÕqÆùL{§mÁsVÍûLÏíÏ¤.9R[´KðÔª£ÿôÁ£ðÍ._ýá{ðÇc¹s.	[=M¯ã¼$Nf·Ü¥|~tyðèÅ©ÏÃë²aNõFÛüò«k´ÃNCÏÚäR{FÆgt>WtH=MQÇ¶çwùÃk¯I]]­hWëc|Q·çîs>¯ä=M±×g¹^ò(ô±{÷ÇÉsÃÕoþ^	f½µïÚ}^oôÜ3µïé¿^#$4k3_àðò!Y%<°"ºU/ôMÀÐ ×s#zM-ØEÀé± Ý·#Ò^.8I v´°"ib.YtHDå°ª-bÚ:Akû¤¼=}th²yAv¦´ÿ1rh$£  )5eñûÖ=MZûVÞ±]xûÖûÖû\~5ù°ùÕéN³ßc¢~3|dÐ)áèb¢eaAC?áúf¢=}%ù&(n®3ºKmFÛk0n*ÝAÀñ7DÍþ³üÍD±{ÌÄÄ-é¤¿EoÄDÊ¥jWé}cEGkºL´ì}OÙØwö9iÁ{5eÓ75þw¬vQC×éìvwl«ªq)e¯ª&}4°B÷$å«4çwKFtD®KØÊØÏøóº|S@«FgAí¶:KU·÷D
ÔòýcÈÆòí¢%ºö:ö\ÁºF¿ó¦þTì7¦a%,ê:NöR\Ë³´AgcÑN¦#-5æ9êîV4yèÚõAã-ÓLøò%ëïzêkëâ¶_Jxþ³¶-ßy2ëËMLóÚxj,Ô;©ÓL7¶»MÇ{¿ÑÌßé ÃS®ûÿ´ôQgçÕÜ®¼Å<-ÊYZçõß=}?V´h:¸VáÑ®ï*çM®S'Ræ¦¾uoFß	Ñß]EþMÙpéScòßhSïÀn¾r\÷flßðÓ­Ç.ï©ã¾ÿîîÿ:áà¡"þ(ìXî¡fÙ"ª&ÞÉ8H"Ë)\½(´<õNPÏ °àk3"ù'ÊN+ÓQðoÀûà k¡Ad&]<	|Ä»±Ú¿d±ÂÙB?7­üsAÒÅv¬Ë&±ÓÍBãÚfÊ,¨\TZRÄ¢èÅu±ö{C>¨¬Y5RL.p= $!0íÖûÎ¿ûíÖûÖûÖ=MÚ§p/§34«Iø¶x°Y½.aâ¢$gÊ)²W4èö¢£}%±ÝÀú@áØQ¢ó$6(ÒÌ6ôûJÕPÄáÉÛ¢{ï%o_*~6Ü.G6cG±:éî²%D#kjºv¶ÍK)ÿ|Ù£¶,Ò^²äãD·æk¦î´y<÷h³D_@ùrrÒ=}iû²wE½j¾¦vT®ÊX=}oq@¥~fe¨üªFe4»ëHâusôÎÏ¸ýbÏÃBÉrôÃ8UtÑ¼eä¥ª¬Ë4ÅWK:=Mq^Ê4ÎK&\(ÅârÍ0vsRºF}mØ4º'9T{¦5òôJÅityÛÖf3m­ÖºPýT»ÌÆmè1º3T¥NLôÔ|Å×i<.l Ïzýõ|ÊInÓ»F(cÓ(¦ÍQ,12:
ÆTìë´ó°Ê°Áiãäª¦cU-::ÕR44ÄÁOã a¦éÃ,G9¶ìRL}xÔêP³Nc¿c¦Ç,µO9ÒþRdØòÐÃÁocåp¶±LzfDÔ4o¸áR_§Å!ë;LÃëyòwÓÍÉöôÛ­Åm7ë+	ðû°ÅHë	©¶¢SM+7xâÍ(VM×y+gM{ïx}Ö´Þ9èÒÅ'kæ?¶A<#â[¶f<­´äSÕCzg²|®%=}y«[ÒµÉ
hsç±ÐÑCKç.®{ý=}Í§9È\ú±²,çÆ.Ûì±Íçª}®æ'=}±oXÖ¼TÚ
ûQ±CkçÑ®ÿ<¯XZ§Ü¯	6óRÞÇeRïÅT¾²¹]Ë5È¾+Å]¹Jõ¼ÏiúôóÆÕç ÷ý³îºl8YPâ¼GtoÞù¾Z+]ý·¦ÎìøyÖóÓßqïîó!,&è!+@&ãùÖûûÖ=M{ÖûÖûÖCàª!])Pu ?"ô6@ÿ¿ bXþ§<­¸6óñRÞCrçt®M9<ýÒYR\H¸tìa9çëª®õ=}ù
ZîUÔûöQÞÓCoç ÏñÿÑ¨ÿgYv¬D¹
¸XëÞÃrçåu®|;<³×}®ò'<Ó®Z~½Ù õ¶C#gñÇ®àKçÚ®<±YT*E/Oì­B¨I¼¯G\nLjAkK¤éLdèAdìK¤KD$OFOEÜLO|ÏB<ÌIÌÈG¬LA´KD=MDF<	Ml2Áá ApéhXÁAî,ô<áM4òN3NÌ2Ï71Ö0Ê8'%[FdYMì^OÄÚBÌÚAÞKÌ¾))Qÿ+c^+¿Þ+-(§£IbKcãK¯BK%H3"E{rerJ§óJSIÓIãI'Iÿ+I9ªIkIãëI;JI÷ÊI_I
KÙ:KµºKí{K]ûK£[KÚKóKÓ½R×¿ÿ'P^j9TîçmóþL¿_o©×hÙtÙÞrùÔv9ÙqÜuéÚsÛgY= 9dÉb©fÙ~9yI}kyoÉh)lyrÉva¹eéãv:wþ§P§QBfPÆdV2fWåR²äSGTGUæÄP¢ÅQÚÇW>RJSVTU|!CoQi9C%¾8é9:;8;;yº;=M{9«ûÜ.fÄNfÍ·QÕÏÑw¬g¬p£¬tc­ÂC¬Ã­Î¬Á3­s¬Eó­-Ó¬½­+¬c«|<x~ÙÍWv×:Ã8;M9/:ù®8Q®;?o:î8Kï;#N9ÕÎ:8ÿ9g:>×çf¢æ½7æ¼÷fÝfì¯æ	ï^»±Ç×%Q= n!= Q0ÌûÖýnûÖ=MûÖûÖûÞëçSÒSl_ a­Gá­qÁ¬,­Ó­Ö±¬pq­ñ­¼Ñ¬³¬Ú­·)­i¬é¬I­¬Ñ	¬(9CdVÃ.NÃe~ÃAC~Qp)IÃyCEÃ5wUCmÃy{}Ç¡qÅ±QÇ©ÄÔÌÜÄ	T=Mì|$­<\</ÛC¬RÃ¬ö¬Á¬%3¬=}³¼ªÿ¹º$¹d¼ä¹DyÄzÄ{
^¶{	w;I÷:©ö;QWZÿ6V.ôNë>ïÛï9/XAÃô1CQïâ¼T¿VF½Uz½W}·­[wüãUÃû-Ã MÞýÇ­*/î3ìHâòxúöÝWO¿¬ø¬c½Û1	ÇÑ·q¯Ï÷*Bn&5­£«?Aä¸pBq8ÑAÌH4~¼©@f2/B«vqåÛÂ,YÆ6{ªCZæ3Ï«Æ)åÍdÂ2XÉè±|LmAÂÅ2jM~Ç1õò©ý	e²¬hF\ÓH¹uLëF¢0-ª=MÙdÄ\Â~ÑK¿¨pà+ªÕ¥ä1QÉÈ÷JF²¶0MkªõÅäûòByñÞ¼xu~\Ë@2w2ÕK«)uäñÊU±Î¦Èws¬ÎEö6oÝBñÐ¡8úðÿWæîûäWWíeÉ6îørEÆÖ6ú¨£åõîñþ0ÁZ©8½]w7±ÁËèùm4Nª0ª*ÝdÅþÂ?ýu_qÎßS-0¥mµèRpÄ:D/|cd°ÁÃ×'ãäÙ¤=}Iæ¯2]gÛ»QÂøx±¼(_þS[WaÌ»Hæl2ÍF4±Ê=MüT_}¹ÚÃy³×cÓåäYÿ|½GÞ[P¬| ¹7ªx«ä=}+6Û§EBåréROvÙ×KJ1ÕøÍç:ÍØZ%2/PÖ½! &ûÖ×ïÖûÖûÖûÖÑÖQÕ1³éf®ßT	×i3îY»Til»÷FmÁòDS¡ÿOTwfNÒO«­cEöØôÅêRÝüøÄy|:ÍÔ:éÛúÙp­óÍ6v³Ü°¬Ú#´÷F§ðÃÙ
³ÿ½ÞðJÏBýV§ìûÕÎù_¹
ÜiÛk;ì:ÜÕçÏÑÙ¿(ÁÜÎ0¹/s}ÿ\¸{TîYm½B~XÂF¼gýW~_ÆE¬bçý¾^~ªðÃhÀøI=MPûe7ýºCÜöÞª¯ï9«sÈ³ä1þôjW'oÆËÓ¬ûOã9g0|ÆùåZ
ÒlE¤ïÎìùà=}º
¼@¯Ë«Q¼3\ÃÑNé(®¤öÚP#øãýa¿ÌDºÕ÷u9ëq/VÔ>·ZôÝÂ]«ÙêsbKºâ=MAU9îvÂIâá±è±Qí8ï.BZê}Ç:xä)¨ö¢³­zAg¨9´ÁMyçY¨î®rÔH«Y= HäGÄ,í9ä<Ö¡D>«×ÁLm	ãv° lfÜcªp³Ö,JKùë%ÂÙCñ·TÃ\-è@FÑ¸í<2±üÌA¨7¿èiQÊð°$syäZ¬«¤²àÚ'¦÷°Ïéd>ªq¾ºTÂU}ëpæQ­L=}ûøëqî¹@Bi Æ4à\êóÜèÜëgá×@KÙèo1jr¶jtÃVlzó¾îÇW8äpfP¦lJS¸í|6Ð¸ÅÌ5yïfVÓ­=}/øïa.´¼ DÇóñ¿"·Øì5Î­$0h0áßã?Ý¿»¿äDG_©­¤ÿh­Ä_h;I±v n~> á;ò­=Móýå¯7¯Éý#{}   ·Zë´ÎÆNÏRÇ½ûV«A¹³ìÖûÖyíû¼9g:&@*!e*$£vËbáª;Vpc,ÈåEUV!4yø Ô#Û%î%i [óX ¢î¾Ù@àÀG!þ¨@ÝIÐNZ= Ýóá¤àYá /Vâ ÷6XH\Øü&ð8ûwâ6õ2@ý Êù.=M+ç-n¢ò|øM/<ýNÌSY¬Ý)z¿¥CoáÎã±	ÐÁïXÙ£!õÜd?¯xðì
Ái;ªäÀ%n= =M+W= ÓÖc[aS
FÁð]NôÝ'= qr(¶ù¤nü«òÿ¿d&ÿÈõT4Þ=}z|ö ¿OW×SMtdH.ÏãRX&§o3ØÜXÍ^ÊMí£W´iâ]NüOå£S£Å·ç÷­ Ý§½GÑUy¹¦ß§/6P0(Cúýb"þ¥°VÙÄá£ÓÙ@¾YýòD{òÃv?EP©=MBé­\Ä½YäýRò	øfâëEEf¼D+gC×úÇ±GÅÿ±Ç?TzÙ¡±ÏÁÕ¯¦ðvZmT}3xËz×cºrÑM=Mc-É©Ô7½wæc§Î»cû¾yfÙWòÆÝÔc¥³ôØf«Äñ·9ø%­g:y^+{U]¤þ[&fÓÏYë«Gªõ¹¦Öðþ¬moÛø?/ÛS.[S9ÛùC/û2²Y£ÎÑ%/sy ¢×ÌùJ­W6Oí\g0^JùêßÏ0í[Ü'ÏÔ>À-¿[ÔW?Y]±ØÙÃî<~ÎëR~Ìf¾Z/×¼_á¾Þê+îoÐñ{Þ\e3K%©¹§íB¹§(c=}ËÈ·SzÔnf§èx}o\9öf|%Ýå¥~©IÇüñY8}Ffú@Rú1éþ3÷ËótQøvû|³Îaá,Óé>BG6Òê}ÃJ|¶=} °öf6õk¶ÌºHgNjÒ{æ¾M;9·é§WèO±Ä3ÒËÒyt	;ù´à©a|Ó^!ÝøûÂÄ
(VV¸ÇÙcÏ>yoçzÃvòG{3Þ£½c×ôíÅé;°OÛGØ<wÜW>	rU]q­{û'ùÝír{*øï?t-ígùWÿ&§]m}×ût¥Ë~ß&>&Õv!b#ÅÌq¢µ|jÍüùÉ^Æ&ôþ~sIµ"]d)uâ´ºvk	Å\<Íÿ­öê½Â
ïBçÏ§mÙIólÜoëVb¦¯éWÇû3` });
  var ei = { a: en };
  this.setModule = (P) => {
    i22.setModule(tt, P);
  }, this.getModule = () => i22.getModule(tt), this.instantiate = () => (this.getModule().then((P) => WebAssembly.instantiate(P, ei)).then((P) => {
    let ve = P.exports;
    tn(ve), p = ve.l, y(), Yo(ve), t();
  }), this.ready = new Promise((P) => {
    t = P;
  }).then(() => {
    this.HEAP = p.buffer, this.malloc = _n, this.free = Gn, this.create_decoder = An, this.send_setup = On, this.init_dsp = Rn, this.decode_packets = Ln, this.destroy_decoder = Un;
  }), this);
}
function Vt() {
  return this._init = () => new this._WASMAudioDecoderCommon().instantiate(this._EmscriptenWASM, this._module).then((i22) => {
    this._common = i22, this._input = this._common.allocateTypedArray(this._inputSize, Uint8Array), this._firstPage = true, this._inputLen = this._common.allocateTypedArray(1, Uint32Array), this._outputBufferPtr = this._common.allocateTypedArray(1, Uint32Array), this._channels = this._common.allocateTypedArray(1, Uint32Array), this._sampleRate = this._common.allocateTypedArray(1, Uint32Array), this._samplesDecoded = this._common.allocateTypedArray(1, Uint32Array);
    let e = 256;
    this._errors = this._common.allocateTypedArray(e, Uint32Array), this._errorsLength = this._common.allocateTypedArray(1, Int32Array), this._frameNumber = 0, this._inputBytes = 0, this._outputSamples = 0, this._decoder = this._common.wasm.create_decoder(this._input.ptr, this._inputLen.ptr, this._outputBufferPtr.ptr, this._channels.ptr, this._sampleRate.ptr, this._samplesDecoded.ptr, this._errors.ptr, this._errorsLength.ptr, e);
  }), Object.defineProperty(this, "ready", { enumerable: true, get: () => this._ready }), this.reset = () => (this.free(), this._init()), this.free = () => {
    this._common.wasm.destroy_decoder(this._decoder), this._common.free();
  }, this.sendSetupHeader = (i22) => {
    this._input.buf.set(i22), this._inputLen.buf[0] = i22.length, this._common.wasm.send_setup(this._decoder, this._firstPage), this._firstPage = false;
  }, this.initDsp = () => {
    this._common.wasm.init_dsp(this._decoder);
  }, this.decodePackets = (i22) => {
    let e = [], t = 0, s = [];
    for (let r = 0; r < i22.length; r++) {
      let n = i22[r];
      this._input.buf.set(n), this._inputLen.buf[0] = n.length, this._common.wasm.decode_packets(this._decoder);
      let o = this._samplesDecoded.buf[0], a = [], c = new Uint32Array(this._common.wasm.HEAP, this._outputBufferPtr.buf[0], this._channels.buf[0]);
      for (let l = 0; l < this._channels.buf[0]; l++) {
        let u = new Float32Array(o);
        o && u.set(new Float32Array(this._common.wasm.HEAP, c[l], o)), a.push(u);
      }
      e.push(a), t += o, this._frameNumber++, this._inputBytes += n.length, this._outputSamples += o;
      for (let l = 0; l < this._errorsLength.buf; l += 2) {
        let u = this._common.codeToString(this._errors.buf[l]), h = this._common.codeToString(this._errors.buf[l + 1]);
        s.push({ message: u + " vorbis_synthesis" + h, frameLength: n.length, frameNumber: this._frameNumber, inputBytes: this._inputBytes, outputSamples: this._outputSamples });
      }
      this._errorsLength.buf[0] = 0;
    }
    return this._WASMAudioDecoderCommon.getDecodedAudioMultiChannel(s, e, this._channels.buf[0], t, this._sampleRate.buf[0], 16);
  }, this._isWebWorker = Vt.isWebWorker, this._WASMAudioDecoderCommon = Vt.WASMAudioDecoderCommon || U, this._EmscriptenWASM = Vt.EmscriptenWASM || tt, this._module = Vt.module, this._inputSize = 128 * 1024, this._ready = this._init(), this;
}
var Jr = /* @__PURE__ */ Symbol();
var Bt = class {
  constructor() {
    this._onCodec = (e) => {
      if (e !== "vorbis") throw new Error("@wasm-audio-decoders/ogg-vorbis does not support this codec " + e);
    }, new U(), this._init(), this._ready = this[Jr](Vt);
  }
  _init() {
    this._vorbisSetupInProgress = true, this._totalSamplesDecoded = 0, this._codecParser = new Vo("audio/ogg", { onCodec: this._onCodec, enableFrameCRC32: false });
  }
  async [Jr](e) {
    if (this._decoder) {
      let t = this._decoder;
      await t.ready.then(() => t.free());
    }
    return this._decoder = new e(), this._decoder.ready;
  }
  get ready() {
    return this._ready;
  }
  async reset() {
    return this._init(), this._decoder.reset();
  }
  free() {
    this._decoder.free();
  }
  async decodeOggPages(e) {
    let t = [];
    for (let n = 0; n < e.length; n++) {
      let o = e[n];
      if (this._vorbisSetupInProgress && (o[Xr][0] === 1 && this._decoder.sendSetupHeader(o[Xr]), o[$r].length)) {
        let a = o[$r][0][Bo];
        this._decoder.sendSetupHeader(a[_o]), this._decoder.initDsp(), this._vorbisSetupInProgress = false;
      }
      t.push(...o[$r].map((a) => a[Xr]));
    }
    let s = await this._decoder.decodePackets(t);
    this._totalSamplesDecoded += s.samplesDecoded;
    let r = e[e.length - 1];
    if (r && r[Ao]) {
      let n = this._totalSamplesDecoded - r[Oo];
      if (n > 0) {
        for (let o = 0; o < s.channelData.length; o++) s.channelData[o] = s.channelData[o].subarray(0, s.samplesDecoded - n);
        s.samplesDecoded -= n, this._totalSamplesDecoded -= n;
      }
    }
    return s;
  }
  async decode(e) {
    return this.decodeOggPages([...this._codecParser.parseChunk(e)]);
  }
  async flush() {
    let e = await this.decodeOggPages([...this._codecParser.flush()]);
    return await this.reset(), e;
  }
  async decodeFile(e) {
    let t = await this.decodeOggPages([...this._codecParser.parseAll(e)]);
    return await this.reset(), t;
  }
};
var Fn = class extends Gt {
  constructor(e) {
    super(e, "ogg-vorbis-decoder", Vt, tt);
  }
  async sendSetupHeader(e) {
    return this.postToDecoder("sendSetupHeader", e);
  }
  async initDsp() {
    return this.postToDecoder("initDsp");
  }
  async decodePackets(e) {
    return this.postToDecoder("decodePackets", e);
  }
};
var At = class extends Bt {
  constructor() {
    super(), this._ready = super[Jr](Fn);
  }
  async free() {
    await this._decoder.free();
  }
  terminate() {
    this._decoder.terminate();
  }
};
wr(Bt, "OggVorbisDecoder");
wr(At, "OggVorbisDecoderWebWorker");
function Lo(i22, e, t) {
  let s = i22.sampleRate, r = s * e, n = new AudioBuffer({ numberOfChannels: 2, length: r, sampleRate: s }), o = Math.min(s * t, r);
  for (let a = 0; a < n.numberOfChannels; a++) {
    let c = n.getChannelData(a);
    for (let u = 0; u < o; u++) c[u] = Math.random() * 2 - 1;
    let l = 1 / (s * e);
    for (let u = o; u < r; u++) {
      let h = Math.exp(-(u - o) * l);
      c[u] = (Math.random() * 2 - 1) * h;
    }
  }
  return n;
}
function En(i22, e) {
  let t = new ConvolverNode(i22, { buffer: e });
  return { input: t, output: t };
}
function ra(i22, e, t, s) {
  let r = new DelayNode(i22, { maxDelayTime: t, delayTime: t }), n = new GainNode(i22, { gain: s });
  return e.connect(r), r.connect(n), n.connect(r), r;
}
function sr(i22, e, t, s) {
  let r = new DelayNode(i22, { maxDelayTime: t, delayTime: t }), n = new GainNode(i22, { gain: s }), o = new GainNode(i22, { gain: 1 - s });
  return e.connect(r), r.connect(n), n.connect(r), r.connect(o), o;
}
function Uo(i22, e, t, s, r) {
  let n = new DelayNode(i22, { maxDelayTime: t, delayTime: t }), o = new GainNode(i22, { gain: s }), a = Math.max(0, Math.min(1, r)), c = new IIRFilterNode(i22, { feedforward: [1 - a], feedback: [1, -a] });
  return e.connect(n), n.connect(c), c.connect(o), o.connect(n), n;
}
function Go(i22, e, t, s, r) {
  let n = new GainNode(i22), o = new GainNode(i22);
  for (let c = 0; c < t.length; c++) ra(i22, n, t[c], e[c]).connect(o);
  let a = [];
  for (let c = 0; c < r.length; c++) {
    let l = c === 0 ? o : a.at(-1), u = sr(i22, l, r[c], s[c]);
    a.push(u);
  }
  return { input: n, output: a.at(-1) };
}
function na(i22, e, t, s, r, n, o, a) {
  let c = new GainNode(i22), l = new GainNode(i22);
  for (let d = 0; d < e.length; d++) {
    let p = new DelayNode(i22, { maxDelayTime: e[d], delayTime: e[d] }), y = new GainNode(i22, { gain: t[d] });
    c.connect(p), p.connect(y), y.connect(l);
  }
  let u = new GainNode(i22);
  for (let d = 0; d < s.length; d++) Uo(i22, l, s[d], r[d], n).connect(u);
  let h = [];
  for (let d = 0; d < o.length; d++) {
    let p = d === 0 ? u : h.at(-1), y = sr(i22, p, o[d], a[d]);
    h.push(y);
  }
  let f = new GainNode(i22);
  return l.connect(f), h.at(-1).connect(f), { input: c, output: f };
}
function jo(i22, { rt60: e = 2, damping: t = 0.3 } = {}) {
  let s = i22.sampleRate, r = [43e-4, 0.0215, 0.0225, 0.0268, 0.027, 0.0298, 0.0458], n = [0.841, 0.504, 0.491, 0.379, 0.38, 0.346, 0.289], a = [1309, 1635, 1811, 1926, 2053, 2667].map((h) => h / s), c = a.map((h) => Math.pow(10, -3 * h / e));
  return na(i22, r, n, a, c, t, [5e-3, 17e-4], [0.7, 0.7]);
}
function oa(i22, e, t, s = 0.2, r = 5e-4) {
  let n = e.length;
  if (n !== 4) throw new Error("createFDN: only N=4 is supported (4x4 Hadamard)");
  let o = [[0.5, 0.5, 0.5, 0.5], [0.5, -0.5, 0.5, -0.5], [0.5, 0.5, -0.5, -0.5], [0.5, -0.5, -0.5, 0.5]], a = new GainNode(i22), c = new GainNode(i22), l = e.map((d) => new DelayNode(i22, { maxDelayTime: d + r, delayTime: d })), u = l.map(() => {
    let d = Math.max(0, Math.min(1, s));
    return new IIRFilterNode(i22, { feedforward: [1 - d], feedback: [1, -d] });
  }), h = t.map((d) => new GainNode(i22, { gain: d }));
  r > 0 && l.forEach((d, p) => {
    let y = new OscillatorNode(i22, { frequency: 0.3 + p * 0.07 }), m = new GainNode(i22, { gain: r });
    y.connect(m), m.connect(d.delayTime), y.start();
  });
  let f = new GainNode(i22, { gain: 1 / n });
  a.connect(f), l.forEach((d) => f.connect(d));
  for (let d = 0; d < n; d++) l[d].connect(u[d]), u[d].connect(h[d]);
  for (let d = 0; d < n; d++) {
    for (let p = 0; p < n; p++) {
      if (o[d][p] === 0) continue;
      let y = new GainNode(i22, { gain: o[d][p] });
      h[p].connect(y), y.connect(l[d]);
    }
    l[d].connect(c);
  }
  return { input: a, output: c };
}
function qo(i22, { rt60: e = 2, damping: t = 0.2, modulation: s = 5e-4 } = {}) {
  let r = i22.sampleRate, o = [1049, 1327, 1601, 1873].map((c) => c / r), a = o.map((c) => Math.pow(10, -3 * c / e));
  return oa(i22, o, a, t, s);
}
function Ko(i22, { decay: e = 0.7, damping: t = 5e-4, bandwidth: s = 0.9995 } = {}) {
  let r = i22.sampleRate, n = Math.max(0, Math.min(1, s)), o = new IIRFilterNode(i22, { feedforward: [1 - n], feedback: [1, -n] }), a = r / 29761, c = [142, 107, 379, 277], l = [0.75, 0.75, 0.625, 0.625], u = new GainNode(i22);
  u.connect(o);
  let h = [];
  for (let x = 0; x < c.length; x++) {
    let L = x === 0 ? o : h.at(-1), j = sr(i22, L, c[x] * a / r, l[x]);
    h.push(j);
  }
  let f = h.at(-1), d = [672, 908], p = [0.5, 0.5], y = [4453, 4217], m = [3720, 3163], b = Math.max(0, Math.min(1, t)), v = [new GainNode(i22), new GainNode(i22)];
  f.connect(v[0]), f.connect(v[1]);
  let S = [];
  for (let x = 0; x < 2; x++) {
    let L = sr(i22, v[x], d[x] * a / r, p[x]), j = new DelayNode(i22, { maxDelayTime: y[x] * a / r, delayTime: y[x] * a / r }), ce = new IIRFilterNode(i22, { feedforward: [1 - b], feedback: [1, -b] }), le = new DelayNode(i22, { maxDelayTime: m[x] * a / r, delayTime: m[x] * a / r }), Fe = new GainNode(i22, { gain: e });
    L.connect(j), j.connect(ce), ce.connect(le), le.connect(Fe), S.push(Fe);
  }
  S[0].connect(v[1]), S[1].connect(v[0]);
  let M = new GainNode(i22, { gain: 0.5 });
  return S[0].connect(M), S[1].connect(M), { input: u, output: M };
}
var ia = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617];
var aa = 23;
var Ro = [225, 341, 441, 556];
var ca = 0.5;
function Qo(i22, { roomSize: e = 0.84, damping: t = 0.2 } = {}) {
  let s = i22.sampleRate, r = e * 0.28 + 0.7, n = (c) => {
    let l = new GainNode(i22), u = new GainNode(i22);
    for (let f of ia) {
      let d = (f + c) / s;
      Uo(i22, l, d, r, t).connect(u);
    }
    let h = [];
    for (let f = 0; f < Ro.length; f++) {
      let d = f === 0 ? u : h.at(-1), p = sr(i22, d, Ro[f] / s, ca);
      h.push(p);
    }
    return { input: l, output: h.at(-1) };
  }, o = n(0), a = n(aa);
  return { inputL: o.input, inputR: a.input, outputL: o.output, outputR: a.output };
}
function la(i22, e, t = 2e3) {
  let s = i22.sampleRate, r = Math.ceil(s * e), n = new AudioBuffer({ numberOfChannels: 2, length: r, sampleRate: s }), o = Math.max(1, Math.round(s / t));
  for (let a = 0; a < 2; a++) {
    let c = n.getChannelData(a);
    for (let l = 0; l < r; l += o) {
      let u = l + Math.floor(Math.random() * o);
      if (u < r) {
        let h = Math.exp(-u / (s * e * 0.3));
        c[u] = (Math.random() > 0.5 ? 1 : -1) * h;
      }
    }
  }
  return n;
}
function Wo(i22, e, t) {
  let s = la(i22, e, t);
  return En(i22, s);
}
var ua = "ads";
var Zo = new ArrayBuffer(8);
var ha = new Float64Array(Zo);
var da = new BigUint64Array(Zo);
function zo(i22) {
  return ha[0] = i22, da[0];
}
var kn = null;
var $o = Promise.resolve();
function fa() {
  if (!kn) {
    let i22 = new At();
    kn = i22.ready.then(() => i22);
  }
  return kn;
}
var In = class {
  voice;
  voiceParams;
  adjustedBaseFreq = 2e4;
  index = -1;
  ending = false;
  bufferSource;
  timelineIndex = null;
  renderedBuffer = null;
  fullCacheVoiceId = null;
  filterEnvelopeNode;
  volumeEnvelopeNode;
  volumeNode;
  modLfo;
  modLfoToPitch;
  modLfoToFilterFc;
  modLfoToVolume;
  vibLfo;
  vibLfoToPitch;
  reverbSend;
  chorusSend;
  portamentoNoteNumber = -1;
  pressure = 0;
  constructor(e, t, s) {
    this.noteNumber = e, this.velocity = t, this.startTime = s, this.ready = new Promise((r) => {
      this.resolveReady = r;
    });
  }
};
var Hn = class {
  channelNumber = 0;
  isDrum = false;
  programNumber = 0;
  detune = 0;
  bankMSB = 121;
  bankLSB = 0;
  dataMSB = 0;
  dataLSB = 0;
  rpnMSB = 127;
  rpnLSB = 127;
  mono = false;
  modulationDepthRange = 50;
  fineTuning = 0;
  coarseTuning = 0;
  activeNotes = new Array(128);
  sustainNotes = [];
  sostenutoNotes = [];
  controlTable = new Int8Array(Vn);
  scaleOctaveTuningTable = new Float32Array(12);
  channelPressureTable = new Int8Array(nr);
  polyphonicKeyPressureTable = new Int8Array(nr);
  keyBasedTable = new Int8Array(16384).fill(-1);
  keyBasedGainLs = new Array(128);
  keyBasedGainRs = new Array(128);
  lastNote = null;
  currentBufferSource = null;
  constructor(e, t, s) {
    this.channelNumber = e, Object.assign(this, t), Object.assign(this, s), this.state = new Nn();
  }
  resetSettings(e) {
    Object.assign(this, e);
  }
  resetTable() {
    this.controlTable.set(Vn), this.scaleOctaveTuningTable.fill(0), this.channelPressureTable.set(nr), this.polyphonicKeyPressureTable.set(nr), this.keyBasedTable.fill(-1);
  }
};
var or = new Array(57);
var pa = 10;
var Y = new Uint8Array(128);
Y[42] = 1;
Y[44] = 1;
Y[46] = 1;
Y[71] = 2;
Y[72] = 2;
Y[73] = 3;
Y[74] = 3;
Y[78] = 4;
Y[79] = 4;
Y[80] = 5;
Y[81] = 5;
Y[29] = 6;
Y[30] = 6;
Y[86] = 7;
Y[87] = 7;
or[0] = Y;
var Zr = new Uint8Array(128);
Zr[42] = 8;
Zr[44] = 8;
Zr[46] = 8;
or[25] = Zr;
var Yr = new Uint8Array(128);
Yr[27] = 9;
Yr[28] = 9;
Yr[29] = 9;
or[48] = Yr;
var Bn = new Uint8Array(128);
Bn[41] = 10;
Bn[42] = 10;
or[56] = Bn;
var _t = { noteOnVelocity: { type: 2, defaultValue: 0 }, noteOnKeyNumber: { type: 3, defaultValue: 0 }, polyphonicKeyPressure: { type: 10, defaultValue: 0 }, channelPressure: { type: 13, defaultValue: 0 }, pitchWheel: { type: 14, defaultValue: 8192 / 16383 }, pitchWheelSensitivity: { type: 16, defaultValue: 2 / 128 }, link: { type: 127, defaultValue: 0 }, modulationDepthMSB: { type: 129, defaultValue: 0 }, portamentoTimeMSB: { type: 133, defaultValue: 0 }, volumeMSB: { type: 135, defaultValue: 100 / 127 }, panMSB: { type: 138, defaultValue: 64 / 127 }, expressionMSB: { type: 139, defaultValue: 1 }, modulationDepthLSB: { type: 161, defaultValue: 0 }, portamentoTimeLSB: { type: 165, defaultValue: 0 }, volumeLSB: { type: 167, defaultValue: 0 }, panLSB: { type: 170, defaultValue: 0 }, expressionLSB: { type: 171, defaultValue: 0 }, sustainPedal: { type: 192, defaultValue: 0 }, portamento: { type: 193, defaultValue: 0 }, sostenutoPedal: { type: 194, defaultValue: 0 }, softPedal: { type: 195, defaultValue: 0 }, filterResonance: { type: 199, defaultValue: 64 / 127 }, releaseTime: { type: 200, defaultValue: 64 / 127 }, attackTime: { type: 201, defaultValue: 64 / 127 }, brightness: { type: 202, defaultValue: 64 / 127 }, decayTime: { type: 203, defaultValue: 64 / 127 }, vibratoRate: { type: 204, defaultValue: 64 / 127 }, vibratoDepth: { type: 205, defaultValue: 64 / 127 }, vibratoDelay: { type: 206, defaultValue: 64 / 127 }, portamentoNoteNumber: { type: 212, defaultValue: 0 }, reverbSendLevel: { type: 219, defaultValue: 0 }, chorusSendLevel: { type: 221, defaultValue: 0 } };
var Nn = class {
  array = new Float32Array(256);
  constructor() {
    let e = Object.entries(_t);
    for (let [t, { type: s, defaultValue: r }] of e) this.array[s] = r, Object.defineProperty(this, t, { get: () => this.array[s], set: (n) => this.array[s] = n, enumerable: true, configurable: true });
  }
};
var ma = ["volDelay", "volAttack", "volHold", "volDecay", "volSustain", "volRelease", "initialAttenuation"];
var ba = new Set(ma);
var ga = ["modEnvToPitch", "initialFilterFc", "modEnvToFilterFc", "modDelay", "modAttack", "modHold", "modDecay", "modSustain"];
var ya = new Set(ga);
var va = ["modEnvToPitch", "modDelay", "modAttack", "modHold", "modDecay", "modSustain", "playbackRate"];
var Sa = new Set(va);
var Dn = [2400 / 64, 9600 / 64, 1 / 64, 600 / 127, 2400 / 127, 1 / 127];
var rr = new Int8Array([64, 64, 0, 0, 0, 0]);
var nr = new Int8Array([64, 64, 64, 0, 0, 0]);
var Vn = new Int8Array([-1, -1, -1, -1, -1, -1, ...nr]);
var Ne = class {
  buffer;
  isLoop;
  isFull;
  adsDuration;
  loopStart;
  loopDuration;
  noteDuration;
  releaseDuration;
  constructor(e, t = {}) {
    this.buffer = e, this.isLoop = t.isLoop ?? false, this.isFull = t.isFull ?? false, this.adsDuration = t.adsDuration, this.loopStart = t.loopStart, this.loopDuration = t.loopDuration, this.noteDuration = t.noteDuration, this.releaseDuration = t.releaseDuration;
  }
};
function is(i22) {
  return Math.pow(10, i22 / 200);
}
var os = 1 / -Math.log(is(-1e3));
var vt = 1 / -Math.log(is(-600));
var Xo = class extends EventTarget {
  perceptualSmoothingTime = 4e-3;
  mode = "GM2";
  masterFineTuning = 0;
  masterCoarseTuning = 0;
  reverb = { algorithm: "Schroeder", time: this.getReverbTime(64), feedback: 0.8 };
  chorus = { modRate: this.getChorusModRate(3), modDepth: this.getChorusModDepth(19), feedback: this.getChorusFeedback(8), sendToReverb: this.getChorusSendToReverb(0), delayTimes: this.generateDistributedArray(0.02, 2, 0.5) };
  numChannels = 16;
  ticksPerBeat = 120;
  totalTime = 0;
  lastActiveSensing = 0;
  activeSensingThreshold = 0.3;
  noteCheckInterval = 0.1;
  lookAhead = 1;
  startDelay = 0.1;
  startTime = 0;
  resumeTime = 0;
  soundFonts = [];
  soundFontTable = Array.from({ length: 128 }, () => []);
  voiceCounter = /* @__PURE__ */ new Map();
  voiceCache = /* @__PURE__ */ new Map();
  realtimeVoiceCache = /* @__PURE__ */ new Map();
  decodeMethod = "wasm-audio-decoders";
  isPlaying = false;
  isPausing = false;
  isPaused = false;
  isStopping = false;
  isSeeking = false;
  totalTimeEventTypes = /* @__PURE__ */ new Set(["noteOff"]);
  tempo = 1;
  loop = false;
  loopStart = 0;
  playPromise;
  timeline = [];
  notePromises = [];
  instruments = /* @__PURE__ */ new Set();
  exclusiveClassNotes = new Array(128);
  drumExclusiveClassNotes = new Array(this.numChannels * pa);
  adsrVoiceCache = /* @__PURE__ */ new Map();
  noteOnDurations = /* @__PURE__ */ new Map();
  noteOnEvents = /* @__PURE__ */ new Map();
  fullVoiceCache = /* @__PURE__ */ new Map();
  renderedAudioBuffer = null;
  isRendering = false;
  audioModeBufferSource = null;
  mpeEnabled = false;
  lowerMPEMembers = 0;
  upperMPEMembers = 0;
  mpeState = { channelToNotes: /* @__PURE__ */ new Map() };
  static channelSettings = { detune: 0, programNumber: 0, bankMSB: 121, bankLSB: 0, dataMSB: 0, dataLSB: 0, rpnMSB: 127, rpnLSB: 127, mono: false, modulationDepthRange: 50, fineTuning: 0, coarseTuning: 0, portamentoControl: false, isMPEMember: false, isMPEManager: false };
  constructor(e) {
    super(), this.audioContext = e, this.cacheMode = ua, this.masterVolume = new GainNode(e), this.scheduler = new GainNode(e, { gain: 0 }), this.schedulerBuffer = new AudioBuffer({ length: 1, sampleRate: e.sampleRate }), this.messageHandlers = this.createMessageHandlers(), this.voiceParamsHandlers = this.createVoiceParamsHandlers(), this.controlChangeHandlers = this.createControlChangeHandlers(), this.keyBasedControllerHandlers = this.createKeyBasedControllerHandlers(), this.effectHandlers = this.createEffectHandlers(), this.channels = this.createChannels(), this.reverbEffect = this.createReverbEffect(this.reverb.algorithm), this.chorusEffect = this.createChorusEffect(), this.chorusEffect.output.connect(this.masterVolume), this.reverbEffect.output.connect(this.masterVolume), this.masterVolume.connect(e.destination), this.scheduler.connect(e.destination), this.GM2SystemOn();
  }
  addSoundFont(e) {
    let t = this.soundFonts.length;
    this.soundFonts.push(e);
    let s = e.parsed.presetHeaders, r = this.soundFontTable;
    for (let n = 0; n < s.length; n++) {
      let { preset: o, bank: a } = s[n];
      r[o][a] = t;
    }
  }
  async toUint8Array(e) {
    let t;
    if (typeof e == "string") {
      let r = await (await fetch(e)).arrayBuffer();
      t = new Uint8Array(r);
    } else if (e instanceof Uint8Array) t = e;
    else throw new TypeError("input must be a URL string or Uint8Array");
    return t;
  }
  async loadSoundFont(e) {
    if (this.voiceCounter.clear(), Array.isArray(e)) {
      let t = new Array(e.length);
      for (let r = 0; r < e.length; r++) t[r] = this.toUint8Array(e[r]);
      let s = await Promise.all(t);
      for (let r = 0; r < s.length; r++) {
        let n = cn(s[r]), o = new hs(n);
        this.addSoundFont(o);
      }
    } else {
      let t = await this.toUint8Array(e), s = cn(t), r = new hs(s);
      this.addSoundFont(r);
    }
  }
  async loadMIDI(e) {
    this.voiceCounter.clear();
    let t = await this.toUint8Array(e), s = (0, Jo.parseMidi)(t);
    this.ticksPerBeat = s.header.ticksPerBeat;
    let r = this.extractMidiData(s);
    this.instruments = r.instruments, this.timeline = r.timeline, this.totalTime = this.calcTotalTime(), this.cacheMode === "audio" && await this.render();
  }
  buildNoteOnDurations() {
    let { timeline: e, totalTime: t, noteOnDurations: s, noteOnEvents: r, numChannels: n } = this;
    s.clear(), r.clear();
    let o = 1 / this.tempo, a = new Uint8Array(n), c = new Uint8Array(n), l = new Array(n).fill(null).map(() => /* @__PURE__ */ new Set()), u = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), f = (d, p, y) => {
      let m = Math.max(0, p - d.startTime), b = y == null || y === 1 / 0 ? 1 / 0 : Math.max(0, y - d.startTicks);
      s.set(d.idx, m), r.set(d.idx, { duration: m, durationTicks: b, startTime: d.startTime, events: d.events });
    };
    for (let d = 0; d < e.length; d++) {
      let p = e[d], y = p.startTime * o;
      switch (p.type) {
        case "noteOn": {
          let m = p.noteNumber * n + p.channel;
          u.has(m) || u.set(m, []), u.get(m).push({ idx: d, startTime: y, startTicks: p.ticks, events: [] });
          let b = h.get(m);
          b && b.length > 0 && b.shift();
          break;
        }
        case "noteOff": {
          let m = p.channel, b = p.noteNumber * n + m, v = l[m].has(b);
          if (a[m] || v) h.has(b) || h.set(b, []), h.get(b).push({ t: y, ticks: p.ticks });
          else {
            let S = u.get(b);
            S && S.length > 0 && (f(S.shift(), y, p.ticks), S.length === 0 && u.delete(b));
          }
          break;
        }
        case "controller": {
          let m = p.channel;
          for (let [b, v] of u) if (b % n === m) for (let S of v) S.events.push(p);
          switch (p.controllerType) {
            case 64: {
              let b = p.value >= 64;
              if (a[m] = b ? 1 : 0, !b) for (let [v, S] of h) {
                if (v % n !== m) continue;
                let M = u.get(v);
                for (let { t: x, ticks: L } of S) M && M.length > 0 && (f(M.shift(), x, L), M.length === 0 && u.delete(v));
                h.delete(v);
              }
              break;
            }
            case 66: {
              let b = p.value >= 64;
              if (b && !c[m]) for (let [v] of u) v % n === m && l[m].add(v);
              else b || l[m].clear();
              c[m] = b ? 1 : 0;
              break;
            }
            case 121:
              a[m] = 0, c[m] = 0, l[m].clear();
              break;
            case 120:
            case 123: {
              for (let [b, v] of u) if (b % n === m) {
                for (let S of v) f(S, y, p.ticks);
                u.delete(b);
              }
              for (let b of h.keys()) b % n === m && h.delete(b);
              break;
            }
          }
          break;
        }
        case "sysEx":
          if (p.data[0] === 126 && p.data[1] === 9 && p.data[2] === 3) {
            if (p.data[3] === 1 || p.data[3] === 3) {
              a.fill(0), h.clear();
              for (let [, m] of u) for (let b of m) f(b, y, p.ticks);
              u.clear();
            }
          } else for (let [, m] of u) for (let b of m) b.events.push(p);
          break;
        case "pitchBend":
        case "programChange":
        case "channelAftertouch":
        case "noteAftertouch": {
          let m = p.channel;
          for (let [b, v] of u) if (b % n === m) for (let S of v) S.events.push(p);
        }
      }
    }
    for (let [, d] of u) for (let p of d) f(p, t, 1 / 0);
  }
  cacheVoiceIds() {
    let { channels: e, timeline: t, voiceCounter: s, cacheMode: r } = this;
    for (let n = 0; n < t.length; n++) {
      let o = t[n];
      switch (o.type) {
        case "noteOn": {
          let a = this.getVoiceId(e[o.channel], o.noteNumber, o.velocity);
          s.set(a, (s.get(a) ?? 0) + 1);
          break;
        }
        case "controller":
          o.controllerType === 0 ? this.setBankMSB(o.channel, o.value) : o.controllerType === 32 && this.setBankLSB(o.channel, o.value);
          break;
        case "programChange":
          this.setProgramChange(o.channel, o.programNumber, o.startTime);
      }
    }
    for (let [n, o] of s) o === 1 && s.delete(n);
    this.GM2SystemOn(), (r === "adsr" || r === "note" || r === "audio") && this.buildNoteOnDurations();
  }
  getVoiceId(e, t, s) {
    let r = e.programNumber, n = this.soundFontTable[r];
    if (!n) return;
    let o = e.isDrum ? 128 : e.bankLSB;
    if (n[o] === void 0) {
      if (e.isDrum) return;
      o = 0;
    }
    let a = n[o];
    if (a === void 0) return;
    let l = this.soundFonts[a].getVoice(o, r, t, s);
    if (!l) return;
    let { instrument: u, sampleID: h } = l.generators;
    return a * 2 ** 31 + u * 2 ** 24 + (h << 8);
  }
  createChannelAudioNodes(e) {
    let { gainLeft: t, gainRight: s } = this.panToGain(_t.panMSB.defaultValue), r = new GainNode(e, { gain: t }), n = new GainNode(e, { gain: s }), o = new ChannelMergerNode(e, { numberOfInputs: 2 });
    return r.connect(o, 0, 0), n.connect(o, 0, 1), o.connect(this.masterVolume), { gainL: r, gainR: n, merger: o };
  }
  createChannels() {
    let e = this.constructor.channelSettings, t = this.audioContext;
    return Array.from({ length: this.numChannels }, (s, r) => new Hn(r, this.createChannelAudioNodes(t), e));
  }
  decodeOggVorbis(e) {
    let t = $o.then(async () => {
      let s = await fa(), r = e.data.slice(), { channelData: n, sampleRate: o, errors: a } = await s.decodeFile(r);
      if (0 < a.length) throw new Error(a.join(", "));
      let c = new AudioBuffer({ numberOfChannels: n.length, length: n[0].length, sampleRate: o });
      for (let l = 0; l < n.length; l++) c.getChannelData(l).set(n[l]);
      return c;
    });
    return $o = t.catch(() => {
    }), t;
  }
  async createAudioBuffer(e) {
    let t = e.sample;
    if (t.type === "compressed") switch (this.decodeMethod) {
      case "decodeAudioData": {
        let s = t.data.slice().buffer;
        return await this.audioContext.decodeAudioData(s);
      }
      case "wasm-audio-decoders":
        return await this.decodeOggVorbis(t);
      default:
        throw new Error(`Unknown decodeMethod: ${this.decodeMethod}`);
    }
    else {
      let s = t.data, r = s.length + e.end, n = s.subarray(e.start, r), o = t.decodePCM(n), a = new AudioBuffer({ numberOfChannels: 1, length: o.length, sampleRate: t.sampleHeader.sampleRate });
      return a.getChannelData(0).set(o), a;
    }
  }
  isLoopDrum(e, t) {
    let s = e.programNumber;
    return s === 48 && t === 88 || s === 56 && 47 <= t && t <= 84;
  }
  createBufferSource(e, t, s, r) {
    let n = r instanceof Ne, o = n ? r.buffer : r, a = new AudioBufferSourceNode(this.audioContext);
    a.buffer = o;
    let c = e.isDrum ? this.isLoopDrum(e, t) : s.sampleModes % 2 !== 0, l = n ? r.isLoop : c;
    return a.loop = l, a.loop && (n && r.adsDuration != null ? (a.loopStart = r.loopStart, a.loopEnd = r.loopStart + r.loopDuration) : (a.loopStart = s.loopStart / s.sampleRate, a.loopEnd = s.loopEnd / s.sampleRate)), a;
  }
  scheduleTimelineEvents(e, t) {
    let s = this.resumeTime - this.startTime, r = e + s + this.lookAhead, n = this.startDelay - s, o = this.timeline, a = 1 / this.tempo;
    for (; t < o.length; ) {
      let c = o[t], l = c.startTime * a;
      if (r < l) break;
      let u = l + n;
      switch (c.type) {
        case "noteOn": {
          let h = this.createNote(c.channel, c.noteNumber, c.velocity, u);
          h.timelineIndex = t, this.setupNote(c.channel, h, u);
          break;
        }
        case "noteOff":
          this.noteOff(c.channel, c.noteNumber, c.velocity, u, false);
          break;
        case "controller":
          this.setControlChange(c.channel, c.controllerType, c.value, u);
          break;
        case "programChange":
          this.setProgramChange(c.channel, c.programNumber, u);
          break;
        case "pitchBend":
          this.setPitchBend(c.channel, c.value + 8192, u);
          break;
        case "sysEx":
          this.handleSysEx(c.data, u);
          break;
        case "channelAftertouch":
          this.setChannelPressure(c.channel, c.amount, u);
          break;
        case "noteAftertouch":
          this.setPolyphonicKeyPressure(c.channel, c.noteNumber, c.amount, u);
      }
      t++;
    }
    return t;
  }
  getQueueIndex(e) {
    let t = this.timeline, s = 1 / this.tempo;
    for (let r = 0; r < t.length; r++) if (e <= t[r].startTime * s) return r;
    return 0;
  }
  resetAllStates() {
    this.exclusiveClassNotes.fill(void 0), this.drumExclusiveClassNotes.fill(void 0), this.voiceCache.clear(), this.realtimeVoiceCache.clear(), this.adsrVoiceCache.clear();
    let e = this.channels;
    for (let t = 0; t < e.length; t++) {
      let s = e[t];
      s.lastNote = null, s.activeNotes = new Array(128), s.sustainNotes = [], s.sostenutoNotes = [], this.resetChannelStates(t);
    }
    this.mpeState.channelToNotes.clear();
  }
  updateStates(e, t) {
    let { timeline: s, resumeTime: r } = this, n = 1 / this.tempo, o = this.audioContext.currentTime;
    t < e && (e = 0);
    for (let a = e; a < t; a++) {
      let c = s[a];
      switch (c.type) {
        case "controller":
          this.setControlChange(c.channel, c.controllerType, c.value, o - r + c.startTime * n);
          break;
        case "programChange":
          this.setProgramChange(c.channel, c.programNumber, o - r + c.startTime * n);
          break;
        case "pitchBend":
          this.setPitchBend(c.channel, c.value + 8192, o - r + c.startTime * n);
          break;
        case "sysEx":
          this.handleSysEx(c.data, o - r + c.startTime * n);
          break;
        case "channelAftertouch":
          this.setChannelPressure(c.channel, c.amount, o - r + c.startTime * n);
          break;
        case "noteAftertouch":
          this.setPolyphonicKeyPressure(c.channel, c.noteNumber, c.amount, o - r + c.startTime * n);
      }
    }
  }
  async playAudioBuffer() {
    let e = this.audioContext, t = this.isPaused;
    this.isPlaying = true, this.isPaused = false, this.startTime = e.currentTime, t ? this.dispatchEvent(new Event("resumed")) : this.dispatchEvent(new Event("started"));
    let s;
    e: for (; ; ) {
      let r = this.renderedAudioBuffer, n = new AudioBufferSourceNode(e, { buffer: r });
      n.playbackRate.value = this.tempo, n.connect(this.masterVolume);
      let o = Math.min(Math.max(this.resumeTime, 0), r.duration);
      n.start(e.currentTime, o), this.audioModeBufferSource = n;
      let a = false;
      for (n.onended = () => {
        a = true;
      }; ; ) {
        let c = e.currentTime;
        if (await this.scheduleTask(() => {
        }, c + this.noteCheckInterval), a || this.currentTime() >= this.totalTime) {
          if (n.disconnect(), this.audioModeBufferSource = null, this.loop) {
            this.resumeTime = 0, this.startTime = e.currentTime, this.dispatchEvent(new Event("looped"));
            continue e;
          }
          await e.suspend(), s = "ended";
          break e;
        }
        if (this.isPausing) {
          this.resumeTime = this.currentTime(), n.stop(), n.disconnect(), this.audioModeBufferSource = null, await e.suspend(), this.isPausing = false, s = "paused";
          break e;
        } else if (this.isStopping) {
          n.stop(), n.disconnect(), this.audioModeBufferSource = null, await e.suspend(), this.isStopping = false, s = "stopped";
          break e;
        } else if (this.isSeeking) {
          n.stop(), n.disconnect(), this.audioModeBufferSource = null, this.startTime = e.currentTime, this.isSeeking = false, this.dispatchEvent(new Event("seeked"));
          continue e;
        }
      }
    }
    this.isPlaying = false, s === "paused" ? (this.isPaused = true, this.dispatchEvent(new Event("paused"))) : s !== void 0 && (this.isPaused = false, this.dispatchEvent(new Event(s)));
  }
  async playNotes() {
    let e = this.audioContext;
    if (e.state === "suspended" && await e.resume(), this.cacheMode === "audio" && this.renderedAudioBuffer) return await this.playAudioBuffer();
    let t = this.isPaused;
    this.isPlaying = true, this.isPaused = false, this.startTime = e.currentTime, t ? this.dispatchEvent(new Event("resumed")) : this.dispatchEvent(new Event("started"));
    let s = this.getQueueIndex(this.resumeTime), r;
    for (this.notePromises = []; ; ) {
      let n = e.currentTime;
      if (0 < this.lastActiveSensing && this.activeSensingThreshold < performance.now() - this.lastActiveSensing) {
        await this.stopNotes(n), await e.suspend(), r = "aborted";
        break;
      }
      if (this.totalTime < this.currentTime() || this.timeline.length <= s) {
        let a = this.notePromises.slice();
        if (this.notePromises = [], await Promise.allSettled(a), this.loop) {
          if (this.resetAllStates(), this.startTime = e.currentTime, this.resumeTime = this.loopStart, 0 < this.loopStart) {
            let c = this.getQueueIndex(this.resumeTime);
            this.updateStates(s, c), s = c;
          } else s = 0;
          this.dispatchEvent(new Event("looped"));
          continue;
        } else {
          await e.suspend(), r = "ended";
          break;
        }
      }
      if (this.isPausing) {
        await this.stopNotes(n), await e.suspend(), this.isPausing = false, r = "paused";
        break;
      } else if (this.isStopping) {
        await this.stopNotes(n), await e.suspend(), this.isStopping = false, r = "stopped";
        break;
      } else if (this.isSeeking) {
        this.stopNotes(n), this.startTime = e.currentTime;
        let a = this.getQueueIndex(this.resumeTime);
        this.updateStates(s, a), s = a, this.isSeeking = false, this.dispatchEvent(new Event("seeked"));
        continue;
      }
      s = this.scheduleTimelineEvents(n, s);
      let o = n + this.noteCheckInterval;
      await this.scheduleTask(() => {
      }, o);
    }
    r !== "paused" && (this.resetAllStates(), this.lastActiveSensing = 0), this.isPlaying = false, r === "paused" ? (this.isPaused = true, this.dispatchEvent(new Event("paused"))) : (this.isPaused = false, this.dispatchEvent(new Event(r)));
  }
  ticksToSecond(e, t) {
    return e * t / this.ticksPerBeat;
  }
  secondToTicks(e, t) {
    return e * this.ticksPerBeat / t;
  }
  getSoundFontId(e) {
    let t = e.programNumber, r = (e.isDrum ? 128 : e.bankLSB).toString().padStart(3, "0"), n = t.toString().padStart(3, "0");
    return `${r}:${n}`;
  }
  extractMidiData(e) {
    let t = /* @__PURE__ */ new Set(), s = [], r = this.channels;
    for (let l = 0; l < e.tracks.length; l++) {
      let u = e.tracks[l], h = 0;
      for (let f = 0; f < u.length; f++) {
        let d = u[f];
        switch (h += d.deltaTime, d.ticks = h, d.type) {
          case "noteOn": {
            let p = r[d.channel];
            t.add(this.getSoundFontId(p));
            break;
          }
          case "controller":
            switch (d.controllerType) {
              case 0:
                this.setBankMSB(d.channel, d.value);
                break;
              case 32:
                this.setBankLSB(d.channel, d.value);
                break;
            }
            break;
          case "programChange": {
            let p = r[d.channel];
            this.setProgramChange(d.channel, d.programNumber), t.add(this.getSoundFontId(p));
            break;
          }
          case "sysEx": {
            let p = d.data;
            if (p[0] === 126 && p[1] === 9 && p[2] === 3) switch (p[3]) {
              case 1:
                this.GM1SystemOn();
                break;
              case 2:
                break;
              case 3:
                this.GM2SystemOn();
                break;
              default:
                console.warn(`Unsupported Exclusive Message: ${p}`);
            }
          }
        }
        delete d.deltaTime, s.push(d);
      }
    }
    let n = { controller: 0, sysEx: 1, noteOff: 2, noteOn: 3 };
    s.sort((l, u) => l.ticks !== u.ticks ? l.ticks - u.ticks : (n[l.type] || 4) - (n[u.type] || 4));
    let o = 0, a = 0, c = 0.5;
    for (let l = 0; l < s.length; l++) {
      let u = s[l], h = this.ticksToSecond(u.ticks - a, c);
      u.startTime = o + h, u.type === "setTempo" && (o += this.ticksToSecond(u.ticks - a, c), c = u.microsecondsPerBeat / 1e6, a = u.ticks);
    }
    return { instruments: t, timeline: s };
  }
  async stopChannelNotes(e, t) {
    let s = this.channels[e], r = [], n = this.perceptualSmoothingTime / 5;
    for (let o = 0; o < 128; o++) {
      let a = s.activeNotes[o];
      if (a) for (let c = 0; c < a.length; c++) {
        let l = a[c], u = l.ready.then(() => {
          if (!l.voice) return;
          let h = this.audioContext.currentTime, f = Math.max(t, h);
          l.volumeNode.gain.cancelScheduledValues(f).setTargetAtTime(0, f, n), l.bufferSource.stop(f + this.perceptualSmoothingTime);
        });
        r.push(u);
      }
    }
    await Promise.all(r), s.lastNote = null, s.activeNotes = new Array(128), s.sustainNotes = [], s.sostenutoNotes = [], this.notePromises = [];
  }
  async stopNotes(e) {
    for (let s = 0; s < this.channels.length; s++) await this.stopChannelNotes(s, e);
    let t = Promise.all(this.notePromises);
    return this.notePromises = [], t;
  }
  async render() {
    if (this.isRendering || this.timeline.length === 0) return;
    this.voiceCounter.size === 0 && this.cacheVoiceIds(), this.isRendering = true, this.renderedAudioBuffer = null, this.dispatchEvent(new Event("rendering"));
    let e = this.audioContext.sampleRate, t = Math.ceil((this.totalTime + this.startDelay) * e), s = new Uint8Array(this.numChannels), r = new Uint8Array(this.numChannels), n = new Uint8Array(this.numChannels), o = new Uint8Array(this.numChannels), a = new Uint8Array(this.numChannels * 128);
    s.fill(121), o[9] = 1, s[9] = 120;
    let c = Array.from({ length: this.numChannels }, () => {
      let d = new Float32Array(256);
      for (let { type: p, defaultValue: y } of Object.values(_t)) d[p] = y;
      return d;
    }), l = [], u = this.timeline, h = 1 / this.tempo;
    for (let d = 0; d < u.length; d++) {
      let p = u[d], y = p.channel;
      switch (p.type) {
        case "noteOn": {
          let m = this.noteOnEvents.get(d), b = m?.duration ?? this.noteOnDurations.get(d) ?? 0;
          if (b <= 0) continue;
          let { noteNumber: v, velocity: S } = p, M = o[y] === 1, x = n[y], L = this.soundFontTable[x];
          if (!L) continue;
          let j = M ? 128 : r[y];
          if (L[j] === void 0) {
            if (M) continue;
            j = 0;
          }
          let ce = L[j];
          if (ce === void 0) continue;
          let le = this.soundFonts[ce], Fe = a[y * 128 + v], je = { channelNumber: y, state: { array: c[y].slice() }, programNumber: x, isDrum: M, modulationDepthRange: 50, detune: 0 }, Ot = this.getControllerState(je, v, S, Fe), St = le.getVoice(j, x, v, S);
          if (!St) continue;
          let Ve = St.getAllParams(Ot), de = p.startTime * h + this.startDelay, ye = { voiceParams: Ve, channel: y, noteNumber: v, velocity: S }, en = (async () => {
            try {
              return await this.createFullRenderedBuffer(je, ye, Ve, b, m);
            } catch (tn) {
              return console.warn("render: note render failed", tn), null;
            }
          })();
          l.push({ t: de, promise: en, fakeChannel: je });
          break;
        }
        case "controller": {
          let { controllerType: m, value: b } = p;
          switch (m) {
            case 0:
              s[y] = b, this.mode === "GM2" && (b === 120 ? o[y] = 1 : b === 121 && (o[y] = 0));
              break;
            case 32:
              r[y] = b;
              break;
            default: {
              let v = 128 + m;
              v < 256 && (c[y][v] = b / 127);
              break;
            }
          }
          break;
        }
        case "pitchBend":
          c[y][14] = (p.value + 8192) / 16383;
          break;
        case "programChange":
          n[y] = p.programNumber, this.mode === "GM2" && (s[y] === 120 ? o[y] = 1 : s[y] === 121 && (o[y] = 0));
          break;
        case "sysEx": {
          let m = p.data;
          if (m[0] === 126 && m[1] === 9 && m[2] === 3) {
            if (m[3] === 1) {
              s.fill(0), r.fill(0), n.fill(0), o.fill(0), o[9] = 1, s[9] = 1;
              for (let b = 0; b < this.numChannels; b++) for (let { type: v, defaultValue: S } of Object.values(_t)) c[b][v] = S;
              a.fill(0);
            } else if (m[3] === 3) {
              s.fill(121), r.fill(0), n.fill(0), o.fill(0), o[9] = 1, s[9] = 120;
              for (let b = 0; b < this.numChannels; b++) for (let { type: v, defaultValue: S } of Object.values(_t)) c[b][v] = S;
              a.fill(0);
            }
          }
          break;
        }
        case "channelAftertouch":
          c[y][13] = p.amount / 127;
          break;
        case "noteAftertouch":
          a[y * 128 + p.noteNumber] = p.amount;
          break;
      }
    }
    let f = new OfflineAudioContext(2, t, e);
    for (let d = 0; d < l.length; d++) {
      let { t: p, promise: y } = l[d], m = await y;
      if (!m) continue;
      let b = m instanceof Ne ? m.buffer : m, v = new AudioBufferSourceNode(f, { buffer: b });
      v.connect(f.destination), v.start(p);
    }
    return this.renderedAudioBuffer = await f.startRendering(), this.isRendering = false, this.dispatchEvent(new Event("rendered")), this.renderedAudioBuffer;
  }
  async start() {
    this.isPlaying || this.isPaused || (this.resumeTime = 0, this.voiceCounter.size === 0 && this.cacheVoiceIds(), this.playPromise = this.playNotes(), await this.playPromise);
  }
  async stop() {
    this.isPlaying && (this.isStopping = true, await this.playPromise);
  }
  async pause() {
    if (!this.isPlaying || this.isPaused) return;
    let e = this.audioContext.currentTime;
    this.resumeTime = e + this.resumeTime - this.startTime, this.isPausing = true, await this.playPromise;
  }
  async resume() {
    this.isPaused && (this.playPromise = this.playNotes(), await this.playPromise);
  }
  seekTo(e) {
    this.resumeTime = e, this.isPlaying && (this.isSeeking = true);
  }
  tempoChange(e) {
    let t = this.cacheMode, s = this.tempo / e;
    this.resumeTime = this.resumeTime * s, this.tempo = e, this.totalTime = this.calcTotalTime(), this.seekTo(this.currentTime() * s), (t === "adsr" || t === "note" || t === "audio") && (this.buildNoteOnDurations(), this.fullVoiceCache.clear(), this.adsrVoiceCache.clear()), t === "audio" && this.audioModeBufferSource && this.audioModeBufferSource.playbackRate.setValueAtTime(this.tempo, this.audioContext.currentTime);
  }
  calcTotalTime() {
    let e = this.totalTimeEventTypes, t = this.timeline, s = 1 / this.tempo, r = 0;
    for (let n = 0; n < t.length; n++) {
      let o = t[n];
      if (!e.has(o.type)) continue;
      let a = o.startTime * s;
      r < a && (r = a);
    }
    return r + this.startDelay;
  }
  currentTime() {
    if (!this.isPlaying) return this.resumeTime;
    let e = this.audioContext.currentTime;
    return this.cacheMode === "audio" ? this.resumeTime + (e - this.startTime) * this.tempo : e + this.resumeTime - this.startTime;
  }
  async processScheduledNotes(e, t) {
    let s = [];
    for (let r = 0; r < 128; r++) {
      let n = e.activeNotes[r];
      if (n) for (let o = 0; o < n.length; o++) {
        let a = n[o];
        if (a.ending) continue;
        let c = a.ready.then(() => t(a));
        s.push(c);
      }
    }
    return await Promise.all(s);
  }
  async processActiveNotes(e, t, s) {
    let r = [];
    for (let n = 0; n < 128; n++) {
      let o = e.activeNotes[n];
      if (o) for (let a = 0; a < o.length; a++) {
        let c = o[a];
        if (c.ending || t < c.startTime) continue;
        let l = c.ready.then(() => s(c));
        r.push(l);
      }
    }
    return await Promise.all(r);
  }
  applyToMPEChannels(e, t) {
    if (t(e), !!this.channels[e].isMPEManager) {
      if (e === 0) for (let r = 1; r <= this.lowerMPEMembers; r++) t(r);
      else if (e === 15) for (let r = 15 - this.upperMPEMembers; r <= 14; r++) t(r);
    }
  }
  generateDistributedArray(e, t, s = 0.1, r = 0.05) {
    let n = e * s, o = new Array(t);
    for (let a = 0; a < t; a++) {
      let c = a / (t - 1 || 1), l = e - n + c * 2 * n;
      o[a] = l * (1 - (Math.random() * 2 - 1) * r);
    }
    return o;
  }
  setReverbEffect(e) {
    this.reverbEffect && this.reverbEffect.output.disconnect(), this.reverbEffect = this.createReverbEffect(e), this.reverb.algorithm = e;
  }
  createReverbEffect(e) {
    let { audioContext: t, reverb: s } = this, { time: r, feedback: n } = s;
    switch (e) {
      case "Convolution": {
        let o = Lo(t, r, this.calcDelay(r, n));
        return En(t, o);
      }
      case "Schroeder": {
        let o = this.generateDistributedArray(n, 4), a = o.map((u) => this.calcDelay(r, u)), c = this.generateDistributedArray(n, 4), l = c.map((u) => this.calcDelay(r, u));
        return Go(t, o, a, c, l);
      }
      case "Moorer":
        return jo(t, { rt60: r, damping: 1 - n });
      case "FDN":
        return qo(t, { rt60: r, damping: 1 - n });
      case "Dattorro": {
        let o = n * 0.28 + 0.7;
        return Ko(t, { decay: o, damping: 1 - n });
      }
      case "Freeverb": {
        let o = 1 - n, { inputL: a, inputR: c, outputL: l, outputR: u } = Qo(t, { roomSize: n, damping: o }), h = new GainNode(t), f = new GainNode(t, { gain: 0.5 });
        return h.connect(a), h.connect(c), l.connect(f), u.connect(f), { input: h, output: f };
      }
      case "VelvetNoise":
        return Wo(t, r);
      default:
        throw new Error(`Unknown reverb algorithm: ${e}`);
    }
  }
  createChorusEffect() {
    let e = this.audioContext, t = new GainNode(e), s = new GainNode(e), r = new GainNode(e), n = new OscillatorNode(e, { frequency: this.chorus.modRate }), o = new GainNode(e, { gain: this.chorus.modDepth / 2 }), a = this.chorus.delayTimes, c = [], l = [];
    for (let u = 0; u < a.length; u++) {
      let h = a[u], f = new DelayNode(e, { maxDelayTime: 0.1, delayTime: h }), d = new GainNode(e, { gain: this.chorus.feedback });
      c.push(f), l.push(d), t.connect(f), o.connect(f.delayTime), f.connect(d), d.connect(f), f.connect(s);
    }
    return s.connect(r), n.connect(o), n.start(), { input: t, output: s, sendGain: r, lfo: n, lfoGain: o, delayNodes: c, feedbackGains: l };
  }
  rateToCent(e) {
    return 1200 * Math.log2(e);
  }
  centToRate(e) {
    return Math.pow(2, e / 1200);
  }
  centToHz(e) {
    return 8.176 * this.centToRate(e);
  }
  calcChannelDetune(e) {
    let t = e.isDrum ? 0 : this.masterCoarseTuning + this.masterFineTuning, s = e.coarseTuning + e.fineTuning, r = t + s, n = e.state.pitchWheel * 2 - 1, o = e.state.pitchWheelSensitivity * 12800, a = n * o, c = this.getChannelPitchControl(e);
    return r + a + c;
  }
  updateChannelDetune(e, t) {
    this.processScheduledNotes(e, (s) => {
      s.renderedBuffer?.isFull || (this.isPortamento(e, s) ? this.setPortamentoDetune(e, s, t) : this.setDetune(e, s, t));
    });
  }
  calcScaleOctaveTuning(e, t) {
    return e.scaleOctaveTuningTable[t.noteNumber % 12];
  }
  calcNoteDetune(e, t) {
    let s = t.voiceParams.detune + this.calcScaleOctaveTuning(e, t), r = this.getNotePitchControl(e, t);
    return e.detune + s + r;
  }
  getPortamentoTime(e, t) {
    let { portamentoTimeMSB: s, portamentoTimeLSB: r } = e.state, n = s + r / 128, o = Math.abs(t.noteNumber - t.portamentoNoteNumber), a = Math.ceil(n * 128);
    return o / this.getPitchIncrementSpeed(a) / 10;
  }
  getPitchIncrementSpeed(e) {
    let t = [[0, 1e3], [6, 100], [16, 20], [32, 10], [48, 5], [64, 2.5], [80, 1], [96, 0.4], [112, 0.15], [127, 0.01]], s = new Array(t.length);
    for (let M = 0; M < t.length; M++) {
      let [x, L] = t[M];
      if (e === x) return L;
      s[M] = [x, Math.log(L)];
    }
    let r = 0;
    for (let M = 1; M < s.length; M++) if (e <= s[M][0]) {
      r = M - 1;
      break;
    }
    let [n, o] = s[r], [a, c] = s[r + 1], l = a - n, u = (e - n) / l, h, f;
    if (r === 0) h = (c - o) / l;
    else {
      let [M, x] = s[r - 1];
      h = (c - x) / (a - M);
    }
    if (r === s.length - 2) f = (c - o) / l;
    else {
      let [M, x] = s[r + 2];
      f = (x - o) / (M - n);
    }
    let d = u * u, p = d * u, y = 2 * p - 3 * d + 1, m = p - 2 * d + u, b = -2 * p + 3 * d, v = p - d, S = y * o + b * c + l * (m * h + v * f);
    return Math.exp(S);
  }
  setPortamentoVolumeEnvelope(e, t, s) {
    let { voiceParams: r, startTime: n } = t, a = is(-r.initialAttenuation) * (1 + this.getChannelAmplitudeControl(e)) * (1 - r.volSustain), c = n + this.getPortamentoTime(e, t);
    t.volumeEnvelopeNode.gain.cancelScheduledValues(s).exponentialRampToValueAtTime(a, c);
  }
  setVolumeEnvelope(e, t, s) {
    if (!t.volumeEnvelopeNode) return;
    let { voiceParams: r, startTime: n, noteNumber: o } = t, a = is(-r.initialAttenuation) * (1 + this.getChannelAmplitudeControl(e)), c = a * (1 - r.volSustain), l = n + r.volDelay, u = this.getRelativeKeyBasedValue(e, o, 73) * 2, h = l + r.volAttack * u, f = h + r.volHold, d = this.getRelativeKeyBasedValue(e, o, 75) * 2, p = r.volDecay * d;
    t.volumeEnvelopeNode.gain.cancelScheduledValues(s).setValueAtTime(0, n).setValueAtTime(1e-6, l).exponentialRampToValueAtTime(a, h).setValueAtTime(a, f).setTargetAtTime(c, f, p * os);
  }
  setVolumeNode(e, t, s) {
    let r = 1 + this.getNoteAmplitudeControl(e, t), n = this.perceptualSmoothingTime / 5;
    t.volumeNode.gain.cancelAndHoldAtTime(s).setTargetAtTime(r, s, n);
  }
  setPortamentoDetune(e, t, s) {
    if (e.portamentoControl) {
      let c = e.state, l = Math.ceil(c.portamentoNoteNumber * 127);
      t.portamentoNoteNumber = l, e.portamentoControl = false, c.portamentoNoteNumber = 0;
    }
    let r = this.calcNoteDetune(e, t), n = t.startTime, o = (t.noteNumber - t.portamentoNoteNumber) * 100, a = n + this.getPortamentoTime(e, t);
    t.bufferSource.detune.cancelScheduledValues(s).setValueAtTime(r - o, s).linearRampToValueAtTime(r, a);
  }
  setDetune(e, t, s) {
    let r = this.calcNoteDetune(e, t), n = this.perceptualSmoothingTime / 5;
    t.bufferSource.detune.cancelAndHoldAtTime(s).setTargetAtTime(r, s, n);
  }
  setPortamentoPitchEnvelope(e, t, s) {
    let r = t.voiceParams.playbackRate, n = t.startTime + this.getPortamentoTime(e, t);
    t.bufferSource.playbackRate.cancelScheduledValues(s).exponentialRampToValueAtTime(r, n);
  }
  setPitchEnvelope(e, t) {
    let { bufferSource: s, voiceParams: r } = e, n = r.playbackRate;
    s.playbackRate.cancelScheduledValues(t).setValueAtTime(n, t);
    let o = r.modEnvToPitch;
    if (o === 0) return;
    let a = n * this.centToRate(o), c = e.startTime + r.modDelay, l = c + r.modAttack, u = l + r.modHold, h = r.modDecay;
    s.playbackRate.setValueAtTime(n, c).exponentialRampToValueAtTime(a, l).setValueAtTime(a, u).setTargetAtTime(n, u, h * os);
  }
  clampCutoffFrequency(e) {
    return Math.max(20, Math.min(e, 2e4));
  }
  setPortamentoFilterEnvelope(e, t, s) {
    if (!t.filterEnvelopeNode) return;
    let { voiceParams: r, startTime: n, noteNumber: o } = t, a = this.getSoftPedalFactor(e, t), c = this.getRelativeKeyBasedValue(e, o, 74) * 2, l = a * c, u = r.initialFilterFc + this.getFilterCutoffControl(e, t), h = u + r.modEnvToFilterFc * (1 - r.modSustain), f = this.centToHz(u) * l, d = this.centToHz(h) * l, p = this.clampCutoffFrequency(f), y = this.clampCutoffFrequency(d), m = n + this.getPortamentoTime(e, t), b = n + r.modDelay;
    t.adjustedBaseFreq = y, t.filterEnvelopeNode.frequency.cancelScheduledValues(s).setValueAtTime(p, n).setValueAtTime(p, b).exponentialRampToValueAtTime(y, m);
  }
  setFilterEnvelope(e, t, s) {
    if (!t.filterEnvelopeNode) return;
    let { voiceParams: r, startTime: n, noteNumber: o } = t, a = r.modEnvToFilterFc, c = r.initialFilterFc + this.getFilterCutoffControl(e, t), l = c + a, u = c + a * (1 - r.modSustain), h = this.getSoftPedalFactor(e, t), f = this.getRelativeKeyBasedValue(e, o, 74) * 2, d = h * f, p = this.centToHz(c) * d, y = this.centToHz(l) * d, m = this.centToHz(u) * d, b = this.clampCutoffFrequency(p), v = this.clampCutoffFrequency(y), S = this.clampCutoffFrequency(m), M = n + r.modDelay, x = M + r.modAttack, L = x + r.modHold, j = r.modDecay;
    t.adjustedBaseFreq = b, t.filterEnvelopeNode.frequency.cancelScheduledValues(s).setValueAtTime(b, n).setValueAtTime(b, M).exponentialRampToValueAtTime(v, x).setValueAtTime(v, L).setTargetAtTime(S, L, j * os);
  }
  startModulation(e, t, s) {
    let r = this.audioContext, { voiceParams: n } = t;
    t.modLfo = new OscillatorNode(r, { frequency: this.centToHz(n.freqModLFO) }), t.modLfoToFilterFc = new GainNode(r, { gain: n.modLfoToFilterFc }), t.modLfoToPitch = new GainNode(r), this.setModLfoToPitch(e, t, s), t.modLfoToVolume = new GainNode(r), this.setModLfoToVolume(e, t, s), t.modLfo.start(t.startTime + n.delayModLFO), t.modLfo.connect(t.modLfoToFilterFc), t.filterEnvelopeNode && t.modLfoToFilterFc.connect(t.filterEnvelopeNode.frequency), t.modLfo.connect(t.modLfoToPitch), t.modLfoToPitch.connect(t.bufferSource.detune), t.modLfo.connect(t.modLfoToVolume);
    let o = t.volumeEnvelopeNode ?? t.volumeNode;
    t.modLfoToVolume.connect(o.gain);
  }
  startVibrato(e, t, s) {
    let r = this.audioContext, { voiceParams: n, noteNumber: o } = t, a = this.getRelativeKeyBasedValue(e, o, 76) * 2, c = this.getRelativeKeyBasedValue(e, o, 78) * 2;
    t.vibLfo = new OscillatorNode(r, { frequency: this.centToHz(n.freqVibLFO) * a }), t.vibLfo.start(t.startTime + n.delayVibLFO * c), t.vibLfoToPitch = new GainNode(r), this.setVibLfoToPitch(e, t, s), t.vibLfo.connect(t.vibLfoToPitch), t.vibLfoToPitch.connect(t.bufferSource.detune);
  }
  async createAdsRenderedBuffer(e, t, s, r, n = false) {
    let o = n ? false : s.sampleModes % 2 !== 0, c = s.volDelay + s.volAttack + s.volHold, l = s.volDecay, u = c + l * os * 5, h = s.loopStart / s.sampleRate, f = o ? (s.loopEnd - s.loopStart) / s.sampleRate : 0, d = s.playbackRate, p = h / d, y = f / d, m = o && u > p ? Math.ceil((u - p) / y) : 0, b = p + m * y, v = o ? b + y : r.duration / d, S = this.audioContext.sampleRate, M = new OfflineAudioContext(r.numberOfChannels, Math.ceil(v * S), S), x = new AudioBufferSourceNode(M);
    x.buffer = r, x.playbackRate.value = d, x.loop = o, o && (x.loopStart = h, x.loopEnd = h + f);
    let L = this.clampCutoffFrequency(this.centToHz(s.initialFilterFc)), j = new BiquadFilterNode(M, { type: "lowpass", Q: s.initialFilterQ / 10, frequency: L }), ce = new GainNode(M), le = { ...t, startTime: 0, bufferSource: x, filterEnvelopeNode: j, volumeEnvelopeNode: ce };
    this.setVolumeEnvelope(e, le, 0), this.setFilterEnvelope(e, le, 0), x.connect(j), j.connect(ce), ce.connect(M.destination), s.sample.type === "compressed" ? x.start(0, s.start / r.sampleRate) : x.start(0);
    let Fe = await M.startRendering();
    return new Ne(Fe, { isLoop: o, adsDuration: u, loopStart: b, loopDuration: y });
  }
  async createAdsrRenderedBuffer(e, t, s, r, n) {
    let o = s.sampleModes % 2 !== 0, c = s.volDelay + s.volAttack + s.volHold, l = s.volDecay, u = c + l * os * 5, h = s.volRelease, f = s.loopStart / s.sampleRate, d = o ? (s.loopEnd - s.loopStart) / s.sampleRate : 0, p = o && n > f ? Math.ceil((n - f) / d) : 0, m = o ? f + p * d : n, b = m + h, v = this.audioContext.sampleRate, S = new OfflineAudioContext(r.numberOfChannels, Math.ceil(b * v), v), M = new AudioBufferSourceNode(S);
    M.buffer = r, M.playbackRate.value = s.playbackRate, M.loop = o, o && (M.loopStart = f, M.loopEnd = f + d);
    let x = this.clampCutoffFrequency(this.centToHz(s.initialFilterFc)), L = new BiquadFilterNode(S, { type: "lowpass", Q: s.initialFilterQ / 10, frequency: x }), j = new GainNode(S), ce = { ...t, startTime: 0, bufferSource: M, filterEnvelopeNode: L, volumeEnvelopeNode: j };
    this.setVolumeEnvelope(e, ce, 0), this.setFilterEnvelope(e, ce, 0);
    let le = is(-s.initialAttenuation), Fe = le * (1 - s.volSustain), je = s.volDelay, Ot = je + s.volAttack, St = Ot + s.volHold, Ve;
    if (m <= je) Ve = 0;
    else if (m <= Ot) Ve = 1e-6 + (le - 1e-6) * (m - je) / s.volAttack;
    else if (m <= St) Ve = le;
    else {
      let ye = m - St;
      Ve = Fe + (le - Fe) * Math.exp(-ye / (os * s.volDecay));
    }
    j.gain.cancelScheduledValues(m).setValueAtTime(Ve, m).setTargetAtTime(0, m, h * vt), L.frequency.cancelScheduledValues(m).setValueAtTime(x, m).setTargetAtTime(x, m, s.modRelease * vt), M.connect(L), L.connect(j), j.connect(S.destination), o ? M.start(0, s.start / r.sampleRate) : M.start(0);
    let de = await S.startRendering();
    return new Ne(de, { isLoop: false, isFull: false, adsDuration: u, noteDuration: m, releaseDuration: h });
  }
  async createFullRenderedBuffer(e, t, s, r, n = {}) {
    let { startTime: o = 0, events: a = [] } = n, c = e.channelNumber, l = s.volRelease * vt * 5, u = r + l, h = this.audioContext.sampleRate, f = new OfflineAudioContext(2, Math.ceil(u * h), h), d = new this.constructor(f, { cacheMode: "none" });
    f.suspend = () => Promise.resolve(), f.resume = () => Promise.resolve(), d.soundFonts = this.soundFonts, d.soundFontTable = this.soundFontTable;
    let p = d.channels[c];
    p.state.array.set(e.state.array), p.isDrum = e.isDrum, p.programNumber = e.programNumber, p.modulationDepthRange = e.modulationDepthRange, p.detune = this.calcChannelDetune(p), await d.noteOn(c, t.noteNumber, t.velocity, 0);
    for (let m of a) {
      let b = m.startTime / this.tempo - o;
      if (!(b < 0 || b > r)) switch (m.type) {
        case "controller":
          d.setControlChange(c, m.controllerType, m.value, b);
          break;
        case "pitchBend":
          d.setPitchBend(c, m.value + 8192, b);
          break;
        case "sysEx":
          d.handleSysEx(m.data, b);
          break;
        case "channelAftertouch":
          d.setChannelPressure(c, m.amount, b);
          break;
        case "noteAftertouch":
          d.setPolyphonicKeyPressure(c, m.noteNumber, m.amount, b);
      }
    }
    d.noteOff(c, t.noteNumber, 0, r, true);
    let y = await f.startRendering();
    return new Ne(y, { isLoop: false, isFull: true, noteDuration: r, releaseDuration: l });
  }
  async getAudioBuffer(e, t, s) {
    let r = this.cacheMode, { noteNumber: n, velocity: o } = t, a = this.getVoiceId(e, n, o);
    if (!s) {
      if (r === "note") return await this.getFullCachedBuffer(e, t, a);
      if (r === "adsr") return await this.getAdsrCachedBuffer(e, t, a);
    }
    return r === "none" ? await this.createAudioBuffer(t.voiceParams) : await this.getAdsCachedBuffer(e, t, a, s);
  }
  async getAdsCachedBuffer(e, t, s, r) {
    let n = s + (t.noteNumber << 1) + 1, o = t.voiceParams;
    if (r) {
      let a = this.realtimeVoiceCache.get(n);
      if (a) return a;
      let c = await this.createAudioBuffer(o), l = await this.createAdsRenderedBuffer(e, t, o, c, e.isDrum);
      return this.realtimeVoiceCache.set(n, l), l;
    } else {
      let a = this.voiceCache.get(n);
      if (a) return a.counter += 1, a.maxCount <= a.counter && this.voiceCache.delete(n), a.audioBuffer;
      {
        let c = this.voiceCounter.get(n) ?? 0, l = await this.createAudioBuffer(o), u = await this.createAdsRenderedBuffer(e, t, o, l, e.isDrum), h = { audioBuffer: u, maxCount: c, counter: 1 };
        return this.voiceCache.set(n, h), u;
      }
    }
  }
  async getAdsrCachedBuffer(e, t, s) {
    let r = t.voiceParams, n = t.timelineIndex, o = this.noteOnEvents.get(n), a = o?.durationTicks ?? 0, c = a === 1 / 0 ? 0xFFFFFFFFn : BigInt(a), l = zo(r.volRelease), u = zo(r.playbackRate), h = BigInt(s) << 160n | u << 96n | c << 64n | l, f = this.adsrVoiceCache.get(s);
    f || (f = /* @__PURE__ */ new Map(), this.adsrVoiceCache.set(s, f));
    let d = f.get(h);
    if (d instanceof Ne) return d;
    if (d instanceof Promise) {
      let m = await d;
      return m ?? await this.createAudioBuffer(r);
    }
    let p = o?.duration ?? 0, y = (async () => {
      try {
        let m = await this.createAudioBuffer(r), b = await this.createAdsrRenderedBuffer(e, t, r, m, p);
        return f.set(h, b), b;
      } catch (m) {
        throw f.delete(h), m;
      }
    })();
    return f.set(h, y), await y;
  }
  async getFullCachedBuffer(e, t, s) {
    let r = t.voiceParams, n = t.timelineIndex, o = this.noteOnEvents.get(n), a = o?.duration ?? 0, c = n, l = this.fullVoiceCache.get(s);
    l || (l = /* @__PURE__ */ new Map(), this.fullVoiceCache.set(s, l));
    let u = l.get(c);
    if (u instanceof Ne) return t.fullCacheVoiceId = s, u;
    if (u instanceof Promise) {
      let d = await u;
      return d == null ? await this.createAudioBuffer(r) : (t.fullCacheVoiceId = s, d);
    }
    let h = (async () => {
      try {
        let d = await this.createFullRenderedBuffer(e, t, r, a, o);
        return l.set(c, d), d;
      } catch (d) {
        throw l.delete(c), d;
      }
    })();
    l.set(c, h);
    let f = await h;
    return t.fullCacheVoiceId = s, f;
  }
  async setNoteAudioNode(e, t, s) {
    let r = this.audioContext, n = r.currentTime, { noteNumber: o, velocity: a, startTime: c } = t, l = e.state, u = this.getControllerState(e, o, a, 0), h = t.voice.getAllParams(u);
    t.voiceParams = h;
    let f = await this.getAudioBuffer(e, t, s), d = f instanceof Ne;
    t.renderedBuffer = d ? f : null, t.bufferSource = this.createBufferSource(e, o, h, f), t.volumeNode = new GainNode(r);
    let p = this.cacheMode, y = d && f.isFull === true;
    if (p === "none") {
      t.volumeEnvelopeNode = new GainNode(r), t.filterEnvelopeNode = new BiquadFilterNode(r, { type: "lowpass", Q: h.initialFilterQ / 10 });
      let m = e.lastNote;
      m && m.noteNumber !== o && (t.portamentoNoteNumber = m.noteNumber), !e.isDrum && this.isPortamento(e, t) ? (this.setPortamentoVolumeEnvelope(e, t, n), this.setPortamentoFilterEnvelope(e, t, n), this.setPortamentoPitchEnvelope(e, t, n), this.setPortamentoDetune(e, t, n)) : (this.setVolumeEnvelope(e, t, n), this.setFilterEnvelope(e, t, n), this.setPitchEnvelope(t, n), this.setDetune(e, t, n)), 0 < l.vibratoDepth && this.startVibrato(e, t, n), 0 < l.modulationDepthMSB && this.startModulation(e, t, n), e.mono && e.currentBufferSource && (e.currentBufferSource.stop(c), e.currentBufferSource = t.bufferSource), t.bufferSource.connect(t.filterEnvelopeNode), t.filterEnvelopeNode.connect(t.volumeEnvelopeNode), t.volumeEnvelopeNode.connect(t.volumeNode), this.setChorusSend(e, t, n), this.setReverbSend(e, t, n);
    } else y ? (t.volumeEnvelopeNode = null, t.filterEnvelopeNode = null, t.bufferSource.connect(t.volumeNode), this.setChorusSend(e, t, n), this.setReverbSend(e, t, n)) : (t.volumeEnvelopeNode = null, t.filterEnvelopeNode = null, this.setDetune(e, t, n), 0 < l.modulationDepthMSB && this.startModulation(e, t, n), t.bufferSource.connect(t.volumeNode), this.setChorusSend(e, t, n), this.setReverbSend(e, t, n));
    return h.sample.type, t.bufferSource.start(c), t;
  }
  handleExclusiveClass(e, t, s) {
    let r = e.voiceParams.exclusiveClass;
    if (r === 0) return;
    let n = this.exclusiveClassNotes[r];
    if (n) {
      let [o, a] = n;
      o && !o.ending && this.noteOff(a, o.noteNumber, 0, s, true);
    }
    this.exclusiveClassNotes[r] = [e, t];
  }
  handleDrumExclusiveClass(e, t, s) {
    let r = this.channels[t];
    if (!r.isDrum) return;
    let n = or[r.programNumber];
    if (!n) return;
    let o = n[e.noteNumber];
    if (o === 0) return;
    let a = (o - 1) * this.channels.length + t, c = this.drumExclusiveClassNotes[a];
    c && !c.ending && this.noteOff(t, c.noteNumber, 0, s, true), this.drumExclusiveClassNotes[a] = e;
  }
  setNoteRouting(e, t, s) {
    let r = this.channels[e], { volumeNode: n } = t;
    if (t.renderedBuffer?.isFull) n.connect(this.masterVolume);
    else if (r.isDrum) {
      let o = t.noteNumber, { keyBasedGainLs: a, keyBasedGainRs: c } = r, l = a[o], u = c[o];
      if (!l) {
        let h = this.createChannelAudioNodes(this.audioContext);
        l = a[o] = h.gainL, u = c[o] = h.gainR;
      }
      n.connect(l), n.connect(u);
    } else n.connect(r.gainL), n.connect(r.gainR);
    this.handleExclusiveClass(t, e, s), this.handleDrumExclusiveClass(t, e, s);
  }
  async noteOn(e, t, s, r) {
    this.mpeEnabled && (this.mpeState.channelToNotes.has(e) || this.mpeState.channelToNotes.set(e, /* @__PURE__ */ new Set()));
    let n = this.createNote(e, t, s, r), o = await this.setupNote(e, n, r);
    return this.mpeEnabled && o && this.mpeState.channelToNotes.get(e).add(o), o;
  }
  createNote(e, t, s, r) {
    0 <= r || (r = this.audioContext.currentTime);
    let n = new In(t, s, r);
    return n.channel = e, n;
  }
  async setupNote(e, t, s) {
    let r = s === void 0, n = this.channels[e], o = n.programNumber, a = this.soundFontTable[o];
    if (!a) return;
    let c = n.isDrum ? 128 : n.bankLSB;
    if (a[c] === void 0) {
      if (n.isDrum) return;
      c = 0;
    }
    let l = a[c];
    if (l === void 0) return;
    let u = this.soundFonts[l];
    if (t.voice = u.getVoice(c, o, t.noteNumber, t.velocity), !!t.voice) return n.activeNotes[t.noteNumber] || (n.activeNotes[t.noteNumber] = []), n.activeNotes[t.noteNumber].push(t), await this.setNoteAudioNode(n, t, r), n.lastNote = t, this.setNoteRouting(e, t, s), t.resolveReady(), 0.5 <= n.state.sustainPedal && n.sustainNotes.push(t), 0.5 <= n.state.sostenutoPedal && n.sostenutoNotes.push(t), t;
  }
  disconnectNote(e) {
    e.bufferSource.disconnect(), e.filterEnvelopeNode?.disconnect(), e.volumeEnvelopeNode?.disconnect(), e.volumeNode.disconnect(), e.modLfoToPitch && (e.modLfoToVolume.disconnect(), e.modLfoToPitch.disconnect(), e.modLfo.stop()), e.vibLfoToPitch && (e.vibLfoToPitch.disconnect(), e.vibLfo.stop()), e.reverbSend && e.reverbSend.disconnect(), e.chorusSend && e.chorusSend.disconnect();
  }
  releaseFullCache(e) {
    if (e.timelineIndex == null || e.fullCacheVoiceId == null) return;
    let t = this.fullVoiceCache.get(e.fullCacheVoiceId);
    if (!t) return;
    t.get(e.timelineIndex) instanceof Ne && (t.delete(e.timelineIndex), t.size === 0 && this.fullVoiceCache.delete(e.fullCacheVoiceId));
  }
  releaseNote(e, t, s) {
    let r = this.audioContext.currentTime;
    s ??= r;
    let n = () => {
      this.disconnectNote(t);
    };
    if (t.renderedBuffer?.isFull) {
      let l = t.renderedBuffer, u = t.startTime + l.buffer.duration, h = t.startTime + (l.noteDuration ?? 0);
      if (s < h) {
        let d = this.getRelativeKeyBasedValue(e, t.noteNumber, 72) * 2, p = t.voiceParams.volRelease * d, y = s + p;
        t.volumeNode.gain.cancelScheduledValues(s).setTargetAtTime(0, s, p * vt), t.bufferSource.stop(y);
      } else {
        if (u <= r) return n(), this.releaseFullCache(t), Promise.resolve();
        t.bufferSource.stop(u);
      }
      return new Promise((d) => {
        t.bufferSource.onended = () => {
          n(), this.releaseFullCache(t), d();
        };
      });
    }
    let o = this.getRelativeKeyBasedValue(e, t.noteNumber, 72) * 2, a = t.voiceParams.volRelease * o, c = s + a;
    if (t.volumeEnvelopeNode) t.filterEnvelopeNode.frequency.cancelScheduledValues(s).setTargetAtTime(t.adjustedBaseFreq, s, t.voiceParams.modRelease * vt), t.volumeEnvelopeNode.gain.cancelScheduledValues(s).setTargetAtTime(0, s, a * vt);
    else {
      if (t.renderedBuffer?.releaseDuration != null && !t.renderedBuffer.isFull) {
        let u = t.renderedBuffer, h = t.startTime + u.buffer.duration, f = t.startTime + (u.noteDuration ?? 0);
        return s < f ? (t.volumeNode.gain.cancelScheduledValues(s).setTargetAtTime(0, s, a * vt), t.bufferSource.stop(c)) : t.bufferSource.stop(h), new Promise((p) => {
          t.bufferSource.onended = () => {
            n(), p();
          };
        });
      }
      t.volumeNode.gain.cancelScheduledValues(s).setTargetAtTime(0, s, a * vt);
    }
    return t.bufferSource.stop(c), new Promise((l) => {
      t.bufferSource.onended = () => {
        n(), l();
      };
    });
  }
  noteOff(e, t, s, r, n) {
    if (this.mpeEnabled) {
      let o = this.mpeState.channelToNotes.get(e);
      if (!o || o.size === 0) return;
      let a;
      for (let u of o) if (u.noteNumber === t && !u.ending) {
        a = u;
        break;
      }
      if (!a) return;
      let c = this.channels[e];
      return a.ending = true, o.delete(a), o.size === 0 && this.mpeState.channelToNotes.delete(e), a.ready.then(() => this.releaseNote(c, a, r));
    } else return this.stopNote(e, t, s, r, n);
  }
  stopNote(e, t, s, r, n) {
    let o = this.channels[e], a = o.state;
    if (!n) {
      if (o.isDrum && !this.isLoopDrum(o, t)) {
        this.removeFromActiveNotes(o, t);
        return;
      }
      if (0.5 <= a.sustainPedal || 0.5 <= a.sostenutoPedal) return;
    }
    let c = this.findNoteForOff(o, t);
    if (!c) return;
    c.ending = true, this.removeFromActiveNotes(o, t);
    let l = c.ready.then(() => {
      if (c.voice) return this.releaseNote(o, c, r);
    });
    return this.notePromises.push(l), l;
  }
  findNoteForOff(e, t) {
    let s = e.activeNotes[t];
    if (s) {
      for (let r = 0; r < s.length; r++) if (!s[r].ending) return s[r];
    }
  }
  removeFromActiveNotes(e, t) {
    let s = e.activeNotes[t];
    !s || s.length === 0 || s.shift();
  }
  releaseSustainPedal(e, t, s) {
    let r = t * 2, n = this.channels[e], o = [];
    for (let a = 0; a < n.sustainNotes.length; a++) {
      let c = this.noteOff(e, n.sustainNotes[a].noteNumber, r, s, true);
      o.push(c);
    }
    return n.sustainNotes = [], o;
  }
  releaseSostenutoPedal(e, t, s) {
    let r = t * 2, n = this.channels[e], o = [], a = n.sostenutoNotes;
    n.state.sostenutoPedal = 0;
    for (let c = 0; c < a.length; c++) {
      let l = a[c], u = this.noteOff(e, l.noteNumber, r, s);
      o.push(u);
    }
    return n.sostenutoNotes = [], o;
  }
  soundOffNote(e, t) {
    if (e.ending = true, !e.voice) return Promise.resolve();
    let s = this.audioContext.currentTime, r = Math.max(t, s), n = this.perceptualSmoothingTime, o = n / 5;
    return e.volumeNode.gain.cancelScheduledValues(r).setTargetAtTime(0, r, o), e.bufferSource.stop(r + n), new Promise((a) => {
      e.bufferSource.onended = () => {
        this.disconnectNote(e), a();
      };
    });
  }
  soundOff(e, t, s) {
    let r = this.channels[e], n = this.findNoteForOff(r, t);
    return n ? (this.removeFromActiveNotes(r, n.noteNumber), this.soundOffNote(n, s)) : Promise.resolve();
  }
  createMessageHandlers() {
    let e = new Array(256);
    return e[128] = (t, s) => this.noteOff(t[0] & 15, t[1], t[2], s), e[144] = (t, s) => this.noteOn(t[0] & 15, t[1], t[2], s), e[160] = (t, s) => this.setPolyphonicKeyPressure(t[0] & 15, t[1], t[2], s), e[176] = (t, s) => this.setControlChange(t[0] & 15, t[1], t[2], s), e[192] = (t, s) => this.setProgramChange(t[0] & 15, t[1], s), e[208] = (t, s) => this.setChannelPressure(t[0] & 15, t[1], s), e[224] = (t, s) => this.handlePitchBendMessage(t[0] & 15, t[1], t[2], s), e[254] = (t, s) => this.activeSensing(), e;
  }
  handleMessage(e, t) {
    let s = e[0];
    if (s === 240) return this.handleSysEx(e.subarray(1), t);
    let r = this.messageHandlers[s];
    r && r(e, t);
  }
  activeSensing() {
    this.lastActiveSensing = performance.now();
  }
  setPolyphonicKeyPressure(e, t, s, r) {
    let n = this.channels[e];
    n.isMPEMember || (0 <= r || (r = this.audioContext.currentTime), this.processActiveNotes(n, r, (o) => {
      o.noteNumber === t && (o.pressure = s, this.setPolyphonicKeyPressureEffects(n, o, r));
    }), this.applyVoiceParams(n, 10, r));
  }
  setProgramChange(e, t, s) {
    this.applyToMPEChannels(e, (r) => {
      this.applyProgramChange(r, t, s);
    });
  }
  applyProgramChange(e, t, s) {
    let r = this.channels[e];
    if (r.programNumber = t, this.mode === "GM2") switch (r.bankMSB) {
      case 120:
        r.isDrum = true, r.keyBasedTable.fill(-1);
        break;
      case 121:
        r.isDrum = false;
        break;
    }
  }
  setChannelPressure(e, t, s) {
    0 <= s || (s = this.audioContext.currentTime), this.applyToMPEChannels(e, (r) => {
      this.applyChannelPressure(r, t, s);
    });
  }
  applyChannelPressure(e, t, s) {
    let r = this.channels[e];
    if (r.isDrum) return;
    let n = this.calcChannelPressureEffectValue(r, 0);
    r.state.channelPressure = t / 127;
    let o = this.calcChannelPressureEffectValue(r, 0);
    r.detune += o - n, this.processActiveNotes(r, s, (a) => {
      this.setChannelPressureEffects(r, a, s);
    }), this.applyVoiceParams(r, 13, s);
  }
  handlePitchBendMessage(e, t, s, r) {
    let n = s * 128 + t;
    this.setPitchBend(e, n, r);
  }
  setPitchBend(e, t, s) {
    this.applyToMPEChannels(e, (r) => {
      this.applyPitchBend(r, t, s);
    });
  }
  applyPitchBend(e, t, s) {
    let r = this.channels[e];
    if (r.isDrum) return;
    0 <= s || (s = this.audioContext.currentTime);
    let n = r.state, o = n.pitchWheel * 2 - 1, a = (t - 8192) / 8192;
    n.pitchWheel = t / 16383, r.detune += (a - o) * n.pitchWheelSensitivity * 12800, this.updateChannelDetune(r, s), this.applyVoiceParams(r, 14, s);
  }
  setModLfoToPitch(e, t, s) {
    if (t.modLfoToPitch) {
      let { modulationDepthMSB: r, modulationDepthLSB: n } = e.state, o = r + n / 128, a = t.voiceParams.modLfoToPitch + this.getLFOPitchDepth(e, t), l = (Math.abs(a) + o) * Math.sign(a);
      t.modLfoToPitch.gain.cancelScheduledValues(s).setValueAtTime(l, s);
    } else this.startModulation(e, t, s);
  }
  setVibLfoToPitch(e, t, s) {
    if (t.vibLfoToPitch) {
      let r = this.getRelativeKeyBasedValue(e, t.noteNumber, 77) * 2, n = t.voiceParams.vibLfoToPitch, a = Math.abs(n) * r * Math.sign(n);
      t.vibLfoToPitch.gain.cancelScheduledValues(s).setValueAtTime(a, s);
    } else this.startVibrato(e, t, s);
  }
  setModLfoToFilterFc(e, t, s) {
    let r = t.voiceParams.modLfoToFilterFc + this.getLFOFilterDepth(e, t);
    t.modLfoToFilterFc.gain.cancelScheduledValues(s).setValueAtTime(r, s);
  }
  setModLfoToVolume(e, t, s) {
    let r = t.voiceParams.modLfoToVolume, o = (is(Math.abs(r)) - 1) * Math.sign(r) * (1 + this.getLFOAmplitudeDepth(e, t));
    t.modLfoToVolume.gain.cancelScheduledValues(s).setValueAtTime(o, s);
  }
  setReverbSend(e, t, s) {
    let r = t.voiceParams.reverbEffectsSend * e.state.reverbSendLevel;
    if (e.isDrum) {
      let n = this.getKeyBasedValue(e, t.noteNumber, 91);
      0 <= n && (r = n / 127);
    }
    if (!t.reverbSend) 0 < r && (t.reverbSend = new GainNode(this.audioContext, { gain: r }), t.volumeNode.connect(t.reverbSend), t.reverbSend.connect(this.reverbEffect.input));
    else if (t.reverbSend.gain.cancelScheduledValues(s).setValueAtTime(r, s), 0 < r) t.volumeNode.connect(t.reverbSend);
    else try {
      t.volumeNode.disconnect(t.reverbSend);
    } catch {
    }
  }
  setChorusSend(e, t, s) {
    let r = t.voiceParams.chorusEffectsSend * e.state.chorusSendLevel;
    if (e.isDrum) {
      let n = this.getKeyBasedValue(e, t.noteNumber, 93);
      0 <= n && (r = n / 127);
    }
    if (!t.chorusSend) 0 < r && (t.chorusSend = new GainNode(this.audioContext, { gain: r }), t.volumeNode.connect(t.chorusSend), t.chorusSend.connect(this.chorusEffect.input));
    else if (t.chorusSend.gain.cancelScheduledValues(s).setValueAtTime(r, s), 0 < r) t.volumeNode.connect(t.chorusSend);
    else try {
      t.volumeNode.disconnect(t.chorusSend);
    } catch {
    }
  }
  setDelayModLFO(e) {
    let t = e.startTime + e.voiceParams.delayModLFO;
    try {
      e.modLfo.start(t);
    } catch {
    }
  }
  setFreqModLFO(e, t) {
    let s = e.voiceParams.freqModLFO;
    e.modLfo.frequency.cancelScheduledValues(t).setValueAtTime(s, t);
  }
  setDelayVibLFO(e, t) {
    let s = this.getRelativeKeyBasedValue(e, t.noteNumber, 78) * 2, r = t.voiceParams.delayVibLFO, n = t.startTime + r * s;
    try {
      t.vibLfo.start(n);
    } catch {
    }
  }
  setFreqVibLFO(e, t, s) {
    let r = this.getRelativeKeyBasedValue(e, t.noteNumber, 76) * 2, n = t.voiceParams.freqVibLFO;
    t.vibLfo.frequency.cancelScheduledValues(s).setValueAtTime(n * r, s);
  }
  createVoiceParamsHandlers() {
    return { modLfoToPitch: (e, t, s) => {
      let { modulationDepthMSB: r, modulationDepthLSB: n } = e.state;
      0 < r + n && this.setModLfoToPitch(e, t, s);
    }, vibLfoToPitch: (e, t, s) => {
      0 < e.state.vibratoDepth && this.setVibLfoToPitch(e, t, s);
    }, modLfoToFilterFc: (e, t, s) => {
      let { modulationDepthMSB: r, modulationDepthLSB: n } = e.state;
      0 < r + n && this.setModLfoToFilterFc(e, t, s);
    }, modLfoToVolume: (e, t, s) => {
      let { modulationDepthMSB: r, modulationDepthLSB: n } = e.state;
      0 < r + n && this.setModLfoToVolume(e, t, s);
    }, chorusEffectsSend: (e, t, s) => {
      this.setChorusSend(e, t, s);
    }, reverbEffectsSend: (e, t, s) => {
      this.setReverbSend(e, t, s);
    }, delayModLFO: (e, t, s) => {
      let { modulationDepthMSB: r, modulationDepthLSB: n } = e.state;
      0 < r + n && this.setDelayModLFO(t);
    }, freqModLFO: (e, t, s) => {
      let { modulationDepthMSB: r, modulationDepthLSB: n } = channel.state;
      0 < r + n && this.setFreqModLFO(t, s);
    }, delayVibLFO: (e, t, s) => {
      0 < e.state.vibratoDepth && this.setDelayVibLFO(e, t);
    }, freqVibLFO: (e, t, s) => {
      0 < e.state.vibratoDepth && this.setFreqVibLFO(e, t, s);
    }, detune: (e, t, s) => {
      this.isPortamento(e, t) ? this.setPortamentoDetune(e, t, s) : this.setDetune(e, t, s);
    } };
  }
  getControllerState(e, t, s, r) {
    let n = new Float32Array(e.state.array.length);
    return n.set(e.state.array), n[2] = s / 127, n[3] = t / 127, n[10] = r / 127, n;
  }
  applyVoiceParams(e, t, s) {
    this.processScheduledNotes(e, (r) => {
      if (r.renderedBuffer?.isFull) return;
      let n = this.getControllerState(e, r.noteNumber, r.velocity, r.pressure), o = r.voice.getParams(t, n), a = false, c = false, l = false;
      for (let [u, h] of Object.entries(o)) {
        let f = r.voiceParams[u];
        h !== f && (r.voiceParams[u] = h, u in this.voiceParamsHandlers ? this.voiceParamsHandlers[u](e, r, s) : (ba.has(u) && (a = true), ya.has(u) && (c = true), Sa.has(u) && (l = true)));
      }
      a && this.setVolumeEnvelope(e, r, s), c && this.setFilterEnvelope(e, r, s), l && this.setPitchEnvelope(r, s);
    });
  }
  createControlChangeHandlers() {
    let e = new Array(128);
    return e[0] = this.setBankMSB, e[1] = this.setModulationDepth, e[5] = this.setPortamentoTime, e[6] = this.dataEntryMSB, e[7] = this.setVolume, e[10] = this.setPan, e[11] = this.setExpression, e[32] = this.setBankLSB, e[33] = this.setModulationDepth, e[37] = this.setPortamentoTime, e[38] = this.dataEntryLSB, e[39] = this.setVolume, e[42] = this.setPan, e[43] = this.setExpression, e[64] = this.setSustainPedal, e[65] = this.setPortamento, e[66] = this.setSostenutoPedal, e[67] = this.setSoftPedal, e[71] = this.setFilterResonance, e[72] = this.setReleaseTime, e[73] = this.setAttackTime, e[74] = this.setBrightness, e[75] = this.setDecayTime, e[76] = this.setVibratoRate, e[77] = this.setVibratoDepth, e[78] = this.setVibratoDelay, e[84] = this.setPortamentoNoteNumber, e[91] = this.setReverbSendLevel, e[93] = this.setChorusSendLevel, e[96] = this.dataIncrement, e[97] = this.dataDecrement, e[100] = this.setRPNLSB, e[101] = this.setRPNMSB, e[111] = this.setRPGMakerLoop, e[120] = this.allSoundOff, e[121] = this.resetAllControllers, e[123] = this.allNotesOff, e[124] = this.omniOff, e[125] = this.omniOn, e[126] = this.monoOn, e[127] = this.polyOn, e;
  }
  setControlChange(e, t, s, r) {
    0 <= r || (r = this.audioContext.currentTime), this.applyToMPEChannels(e, (n) => {
      this.applyControlChange(n, t, s, r);
    });
  }
  applyControlChange(e, t, s, r) {
    let n = this.controlChangeHandlers[t];
    if (n) {
      n.call(this, e, s, r);
      let o = this.channels[e];
      this.applyVoiceParams(o, t + 128, r), this.processActiveNotes(o, r, (a) => {
        this.setControlChangeEffects(o, a, r);
      });
    } else console.warn(`Unsupported Control change: controllerType=${t} value=${s}`);
  }
  setBankMSB(e, t) {
    this.channels[e].bankMSB = t;
  }
  updateModulation(e, t) {
    let { modulationDepthMSB: s, modulationDepthLSB: r } = e.state, o = (s + r / 128) * e.modulationDepthRange;
    this.processScheduledNotes(e, (a) => {
      a.renderedBuffer?.isFull || (a.modLfoToPitch ? a.modLfoToPitch.gain.setValueAtTime(o, t) : this.startModulation(e, a, t));
    });
  }
  setModulationDepth(e, t, s) {
    let r = this.channels[e];
    if (r.isDrum) return;
    0 <= s || (s = this.audioContext.currentTime);
    let n = r.state, o = Math.trunc(t);
    n.modulationDepthMSB = o / 127, n.modulationDepthLSB = t - o, this.updateModulation(r, s);
  }
  updatePortamento(e, t) {
    e.isDrum || this.processScheduledNotes(e, (s) => {
      this.isPortamento(e, s) ? (this.setPortamentoVolumeEnvelope(e, s, t), this.setPortamentoFilterEnvelope(e, s, t), this.setPortamentoPitchEnvelope(e, s, t), this.setPortamentoDetune(e, s, t)) : (this.setVolumeEnvelope(e, s, t), this.setFilterEnvelope(e, s, t), this.setPitchEnvelope(s, t), this.setDetune(e, s, t));
    });
  }
  setPortamentoTime(e, t, s) {
    0 <= s || (s = this.audioContext.currentTime);
    let r = this.channels[e], n = r.state, o = Math.trunc(t);
    n.portamentoTimeMSB = o / 127, n.portamentoTimeLSB = t - 127, !r.isDrum && this.updatePortamento(r, s);
  }
  setVolume(e, t, s) {
    0 <= s || (s = this.audioContext.currentTime);
    let r = this.channels[e], n = r.state, o = Math.trunc(t);
    n.volumeMSB = o / 127, n.volumeLSB = t - o, this.applyVolume(r, s);
  }
  applyVolume(e, t) {
    if (e.isDrum) for (let s = 0; s < 128; s++) this.updateKeyBasedVolume(e, s, t);
    else this.updateChannelVolume(e, t);
  }
  panToGain(e) {
    let t = Math.PI / 2 * Math.max(0, e * 127 - 1) / 126;
    return { gainLeft: Math.cos(t), gainRight: Math.sin(t) };
  }
  setPan(e, t, s) {
    0 <= s || (s = this.audioContext.currentTime);
    let r = this.channels[e], n = r.state, o = Math.trunc(t);
    if (n.panMSB = o / 127, n.panLSB = t - o, r.isDrum) for (let a = 0; a < 128; a++) this.updateKeyBasedVolume(r, a, s);
    else this.updateChannelVolume(r, s);
  }
  setExpression(e, t, s) {
    0 <= s || (s = this.audioContext.currentTime);
    let r = this.channels[e], n = r.state, o = Math.trunc(t);
    n.expressionMSB = o / 127, n.expressionLSB = t - o, this.updateChannelVolume(r, s);
  }
  setBankLSB(e, t) {
    this.channels[e].bankLSB = t;
  }
  dataEntryLSB(e, t, s) {
    this.channels[e].dataLSB = t, this.handleRPN(e, 0, s);
  }
  updateChannelVolume(e, t) {
    let { expressionMSB: s, expressionLSB: r, volumeMSB: n, volumeLSB: o, panMSB: a, panLSB: c } = e.state, l = n + o / 128, u = s + r / 128, h = a + c / 128, f = this.getChannelAmplitudeControl(e), d = l * u * (1 + f), { gainLeft: p, gainRight: y } = this.panToGain(h);
    e.gainL.gain.cancelScheduledValues(t).setValueAtTime(d * p, t), e.gainR.gain.cancelScheduledValues(t).setValueAtTime(d * y, t);
  }
  updateKeyBasedVolume(e, t, s) {
    let r = e.keyBasedGainLs[t];
    if (!r) return;
    let n = e.keyBasedGainRs[t], { expressionMSB: o, expressionLSB: a, volumeMSB: c, volumeLSB: l, panMSB: u, panLSB: h } = e.state, f = c + l / 128, d = o + a / 128, p = f * d, y = u + h / 128, m = this.getKeyBasedValue(e, t, 7), b = 0 <= m ? p * m / 64 : p, v = this.getKeyBasedValue(e, t, 10), S = 0 <= v ? v / 127 : y, { gainLeft: M, gainRight: x } = this.panToGain(S);
    r.gain.cancelScheduledValues(s).setValueAtTime(b * M, s), n.gain.cancelScheduledValues(s).setValueAtTime(b * x, s);
  }
  setSustainPedal(e, t, s) {
    let r = this.channels[e];
    if (r.isDrum) return;
    0 <= s || (s = this.audioContext.currentTime);
    let n = r.state, o = n.sustainPedal;
    n.sustainPedal = t / 127, 64 <= t ? o < 0.5 && this.processScheduledNotes(r, (a) => {
      r.sustainNotes.push(a);
    }) : this.releaseSustainPedal(e, t, s);
  }
  isPortamento(e, t) {
    return 0.5 <= e.state.portamento && 0 <= t.portamentoNoteNumber;
  }
  setPortamento(e, t, s) {
    let r = this.channels[e];
    r.isDrum || (0 <= s || (s = this.audioContext.currentTime), r.state.portamento = t / 127, this.updatePortamento(r, s));
  }
  setSostenutoPedal(e, t, s) {
    let r = this.channels[e];
    if (r.isDrum) return;
    0 <= s || (s = this.audioContext.currentTime);
    let n = r.state, o = n.sostenutoPedal;
    if (n.sostenutoPedal = t / 127, 64 <= t) {
      if (o < 0.5) {
        let a = [];
        this.processActiveNotes(r, s, (c) => {
          a.push(c);
        }), r.sostenutoNotes = a;
      }
    } else this.releaseSostenutoPedal(e, t, s);
  }
  getSoftPedalFactor(e, t) {
    return 1 - (0.1 + t.noteNumber / 127 * 0.2) * e.state.softPedal;
  }
  setSoftPedal(e, t, s) {
    let r = this.channels[e];
    if (r.isDrum) return;
    let n = r.state;
    0 <= s || (s = this.audioContext.currentTime), n.softPedal = t / 127, this.processScheduledNotes(r, (o) => {
      this.isPortamento(r, o) ? (this.setPortamentoVolumeEnvelope(r, o, s), this.setPortamentoFilterEnvelope(r, o, s)) : (this.setVolumeEnvelope(r, o, s), this.setFilterEnvelope(r, o, s));
    });
  }
  setFilterQ(e, t, s) {
    if (!t.filterEnvelopeNode) return;
    let r = this.getRelativeKeyBasedValue(e, t.noteNumber, 71), n = t.voiceParams.initialFilterQ / 5 * r;
    t.filterEnvelopeNode.Q.setValueAtTime(n, s);
  }
  setFilterResonance(e, t, s) {
    let r = this.channels[e];
    if (r.isDrum) return;
    0 <= s || (s = this.audioContext.currentTime);
    let n = r.state;
    n.filterResonance = t / 127, this.processScheduledNotes(r, (o) => {
      this.setFilterQ(r, o, s);
    });
  }
  setReleaseTime(e, t, s) {
    let r = this.channels[e];
    r.isDrum || (0 <= s || (s = this.audioContext.currentTime), r.state.releaseTime = t / 127);
  }
  setAttackTime(e, t, s) {
    let r = this.channels[e];
    r.isDrum || (0 <= s || (s = this.audioContext.currentTime), r.state.attackTime = t / 127, this.processScheduledNotes(r, (n) => {
      s < n.startTime && this.setVolumeEnvelope(r, n, s);
    }));
  }
  setBrightness(e, t, s) {
    let r = this.channels[e];
    if (r.isDrum) return;
    let n = r.state;
    0 <= s || (s = this.audioContext.currentTime), n.brightness = t / 127, this.processScheduledNotes(r, (o) => {
      this.isPortamento(r, o) ? this.setPortamentoFilterEnvelope(r, o, s) : this.setFilterEnvelope(r, o, s);
    });
  }
  setDecayTime(e, t, s) {
    let r = this.channels[e];
    r.isDrum || (0 <= s || (s = this.audioContext.currentTime), r.state.decayTime = t / 127, this.processScheduledNotes(r, (n) => {
      this.setVolumeEnvelope(r, n, s);
    }));
  }
  setVibratoRate(e, t, s) {
    let r = this.channels[e];
    r.isDrum || (0 <= s || (s = this.audioContext.currentTime), r.state.vibratoRate = t / 127, !(r.vibratoDepth <= 0) && this.processScheduledNotes(r, (n) => {
      this.setVibLfoToPitch(r, n, s);
    }));
  }
  setVibratoDepth(e, t, s) {
    let r = this.channels[e];
    if (r.isDrum) return;
    0 <= s || (s = this.audioContext.currentTime);
    let n = r.state.vibratoDepth;
    r.state.vibratoDepth = t / 127, 0 < n ? this.processScheduledNotes(r, (o) => {
      this.setFreqVibLFO(r, o, s);
    }) : this.processScheduledNotes(r, (o) => {
      this.startVibrato(r, o, s);
    });
  }
  setVibratoDelay(e, t, s) {
    let r = this.channels[e];
    r.isDrum || (0 <= s || (s = this.audioContext.currentTime), r.state.vibratoDelay = t / 127, 0 < r.state.vibratoDepth && this.processScheduledNotes(r, (n) => {
      this.startVibrato(r, n, s);
    }));
  }
  setPortamentoNoteNumber(e, t, s) {
    0 <= s || (s = this.audioContext.currentTime);
    let r = this.channels[e];
    r.portamentoControl = true, r.state.portamentoNoteNumber = t / 127;
  }
  setReverbSendLevel(e, t, s) {
    0 <= s || (s = this.audioContext.currentTime);
    let r = this.channels[e], n = r.state;
    n.reverbSendLevel = t / 127, this.processScheduledNotes(r, (o) => {
      this.setReverbSend(r, o, s);
    });
  }
  setChorusSendLevel(e, t, s) {
    0 <= s || (s = this.audioContext.currentTime);
    let r = this.channels[e], n = r.state;
    n.chorusSendLevel = t / 127, this.processScheduledNotes(r, (o) => {
      this.setChorusSend(r, o, s);
    });
  }
  limitData(e, t, s, r, n) {
    n < e.dataLSB ? (e.dataMSB++, e.dataLSB = r) : e.dataLSB < 0 && (e.dataMSB--, e.dataLSB = n), s < e.dataMSB ? (e.dataMSB = s, e.dataLSB = n) : e.dataMSB < 0 && (e.dataMSB = t, e.dataLSB = r);
  }
  limitDataMSB(e, t, s) {
    s < e.dataMSB ? e.dataMSB = s : e.dataMSB < 0 && (e.dataMSB = t);
  }
  handleRPN(e, t, s) {
    let r = this.channels[e];
    switch (r.rpnMSB * 128 + r.rpnLSB) {
      case 0:
        r.dataLSB += t, this.handlePitchBendRangeRPN(e, s);
        break;
      case 1:
        r.dataLSB += t, this.handleFineTuningRPN(e, s);
        break;
      case 2:
        r.dataMSB += t, this.handleCoarseTuningRPN(e, s);
        break;
      case 5:
        r.dataLSB += t, this.handleModulationDepthRangeRPN(e, s);
        break;
      case 6:
        r.dataLSB += t, this.handleMIDIPolyphonicExpressionRPN(e, s);
        break;
      case 16383:
        break;
      default:
        console.warn(`Channel ${e}: Unsupported RPN MSB=${r.rpnMSB} LSB=${r.rpnLSB}`);
    }
  }
  dataIncrement(e, t) {
    0 <= t || (t = this.audioContext.currentTime), this.handleRPN(e, 1, t);
  }
  dataDecrement(e, t) {
    0 <= t || (t = this.audioContext.currentTime), this.handleRPN(e, -1, t);
  }
  setRPNMSB(e, t) {
    this.channels[e].rpnMSB = t;
  }
  setRPNLSB(e, t) {
    this.channels[e].rpnLSB = t;
  }
  dataEntryMSB(e, t, s) {
    this.channels[e].dataMSB = t, this.handleRPN(e, 0, s);
  }
  handlePitchBendRangeRPN(e, t) {
    let s = this.channels[e];
    this.limitData(s, 0, 127, 0, 127);
    let r = (s.dataMSB + s.dataLSB / 128) * 100;
    this.setPitchBendRange(e, r, t);
  }
  setPitchBendRange(e, t, s) {
    let r = this.channels[e];
    if (r.isDrum) return;
    0 <= s || (s = this.audioContext.currentTime);
    let n = r.state, o = n.pitchWheelSensitivity, a = t / 12800;
    n.pitchWheelSensitivity = a, r.detune += (n.pitchWheel * 2 - 1) * (a - o) * 12800, this.updateChannelDetune(r, s), this.applyVoiceParams(r, 16, s);
  }
  handleFineTuningRPN(e, t) {
    let s = this.channels[e];
    this.limitData(s, 0, 127, 0, 127);
    let n = (s.dataMSB * 128 + s.dataLSB - 8192) / 8192 * 100;
    this.setFineTuning(e, n, t);
  }
  setFineTuning(e, t, s) {
    let r = this.channels[e];
    if (r.isDrum) return;
    0 <= s || (s = this.audioContext.currentTime);
    let n = r.fineTuning, o = t;
    r.fineTuning = o, r.detune += o - n, this.updateChannelDetune(r, s);
  }
  handleCoarseTuningRPN(e, t) {
    let s = this.channels[e];
    this.limitDataMSB(s, 0, 127);
    let r = (s.dataMSB - 64) * 100;
    this.setCoarseTuning(e, r, t);
  }
  setCoarseTuning(e, t, s) {
    let r = this.channels[e];
    if (r.isDrum) return;
    0 <= s || (s = this.audioContext.currentTime);
    let n = r.coarseTuning, o = t;
    r.coarseTuning = o, r.detune += o - n, this.updateChannelDetune(r, s);
  }
  handleModulationDepthRangeRPN(e, t) {
    let s = this.channels[e];
    this.limitData(s, 0, 127, 0, 127);
    let r = (s.dataMSB + s.dataLSB / 128) * 100;
    this.setModulationDepthRange(e, r, t);
  }
  setModulationDepthRange(e, t, s) {
    let r = this.channels[e];
    r.isDrum || (0 <= s || (s = this.audioContext.currentTime), r.modulationDepthRange = t, this.updateModulation(r, s));
  }
  handleMIDIPolyphonicExpressionRPN(e, t) {
    let s = this.channels[e];
    this.setMIDIPolyphonicExpression(e, s.dataMSB);
  }
  setMIDIPolyphonicExpression(e, t) {
    if (e !== 0 && e !== 15) return;
    let s = t & 15;
    e === 0 ? this.lowerMPEMembers = s : this.upperMPEMembers = s, this.mpeEnabled = this.lowerMPEMembers > 0 || this.upperMPEMembers > 0;
    let r = 1, n = this.lowerMPEMembers, o = 16 - this.upperMPEMembers, a = 14, { channels: c, lowerMPEMembers: l, upperMPEMembers: u, mpeEnabled: h } = this;
    for (let f = 0; f < 16; f++) {
      let d = l && r <= f && f <= n, p = u && o <= f && f <= a;
      c[f].isMPEMember = h && (d || p), c[f].isMPEManager = h && (f === 0 || f === 15);
    }
  }
  setRPGMakerLoop(e, t, s) {
    s ??= this.audioContext.currentTime, this.loopStart = s + this.resumeTime - this.startTime;
  }
  allSoundOff(e, t, s) {
    this.channels[e].isMPEManager || this.applyAllSoundOff(e, t, s);
  }
  applyAllSoundOff(e, t, s) {
    0 <= s || (s = this.audioContext.currentTime);
    let r = this.channels[e], n = [];
    return this.processActiveNotes(r, s, (o) => {
      n.push(this.soundOffNote(r, o, s));
    }), Promise.all(n);
  }
  resetChannelStates(e) {
    let t = this.audioContext.currentTime, s = this.channels[e], r = s.state, n = Object.entries(_t);
    for (let [o, { type: a, defaultValue: c }] of n) 128 <= a ? this.setControlChange(e, a - 128, Math.ceil(c * 127), t) : r[o] = c;
    s.resetSettings(this.constructor.channelSettings), s.resetTable(), this.mode = "GM2", this.masterFineTuning = 0, this.masterCoarseTuning = 0;
  }
  resetAllControllers(e, t, s) {
    let r = ["polyphonicKeyPressure", "channelPressure", "pitchWheel", "expressionMSB", "expressionLSB", "modulationDepthMSB", "modulationDepthLSB", "sustainPedal", "portamento", "sostenutoPedal", "softPedal"], n = this.channels[e], o = n.state;
    for (let c = 0; c < r.length; c++) {
      let l = r[c], { type: u, defaultValue: h } = _t[l];
      128 <= u ? this.setControlChange(e, u - 128, Math.ceil(h * 127), s) : o[l] = h;
    }
    this.setPitchBend(e, 8192, s);
    let a = ["rpnMSB", "rpnLSB"];
    for (let c = 0; c < a.length; c++) {
      let l = a[c];
      n[l] = this.constructor.channelSettings[l];
    }
  }
  allNotesOff(e, t, s) {
    0 <= s || (s = this.audioContext.currentTime);
    let r = this.channels[e], n = [];
    return this.processActiveNotes(r, s, (o) => {
      let a = this.noteOff(e, o.noteNumber, 0, s, false);
      n.push(a);
    }), Promise.all(n);
  }
  omniOff(e, t, s) {
    this.mpeEnabled || this.allNotesOff(e, t, s);
  }
  omniOn(e, t, s) {
    this.mpeEnabled || this.allNotesOff(e, t, s);
  }
  monoOn(e, t, s) {
    let r = this.channels[e];
    r.isMPEManager || (this.allNotesOff(e, t, s), r.mono = true);
  }
  polyOn(e, t, s) {
    let r = this.channels[e];
    r.isMPEManager || (this.allNotesOff(e, t, s), r.mono = false);
  }
  handleUniversalNonRealTimeExclusiveMessage(e, t) {
    switch (e[2]) {
      case 8:
        switch (e[3]) {
          case 8:
            return this.handleScaleOctaveTuning1ByteFormatSysEx(e, false, t);
          case 9:
            return this.handleScaleOctaveTuning2ByteFormatSysEx(e, false, t);
          default:
            console.warn(`Unsupported Exclusive Message: ${e}`);
        }
        break;
      case 9:
        switch (e[3]) {
          case 1:
            this.GM1SystemOn(t);
            break;
          case 2:
            break;
          case 3:
            this.GM2SystemOn(t);
            break;
          default:
            console.warn(`Unsupported Exclusive Message: ${e}`);
        }
        break;
      default:
        console.warn(`Unsupported Exclusive Message: ${e}`);
    }
  }
  GM1SystemOn(e) {
    let t = this.channels;
    0 <= e || (e = this.audioContext.currentTime), this.mode = "GM1";
    for (let s = 0; s < t.length; s++) {
      this.applyAllSoundOff(s, 0, e);
      let r = t[s];
      r.bankMSB = 0, r.bankLSB = 0, r.isDrum = false;
    }
    t[9].bankMSB = 1, t[9].isDrum = true;
  }
  GM2SystemOn(e) {
    let t = this.channels;
    0 <= e || (e = this.audioContext.currentTime), this.mode = "GM2";
    for (let s = 0; s < t.length; s++) {
      this.applyAllSoundOff(s, 0, e);
      let r = t[s];
      r.bankMSB = 121, r.bankLSB = 0, r.isDrum = false;
    }
    t[9].bankMSB = 120, t[9].isDrum = true;
  }
  handleUniversalRealTimeExclusiveMessage(e, t) {
    switch (e[2]) {
      case 4:
        switch (e[3]) {
          case 1:
            return this.handleMasterVolumeSysEx(e, t);
          case 3:
            return this.handleMasterFineTuningSysEx(e, t);
          case 4:
            return this.handleMasterCoarseTuningSysEx(e, t);
          case 5:
            return this.handleGlobalParameterControlSysEx(e, t);
          default:
            console.warn(`Unsupported Exclusive Message: ${e}`);
        }
        break;
      case 8:
        switch (e[3]) {
          case 8:
            return this.handleScaleOctaveTuning1ByteFormatSysEx(e, true, t);
          case 9:
            return this.handleScaleOctaveTuning2ByteFormatSysEx(e, true, t);
          default:
            console.warn(`Unsupported Exclusive Message: ${e}`);
        }
        break;
      case 9:
        switch (e[3]) {
          case 1:
            return this.handleChannelPressureSysEx(e, t);
          case 2:
            return this.handlePolyphonicKeyPressureSysEx(e, t);
          case 3:
            return this.handleControlChangeSysEx(e, t);
          default:
            console.warn(`Unsupported Exclusive Message: ${e}`);
        }
        break;
      case 10:
        if (e[3] === 1) return this.handleKeyBasedInstrumentControlSysEx(e, t);
        console.warn(`Unsupported Exclusive Message: ${e}`);
        break;
      default:
        console.warn(`Unsupported Exclusive Message: ${e}`);
    }
  }
  handleMasterVolumeSysEx(e, t) {
    let s = (e[5] * 128 + e[4]) / 16383;
    this.setMasterVolume(s, t);
  }
  setMasterVolume(e, t) {
    0 <= t || (t = this.audioContext.currentTime);
    let s = this.perceptualSmoothingTime / 5;
    this.masterVolume.gain.cancelAndHoldAtTime(t).setTargetAtTime(e * e, t, s);
  }
  handleMasterFineTuningSysEx(e, t) {
    let r = ((e[5] * 128 + e[4]) / 16383 - 8192) / 8192 * 100;
    this.setMasterFineTuning(r, t);
  }
  setMasterFineTuning(e, t) {
    let s = this.masterFineTuning, r = e;
    this.masterFineTuning = r;
    let n = r - s, o = this.channels;
    for (let a = 0; a < o.length; a++) {
      let c = o[a];
      c.isDrum || (c.detune += n, this.updateChannelDetune(c, t));
    }
  }
  handleMasterCoarseTuningSysEx(e, t) {
    let s = (e[4] - 64) * 100;
    this.setMasterCoarseTuning(s, t);
  }
  setMasterCoarseTuning(e, t) {
    let s = this.masterCoarseTuning, r = e;
    this.masterCoarseTuning = r;
    let n = r - s, o = this.channels;
    for (let a = 0; a < o.length; a++) {
      let c = o[a];
      c.isDrum || (c.detune += n, this.updateChannelDetune(c, t));
    }
  }
  handleGlobalParameterControlSysEx(e, t) {
    if (e[7] === 1) switch (e[8]) {
      case 1:
        return this.handleReverbParameterSysEx(e);
      case 2:
        return this.handleChorusParameterSysEx(e, t);
      default:
        console.warn(`Unsupported Global Parameter Control Message: ${e}`);
    }
    else console.warn(`Unsupported Global Parameter Control Message: ${e}`);
  }
  handleReverbParameterSysEx(e) {
    switch (e[9]) {
      case 0:
        return this.setReverbType(e[10]);
      case 1:
        return this.setReverbTime(e[10]);
    }
  }
  setReverbType(e) {
    this.reverb.time = this.getReverbTimeFromType(e), this.reverb.feedback = e === 8 ? 0.9 : 0.8, this.reverbEffect = this.setReverbEffect(this.reverb.algorithm);
  }
  getReverbTimeFromType(e) {
    switch (e) {
      case 0:
        return this.getReverbTime(44);
      case 1:
        return this.getReverbTime(50);
      case 2:
        return this.getReverbTime(56);
      case 3:
        return this.getReverbTime(64);
      case 4:
        return this.getReverbTime(64);
      case 8:
        return this.getReverbTime(50);
      default:
        console.warn(`Unsupported Reverb Time: ${e}`);
    }
  }
  setReverbTime(e) {
    this.reverb.time = this.getReverbTime(e), this.reverbEffect = this.setReverbEffect(this.reverb.algorithm);
  }
  getReverbTime(e) {
    return Math.exp((e - 40) * 0.025);
  }
  calcDelay(e, t) {
    return -e * Math.log10(t) / 3;
  }
  handleChorusParameterSysEx(e, t) {
    switch (e[9]) {
      case 0:
        return this.setChorusType(e[10], t);
      case 1:
        return this.setChorusModRate(e[10], t);
      case 2:
        return this.setChorusModDepth(e[10], t);
      case 3:
        return this.setChorusFeedback(e[10], t);
      case 4:
        return this.setChorusSendToReverb(e[10], t);
    }
  }
  setChorusType(e, t) {
    switch (e) {
      case 0:
        return this.setChorusParameter(3, 5, 0, 0, t);
      case 1:
        return this.setChorusParameter(9, 19, 5, 0, t);
      case 2:
        return this.setChorusParameter(3, 19, 8, 0, t);
      case 3:
        return this.setChorusParameter(9, 16, 16, 0, t);
      case 4:
        return this.setChorusParameter(2, 24, 64, 0, t);
      case 5:
        return this.setChorusParameter(1, 5, 112, 0, t);
      default:
        console.warn(`Unsupported Chorus Type: ${e}`);
    }
  }
  setChorusParameter(e, t, s, r, n) {
    this.setChorusModRate(e, n), this.setChorusModDepth(t, n), this.setChorusFeedback(s, n), this.setChorusSendToReverb(r, n);
  }
  setChorusModRate(e, t) {
    let s = this.getChorusModRate(e);
    this.chorus.modRate = s, this.chorusEffect.lfo.frequency.setValueAtTime(s, t);
  }
  getChorusModRate(e) {
    return e * 0.122;
  }
  setChorusModDepth(e, t) {
    let s = this.getChorusModDepth(e);
    this.chorus.modDepth = s, this.chorusEffect.lfoGain.gain.cancelScheduledValues(t).setValueAtTime(s / 2, t);
  }
  getChorusModDepth(e) {
    return (e + 1) / 3200;
  }
  setChorusFeedback(e, t) {
    let s = this.getChorusFeedback(e);
    this.chorus.feedback = s;
    let r = this.chorusEffect;
    for (let n = 0; n < r.feedbackGains.length; n++) r.feedbackGains[n].gain.cancelScheduledValues(t).setValueAtTime(s, t);
  }
  getChorusFeedback(e) {
    return e * 763e-5;
  }
  setChorusSendToReverb(e, t) {
    let s = this.getChorusSendToReverb(e), r = this.chorusEffect.sendGain;
    0 < this.chorus.sendToReverb ? (this.chorus.sendToReverb = s, 0 < s ? r.gain.cancelScheduledValues(t).setValueAtTime(s, t) : r.disconnect()) : (this.chorus.sendToReverb = s, 0 < s && (r.connect(this.reverbEffect.input), r.gain.cancelScheduledValues(t).setValueAtTime(s, t)));
  }
  getChorusSendToReverb(e) {
    return e * 787e-5;
  }
  getChannelBitmap(e) {
    let t = new Array(this.channels.length).fill(false), s = e[4] & 3, r = e[5] & 127, n = e[6] & 127;
    for (let o = 0; o < 7; o++) n & 1 << o && (t[o] = true);
    for (let o = 0; o < 7; o++) r & 1 << o && (t[o + 7] = true);
    for (let o = 0; o < 2; o++) s & 1 << o && (t[o + 14] = true);
    return t;
  }
  handleScaleOctaveTuning1ByteFormatSysEx(e, t, s) {
    if (e.length < 19) {
      console.error("Data length is too short");
      return;
    }
    let r = this.getChannelBitmap(e);
    for (let n = 0; n < r.length; n++) {
      if (!r[n]) continue;
      let o = this.channels[n];
      if (!o.isDrum) {
        for (let a = 0; a < 12; a++) {
          let c = e[a + 7] - 64;
          o.scaleOctaveTuningTable[a] = c;
        }
        t && this.updateChannelDetune(o, s);
      }
    }
  }
  handleScaleOctaveTuning2ByteFormatSysEx(e, t, s) {
    if (e.length < 31) {
      console.error("Data length is too short");
      return;
    }
    let r = this.getChannelBitmap(e);
    for (let n = 0; n < r.length; n++) {
      if (!r[n]) continue;
      let o = this.channels[n];
      if (!o.isDrum) {
        for (let a = 0; a < 12; a++) {
          let c = 7 + a * 2, l = e[c] & 127, u = e[c + 1] & 127, f = (l * 128 + u - 8192) / 8.192;
          o.scaleOctaveTuningTable[a] = f;
        }
        t && this.updateChannelDetune(o, s);
      }
    }
  }
  calcEffectValue(e, t, s) {
    return this.calcChannelEffectValue(e, s) + this.calcNoteEffectValue(e, t, s);
  }
  calcChannelEffectValue(e, t) {
    return this.calcControlChangeEffectValue(e, t) + this.calcChannelPressureEffectValue(e, t);
  }
  calcControlChangeEffectValue(e, t) {
    let s = e.controlTable[t];
    if (s < 0) return 0;
    let r = e.state.array[s];
    if (r <= 0) return 0;
    let n = rr[t];
    return (e.controlTable[t + 6] - n) * r * Dn[t];
  }
  calcChannelPressureEffectValue(e, t) {
    let s = e.state.channelPressure;
    if (s <= 0) return 0;
    let r = rr[t];
    return (e.channelPressureTable[t] - r) * s * Dn[t];
  }
  calcNoteEffectValue(e, t, s) {
    let r = t.pressure;
    if (r <= 0) return 0;
    let n = rr[s];
    return (e.polyphonicKeyPressureTable[s] - n) * r / 127 * Dn[s];
  }
  getChannelPitchControl(e) {
    return this.calcChannelEffectValue(e, 0);
  }
  getNotePitchControl(e, t) {
    return this.calcNoteEffectValue(e, t, 0);
  }
  getPitchControl(e, t) {
    return this.calcEffectValue(e, t, 0);
  }
  getFilterCutoffControl(e, t) {
    return this.calcEffectValue(e, t, 1);
  }
  getChannelAmplitudeControl(e) {
    return this.calcChannelEffectValue(e, 2);
  }
  getNoteAmplitudeControl(e, t) {
    return this.calcNoteEffectValue(e, t, 2);
  }
  getAmplitudeControl(e, t) {
    return this.calcEffectValue(e, t, 2);
  }
  getLFOPitchDepth(e, t) {
    return this.calcEffectValue(e, t, 3);
  }
  getLFOFilterDepth(e, t) {
    return this.calcEffectValue(e, t, 4);
  }
  getLFOAmplitudeDepth(e, t) {
    return this.calcEffectValue(e, t, 5);
  }
  createEffectHandlers() {
    let e = new Array(6);
    return e[0] = (t, s, r, n) => {
      this.isPortamento(t, s) ? this.setPortamentoDetune(t, s, n) : this.setDetune(t, s, n);
    }, e[1] = (t, s, r, n) => {
      0.5 <= t.state.portamento && 0 <= s.portamentoNoteNumber ? this.setPortamentoFilterEnvelope(t, s, n) : this.setFilterEnvelope(t, s, n);
    }, e[2] = (t, s, r, n) => {
      r === "polyphonicKeyPressureTable" ? this.setVolumeNode(t, s, n) : this.applyVolume(t, n);
    }, e[3] = (t, s, r, n) => this.setModLfoToPitch(t, s, n), e[4] = (t, s, r, n) => this.setModLfoToFilterFc(t, s, n), e[5] = (t, s, r, n) => this.setModLfoToVolume(t, s, n), e;
  }
  setControlChangeEffects(e, t, s) {
    let r = this.effectHandlers;
    for (let n = 0; n < r.length; n++) {
      let o = rr[n], a = e.controlTable[n + 6];
      o !== a && r[n](e, t, "controlTable", s);
    }
  }
  setChannelPressureEffects(e, t, s) {
    this.setPressureEffects(e, t, "channelPressureTable", s);
  }
  setPolyphonicKeyPressureEffects(e, t, s) {
    this.setPressureEffects(e, t, "polyphonicKeyPressureTable", s);
  }
  setPressureEffects(e, t, s, r) {
    let n = this.effectHandlers, o = e[s];
    for (let a = 0; a < n.length; a++) {
      let c = rr[a], l = o[a];
      c !== l && n[a](e, t, s, r);
    }
  }
  handleChannelPressureSysEx(e, t) {
    this.handlePressureSysEx(e, "channelPressureTable", t);
  }
  handlePolyphonicKeyPressureSysEx(e, t) {
    this.handlePressureSysEx(e, "polyphonicKeyPressureTable", t);
  }
  handlePressureSysEx(e, t, s) {
    let r = e[4], n = this.channels[r];
    if (n.isDrum) return;
    let o = n[t];
    for (let a = 5; a < e.length - 1; a += 2) {
      let c = e[a], l = e[a + 1];
      o[c] = l;
      let u = this.effectHandlers[c];
      this.processActiveNotes(n, s, (h) => {
        u && u(n, h, t, s);
      });
    }
  }
  handleControlChangeSysEx(e, t) {
    let s = e[4], r = this.channels[s];
    if (r.isDrum) return;
    let n = r.controlTable;
    n.set(Vn);
    let o = e[5];
    for (let a = 6; a < e.length; a += 2) {
      let c = e[a], l = e[a + 1];
      n[c] = o, n[c + 6] = l;
      let u = this.effectHandlers[c];
      this.processActiveNotes(r, t, (h) => {
        u && u(r, h, "controlTable", t);
      });
    }
  }
  getRelativeKeyBasedValue(e, t, s) {
    let r = e.state.array[128 + s];
    if (!e.isDrum) return r;
    let n = this.getKeyBasedValue(e, t, s);
    return n < 0 ? r : r * n / 64;
  }
  getKeyBasedValue(e, t, s) {
    let r = t * 128 + s;
    return e.keyBasedTable[r];
  }
  createKeyBasedControllerHandlers() {
    let e = new Array(128);
    return e[7] = (t, s, r) => this.updateKeyBasedVolume(t, s, r), e[10] = (t, s, r) => this.updateKeyBasedVolume(t, s, r), e[71] = (t, s, r) => this.processScheduledNotes(t, (n) => {
      n.noteNumber === s && this.setFilterQ(t, n, r);
    }), e[73] = (t, s, r) => this.processScheduledNotes(t, (n) => {
      n.noteNumber === s && this.setVolumeEnvelope(t, n, r);
    }), e[74] = (t, s, r) => this.processScheduledNotes(t, (n) => {
      n.noteNumber === s && this.setFilterEnvelope(t, n, r);
    }), e[75] = (t, s, r) => this.processScheduledNotes(t, (n) => {
      n.noteNumber === s && this.setVolumeEnvelope(t, n, r);
    }), e[76] = (t, s, r) => {
      t.state.vibratoDepth <= 0 || this.processScheduledNotes(t, (n) => {
        n.noteNumber === s && this.setFreqVibLFO(t, n, r);
      });
    }, e[77] = (t, s, r) => {
      t.state.vibratoDepth <= 0 || this.processScheduledNotes(t, (n) => {
        n.noteNumber === s && this.setVibLfoToPitch(t, n, r);
      });
    }, e[78] = (t, s) => {
      t.state.vibratoDepth <= 0 || this.processScheduledNotes(t, (r) => {
        r.noteNumber === s && this.setDelayVibLFO(t, r);
      });
    }, e[91] = (t, s, r) => this.processScheduledNotes(t, (n) => {
      n.noteNumber === s && this.setReverbSend(t, n, r);
    }), e[93] = (t, s, r) => this.processScheduledNotes(t, (n) => {
      n.noteNumber === s && this.setChorusSend(t, n, r);
    }), e;
  }
  handleKeyBasedInstrumentControlSysEx(e, t) {
    let s = e[4], r = this.channels[s];
    if (!r.isDrum) return;
    let n = e[5], o = r.keyBasedTable;
    for (let a = 6; a < e.length; a += 2) {
      let c = e[a], l = e[a + 1], u = n * 128 + c;
      o[u] = l;
      let h = this.keyBasedControllerHandlers[c];
      h && h(r, n, t);
    }
  }
  handleSysEx(e, t) {
    switch (e[0]) {
      case 126:
        return this.handleUniversalNonRealTimeExclusiveMessage(e, t);
      case 127:
        return this.handleUniversalRealTimeExclusiveMessage(e, t);
      default:
        console.warn(`Unsupported Exclusive Message: ${e}`);
    }
  }
  scheduleTask(e, t) {
    return new Promise((s) => {
      let r = new AudioBufferSourceNode(this.audioContext, { buffer: this.schedulerBuffer });
      r.connect(this.scheduler), r.onended = () => {
        try {
          e();
        } finally {
          r.disconnect(), s();
        }
      }, r.start(t);
    });
  }
};

// src/index.js
import {
  AudioBufferSource,
  BufferTarget,
  canEncodeAudio,
  FlacOutputFormat,
  Mp3OutputFormat,
  Mp4OutputFormat,
  OggOutputFormat,
  Output,
  QUALITY_HIGH,
  WavOutputFormat
} from "https://cdn.jsdelivr.net/npm/mediabunny@1.45.2/+esm";
function toggleDarkMode() {
  const html = document.documentElement;
  const newTheme = html.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
  html.setAttribute("data-bs-theme", newTheme);
  localStorage.setItem("darkMode", newTheme);
}
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
function shuffle(array) {
  for (let i22 = array.length; 1 < i22; i22--) {
    const k2 = Math.floor(Math.random() * i22);
    [array[k2], array[i22 - 1]] = [array[i22 - 1], array[k2]];
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
    "https://midi-db.pages.dev/collections.json"
  );
  const homepageList = await homepageResponse.json();
  const homepage = homepageList[getRandomInt(0, homepageList.length)];
  const { license: homepageLicense, maintainer: homepageMaintainer } = homepage;
  const license = homepageLicense.startsWith("http") ? `<a href="${homepageLicense}">custom</a>` : homepageLicense;
  const fileResponse = await fetch(
    `https://midi-db.pages.dev/json/${homepage.id}/${htmlLang}.json`
  );
  const fileList = await fileResponse.json();
  const longFileList = fileList.filter((file) => !file.time.startsWith("0:"));
  shuffle(longFileList);
  let html = "";
  for (let i22 = 0; i22 < 15; i22++) {
    const file = longFileList[i22];
    const maintainer = !homepageMaintainer ? file.maintainer : homepageMaintainer;
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
  for (let i22 = 0; i22 < list.length; i22++) {
    const soundFont = list[i22];
    const checked = soundFont.name === "GeneralUser_GS_v1.471" ? "checked" : "";
    const license = soundFont.license.startsWith("http") ? `<a href="${soundFont.license}">custom</a>` : soundFont.license;
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
    if (index !== void 0) continue;
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
    }
  );
}
var FORMAT_MAP = {
  wav: {
    mime: "audio/wav",
    codec: "pcm-f32",
    fmt: () => new WavOutputFormat()
  },
  mp3: {
    mime: "audio/mpeg",
    codec: "mp3",
    fmt: () => new Mp3OutputFormat()
  },
  aac: {
    // mime: "audio/aac",
    mime: "audio/x-m4a",
    codec: "aac",
    // fmt: () => new AdtsOutputFormat(),
    fmt: () => new Mp4OutputFormat()
  },
  flac: {
    mime: "audio/flac",
    codec: "flac",
    fmt: () => new FlacOutputFormat()
  },
  opus: {
    mime: "audio/ogg",
    codec: "opus",
    fmt: () => new OggOutputFormat()
  }
};
async function initEncoders() {
  if (!await canEncodeAudio("aac")) {
    const { registerAacEncoder } = await import("https://cdn.jsdelivr.net/npm/@mediabunny/aac-encoder@1.45.2/+esm");
    registerAacEncoder();
  }
  if (!await canEncodeAudio("mp3")) {
    const { registerMp3Encoder } = await import("https://cdn.jsdelivr.net/npm/@mediabunny/mp3-encoder@1.45.2/+esm");
    registerMp3Encoder();
  }
  if (!await canEncodeAudio("flac")) {
    const { registerFlacEncoder } = await import("https://cdn.jsdelivr.net/npm/@mediabunny/flac-encoder@1.45.2/+esm");
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
        configuration.outputFormat
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
var htmlLang = document.documentElement.lang;
var soundFontURL = "https://soundfonts.pages.dev/GeneralUser_GS_v1.471";
var configuration = {
  reverbAlgorithm: "Schroeder",
  reverbType: 4,
  chorusType: 1,
  outputFormat: "opus"
};
await getSampleMIDIList();
await getSampleSoundFontList();
setSampleEvents();
setConfigurationEvents();
setDragEvent();
initEncoders();
var audioContext = new AudioContext();
if (audioContext.state === "running") await audioContext.suspend();
var midy = new Xo(audioContext);
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
