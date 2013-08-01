var running = false;

$(function() {
    if (window.location != '/nochrome')
    checkPermissions();});

$(function() {
    var qs = $.deparam.querystring();
    if (qs) {
        if (qs['r'])
        {
            showPrompter();
            $('#reminderText').val(qs['r']);
        }
        if (qs['w'])
        {
            if (qs['w'] === 'e')
                if (qs['e'] && qs['i'])
                {
                    $('#optionsEvery').attr("checked", "checked");;
                    $('#period').val(qs['e']);
                    $('#interval').val(qs['i']);
                }
            }
            if (qs['w'] === 'a')
            {
                if (qs['h'] && qs['m'])
                {
                    $('#optionsAt').attr("checked", "checked");
                    $('#hours').val(qs['h']);
                    $('#minutes').val(qs['m']);
                }
            }
        }
    });

$('#enableNotifications').click( function (){
    if (window.webkitNotifications.checkPermission() == 0) {
    } else {
        window.webkitNotifications.requestPermission(checkPermissions);
        if (window.webkitNotifications.checkPermission() == 0) {
            checkPermissions();
        }
    }
});

$('#letsGo').click(showPrompter);

$('#showInstructions').click(showInstructions);

$('#start').click(function () {

    if (running)
    {
        changeToNotRunning();
        running = false;
        return;
    }

    changeToRunning();

    createAndShowNotification();});

function createAndShowNotification() {

    var runAt = $('#optionsAt').attr("checked") === "checked";
    var title = 'Recurring Reminder';
    var icon = "images/recurring.png";
    var interval = 0;
    if (runAt)
    {
        var icon = "images/scheduled.png";
        title = 'Scheduled Notification';

        var now = new Date();
        var d = new Date();
        var hours = $('#hours').val();
        var mins = $('#minutes').val();
        if (hours && mins)
        {
            d.setHours(hours);
            d.setMinutes(mins);

            if (d < now)
            {
                d.setDate(d.getDate()+1);
            }

            interval = d.getTime() - now.getTime();
        }
    }
    var notification  = window.webkitNotifications.createNotification(icon, title, $('#reminderText').val());
    if (!runAt)
    {
        var period = $('#period').val();
        var multiplier = 0;
        switch ($('#interval').val())
        {
            case 'secs':
            multiplier = 1000;
            break;
            case 'mins':
            multiplier = 1000 * 60;
            break;
            case 'hours':
            multiplier = 1000 * 60 * 60;
            break;
        }

        interval = multiplier * period;
        notification.onclose = function () { 
            createAndShowNotification();
        }
    }

    setTimeout(function() { 
        if (running) {
            notification.show()
        }
    }, interval);

}


function showPrompter() {
    $('#instructions').hide();
    $('#prompter').show();
}

function showInstructions() {
    $('#prompter').hide();
    $('#instructions').show(300)
}

function setReminder(item) {
    var data = {'r': item, 'e': '1', 'i': 'hours'};
    var redirect = 'http://localhost:3000/?' + $.param(data);
    document.location = redirect;

    return false;
}

function checkPermissions() {

   var p = window.webkitNotifications;
   if (p === undefined)
   {
    document.location = '/nochrome';
    return;
}

if ( p.checkPermission()== 0) {
    changeToEnabled();
}
else if (window.webkitNotifications.checkPermission() == 2){
    changeToDisabled();
}
}

function changeToDisabled() {
    $('#enableNotifications').val("Notifications Disabled");
    $('#enableNotifications').addClass('btn-danger');
    $('#enableNotifications').removeClass('btn-info');    
}

function changeToRunning() {
    running = true;
    $('#start').val("Cancel");
    $('#start').addClass('btn-danger');
    $('#start').removeClass('btn-info');  
}

function changeToNotRunning() {
    $('#start').val("Start reminding");
    $('#start').addClass('btn-info');
    $('#start').removeClass('btn-danger');  
}

function changeToEnabled() {
    $('#enableNotifications').val("Notifications Enabled");
    $('#enableNotifications').addClass('btn-success');
    $('#enableNotifications').removeClass('btn-info');    
    $('#start').removeAttr('disabled')
    $('#start').val("Start reminding");
    $('#start').addClass('btn-info');
    $('#start').removeClass('btn-disabled');  
}

