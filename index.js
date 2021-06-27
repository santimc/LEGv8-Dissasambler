const button = document.querySelector('#button');
button.addEventListener('click', disassamlbe);

const dispayInstuctionDiv = document.querySelector('#instuction');

function crateBitDivs(instuction) {
  let binCont = document.createElement('div');
  binCont.className = 'containerFlex';

  for (let i = 0; i < instuction.binary.length; i++) {
    let n = document.createElement('div');
    n.className = 'bin_child';
    n.textContent = instuction.binary.charAt(i);
    binCont.appendChild(n);
  }

  return binCont;

}

function processInstuction(instuction) {

  let bitDivs = crateBitDivs(instuction);

  let mnemonicContainer = document.createElement('div');
  mnemonicContainer.className = 'containerFlex';

  function addClassDivChildren(first, last, divs, text) {
    for (let i = first; i > last - 1; i--) {
      divs.children[31 - i].classList += ' ' + text;
    }
    let n = document.createElement('div');
    n.classList = text + ' mnemonicChild';
    n.textContent = text;
    mnemonicContainer.appendChild(n);
  }

  switch (instuction.format) {
    case "R":
      addClassDivChildren(31, 21, bitDivs, 'opcode');
      addClassDivChildren(20, 16, bitDivs, 'Rm');
      addClassDivChildren(15, 10, bitDivs, 'shamt');
      addClassDivChildren(9, 5, bitDivs, 'Rn');
      addClassDivChildren(4, 0, bitDivs, 'Rd');
      break;
    case "I":
      addClassDivChildren(31, 22, bitDivs, 'opcode');
      addClassDivChildren(21, 10, bitDivs, 'ALU_immediate');
      addClassDivChildren(9, 5, bitDivs, 'Rn');
      addClassDivChildren(4, 0, bitDivs, 'Rd');
      break;
    case "D":
      addClassDivChildren(31, 21, bitDivs, 'opcode');
      addClassDivChildren(20, 12, bitDivs, 'DT_address');
      addClassDivChildren(11, 10, bitDivs, 'op');
      addClassDivChildren(9, 5, bitDivs, 'Rn');
      addClassDivChildren(4, 0, bitDivs, 'Rt');
      break;
    case "B":
      addClassDivChildren(31, 26, bitDivs, 'opcode');
      addClassDivChildren(25, 0, bitDivs, 'BR_address');
      break;
    case "CB":
      addClassDivChildren(31, 24, bitDivs, 'opcode');
      addClassDivChildren(23, 5, bitDivs, 'COND_BR_address');
      addClassDivChildren(4, 0, bitDivs, 'Rt');
      break;
    case "IM":
      addClassDivChildren(31, 23, bitDivs, 'opcode');
      addClassDivChildren(22, 21, bitDivs, 'LSL');
      addClassDivChildren(20, 5, bitDivs, 'MOV_immediate');
      addClassDivChildren(4, 0, bitDivs, 'Rd');
      break;
    default:
      break;
  }

  dispayInstuctionDiv.appendChild(bitDivs);

  let mne = document.createElement('div');
  mne.classList = 'opcode'
  mne.textContent = instuction.mnemonic;
  dispayInstuctionDiv.appendChild(mne);

  dispayInstuctionDiv.appendChild(mnemonicContainer);
}

