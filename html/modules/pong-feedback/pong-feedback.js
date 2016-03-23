/*
The MIT License (MIT)

Copyright (c) 2014 Markus Harms, ma@mh-svr.de

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. 
*/
log( "pong-feedback", "load module"); // print this on console, when module is loaded


//======= Code for "loadResourcesHtml" hook ================================================
function pongFeedbackHTML( divId, resourceURL, paramObj ) {
  log( "pong-feedback", "divId="+divId  );
  var html = [];
  html.push( '<div id="'+divId+'" class="pong-feedback">.X.<br>..X' );
  html.push( '</div>' );
  // output
  $( "#"+divId ).html( html.join( "\n" ) );
  
  log( "pong-feedback", "broker.subscribe(...) ");
  subscribeEvent( 'feedback', feedbackEvtCallback ) 

  log( "pong-feedback", "divId="+divId+" end.");
}

var pongLastFeedbackTxt = [' ','  ','   ']
var pongLastFeedbackCnt = [1,1,1]

/** The callback is subscribed for feedback events */
function feedbackEvtCallback( evt ) {
  log( "pong-feedback", "feedbackEvtCallback" )
  if ( evt && evt.text ) {
    if ( pongLastFeedbackTxt.indexOf( evt.text ) >= 0 ) {
      if ( evt.text.length > 0 ) {
        var feedbackTxt =  $.i18n( evt.text )
        var evtNo = pongLastFeedbackTxt.indexOf( feedbackTxt )
        pongLastFeedbackCnt[evtNo] = pongLastFeedbackCnt[evtNo] + 1
      }
    } else {
      if ( evt.text.length > 0 ) {
        var feedbackTxt =  $.i18n( evt.text )
        pongLastFeedbackTxt.shift()
        pongLastFeedbackCnt.shift()
        pongLastFeedbackTxt.push( feedbackTxt )
        pongLastFeedbackCnt.push( 1 )
      }
    }
  }
  var feedbackLog = ''
  for ( var i = pongLastFeedbackTxt.length-1; i >= 0; i-- ) {
    if ( pongLastFeedbackCnt[i] == 1 ) {
      feedbackLog += pongLastFeedbackTxt[i] + '<br>'
    } else {
      feedbackLog += pongLastFeedbackTxt[i] + ' ['+ pongLastFeedbackCnt[i] +']<br>'
    }
  }
  $( '.pong-feedback' ).html( feedbackLog )    
}
