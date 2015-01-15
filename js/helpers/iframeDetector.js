define([], function(){
  inIframe = function() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
  }

  return {inIframe: inIframe}
});