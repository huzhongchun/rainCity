export function media(url){
    if(url.indexOf('blob') === 0) {
        return url;
    }
    const newURL = (url.indexOf(process.env.CDN_PREFIX) === 0 ? url : process.env.CDN_PREFIX + url);

    return loadedUrl[newURL] || loadedUrl[url] || newURL;
}