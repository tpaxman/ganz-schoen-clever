DARK_GREY = '#999999'
LIGHT_GREY = '#d9d9d9'
DEFAULT_DICE_COLOR_ORDER = [['#f1c232', '#4a86e8', '#6aa84f', '#ff9900', '#a64d79', '#ffffff']];
DEFAULT_DICE_FONT_ORDER = [['#000000', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#000000']]
DICE_STATUS = SpreadsheetApp.getActiveSpreadsheet().getRangeByName('dice_status')
SS = SpreadsheetApp.getActiveSpreadsheet();

function get_dice_status() {return SS.getRangeByName('dice_status')}
function get_dice_rolled() {return SpreadsheetApp.getActiveSpreadsheet().getRangeByName('dice_rolled')}
function get_picks() {return SpreadsheetApp.getActiveSpreadsheet().getRangeByName('dice_picked')}
function get_discards() {return SpreadsheetApp.getActiveSpreadsheet().getRangeByName('dice_discarded')}

function onEdit(e){
  statuscell = e.range;
  status_range = get_dice_status();
  if (is_cell_in_range(statuscell, status_range)){
    die_index = get_cell_index_in_range(e.range, status_range);
    if (statuscell.isChecked()){
      move_die_to_picks(die_index);
      if (count_picks() < 3){
        discard_lesser_dice(die_index);
      } else {
        discard_remaining_dice();
      }
    }
  }
}



function rolldice(){
  // roll the rest
  var dice_rolled = get_dice_rolled()
  var newdice = []
  for (var i = 1; i <= dice_rolled.getNumColumns(); i++) {
    die_value = dice_rolled.getCell(1,i).getValue();
    if (is_die_available(i)){
      newdice.push(rollone());
    } else {
      newdice.push(''); 
    }
  }
  dice_rolled.setValues([newdice]); 
}


function newturn() {
  reset_dice();
  rolldice();
}  

  
function get_cell_index_in_range(cell, range){
  if (is_cell_in_range(cell, range)){
    return cell.getColumn() - range.getColumn() + 1;
  }
}


// CHECK RANGE DETAILS
function is_row_range(range){
  return (range.getNumRows() == 1);
}

function is_cell(range){
  return (range.getNumColumns()==1 && range.getNumRows()==1)  
}

function is_cell_in_range(cell, range){
  if (is_cell(cell) && is_row_range(range)){
    cellrow = cell.getRow();
    cellcol = cell.getColumn();
    rangerow = range.getRow();
    rangecolmin = range.getColumn();
    rangecolmax = range.getLastColumn();
    return (cellcol >= rangecolmin && cellcol <= rangecolmax && cellrow == rangerow);
  } else {
    return null
  }
}

function count_picks(){
  picks = get_picks();
  counter = 0
  for (var i = 1; i <= picks.getNumColumns(); i++){
    if (!picks.getCell(1,i).isBlank()){
      counter = counter + 1
    }
  }  
  return counter
}


function is_die_available(die_index){
  var statusrange = SpreadsheetApp.getActiveSpreadsheet().getRangeByName('dice_status');
  var cell = statusrange.getCell(1, die_index);
  var value = cell.getValue();
  if (cell.isChecked()==null){
    // https://yagisanatode.com/2019/07/16/google-apps-script-how-to-check-if-there-is-a-tick-box-check-box-in-a-cell-or-range/
    return false;
  } else {
    return true;
  }
}




function rollone(){
  return Math.floor(Math.random() * 6) + 1;
}
  

function get_die_choice_index(){
  var statusrow = SpreadsheetApp.getActiveSpreadsheet().getRangeByName('dice_status');
  for (i = 1; i <= statusrow.getNumColumns(); i++) { 
    if (statusrow.getCell(1, i).isChecked()){
      return i
    }
  }
  return null
}

function get_die_choice_cell(){
  var die_index = get_die_choice_index()
  if (die_index != null){
    var rolledrow = SpreadsheetApp.getActiveSpreadsheet().getRangeByName('dice_rolled');
    var die_cell = rolledrow.getCell(1, die_index);
    return die_cell
  } else {
    return null
  }
}

function get_rolled_cell(dice_index){
  return SpreadsheetApp.getActiveSpreadsheet().getRangeByName('dice_rolled').getCell(1, dice_index);
}

function get_status_cell(dice_index){
  return SpreadsheetApp.getActiveSpreadsheet().getRangeByName('dice_status').getCell(1, dice_index);
}

function get_next_picks_slot(){
  return get_first_open_slot('dice_picked');
}

function get_next_tray_slot(){
  return get_first_open_slot('dice_discarded');
}

function get_first_open_slot(range_name){
  var pickedrng = SpreadsheetApp.getActiveSpreadsheet().getRangeByName(range_name);
  for (var i = 1; 1 <= pickedrng.getNumColumns(); i++){
    var cell = pickedrng.getCell(1, i)
    if (cell.isBlank()){
      return cell
    }
  }
}



function is_valid_die_value(value){
  return (value >= 1 && value <= 6);
}




function get_die_value(die_index){
  var rolledcell = get_rolled_cell(die_index);
  return rolledcell.getValue();
}


function move_die_to_picks(die_index){
  var rolledcell = get_rolled_cell(die_index);
  var statuscell = get_status_cell(die_index);
  
  rolledcell.copyTo(get_next_picks_slot());
  rolledcell.setBackground('black')
  rolledcell.setFontColor('black')
  statuscell.clearContent();
  statuscell.removeCheckboxes();
}  

function move_die_to_tray(die_index){
  var rolledcell = get_rolled_cell(die_index);
  var statuscell = get_status_cell(die_index);
  
  rolledcell.copyTo(get_next_tray_slot());
  rolledcell.setBackground('black')
  rolledcell.setFontColor('black')
  statuscell.clearContent();
  statuscell.removeCheckboxes();  
}

function discard_lesser_dice(die_index){
  picked_value = get_die_value(die_index);
  var rolledrow = SpreadsheetApp.getActiveSpreadsheet().getRangeByName('dice_rolled');
  var statusrow = SpreadsheetApp.getActiveSpreadsheet().getRangeByName('dice_status');
  for (var i = 1; i <= statusrow.getNumColumns(); i++) {   
    var rolledcell = rolledrow.getCell(1, i);
    var statuscell = statusrow.getCell(1, i);
    if (!statuscell.isBlank() & (rolledcell.getValue() < picked_value)){
      move_die_to_tray(i);
    }
  }
}

function discard_remaining_dice(){
  for (var i = 1; i <= 6; i++) {   
    if (is_die_available(i)){
      move_die_to_tray(i);
    }
  }  
}

function reset_dice(){

  var dice = SpreadsheetApp.getActiveSpreadsheet().getRangeByName('dice_rolled');
  dice.setBackgrounds(DEFAULT_DICE_COLOR_ORDER);
  dice.setFontColors(DEFAULT_DICE_FONT_ORDER);
  
  var status = SpreadsheetApp.getActiveSpreadsheet().getRangeByName('dice_status')
  status.insertCheckboxes();
  status.uncheck();
  
  var picks = SpreadsheetApp.getActiveSpreadsheet().getRangeByName('dice_picked')
  picks.clearContent();
  picks.setBackground(DARK_GREY);
  //picks.setBorder(false, false, false, false, false, false);
  
  var discards = SpreadsheetApp.getActiveSpreadsheet().getRangeByName('dice_discarded')
  discards.clearContent();
  discards.setBackground(DARK_GREY);
  //discards.setBorder(false, false, false, false, false, false);
}