function disassamlbe() {

  const input = document.querySelector('#input');

  let bin = parseInt(input.value, 16).toString(2);
  while (bin.length < 32) {
    bin = "0" + bin;
  }

  let instuction = {
    hexa: input,
    binary: bin,
    mnemonic: undefined,
    format: undefined
  };

  const op_11 = parseInt(instuction.binary.substring(0, 11), 2);

  if (op_11 >= 160 && op_11 <= 191) { // 0a0 - 0bf
    instuction.mnemonic = "B";
    instuction.format = "B";
  }
  else if (op_11 == 448) { //1c0
    instuction.mnemonic = "STURB";
    instuction.format = "D";
  }
  else if (op_11 == 450) { //1c2
    instuction.mnemonic = "LDURB";
    instuction.format = "D";
  }
  else if (op_11 >= 672 && op_11 <= 679) { //2a0-2a7
    instuction.mnemonic = "B.cond";
    instuction.format = "CB";
  }
  else if (op_11 == 960) { //3c0
    instuction.mnemonic = "STURH";
    instuction.format = "D";
  }
  else if (op_11 == 962) { //3c2
    instuction.mnemonic = "LDURH";
    instuction.format = "D";
  }
  else if (op_11 == 1104) { //450
    instuction.mnemonic = "AND";
    instuction.format = "R";
  }
  else if (op_11 == 1112) { //458
    instuction.mnemonic = "ADD";
    instuction.format = "R";
  }
  else if (op_11 >= 1160 && op_11 <= 1161) { //488-489
    instuction.mnemonic = "ADDI";
    instuction.format = "I";
  }
  else if (op_11 >= 1168 && op_11 <= 1169) { //490-491
    instuction.mnemonic = "ANDI";
    instuction.format = "I";
  }
  else if (op_11 >= 1184 && op_11 <= 1215) { //4a0-4bf
    instuction.mnemonic = "BL";
    instuction.format = "B";
  }
  else if (op_11 == 1112) { //550
    instuction.mnemonic = "ORR";
    instuction.format = "R";
  }
  else if (op_11 == 1112) { //558
    instuction.mnemonic = "ADDS";
    instuction.format = "R";
  }
  else if (op_11 >= 1416 && op_11 <= 1417) { //588-589
    instuction.mnemonic = "ADDIS";
    instuction.format = "I";
  }
  else if (op_11 >= 1424 && op_11 <= 1425) { //590-591
    instuction.mnemonic = "ORRI";
    instuction.format = "I";
  }
  else if (op_11 >= 1440 && op_11 <= 1447) { //5a0-5a7
    instuction.mnemonic = "CBZ";
    instuction.format = "CB";
  }
  else if (op_11 >= 1448 && op_11 <= 1455) { //5a8-5af
    instuction.mnemonic = "CBNZ";
    instuction.format = "CB";
  }
  else if (op_11 == 1472) { //5c0
    instuction.mnemonic = "STURW";
    instuction.format = "D";
  }
  else if (op_11 == 1476) { //5c4
    instuction.mnemonic = "LDURW";
    instuction.format = "D";
  }
  else if (op_11 == 1616) { //650
    instuction.mnemonic = "EOR";
    instuction.format = "R";
  }
  else if (op_11 == 1624) { //658
    instuction.mnemonic = "SUB";
    instuction.format = "R";
  }
  else if (op_11 >= 1672 && op_11 <= 1673) { //688-689
    instuction.mnemonic = "SUBI";
    instuction.format = "I";
  }
  else if (op_11 >= 1680 && op_11 <= 1681) { //690-691
    instuction.mnemonic = "EORI";
    instuction.format = "I";
  }
  else if (op_11 >= 1684 && op_11 <= 1687) { //694-697
    instuction.mnemonic = "MOVZ";
    instuction.format = "IM";
  }
  else if (op_11 == 1690) { //69a
    instuction.mnemonic = "LSR";
    instuction.format = "R";
  }
  else if (op_11 == 1691) { //69b
    instuction.mnemonic = "LSL";
    instuction.format = "R";
  }
  else if (op_11 == 1712) { //6b0
    instuction.mnemonic = "BR";
    instuction.format = "R";
  }
  else if (op_11 == 1872) { //750
    instuction.mnemonic = "ANDS";
    instuction.format = "R";
  }
  else if (op_11 == 1880) { //758
    instuction.mnemonic = "SUBS";
    instuction.format = "R";
  }
  else if (op_11 >= 1928 && op_11 <= 1929) { //788-789
    instuction.mnemonic = "SUBIS";
    instuction.format = "I";
  }
  else if (op_11 >= 1936 && op_11 <= 1934) { //790-791
    instuction.mnemonic = "ANDIS";
    instuction.format = "I";
  }
  else if (op_11 >= 1940 && op_11 <= 1943) { //794-797
    instuction.mnemonic = "MOVK";
    instuction.format = "IM";
  }
  else if (op_11 == 1984) { //7c0
    instuction.mnemonic = "STUR";
    instuction.format = "D";
  }
  else if (op_11 == 1986) { //7c2
    instuction.mnemonic = "LDUR";
    instuction.format = "D";
  }
  else if (op_11 == 2016) { //7e0
    instuction.mnemonic = "STURD";
    instuction.format = "R";
  }
  else if (op_11 == 2018) { //7e2
    instuction.mnemonic = "LDURD";
    instuction.format = "R";
  }
  else {
    instuction = {
      mnemonic: "fail"
    }
  }
  console.log(instuction);
  processInstuction(instuction);
}

