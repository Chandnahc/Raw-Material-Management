var jpdbBaseURL = "http://api.login2explore.com:5577";
var connToken = "enter_your_connection_token";

var jpdbIRL = '/api/irl';
var jpdbIML = '/api/iml';
var matDBName = 'Material-DB';
var matRelationName = 'ItemData';

setBaseUrl(jpdbBaseURL);

function disableCtrl(ctrl){
    $('#new').prop('disabled',ctrl);
    $('#save').prop('disabled',ctrl);
    $('#edit').prop('disabled',ctrl);
    $('#change').prop('disabled',ctrl);
    $('#reset').prop('disabled',ctrl);
}

function disableNav(ctrl){
    $('#first').prop('disabled',ctrl);
    $('#prev').prop('disabled',ctrl);
    $('#next').prop('disabled',ctrl);
    $('#last').prop('disabled',ctrl);
}

function disableForm(bValue) {
    $('#itemid').prop('disabled',bValue);
    $('#itemname').prop('disabled',bValue);
    $('#openingstock').prop('disabled',bValue);
    $('#unitofmeasurement').prop('disabled',bValue);
}

function initEmpForm(){
    localStorage.removeItem('first_item_no');
    localStorage.removeItem('last_item_no');
    localStorage.removeItem('item_no');
    console.log('initEmpForm() - done');
}

function setCurritemNo2LS(jsonObj){
    var data = JSON.parse(jsonObj.data);
    localStorage.setItem('item_no',data.rec_no);
}

function getCurritemNoFromLS(){
    return localStorage.getItem('item_no');
}

function setFirstitemNo2LS(jsonObj){
    var data = JSON.parse(jsonObj.data);
    if(data.rec_no === undefined){
        localStorage.setItem('first_item_no',"0");
    }else {
        localStorage.setItem("first_item_no",data.rec_no);
    }
}

function getFirstitemNoFromLS(){
    return localStorage.getItem('first_item_no');
}

function setLastitemNo2LS(jsonObj){
    var data = JSON.parse(jsonObj.data);
    if(data.rec_no === undefined){
        localStorage.setItem('last_item_no',"0");
    }else {
        localStorage.setItem('last_item_no',data.rec_no);
    }
}

function getLastitemNoFromLS(){
    return localStorage.getItem('last_item_no');
}


function getItemFromID(){
    var itemid = $('#itemid').val();
    var jsonStr = {
        id: itemid
    };
    var getRequest = createGET_BY_KEYRequest(connToken,matDBName,matRelationName,JSON.stringify(jsonStr));
    jQuery.ajaxSetup({async: false});
    var jsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    if(jsonObj.status === 400){
        $('#save').prop('disabled',false);
        $('#reset').prop('disabled',false);
        $('#itemname').focus();
    } else if(jsonObj.status === 200){
        showData(jsonObj);
    }
    jQuery.ajaxSetup({async:true});
}


function newForm(){
    makeDataFormEmpty();
    disableForm(false);
    $('#itemid').focus();
    disableNav(true);
    disableCtrl(true);
    $('#save').prop('disabled',false);
    $('#reset').prop('disabled',false);
}

function makeDataFormEmpty(){
    $('#itemid').val('');
    $('#itemname').val('');
    $('#openingstock').val('');
    $('#unitofmeasurement').val('');
}

function resetForm(){
    disableCtrl(true);
    disableNav(false);

    var getCurRequest = createGET_BY_RECORDRequest(connToken,matDBName,matRelationName,getCurritemNoFromLS());
    jQuery.ajaxSetup({async: false});
    var result = executeCommand(getCurRequest,irlPartUrl);
    showData(result);
    jQuery.ajaxSetup({async: true});

    if(isOnlyOneitemordPresent() || isNoitemordPresentLS()){
        disableNav(true);
    }
    $('#new').prop('disabled',false);
    if(isNoitemordPresentLS()){
        makeDataFormEmpty();
        $('#edit').prop('disabled',true);
    }else {
        $('#edit').prop('disabled',false);
    }
    disableForm(true);
}

function showData(jsonObj){
    if(jsonObj.status === 400){
        return;
    }
    var data = (JSON.parse(jsonObj.data)).record;
    setCurritemNo2LS(jsonObj);

    $('#itemid').val(data.id);
    $('#itemname').val(data.name);
    $('#openingstock').val(data.openingstock);
    $('#unitofmeasurement').val(data.unitofmeasurement);
    

    disableNav(false);
    disableForm(true);

    $('#save').prop('disabled',true);
    $('#change').prop('disabled',true);
    $('#reset').prop('disabled',true);
    $('#new').prop('disabled',false);
    $('#edit').prop('disabled',false);

    if(getCurritemNoFromLS()===getLastitemNoFromLS()){
        $('#next').prop('disabled',true);
        $('#last').prop('disabled',true);
    }

    if(getCurritemNoFromLS()===getFirstitemNoFromLS()){
        $('#prev').prop('disabled',true);
        $('#first').prop('disabled',true);
        return;
    }
}

