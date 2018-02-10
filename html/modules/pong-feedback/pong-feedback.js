/*
The MIT License (MIT)

Copyright (c) 2018 Markus Harms, ma@mh-svr.de

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


var pongLastFeedbacks = 3;
var pongLastFeedbackTxt = []
var pongLastFeedbackCnt = []
var pongLastFeedbackTim = []
var pongFeedbackFadeout = 5000


//======= Code for "loadResourcesHtml" hook ================================================
function pongFeedbackHTML( divId, resourceURL, paramObj ) {
  log( "pong-feedback", "divId="+divId  );
  $( "#"+divId ).html( '<div id="'+divId+'" class="pong-feedback"></div>' );
  for ( var i=0; i < pongLastFeedbacks; i++ ) {
    pongLastFeedbackTxt.push( ' ' );
    pongLastFeedbackCnt.push( 1 );
    pongLastFeedbackTim.push( new Date() )
  }
  log( "pong-feedback", "broker.subscribe(...) ");
  subscribeEvent( 'feedback', feedbackEvtCallback ) 
  pongFeedbackFimerID = setInterval( "updateFeedback()", pongFeedbackFadeout );

  log( "pong-feedback", "divId="+divId+" end.");
}

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
  var feedbackLog = ''
  var justNow = new Date()
  var col = 'feedback100'
  var fadeOutCnt = 0;
  for ( var i = pongLastFeedbacks-1; i >= 0; i-- ) {
    var deltaMS = justNow.getTime() - pongLastFeedbackTim[i].getTime()
    //log( "pong-feedback", deltaMS+' ms' )
    if ( deltaMS > pongFeedbackFadeout * 10  ) {
      col = 'feedback000' 
      fadeOutCnt++
    } else if ( deltaMS > pongFeedbackFadeout * 9 ) {
      col = 'feedback010'
    } else if ( deltaMS > pongFeedbackFadeout * 8 ) {
      col = 'feedback020'
    } else if ( deltaMS > pongFeedbackFadeout * 7 ) {
      col = 'feedback030'
    } else if ( deltaMS > pongFeedbackFadeout * 6 ) {
      col = 'feedback040'
    } else if ( deltaMS > pongFeedbackFadeout * 5 ) {
      col = 'feedback050'
    } else if ( deltaMS > pongFeedbackFadeout * 4 ) {
      col = 'feedback060'
    } else if ( deltaMS > pongFeedbackFadeout * 3 ) {
      col = 'feedback070'
    } else if ( deltaMS > pongFeedbackFadeout * 2 ) {
      col = 'feedback080'
    } else if ( deltaMS > pongFeedbackFadeout * 1 ) {
      col = 'feedback090'
    }  
    if ( pongLastFeedbackCnt[i] == 1 ) {
      feedbackLog += '<span class="'+col+'">' + pongLastFeedbackTxt[i] + '</span><br>'
    } else {
      feedbackLog += '<span class="'+col+'">' + pongLastFeedbackTxt[i] + ' ['+ pongLastFeedbackCnt[i] +']</span><br>'
    }
  }
  $( '.pong-feedback' ).html( feedbackLog )
  if ( fadeOutCnt == pongLastFeedbacks ) {
    log( "pong-feedback", "updateFeedback done" )
    $( ".pong-feedback" ).fadeOut( 500 )
  } else {
    $( ".pong-feedback" ).fadeIn( 100 )
  }
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