const EC = require('elliptic').ec;
const keccak_256 = require('js-sha3').keccak_256;
const rlp = require('rlp');

export const ec = new EC('secp256k1');
ec.keyFromPrivate(keccak_256(''), 'hex').sign(keccak_256(''), 'hex').constructor.prototype.toEthereum =
  function() { return this.r.toString('hex') + this.s.toString('hex') + (this.recoveryParam ? '1c' : '1b'); };

export function unserialize(storage) {
  const keys = {};
  JSON.parse(storage || '[]').forEach(k => { let kp = ec.keyFromPrivate(k); keys[toAddress(kp)] = kp; });
  return keys;
}

export function serialize(keys) {
  return JSON.stringify(Object.keys(keys).map(k => keys[k].getPrivate('hex')));
}

export function parseTransaction(data) {
  const txBuffer = Buffer.from(data, 'hex');
  const txDecoded = rlp.decode(txBuffer);
  if (Array.isArray(txDecoded)) {
    const tx = txDecoded.map((v) => v.toString('hex'))
    return {
      'nonce': tx[0], 'gasPrice': tx[1], 'gasLimit': tx[2], 'to': tx[3],
      'value': tx[4], 'data': tx[5], 'v': tx[6], 'r': tx[7], 's': tx[8],
    }
  }
  return false;
}

export function sign (privateKey) {
  const msgHash = this.hash(false)
  const sig = ethUtil.ecsign(msgHash, privateKey)
  if (this._chainId > 0) {
    sig.v += this._chainId * 2 + 8
  }
  Object.assign(this, sig)
}

export function toAddress(kp) { return keccak_256(kp.getPublic('buffer').slice(1)).substr(24); }

export function fromPhrase(phrase) {
  let seed = keccak_256.array(phrase);
  let kp;
  for (let i = 0; i <= 16384 || !toAddress(kp = ec.keyFromPrivate(seed)).startsWith('00'); ++i)
    seed = keccak_256.array(seed);
  return kp;
}