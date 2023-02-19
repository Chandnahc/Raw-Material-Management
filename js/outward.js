var jpdbBaseURL = "http://api.login2explore.com:5577";
var connToken = "90938234|-31949273530510110|90952465";

var jpdbIRL = '/api/irl';
var jpdbIML = '/api/iml';
var matDBName = 'Material-DB';
var matRelationName = 'IssueData';
var flag = false;
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
    $('#issueno').prop('disabled',bValue);
    $('#issuedate').prop('disabled',bValue);
    $('#itemid').prop('disabled',bValue);
    $('#quantity').prop('disabled',bValue);
}

function initEmpForm(){
    localStorage.removeItem('first_issue_no');
    localStorage.removeItem('last_issue_no');
    localStorage.removeItem('issue_no');
    console.log('initEmpForm() - done');
}

function setCurrRecNo2LS(jsonObj){
    var data = JSON.parse(jsonObj.data);
    localStorage.setItem('issue_no',data.rec_no);
}

function getCurrRecNoFromLS(){
    return localStorage.getItem('issue_no');
}

function setFirstRecNo2LS(jsonObj){
    var data = JSON.parse(jsonObj.data);
    if(data.rec_no === undefined){
        localStorage.setItem('first_issue_no',"0");
    }else {
        localStorage.setItem("first_issue_no",data.rec_no);
    }
}

function getFirstRecNoFromLS(){
    return localStorage.getItem('first_issue_no');
}

function setLastRecNo2LS(jsonObj){
    var data = JSON.parse(jsonObj.data);
    if(data.rec_no === undefined){
        localStorage.setItem('last_issue_no',"0");
    }else {
        localStorage.setItem('last_issue_no',data.rec_no);
    }
}

function getLastRecNoFromLS(){
    return localStorage.getItem('last_issue_no');
}


function getReceiptFromID(){
    var issueno = $('#issueno').val();
    var jsonStr = {
        id: issueno
    };
    var getRequest = createGET_BY_KEYRequest(connToken,matDBName,matRelationName,JSON.stringify(jsonStr));
    jQuery.ajaxSetup({async: false});
    var jsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    if(jsonObj.status === 400){
        $('#save').prop('disabled',false);
        $('#reset').prop('disabled',false);
        $('#issuedate').focus();
    } else if(jsonObj.status === 200){
        showData(jsonObj);
    }
    jQuery.ajaxSetup({async:true});
}


function newForm(){
    makeDataFormEmpty();
    disableForm(false);
    $('#issueno').focus();
    disableNav(true);
    disableCtrl(true);
    $('#save').prop('disabled',false);
    $('#reset').prop('disabled',false);
}

function makeDataFormEmpty(){
    $('#issueno').val('');
    $('#issuedate').val('');
    $('#itemid').val('');
    $('#quantity').val('');
    $('#nameFound').html('');
    $('#moreQuant').html('');
}

function resetForm(){
    disableCtrl(true);
    disableNav(false);

    var getCurRequest = createGET_BY_RECORDRequest(connToken,matDBName,matRelationName,getCurrRecNoFromLS());
    jQuery.ajaxSetup({async: false});
    var result = executeCommand(getCurRequest,irlPartUrl);
    showData(result);
    jQuery.ajaxSetup({async: true});

    if(isOnlyOneRecordPresent() || isNoRecordPresentLS()){
        disableNav(true);
    }
    $('#new').prop('disabled',false);
    if(isNoRecordPresentLS()){
        makeDataFormEmpty();
        $('#edit').prop('disabled',true);
    }else {
        $('#edit').prop('disabled',false);
    }
    disableForm(true);
    $('#nameFound').html('');
    $('#moreQuant').html('');
}

function showData(jsonObj){
    if(jsonObj.status === 400){
        return;
    }
    var data = (JSON.parse(jsonObj.data)).record;
    setCurrRecNo2LS(jsonObj);

    $('#issueno').val(data.id);
    $('#issuedate').val(data.issuedate);
    $('#itemid').val(data.itemid);
    $('#quantity').val(data.quantity);
    $('#nameFound').val('');
    $('#moreQuant').html('');

    disableNav(false);
    disableForm(true);

    $('#save').prop('disabled',true);
    $('#change').prop('disabled',true);
    $('#reset').prop('disabled',true);
    $('#new').prop('disabled',false);
    $('#edit').prop('disabled',false);

    if(getCurrRecNoFromLS()===getLastRecNoFromLS()){
        $('#next').prop('disabled',true);
        $('#last').prop('disabled',true);
    }

    if(getCurrRecNoFromLS()===getFirstRecNoFromLS()){
        $('#prev').prop('disabled',true);
        $('#first').prop('disabled',true);
        return;
    }
}

function validateData(){
    var issueno,issuedate,itemid,quantity;
    issueno = $('#issueno').val();
    issuedate = $('#issuedate').val();
    itemid = $('#itemid').val();
    quantity = $('#quantity').val();
    

    if(issueno===''){
        alert("receipt no missing");
        $('#issueno').focus();
        return "";
    }
    if(issuedate===''){
        alert("receipt date missing");
        $('#issuedate').focus();
        return "";
    }
    if(itemid===''){
        alert("item id missing");
        $('#itemid').focus();
        return "";
    }
    if(quantity===''){
        alert("quantity missing");
        $('#quantity').focus();
        return "";
    }

    var jsonStrObj = {
        id: issueno,
        issuedate: issuedate,
        itemid: itemid,
        quantity: quantity,
    };
    return JSON.stringify(jsonStrObj);
}

