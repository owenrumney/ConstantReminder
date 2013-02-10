$(changeToDisabled);


function changeToDisabled() {
    $('#enableNotifications').val("Notifications Disabled");
    $('#enableNotifications').addClass('btn-danger');
    $('#enableNotifications').removeClass('btn-info');    
}