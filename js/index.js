function renderDiv(what){
    if(what==="Management"){
        $('#receiveItem').removeClass("active");
        $('#issueItem').removeClass("active");
        $('#reportItem').removeClass("active");
        $('#addItem').addClass("active");
        $('#dummyComponent').load("./pages/managementPage.html");
    }else if(what==="Inward"){
        $('#addItem').removeClass("active");
        $('#issueItem').removeClass("active");
        $('#reportItem').removeClass("active");
        $('#receiveItem').addClass("active");
        $('#dummyComponent').load("./pages/inwardPage.html");
    }else if(what==="Outward"){
        $('#addItem').removeClass("active");
        $('#receiveItem').removeClass("active");
        $('#reportItem').removeClass("active");
        $('#issueItem').addClass("active");
        $('#dummyComponent').load("./pages/outwardPage.html");
    }else if(what==="Report"){
        $('#addItem').removeClass("active");
        $('#receiveItem').removeClass("active");
        $('#issueItem').removeClass("active");
        $('#reportItem').addClass("active");
        $('#dummyComponent').load("./pages/reportPage.html");
    }
}




renderDiv("Management");
// renderDiv("Inward");
// renderDiv("Outward");
// renderDiv("Report");