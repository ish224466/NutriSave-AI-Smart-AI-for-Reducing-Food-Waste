const fs = require('fs');
const Blockchain = require('./blockchain');
const path = require('path');

const chainFile = path.join(__dirname, 'chain.json');

let myBlockchain = new Blockchain();

// Load existing chain
if (fs.existsSync(chainFile)) {
  const chainData = JSON.parse(fs.readFileSync(chainFile));
  myBlockchain.chain = chainData;
}

// Add donation to chain
function addDonationToChain(donation) {
  const block = myBlockchain.addBlock(donation);
  fs.writeFileSync(chainFile, JSON.stringify(myBlockchain.chain, null, 2));
  return block;
}

function getFullChain() {
  return myBlockchain.chain;
}

module.exports = {
  addDonationToChain,
  getFullChain,
};
