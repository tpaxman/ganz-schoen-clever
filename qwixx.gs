function rolldice(){
  var dicerange = SpreadsheetApp.getActiveSpreadsheet().getRangeByName('dice_rolled')
  var dicevals = dicerange.getValues()[0];
  var newdice = dicevals.map((x) => ((x == 'X') ? x : dieroll()));
  dicerange.setValues([newdice]);
}

function dieroll(){
  // get random six-sided die roll
  return randbetween(1,6);
}

function randbetween(min, max){
  // get random number between two numbers
  return Math.floor(Math.random() * (max - min + 1) + min);
}
