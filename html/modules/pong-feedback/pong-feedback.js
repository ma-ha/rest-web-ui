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
  pongFeedbackFimerID = setInterval( "updateFeedback()", 5000 );

  log( "pong-feedback", "divId="+divId+" end.");
}
var pongLastFeedbacks = 3;
var pongLastFeedbackTxt = [' ','  ','   ']
var pongLastFeedbackCnt = [1,1,1]
var pongLastFeedbackTim = [ new Date() , new Date() , new Date() ]

/** The callback is subscribed for feedback events */
function feedbackEvtCallback( evt ) {
  log( "pong-feedback", "feedbackEvtCallback" )
  if ( evt && evt.text ) {
    log( "pong-feedback", "feedbackEvtCallback "+evt.text )
    if ( pongLastFeedbackTxt.indexOf( evt.text ) >= 0 ) {
      if ( evt.text.length > 0 ) {
        var feedbackTxt =  $.i18n( evt.text )
        var evtNo = pongLastFeedbackTxt.indexOf( feedbackTxt )
        pongLastFeedbackCnt[evtNo] = pongLastFeedbackCnt[evtNo] + 1
        pongLastFeedbackTim[evtNo] = new Date()
        moveToLastFeetback( evtNo )
      }
    } else {
      if ( evt.text.length > 0 ) {
        var feedbackTxt =  $.i18n( evt.text )
        
        pongLastFeedbackTxt.shift()
        pongLastFeedbackTxt.push( feedbackTxt )
        
        pongLastFeedbackCnt.shift()
        pongLastFeedbackCnt.push( 1 )

        pongLastFeedbackTim.shift()
        pongLastFeedbackTim.push( new Date() )
      }
    }
  } 
  updateFeedback()
}

function updateFeedback() {
  log( "pong-feedback", " updateFeedback " ) 
  var feedbackLog = ''
  var justNow = new Date()
  var col = '#000'
  for ( var i = pongLastFeedbacks-1; i >= 0; i-- ) {
    var deltaMS = justNow.getTime() - pongLastFeedbackTim[i].getTime()
    //log( "pong-feedback", deltaMS+' ms' )
    if ( deltaMS > 50000 ) {
      col = '#F0F0F0'
    } else if ( deltaMS > 40000 ) {
      col = '#BBB'
    } else if ( deltaMS > 30000 ) {
      col = '#999'
    } else if ( deltaMS > 20000 ) {
      col = '#666'
    } else if ( deltaMS > 10000 ) {
      col = '#333'
    }  
    if ( pongLastFeedbackCnt[i] == 1 ) {
      feedbackLog += '<span style="color:'+col+'">' + pongLastFeedbackTxt[i] + '</span><br>'
    } else {
      feedbackLog += '<span style="color:'+col+'">' + pongLastFeedbackTxt[i] + ' ['+ pongLastFeedbackCnt[i] +']</span><br>'
    }
  }
  $( '.pong-feedback' ).html( feedbackLog ) 
  log( "pong-feedback", "updateFeedback done" )
}

function moveToLastFeetback( evtNo ) {
  if ( evtNo != pongLastFeedbacks-1 ) {
    arraymove( pongLastFeedbackTxt, evtNo, pongLastFeedbacks-1 );
    arraymove( pongLastFeedbackCnt, evtNo, pongLastFeedbacks-1 );
    arraymove( pongLastFeedbackTim, evtNo, pongLastFeedbacks-1 );          
  }  
}
 
function arraymove(arr, fromIndex, toIndex) {
  var element = arr[fromIndex];
  arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, element);
}