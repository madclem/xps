var tcpPortUsed = require('tcp-port-used');
var startPort = 8080;

function getAvailablePort(options)
{

    startPort = 8080-1;

    return onPortStatus(true);
}

function onPortStatus(inUse)
{
    if(inUse)
    {
        startPort++;
        return tcpPortUsed.check(startPort, '0.0.0.0')
        .then(onPortStatus, onError);
    }
    else
    {
        return startPort;
    }
}

function onError(err)
{
    console.error('Error on check:', err.message);
}


module.exports = getAvailablePort;