function validateData(){
    var itemid,itemname,openingstock,unitofmeasurement;
    itemid = $('#itemid').val();
    itemname = $('#itemname').val();
    openingstock = $('#openingstock').val();
    unitofmeasurement = $('#unitofmeasurement').val();

    if(itemid===''){
        alert("Item id missing");
        $('#itemid').focus();
        return "";
    }
    if(itemname===''){
        alert("Item name missing");
        $('#itemname').focus();
        return "";
    }
    if(openingstock===''){
        alert("opening stock  missing");
        $('#openingstock').focus();
        return "";
    }
    if(unitofmeasurement===''){
        alert("unit of measurement missing");
        $('#unitofmeasurement').focus();
        return "";
    }

    var jsonStrObj = {
        id: itemid,
        name: itemname,
        openingstock: openingstock,
        unitofmeasurement: unitofmeasurement
    };
    return JSON.stringify(jsonStrObj);
}

function getFirst(){
    var getFirstRequest = createFIRST_RECORDRequest(connToken,matDBName, matRelationName);
    jQuery.ajaxSetup({async: false});
    var result = executeCommand(getFirstRequest,irlPartUrl);
    showData(result);
    setFirstitemNo2LS(result);
    jQuery.ajaxSetup({async: true});
    $('#itemid').prop('disabled',true);
    $('#first').prop('disabled',true);
    $('#prev').prop('disabled',true);
    $('#next').prop('disabled',false);
    $('#save').prop('disabled',true);
}

function getPrev(){
    var r = getCurritemNoFromLS();
    if(r===1){
        $('#prev').prop('disabled',true);
        $('#first').prop('disabled',true);
    }
    var getPrevRequest = createPREV_RECORDRequest(connToken, matDBName, matRelationName, r);
    jQuery.ajaxSetup({async:false});
    var result = executeCommand(getPrevRequest, irlPartUrl);
    showData(result);
    jQuery.ajaxSetup({async:true});
    var r = getCurritemNoFromLS();
    if(r===1){
        $('#first').prop('disabled',true);
        $('#prev').prop('disabled',true);
    }
    $('#save').prop('disabled',true);
}

function getNext(){
    var r = getCurritemNoFromLS();
    var getPrevRequest = createNEXT_RECORDRequest(connToken,matDBName,matRelationName,r);
    jQuery.ajaxSetup({async: false});
    var result = executeCommand(getPrevRequest, irlPartUrl);
    showData(result);
    jQuery.ajaxSetup({async: true});
    $('#save').prop('disabled',true);
}

function getLast(){
    var getLastRequest = createLAST_RECORDRequest(connToken,matDBName,matRelationName);
    jQuery.ajaxSetup({async: false});
    var result = executeCommand(getLastRequest,irlPartUrl);
    setLastitemNo2LS(result);
    showData(result);
    jQuery.ajaxSetup({async: true});
    $('#first').prop('disabled',false);
    $('#prev').prop('disabled',false);
    $('#last').prop('disabled',true);
    $('#next').prop('disabled',true);
    $('#save').prop('disabled',true);
}

function saveData(){
    var jsonStrObj = validateData();
    if(jsonStrObj === ''){
        return '';
    }
    var putRequest = createPUTRequest(connToken,jsonStrObj,matDBName,matRelationName);
    jQuery.ajaxSetup({async:false});
    var jsonObj = executeCommand(putRequest, imlPartUrl);
    jQuery.ajaxSetup({async:true});
    if(isNoitemordPresentLS()){
        setFirstitemNo2LS(jsonObj);
    }
    setLastitemNo2LS(jsonObj);
    setCurritemNo2LS(jsonObj);
    resetForm();
}


function editData(){
    disableForm(false);
    $('#itemid').prop('disabled',true);
    $('#itemname').focus();
    disableNav(true);
    disableCtrl(true);
    $('#change').prop('disabled',false);
    $('#reset').prop('disabled',false);
}

function changeData(){
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken,jsonChg,matDBName,matRelationName,getCurritemNoFromLS())
    jQuery.ajaxSetup({async: false});
    var jsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(jsonObj);
    resetForm();
    $('#itemid').focus();
    $('#edit').focus();
}

function isNoitemordPresentLS(){
    if(getFirstitemNoFromLS()==="0" && getLastitemNoFromLS()==="0"){
        return true;
    }
    return false;
}

function isOnlyOneitemordPresent(){
    if(isNoitemordPresentLS()){
        return false;
    }
    if(getFirstitemNoFromLS()===getLastitemNoFromLS()){
        return true;
    }
    return false;
}

function checkForNoOrOneitemord(){
    if(isNoitemordPresentLS()){
        disableForm(true);
        disableNav(true);
        disableCtrl(true);
        $('#new').prop('disabled',false);
        return;
    }
    if(isOnlyOneitemordPresent()){
        disableForm(true);
        disableNav(true);
        disableCtrl(true);
        $('#new').prop('disabled',false);
        $('#edit').prop('disabled',false);
        return;
    }
}

initEmpForm();
getFirst();
getLast();
checkForNoOrOneitemord();
