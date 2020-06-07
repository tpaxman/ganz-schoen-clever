function rolldice() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var dice_rolled_all = ss.getRangeByName('dice_rolled_all');
  var dice_rolled = ss.getRangeByName('dice_rolled');
  var dice_status = ss.getRangeByName('dice_status');
  var numCols = dice_rolled_all.getNumColumns();
  var newdice = []
  for (var j = 1; j <= numCols; j++) {
    var dicevalue = dice_rolled_all.getCell(1, j);
    var used_status = dice_rolled_all.getCell(2, j);
    var discard_status = dice_rolled_all.getCell(3, j);
    if (!used_status.isChecked() & !discard_status.isChecked()) {
      newdice.push(rollone());
    } else {
      newdice.push(dicevalue.getValue()); // don't change it.
    }
  }
  dice_rolled.setValues([newdice]);
}

function rollone(){
  return Math.floor(Math.random() * 6) + 1;
}

function newturn() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var dice_rolled_all = ss.getRangeByName('dice_rolled_all');
  var numCols = dice_rolled_all.getNumColumns();
  for (var j = 1; j <= numCols; j++) {
    var dicevalue = dice_rolled_all.getCell(1, j);
    var used_status = dice_rolled_all.getCell(2, j);
    var discard_status = dice_rolled_all.getCell(3, j);
    used_status.setValue("FALSE")
    discard_status.setValue("FALSE")
    dicevalue.setValue(rollone())
  }
}  
