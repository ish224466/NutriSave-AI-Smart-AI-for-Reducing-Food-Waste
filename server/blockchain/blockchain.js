const CryptoJS = require('crypto-js');

class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data; // Donation details
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return CryptoJS.SHA256(
      this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash
    ).toString();
  }
  
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(0, Date.now().toString(), 'Genesis Block', '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newData) {
    const prevBlock = this.getLatestBlock();
    const newBlock = new Block(
      prevBlock.index + 1,
      Date.now().toString(),
      newData,
      prevBlock.hash
    );
    this.chain.push(newBlock);
    return newBlock;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const curr = this.chain[i];
      const prev = this.chain[i - 1];

      if (curr.hash !== curr.calculateHash()) return false;
      if (curr.previousHash !== prev.hash) return false;
    }
    return true;
  }
}

module.exports = Blockchain;