function getFirst(){
    var getFirstRequest = createFIRST_RECORDRequest(connToken,matDBName, matRelationName);
    jQuery.ajaxSetup({async: false});
    var result = executeCommand(getFirstRequest,irlPartUrl);
    showData(result);
    setFirstRecNo2LS(result);
    jQuery.ajaxSetup({async: true});
    $('#issueno').prop('disabled',true);
    $('#first').prop('disabled',true);
    $('#prev').prop('disabled',true);
    $('#next').prop('disabled',false);
    $('#save').prop('disabled',true);
}

function getPrev(){
    var r = getCurrRecNoFromLS();
    if(r===1){
        $('#prev').prop('disabled',true);
        $('#first').prop('disabled',true);
    }
    var getPrevRequest = createPREV_RECORDRequest(connToken, matDBName, matRelationName, r);
    jQuery.ajaxSetup({async:false});
    var result = executeCommand(getPrevRequest, irlPartUrl);
    showData(result);
    jQuery.ajaxSetup({async:true});
    var r = getCurrRecNoFromLS();
    if(r===1){
        $('#first').prop('disabled',true);
        $('#prev').prop('disabled',true);
    }
    $('#save').prop('disabled',true);
}

function getNext(){
    var r = getCurrRecNoFromLS();
    var getPrevRequest = createNEXT_RECORDRequest(connToken,matDBName,matRelationName,r);
    jQuery.ajaxSetup({async: false});
    var result = executeCommand(getPrevRequest, irlPartUrl);
    showData(result);
    jQuery.ajaxSetup({async: true});
    $('#save').prop('disabled',true);
}

function getItemFromID(){
    var itemid = $('#itemid').val();
    var jsonStr = {
        id: itemid
    };
    var getRequest = createGET_BY_KEYRequest(connToken,matDBName,"ItemData",JSON.stringify(jsonStr));
    jQuery.ajaxSetup({async: false});
    var jsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    if(jsonObj.status === 400){
        $('#save').prop('disabled',true);
        $('#reset').prop('disabled',false);
        $('#change').prop('disabled',true);
        $('#nameFound').html("Item not present!");
        $('#itemid').focus();
        // $('#issuedate').prop('disabled',true);
        // $('#issueno').prop('disabled',true);
        // $('#quantity').prop('disabled',true);
    } else if(jsonObj.status === 200){
        if(flag){
            $('#change').prop('disabled',false);
        }else{
            $('#save').prop('disabled',false);

        }
        console.log(jsonObj.data)
        let tempobj = JSON.parse(jsonObj.data);
        console.log(tempobj.record.name)
        $('#nameFound').html(tempobj.record.name);
        // $('#issuedate').prop('disabled',false);
        // $('#issueno').prop('disabled',false);
        // $('#quantity').prop('disabled',false);
        
        // $('#change').prop('disabled',false);
        // showData(jsonObj);
    }
    jQuery.ajaxSetup({async:true});
}

function checkQuantity(){
    var quant = $('#quantity').val();
    var itemid = $('#itemid').val();
    var jsonStr = {
        id: itemid
    };
    var getRequest = createGET_BY_KEYRequest(connToken,matDBName,"ItemData",JSON.stringify(jsonStr));
    jQuery.ajaxSetup({async: false});
    var jsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    if(jsonObj.status === 400){
        
    } else if(jsonObj.status === 200){
        console.log(jsonObj);
        let tempobj = JSON.parse(jsonObj.data);
        console.log(tempobj.record.openingstock);
        if(quant>tempobj.record.openingstock){
            $('#save').prop('disabled',true);
            $('#change').prop('disabled',true);
            $('#moreQuant').html("Quantity entered is more than available")
        }else{
            if(flag){
                $('#change').prop('disabled',false);
            }else{
                $('#save').prop('disabled',false);
    
            }
        }
    }
    jQuery.ajaxSetup({async:true});
}

function getLast(){
    var getLastRequest = createLAST_RECORDRequest(connToken,matDBName,matRelationName);
    jQuery.ajaxSetup({async: false});
    var result = executeCommand(getLastRequest,irlPartUrl);
    setLastRecNo2LS(result);
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
    if(isNoRecordPresentLS()){
        setFirstRecNo2LS(jsonObj);
    }
    setLastRecNo2LS(jsonObj);
    setCurrRecNo2LS(jsonObj);
    flag=false;
    resetForm();
}


function editData(){
    disableForm(false);
    $('#issueno').prop('disabled',true);
    $('#issuedate').focus();
    disableNav(true);
    disableCtrl(true);
    $('#change').prop('disabled',false);
    $('#reset').prop('disabled',false);
    flag=true;
}

function changeData(){
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken,jsonChg,matDBName,matRelationName,getCurrRecNoFromLS())
    jQuery.ajaxSetup({async: false});
    var jsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(jsonObj);
    resetForm();
    $('#issueno').focus();
    $('#edit').focus();
    flag=false;
}

function isNoRecordPresentLS(){
    if(getFirstRecNoFromLS()==="0" && getLastRecNoFromLS()==="0"){
        return true;
    }
    return false;
}

function isOnlyOneRecordPresent(){
    if(isNoRecordPresentLS()){
        return false;
    }
    if(getFirstRecNoFromLS()===getLastRecNoFromLS()){
        return true;
    }
    return false;
}

function checkForNoOrOneRecord(){
    if(isNoRecordPresentLS()){
        disableForm(true);
        disableNav(true);
        disableCtrl(true);
        $('#new').prop('disabled',false);
        return;
    }
    if(isOnlyOneRecordPresent()){
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
checkForNoOrOneRecord();
