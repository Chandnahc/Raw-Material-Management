var jpdbBaseURL = "http://api.login2explore.com:5577";
var connToken = "enter_your_connection_token";

var jpdbIRL = '/api/irl';
var jpdbIML = '/api/iml';
var matDBName = 'Material-DB';
var matRelationName = 'ItemData';

setBaseUrl(jpdbBaseURL);

function renderData() {
    var getRequest = createGETALLSyncRecordRequest(connToken, matDBName, matRelationName, null, 1, 10);
    let tempjsonobj;

    jQuery.ajaxSetup({ async: false });
    var jsonObj = executeCommand(getRequest, irlPartUrl);
    if (jsonObj.status === 400) {
        console.log("error")
    } else if (jsonObj.status === 200) {
        let temp = JSON.parse(jsonObj.data);
        console.log(jsonObj);
        console.log(temp.json_records);
        tempjsonobj = temp.json_records;

        $.each(tempjsonobj, function (key, value) {
            $('#mytable').append('<tr> <td>' + value.record.id + '</td>  <td>' + value.record.name + '</td> <td>' + value.record.openingstock + '</td> </tr>');
        })
        
    }
    jQuery.ajaxSetup({ async: true });
}

renderData()
