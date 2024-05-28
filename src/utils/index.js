export function resolveWsUrl(url) {
  if (url.startsWith("ws")) {
    return url;
  }
  let loc = window.location;
  let uri = "";
  if (loc.protocol === "https:") {
    uri += "wss";
  } else {
    uri += "ws";
  }
  uri += "//" + loc.host;
  uri += url;
}
