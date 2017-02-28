type TxData = Buffer | string;
type RLP = Array<Buffer>;

const EC = require('elliptic').ec;
const keccak256 = require('js-sha3').keccak_256;
const rlp = require('rlp');

export const ec = new EC('secp256k1');

export function unserialize(storage) {
  const keys = {};
  JSON.parse(storage || '[]').forEach(k => { let kp = ec.keyFromPrivate(k); keys[toAddress(kp)] = kp; });
  return keys;
}

export function serialize(keys) {
  return JSON.stringify(Object.keys(keys).map(k => keys[k].getPrivate('hex')));
}

// TODO: convert values
export function getTxFields(data) {
  const tx = decodeTransaction(data);
  return tx && {
    'nonce': parseRlpInt(tx[0]), 'gasPrice': parseRlpInt(tx[1]), 'gasLimit': parseRlpInt(tx[2]),
    'to': toHex(tx[3]), 'value': parseRlpInt(tx[4]), 'data': toHex(tx[5]), 'v': toHex(tx[6]), 'r': toHex(tx[7]), 's': toHex(tx[8]),
  }
}

export function decodeTransaction(data: TxData): RLP | false {
  const txBuffer = toBuffer(data);
  const txDecoded = rlp.decode(txBuffer);
  if (Array.isArray(txDecoded)) {
    return txDecoded;
  }
  return false;
}

export function sign (key, data: TxData): TxData {
  const buffer = toBuffer(data);
  const txDecoded = decodeTransaction(buffer);
  if (!txDecoded) {
    return false;
  }

  const msgHash = hash(rlp.encode(txDecoded.slice(0,6)));
  const sig = key.sign(msgHash);
  txDecoded[6] = Buffer.from(sig.recoveryParam ? '1c' : '1b', 'hex'); // v
  txDecoded[7] = new Buffer(sig.r.toArray());
  txDecoded[8] = new Buffer(sig.s.toArray());
  return rlp.encode(txDecoded);
}

export function fromPhrase(phrase) {
  let seed = keccak256.array(phrase);
  let kp;
  for (let i = 0; i <= 16384 || !toAddress(kp = ec.keyFromPrivate(seed)).startsWith('00'); ++i)
    seed = keccak256.array(seed);
  return kp;
}


function hash (buffer) {
  return arrayBufferToBuffer(
    keccak256.arrayBuffer(bufferToArrayBuffer(buffer)));
}

function toBuffer(data: TxData): Buffer {
  return Buffer.isBuffer(data) ? data : Buffer.from(data, 'hex');
}

function arrayBufferToBuffer(ab) {
  const buf = new Buffer(ab.byteLength);
  const view = new Uint8Array(ab);
  for (let i = 0; i < buf.length; ++i) {
    buf[i] = view[i];
  }
  return buf;
}

function bufferToArrayBuffer(buf) {
  const ab = new ArrayBuffer(buf.length);
  const view = new Uint8Array(ab);
  for (let i = 0; i < buf.length; ++i) {
    view[i] = buf[i];
  }
  return ab;
}

function toAddress(kp) {
  return keccak256(kp.getPublic('buffer').slice(1)).substr(24);
}

function parseRlpInt(buffer) {
  return parseInt(buffer.reduce((r, i) => r + i.toString(16), ""), 16)
}

function toHex(buffer) {
  return '0x' + buffer.toString('hex');
}