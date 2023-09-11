const API_URL = "http://127.0.0.1:5000"

async function checkUrl() {
    console.log("CLick....")
    const urlEntry = document.getElementById("urlEntry").value.toString();
    console.log("Url Entry " + urlEntry);
    const properties = extractPropertiesFromUrl(urlEntry, document);
    console.log("Properties Array - " + properties);
    checkIsUrlPhishy(properties)
}

const checkIsUrlPhishy = async (properties) => {
    try {
        const response = await fetch(API_URL + "/isUrlPhishy", {
            method: "POST", 
            mode: "cors", 
            credentials: "same-origin", 
            headers: {
                "Content-Type": "text/plain",
                "Access-Control-Allow-Origin": "*",
            },
            body: properties.toString(),})
        const isUrlPhishy = await response.text()
        console.log(isUrlPhishy)
        const message = isUrlPhishy == '0' ? "URL is Safe" : "!! PHISHING ALERT !!";
        alert(message);
    } catch (error) {
        console.error(error)
        alert(error.message);
    }
}

const extractPropertiesFromUrl = (urlString, document) => {
    console.log("Processing Url - " + urlString)
    const parsedUrl = new URL(urlString);
    console.log(parsedUrl)
    return [
        (parsedUrl.hostname && parsedUrl.hostname.match(/\d+\.\d+\.\d+\.\d+/)) != null ? 0 : 1,
        (parsedUrl.pathname && parsedUrl.pathname.length) < 24 ? 0 : 1,
        (parsedUrl.hostname && parsedUrl.hostname.split('.').some((part) => part.length < 3)) ? 0 : 1,
        (parsedUrl.href && parsedUrl.href.indexOf('@') === -1) ? 0 : 1,
        (parsedUrl.href && parsedUrl.href.indexOf('//', 7) === -1) ? 0 : 1,
        (parsedUrl.href && parsedUrl.href.indexOf('-') === -1) ? 0 : 1,
        (parsedUrl.hostname && parsedUrl.hostname.split('.').length <= 3) ? 0 : 1,
        (parsedUrl.href && parsedUrl.href.includes(parsedUrl.origin + '/favicon')) ? 0 : 1,
        (parsedUrl.port && (parsedUrl.port === '' || parsedUrl.port === '80' || parsedUrl.port === '443')) ? 0 : 1,
        (parsedUrl.href && parsedUrl.href.includes('http://') && parsedUrl.href.includes('https://')) ? 0 : 1,
        document.querySelectorAll('video[src], audio[src], iframe[src]').length > 0 &&
            !document.querySelectorAll('video[src], audio[src], iframe[src]').forEach((element) => {
                // if () {
                return element.src && new URL(element.src).hostname !== parsedUrl.hostname;
                // }
            }).length ? 0 : 1,
        document.querySelectorAll('a[href]').length === 0 ? 0 : 1,
        document.querySelectorAll('meta[http-equiv], script[src], link[rel="stylesheet"]').length > 0 &&
            !document.querySelectorAll('meta[http-equiv], script[src], link[rel="stylesheet"]').forEach((element) => {
                // if (new URL(element.src || element.href).hostname !== parsedUrl.hostname) {
                return element.src && new URL(element.src || element.href).hostname !== parsedUrl.hostname;
                // }
            }) ? 0 : 1,
        document.querySelectorAll('form[action]').length === 0 || document.querySelectorAll('form[action]').some((form) => form.action === '' || form.action === 'about:blank') ? 0 : 1,
        (parsedUrl.href && (parsedUrl.href.indexOf('mailto:') === -1 && !document.querySelectorAll('a[href^="mailto:"], a[href^="mail()"]').length > 0)) ? 0 : 1,
        (parsedUrl.hostname && parsedUrl.hostname.split('.').length >= 2) ? 0 : 1, 0];
}