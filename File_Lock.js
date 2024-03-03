function onOpen(e){
  var ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu('LockFile')
      .addItem('Lock', 'lock')
      .addItem('Unlock', 'unlock')
      .addToUi();

  //Check if file is locked. if not, execute the procedure
  var scriptProperties = PropertiesService.getScriptProperties();
  var keys = scriptProperties.getKeys();
  if(keys.length==0){
    //Lock the file 
    //lock(); empty Session.getActiveUser().getEmail() received when user opens the spreadsheet
    showAlert("Please lock the file first");
    
    
  }else{
    showAlert("File is currenly locked by "+scriptProperties.getProperty('user'));
  }
}

function onEdit(e){
  console.log(JSON.stringify(e));
  var ui = SpreadsheetApp.getUi();
  var ws = SpreadsheetApp.getActiveSheet().getActiveCell();
  var ts = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1").getActiveRangeList();
  // Or DocumentApp or FormApp.
  var sheet = e.range.getSheet();
  console.log(e.range.getSheet().getName());
  
 

  var scriptProperties = PropertiesService.getScriptProperties();
  var keys = scriptProperties.getKeys();
  if (e.range.getSheet().getName() != 'Sheet1') {
  if(keys.length>0 && (Session.getEffectiveUser().getEmail() != scriptProperties.getProperty('user'))){
    ws.clear();
    showAlert("Sorry, file is locked by "+scriptProperties.getProperty('user'));
    }
    
    
  }else{
    
  } 
}

function test(e) {
   var ui = SpreadsheetApp.getUi();
   PropertiesService.getScriptProperties().getProperty('user');
   console.log(e.range.getSheet().getName());
}


function lock(){
  var scriptProperties = PropertiesService.getScriptProperties();
  var userEmail;
  var keys = scriptProperties.getKeys();
  Logger.log(keys.length);

  if(keys.length==0){
    //Create new property with current user's email
    userEmail = Session.getEffectiveUser().getEmail();
    Logger.log(userEmail);
    scriptProperties.setProperties({user: userEmail});
    showAlert("File successfully locked by "+userEmail);
    
  }else{
    userEmail = scriptProperties.getProperty('user');
    showAlert("File is currenly locked by "+userEmail);
  }

}
function unlock(){
  var ui = SpreadsheetApp.getUi();
  var scriptProperties = PropertiesService.getScriptProperties();
  var userEmail;
  var keys = scriptProperties.getKeys();
  Logger.log(keys.length);
  Logger.log(scriptProperties.getProperty('user'));

  if(keys.length>0){
    userEmail = Session.getEffectiveUser().getEmail();
    Logger.log(scriptProperties.getProperty('user'));
    if(scriptProperties.getProperty('user') == userEmail){
      scriptProperties.deleteAllProperties();
      showAlert("File successfully unlocked by "+userEmail);
    }
    else if (scriptProperties.getProperty('user') != userEmail)   {
      var response = ui.prompt("File is locked. Please enter master password to reset lock:", ui.ButtonSet.OK_CANCEL);

      if (response.getSelectedButton() == ui.Button.OK) {
        if (response.getResponseText() == "mirabel") {
          scriptProperties.deleteAllProperties();
          showAlert("File successfully unlocked by "+userEmail);
        }
        else {
          showAlert("Sorry, wrong password.");
        } 
      }
          
      else {
      //nothing
      }
     
    }
    
  }
  else  {
    showAlert("File is not locked");
  }
}
