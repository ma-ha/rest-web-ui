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
log( "Pong-Form", "load module");

function pongFormDivHTML( divId, resourceURL, params ) {
  log( "Pong-Form",  "divId="+divId+" resourceURL="+resourceURL );

  if ( moduleConfig[ divId ] != null ) {
    moduleConfig[ divId ].resourceURL = resourceURL;
    pongFormRenderHTML( divId, resourceURL, params, moduleConfig[ divId ]  );
  } else {

    var metaURL =  resourceURL+"/pong-form";
    if ( params != null ) {
      if ( params.def != null ) {
        metaURL = resourceURL+"/"+params.def;
      }
    }
    // pass get params of page to module config loader call, to enable dynamic table columns
    if ( params.get != null ) {
      var first = true;
      for (var key in params.get) {
        metaURL += (first ? "?" :"&");
        metaURL += key + "=" + params.get[ key ];
        first = false;
      }
    }
    $.getJSON( metaURL, 
      function( pmd ) {
        moduleConfig[ divId ] = pmd;
        moduleConfig[ divId ].resourceURL = resourceURL;
        pongFormRenderHTML( divId, resourceURL, params, pmd );
      }
    ).fail(
        function() {
          publishEvent( 'feedback', {'text':'Form: Service offline?'} )
        }
    );          
  }  
}

var checkboxNames = [];
var checkboxVals = [];

function pongFormRenderHTML( divId, resourceURL, params, pmd ) {
  log( "Pong-Form", "start '"+pmd.description+"'");
  var contentItems = [];
  contentItems.push( '<div id="'+divId+'PongFormDiv" class="pongFormFrm">' );
  contentItems.push( '<form id="'+divId+'PongFormFrm">' );
  if ( pmd.label != null ) {        
    contentItems.push( '<fieldset>' );
    contentItems.push( '<legend>'+ $.i18n( pmd.label )  +'</legend>' );
  }
  var postLst = [];      
  var getLst = [];      
  var headerLst = [];
  checkboxNames = [];
  checkboxVals = [];
  var basicAuth = null;
  var radioNames = []
  log( "Pong-Form", "start fields" );
  if ( pmd.fieldGroups != null ) {
    for ( var i = 0; i < pmd.fieldGroups.length; i++ ) {
      contentItems.push( '<div class="pongFormInputGrp'+i+'">' );
      var grp = pmd.fieldGroups[i];
      if ( grp.fieldset != null ) {
        contentItems.push( '<fieldset>' );
        contentItems.push( '<legend>'+ $.i18n( grp.fieldset )  +'</legend>' );        
      }
      for ( var j = 0; j < grp.columns.length; j++ ) {
        contentItems.push( '<div class="pongFormInputCol pongFormInput'+divId+'Grp'+i+'Col'+j+'">' );
        var col = grp.columns[j];
        if ( col.fieldset != null ) {
          contentItems.push( '<fieldset>' );
          contentItems.push( '<legend>'+ $.i18n( col.fieldset )  +'</legend>' );        
        }
        for ( var k = 0; k < col.formFields.length; k++ ) {
          var field = col.formFields[k];
          contentItems = contentItems.concat( pongFormRenderField( divId, field, 'G'+i+'C'+j ) );
          if ( field.type == 'checkbox' ) {
            if ( field.name != null ) { // normal checkbox operation
              log( "Pong-Form", "checkbox "+field.name  );
              if ( ! checkboxNames.inArray( field.name ) ) {
                log( "Pong-Form", "checkboxNames "+field.name  );
  
                checkboxNames.push( field.name );               
                postLst.push( field.name+": checkboxVal('"+field.name+"' )" );          
              }
              checkboxVals.push( { "name":field.name, "val":field.value, "id":divId+field.id } );
            } else { // stand alone checkbox
              log( "Pong-Form", "stand alone checkbox "+field.id  );
              postLst.push( '"'+field.id+'"'+": $( '#"+divId+field.id+":checked' ).val()" );            
            }
            // TODO handle check boch with same name !!
            // postLst.push( field.id+": $( '#"+divId+field.id+":checked' ).val()" )            
          } else if ( field.type == 'radio' ) {

            if ( radioNames.indexOf( field.name ) == -1 ) {
              radioNames.push( field.name );
              
              postLst.push( '"'+field.name+'": $( "input[name=\''+field.name+'\']:checked" ).val()' );  
              getLst.push( field.name + '=" + $( "input[name=\''+field.name+'\']:checked" ).val() +"' ); 
              //console.log(  'data: { '+ postLst +' }' );
            }
          } else if ( field.type == "reCAPTCHA"  ) {
              // ignore
          } else if ( field.type != 'separator' && field.type != 'label' ) {
            
            // check if this is 1:1 for http header
            if ( field.request != null ) {
              if ( field.request == "header" || field.request == "header+param") {
                headerLst.push( '"'+field.id+'"'+", $( '#"+divId+field.id+"' ).val()" );
              } else if ( field.request == "substitute" && field.defaultVal != null ) {
                var x = field.defaultVal;
                for ( var kk = 0; kk < col.formFields.length; kk++ ) {
                  var fieldKK = col.formFields[kk];
                  if ( fieldKK.request != null && fieldKK.request == "variable" ) {
                    x = x.replace( "${"+fieldKK.id+"}", "$( '#"+divId+fieldKK.id+"' ).val()" );
                  }
                }
                log( "Pong-Form", field.id+"= "+x );
                postLst.push( '"'+field.id+'"'+": "+x );  
                //alert( JSON.stringify(x) );
                getLst.push( field.id + '='+x  );  
              } else if ( field.request == "variable"  ) {
                // ignore here
              } else {
                postLst.push( '"'+field.id+'"'+": $( '#"+divId+field.id+"' ).val()" );  
              }
              
            // but might be a basic auth
            } else if ( field.basicAuth != null ) {
              if ( field.basicAuth == "user" ) {
                if ( basicAuth == null ) { basicAuth = {}; }
                basicAuth.user = field.id;    
                //alert( "U" );
              } else if ( field.basicAuth == "user+field" ) {
                if ( basicAuth == null ) { basicAuth = {}; }
                basicAuth.user = field.id;    
                postLst.push( '"'+field.id+'"'+": $( '#"+divId+field.id+"' ).val()" );  
                getLst.push( field.id + '=" + $( "#'+divId+field.id+'" ).val() +"' );  
                //alert( "U+f" );
              } else if ( field.basicAuth == "password" ) {
                if ( basicAuth == null ) { basicAuth = {}; }
                basicAuth.password = field.id;
                //alert( "P" );
              } else if ( field.basicAuth == "password+field" ) {
                if ( basicAuth == null ) { basicAuth = {}; }
                basicAuth.password = field.id;
                postLst.push( '"'+field.id+'"'+": $( '#"+divId+field.id+"' ).val()" );  
                getLst.push( field.id + '=" + $( "#'+divId+field.id+'" ).val() +"' );  
                //alert( "P+F" );
              }
            // no: normal form field, add to post list
            } else {              
              postLst.push( '"'+field.id.replaceAll('.','*') +'"'+": $( '#"+divId+field.id.replaceAll('.','')+"' ).val()" );  
              getLst.push( field.id + '=" + $( "#'+divId+field.id+'" ).val() +"' );  
            }
          } 
        }
        if ( col.fieldset != null ) {
          contentItems.push( '</fieldset>' );
        }
        contentItems.push( '</div>' ); //pongFormInputGrpXColY  
      }
      if ( grp.fieldset != null ) {
        contentItems.push( '</fieldset>' );
      }
      if ( ! pmd.height || pmd.height == 'auto' ) { // otherwise div will have no height:
        contentItems.push( '<div class="pongFormInputGrp'+i+'Close pongFormInputGrpClose">&nbsp;</div>' );
      }
      contentItems.push( '</div>' ); //pongFormInputGrp
    }
  } else {
    log( "Pong-Form", "easy legacy two column form" );
    if ( pmd.formFields2 != null ) {
      log( "Pong-Form", "easy legacy two column form" );
      contentItems.push( '<div class="pongFormInput1">' );
      for ( var i = 0; i < pmd.formFields1.length; i++ ) {
        var field = pmd.formFields1[i];
        contentItems = contentItems.concat( pongFormRenderField( divId, field, 1 ) );
        postLst.push( '"'+field.id+'"'+": $( '#"+divId+field.id+"' ).val()" )
      }
      contentItems.push( '</div>' );        
    }
    if ( pmd.formFields2 != null ) {
      contentItems.push( '<div class="pongFormInput2">' );
      for ( var i = 0; i < pmd.formFields2.length; i++ ) {
        var field = pmd.formFields2[i];
        contentItems = contentItems.concat( pongFormRenderField( divId, field, 2 ) );
        postLst.push( '"'+field.id+'"'+": $( '#"+divId+field.id+"' ).val()" )
      }
      contentItems.push( '</div>' );            
    }     
  }
  
  //postLst.push( field.id+": $( '#"+divId+field.id+":checked' ).val()" );          

  
  log( "Pong-Form", "start actions");
  contentItems.push( '<div class="pongFormActions">' );
  var initData = null;
  if ( pmd.actions != null ) {
    for ( var i = 0; i < pmd.actions.length; i++ ) {
      var action = pmd.actions[i];
      if ( action.onInit != null ) {
        if ( action.onInit == 'GET' ) {
          initData = getUrlGETparams();
        } else {
          initData = action.onInit;          
        }
        //alert( "onInit GET: "+JSON.stringify( initData ) );  
      } else {
        contentItems = contentItems.concat( pongFormRenderAction( divId, action, postLst, getLst, headerLst, basicAuth ) );      
      }
    }    
  }
  // contentItems.push( '<div class="pongFormFrmField">' );
  
  contentItems.push( '</div>' );
  if ( ! pmd.height || pmd.height == 'auto' ) { // otherwise div will have no height:
    contentItems.push( '<div class="pongFormActionsClose">&nbsp;</div>' );
  }
  contentItems.push( '</form>' );
  if ( pmd.label != null ) {        
    contentItems.push( '</fieldset>' );
  }
  contentItems.push( '</div>' );

  // output
  $( "#"+divId ).html( contentItems.join( "\n" ) );

  if ( initData != null ) {
    pongFormUpdateData( divId, initData );
  } 
  log( "Pong-Form", "end.");
}


// select checkbox vals for GET/POST/...
function checkboxVal( name ) {
  log( "Pong-Form", "checkboxVal: "+name);
  var result = '[';
  var first = true;
  for ( var i = 0; i < checkboxVals.length; i++ ) {
    if ( checkboxVals[i].name == name  ) {
      if ( $( "#"+checkboxVals[i].id ).is(':checked') ) {
        if ( ! first ) { result += ','; }
        result += "'"+checkboxVals[i].val+"'";
        log( "Pong-Form", " val= "+checkboxVals[i].val);

        first = false;
      }
    }
  }
  result += ']';
  return result;
}


function pongFormPostDta( dataFlat ) {
  let data = {};
  for ( let key in dataFlat ) {
    pongFormSetKey( data, key, dataFlat[ key ] )
  }
  return data;
}

function pongFormSetKey( data, key, val ) {
  if ( key.indexOf('*') == -1 ) {
    data[ key ] = val;
  } else {
    let hiera = key.split('*');
    let key0 = hiera.shift()
    if ( ! data[ key0 ] ) { data[ key0 ] = {}; }
    let hiera1 = hiera.join('*')
    pongFormSetKey( data[ key0 ], hiera1, val );
  }
}


function pongFormRenderAction( divId, action, postLst, getLst, headerLst, basicAuth ) {
  log( "Pong-Form", "action '"+action.actionName+"'");
  // console.log( 'postLst' );
  // console.log( postLst );
  var contentItems = [];
  var method = "POST";
  var def = moduleConfig[ divId ];

  if ( action.method != null ) { method = action.method; }

  var active = ""
  if ( action.enabled != null && ( action.enabled === "false" ||  action.enabled === false ) ) {
     active = ' disabled="disabled"'
  }

  if ( action.onChange != null ) { // no button, but a onChange event is done for the form

    var onChngSelector = '.'+divId+'PongFormField';
    if ( action.onChange != "*" ) {
      //log( "Pong-Form", "action.onChange: "+ action.onChange );
      
      var onCngElements = action.onChange.splitCSV();
      //log( "Pong-Form", "onCngElements= "+ onCngElements.join('|') );
      onChngSelector = '';
      for ( var i = 0; i < onCngElements.length; i++ ) {
        if ( i != 0 ) { onChngSelector += ', '; } 
        onChngSelector += '#'+divId+onCngElements[i];
      }
    }

    log( "Pong-Form", "selector: "+ onChngSelector );
    if ( action.actionURL != null ) {
      
      // do a aAJAX call on a change field event
      contentItems.push( '<script>' );
      contentItems.push( '  $( function() { ' );
      contentItems.push( '       $( "' +onChngSelector+ '" ).change(' );
      contentItems.push( '          function() { ' );
      contentItems.push( '              $("body").addClass("waiting"); ' ); 
      contentItems.push( '              var postData = pongFormPostDta( { '+ postLst +' } );' );
      contentItems.push( '              var actionUrl = parsePlaceHolders( "'+divId+'", "'+action.actionURL+'" );' ); // TODO check docu
      contentItems.push( '              $.ajax( ' );
      contentItems.push( '                 { url: actionUrl, type: "'+method+'", dataType: "json", ' );
      //alert ('headerLst.length '+headerLst.length );
      contentItems.push( '                        beforeSend: function (request) { ' );
      if ( action.oauth_scope != null ) {
        contentItems.push( '                          if ( sessionInfo["OAuth"]["access_token"] != null && sessionInfo["OAuth"]["access_token"] != "" ) {');
        contentItems.push( '                             request.setRequestHeader( "Authorization", "Bearer "+sessionInfo["OAuth"]["access_token"] ); } ');
      }
      if ( headerLst.length != 0 ) { 
        for ( var i = 0; i < headerLst.length; i++ ) {
          contentItems.push( '                           request.setRequestHeader( ' +headerLst[i]+ ');   ');
        }
      }
      contentItems.push( '                   },');
      contentItems.push( '                   data: postData' );
      contentItems.push( '              } ).done(  ' );
      contentItems.push( '                 function( dta ) { ' );
      if ( action.target != null ) {
        contentItems.push( '                       $( "#'+action.target+'Content" ).html( dta );  ' );            
      }
      if ( ( action.update != null ) && ( action.update.length != null ) ) {
        for ( var i = 0; i < action.update.length; i++ ) {
          //contentItems.push( '                   udateModuleData( "'+action.update[i].resId+'Content", { "'+def.id+'": $( "#'+divId+def.id+'" ).val() } );' );
          contentItems.push( '                   udateModuleData( "'+action.update[i].resId+'Content", { '+postLst+' } );' );          
        }
      }
      contentItems.push( '                       $("body").removeClass("waiting"); ' ); 
      contentItems.push( '                       return false;' ); 
      contentItems.push( '                  }  ' );
      contentItems.push( '              ).error( function( jqXHR, textStatus, errorThrown) { ' ); 
      contentItems.push( '                  $("body").removeClass("waiting"); ' ); 
      contentItems.push( '                  alert( textStatus+": "+jqXHR.responseText ); ' ); 
      contentItems.push( '              }); ');
      contentItems.push( '              return false;' ); 
      contentItems.push( '          }' );
      contentItems.push( '       ); ' );
      contentItems.push( '  } ); ' );
      contentItems.push( '</script>' );
      
    } else if ( ( action.update != null ) && ( action.update.length != null ) ) {
      
      contentItems.push( '<script>' );
      contentItems.push( '  $( function() { ' );
      contentItems.push( '       $( "' +onChngSelector+ '" ).change(' );
      contentItems.push( '          function() { ' );
      for ( var i = 0; i < action.update.length; i++ ) {
        //contentItems.push( '             udateModuleData( "'+action.update[i].resId+'Content", { "'+def.id+'": $( "#'+divId+def.id+'" ).val() } );' );
        contentItems.push( '                   udateModuleData( "'+action.update[i].resId+'Content", { '+postLst+' } );' );          

      }
      contentItems.push( '              return false;' ); 
      contentItems.push( '          }' );
      contentItems.push( '       ); ' );
      contentItems.push( '  } ); ' );
      contentItems.push( '</script>' );
      
    }  
    
  } else if ( ( action.updateButton != null ) && ( action.updateButton.length != null ) ) {

    contentItems.push( '<button id="'+divId+'Bt'+action.id+'" '+active+'>'+  $.i18n( action.name ) +'</button>' );
    contentItems.push( '<script>' );
    contentItems.push( '  $(function() { ' );
    contentItems.push( '       $( "#'+divId+'Bt'+action.id+'" ).click(' );
    contentItems.push( '          function() { ' );
    for ( var i = 0; i < action.updateButton.length; i++ ) {
      contentItems.push( '                   udateModuleData( "'+action.updateButton[i].resId+'Content", { '+postLst+' } );' );  
    }
    contentItems.push( '              return false;' ); 
    contentItems.push( '          }' );
    contentItems.push( '       ); ' );
    contentItems.push( '  } ); ' );
    contentItems.push( '</script>' );
    
  } else if ( action.afterUpdate != null ) {
    // do nothing
    
  } else if ( action.link != null && action.linkURL != null ) { // simple link with id-field as GET parameter
    log( "Pong-Form", "link: "+ action.id );

    var target = "_blank";
    if ( action.target == null ) {
      target = "_blank";
    } else if ( action.target == '_parent' ) {
      target = "_parent";
    } else if ( action.target == '_blank' ) {
      target = "_blank";
    } else if ( action.target == '_self' ) {
      target = "_self";
    } 
    var url = action.linkURL;
    // TODO: must be on change
    
    if ( action.getParams != null ) {
      for ( var i = 0; i < action.getParams.length; i++ ) {
        contentItems.push( '<script>' );
        contentItems.push( '  $(function() { ' );
        contentItems.push( '       $( "#'+divId+action.getParams[i]+'" ).on( "change", ' );
        contentItems.push( '         function() { ' );
        contentItems.push( '            var url = "'+action.linkURL+'"; ' );
        for ( var j = 0; j < action.getParams.length; j++ ) {
          contentItems.push( '            url +=  ( ( url.indexOf("?") > -1 ) ? "&" : "?" );' );
          var valStr = '"#'+ divId + action.getParams[j] +'"';
          contentItems.push( '            url += "'+action.getParams[j]+'="+ $( '+valStr+' ).val();' );
        }
        contentItems.push( '            $( "#'+divId+'Lnk'+action.id+'" ).attr( "href", url );' );
        contentItems.push( '         } ' );
        contentItems.push( '       );   ' );
        contentItems.push( '  } ); ' );
        contentItems.push( '</script>' );
        // url +=  ( ( url.indexOf('?') > -1 ) ? '&' : '?' );
        // url += '"'+action.getParams[i]+'"='+"$( '#"+divId+action.getParams[i]+"' ).val()";        
      }  
      
    }
    
    log( "Pong-Form", "   url= "+ url );
    //alert( url );
    
    contentItems.push( '<a href="'+url+'" id="'+divId+'Lnk'+action.id+'" target="'+target+'">'+  $.i18n( action.link ) +'</a>' );      
    
  } else if ( action.modalQuestion != null ) { // normal button action + modal dialog "Do you really ...?"
    contentItems.push( '<button id="'+divId+'Bt'+action.id+'" '+active+'>'+  $.i18n( action.actionName ) +'</button>' );
    contentItems.push( '<div id="'+divId+'ModalDlg'+action.id+'">'+$.i18n( action.modalQuestion )+'</div>' );  
    contentItems.push( '<script>' );
    contentItems.push( '  $(function() { ' );
    contentItems.push( '    $( "#'+divId+'ModalDlg'+action.id+'" ).dialog({ ' );
    contentItems.push( '      autoOpen: false, modal: true,' ); 
    contentItems.push( '      buttons: {' ); 
    contentItems.push( '        Cancel: function() { $( this ).dialog( "close" ); },' ); 
    contentItems.push( '        "'+$.i18n( action.actionName )+'": function() {' ); 
    if ( ( action.dataEncoding != null ) || ( action.dataEncoding == "GETstyle")  ) { // funny request, but some standard
      contentItems.push( '            var frmData = getGeDta( "'+getLst.join("&")+'" ) ' );
    } else { // default: JSON data encoding
      contentItems.push( '            var frmData = getPostDta( {'+postLst+'} ) ' );
    }
    contentItems.push( '            pongFrmActionBtn( "'+divId+'", "'+method+'", frmData, '+JSON.stringify(action)+', { '+postLst+' }, '+JSON.stringify(headerLst)+', '+JSON.stringify(basicAuth)+' ); ' );    
    contentItems.push( '            $( "#'+divId+'ModalDlg'+action.id+'" ).dialog( "close" );' );
    contentItems.push( '        },' ); 
    contentItems.push( '      } ' ); 
    contentItems.push( '    }); ' );
    contentItems.push( '    $( "#'+divId+'Bt'+action.id+'" ).click( function(e) { ' ); 
    contentItems.push( '      try{ if ( ! jQuery("#'+divId+'PongFormFrm")[0].checkValidity() ) { return; } } catch(exc){}');
    contentItems.push( '      $( "#'+divId+'ModalDlg'+action.id+'" ).dialog( "open" );' );
    contentItems.push( '      return false;' );
    contentItems.push( '    });' );
    contentItems.push( '  }); ' );
    contentItems.push( '</script>' );
    
  } else if ( action.actionName != null ) { // normal button action
  
    log( "Pong-Form", "action: "+ action.id );
    // render a button
    contentItems.push( '<button id="'+divId+'Bt'+action.id+'" '+active+'>'+  $.i18n( action.actionName ) +'</button>' );
    contentItems.push( '<script>' );
    contentItems.push( '  $(function() { ' );
    contentItems.push( '       $( "#'+divId+'Bt'+action.id+'" ).click(' );
    contentItems.push( '          function(e) { ' );    
    if ( ( action.dataEncoding != null ) || ( action.dataEncoding == "GETstyle")  ) { // funny request, but some standard
      contentItems.push( '            var frmData = getGeDta( "'+getLst.join("&")+'" ) ' );
    } else { // default: JSON data encoding
      contentItems.push( '            var frmData = getPostDta( {'+postLst+'} ) ' );
    }
    contentItems.push( '            pongFrmActionBtn( "'+divId+'", "'+method+'", frmData, '+JSON.stringify(action)+', { '+postLst+' }, '+JSON.stringify(headerLst)+', '+JSON.stringify(basicAuth)+' ); ' );    
    // contentItems.push( '              try{ if ( ! jQuery("#'+divId+'PongFormFrm")[0].checkValidity() ) { return; } }catch(exc){}');
    // contentItems.push( '              $("body").addClass("waiting"); ' ); 
    // contentItems.push( '              var actionUrl = parsePlaceHolders( "'+divId+'", "'+action.actionURL+'" );' );
    // contentItems.push( '              var request = $.ajax( { url: actionUrl, type: "'+method+'", ' );
    // contentItems.push( '                       crossDomain: true, ' );
    // contentItems.push( '                        beforeSend: function ( request ) { ' );
    // if ( basicAuth != null ) {
    // //  alert()
    //   var basicAuthStr = 'btoa( $( "#'+divId+basicAuth.user+'" ).val() + ":" + $( "#'+divId+basicAuth.password+'" ).val() )';
    //   contentItems.push( '                           request.setRequestHeader( "Authorization", "Basic "+'+basicAuthStr+' );' );
    // } else 
    // if ( action.oauth_scope != null ) {
    //   contentItems.push( '                             if ( sessionInfo["OAuth"]["access_token"] != null && sessionInfo["OAuth"]["access_token"] != "" ) {');
    //   contentItems.push( '                                  request.setRequestHeader( "Authorization", "Bearer "+sessionInfo["OAuth"]["access_token"] ); ');
    //   contentItems.push( '                                  request.setRequestHeader( "oauth-token", sessionInfo["OAuth"]["access_token"] ); '); // huuhaaaaa SugarCRM special -- hope it won't hurt elsewhere!!
    //   contentItems.push( '                              } ');
    // }
    // for ( var i = 0; i < headerLst.length; i++ ) {
    //   contentItems.push( '                              request.setRequestHeader( ' +headerLst[i] + '); ');
    // }
    // contentItems.push( '                        },' )
    // if ( ( action.dataEncoding != null ) || ( action.dataEncoding == "GETstyle")  ) { // funny request, but some standard
    //   var dataStr = "";
    //   dataStr = getLst.join("&");
    //   contentItems.push( '                       data: getGeDta( "'+getLst.join("&")+'" ) ' );
    // } else { // default: JSON data encoding
    //   contentItems.push( '                 data: getPostDta( {'+postLst+'} ) ' );
    // }
    // //contentItems.push( '                     xhr: function() {return new window.XMLHttpRequest({mozSystem: true});}, beforeSend: function(xhr){  xhr.withCredentials = true; } ');
    // contentItems.push( '              } ).done(  ' );
    // contentItems.push( '                 function( dta ) {' );
    // contentItems.push( '                    $("body").removeClass("waiting"); ' ); 
    // contentItems.push( '                    publishEvent( "feedback", { text:"Form data send"} );' );
    // contentItems.push( '                    if ( dta != null && ( dta.error != null || dta.error_message != null ) ) {  alert( "ERROR: "+ dta.error +": "+ dta.error_message );}   ' );
    // if ( action.target != null ) {
    //   if ( action.target == '_parent' ) {
    //     contentItems.push( '                       window.location.replace( dta );');
    //   } else if ( action.target == '_blank' ) {
    //     contentItems.push( '                       window.open( dta );');
    //   } else if ( action.target == 'modal' ) {
    //     contentItems.push( '                       alert( $.i18n( dta ) );  ' );
    //     if ( action.navto ) {
    //       contentItems.push( '                       window.location.replace( "'+action.navto +'" ); ' );
    //     }
    //   } else {
    //     contentItems.push( '                       $( "#'+action.target+'Content" ).html( dta );  ' );
    //   }
    // }
    // if ( ( action.update != null ) && ( action.update.length != null ) ) {
    //   for ( var i = 0; i < action.update.length; i++ ) {
    //     //contentItems.push( '                   udateModuleData( "'+action.update[i].resId+'Content", { "'+def.id+'": $( "#'+divId+def.id+'" ).val() } );' );          
    //     contentItems.push( '                   udateModuleData( "'+action.update[i].resId+'Content", { '+postLst+' } );' );          
    //   }
    // }
    // if ( ( action.setData != null ) && ( action.setData.length != null ) ) {
    //   for ( var i = 0; i < action.setData.length; i++ ) {
    //     log( "Pong-Form", "action: "+ action.id + " setResponse hook "+action.setData[i].resId );
    //     if ( action.setData[i].dataDocSubPath != null ) {
    //       contentItems.push( '                   setModuleData( "'+action.setData[i].resId+'Content", dta, "'+action.setData[i].dataDocSubPath+'" );' );                    
    //     } else {
    //       contentItems.push( '                   setModuleData( "'+action.setData[i].resId+'Content", dta, null );' );                  
    //     }
    //   }      
    // }
    // contentItems.push( '                       return false;' ); 
    // contentItems.push( '                  }  ' );
    // contentItems.push( '              ).error( function( jqXHR, textStatus, errorThrown) {' ); 
    // contentItems.push( '                   $("body").removeClass("waiting"); ' ); 
    // contentItems.push( '                   alert( textStatus+": "+jqXHR.responseText ); ' ); 
    // contentItems.push( '              }); ');

    // if ( action.target == 'modal' ) {
    //   contentItems.push( '            request.fail(  function(jqXHR, textStatus) { ' ); 
    //   contentItems.push( '                   $("body").removeClass("waiting"); ' ); 
    //   contentItems.push( '                   alert( "Failed: "+textStatus );' ); 
    //   contentItems.push( '            });' );
    // }    

    contentItems.push( '              return false;' ); 
    contentItems.push( '          }' );
    contentItems.push( '       ); ' );
    contentItems.push( '  }); ' );
    contentItems.push( '</script>' );

  }
  return contentItems;
}

function pongFrmActionBtn( divId, method, theDataFlat, action, postLst, headerLst, basicAuth ) {
  // console.log( divId )
  // console.log( method )
  var theData = pongFormPostDta( theDataFlat );
  // console.log( '>>theData>>>>>>',theData )
  // console.log( action )
  // console.log( postLst )
  // console.log( headerLst )
  // console.log( basicAuth )
  try { if ( !jQuery( "#"+divId+"PongFormFrm" )[ 0 ].checkValidity() ) { return; } } catch ( exc ) { }
  $( "body" ).addClass( "waiting" );
  var actionUrl = parsePlaceHolders( divId, action.actionURL );
    var request = $.ajax({
    url: actionUrl, 
    type: method,
    crossDomain: true,
    beforeSend: function ( request ) {
      if ( basicAuth != null ) {
      //  alert()
        var basicAuthStr = btoa( $( "#"+divId+basicAuth.user ).val() + ":" + $( '#'+divId+basicAuth.password ).val() );
        request.setRequestHeader( "Authorization", "Basic "+basicAuthStr );
      } else if ( action.oauth_scope != null ) {
        if ( sessionInfo[ "OAuth" ][ "access_token" ] != null && sessionInfo[ "OAuth" ][ "access_token" ] != "" ) {
          request.setRequestHeader( "Authorization", "Bearer " + sessionInfo[ "OAuth" ][ "access_token" ] );
          request.setRequestHeader( "oauth-token", sessionInfo[ "OAuth" ][ "access_token" ] );  // huuhaaaaa SugarCRM special -- hope it won't hurt elsewhere!!
        } 
      }
      for ( var i = 0; i < headerLst.length; i++ ) {
        request.setRequestHeader( headerLst[i] );
      }
    },
    data: theData
    // ,xhr: function() {return new window.XMLHttpRequest({mozSystem: true});}, beforeSend: function(xhr){  xhr.withCredentials = true; } 
  }).done( function( dta, status ) {
    $("body").removeClass("waiting");  
    publishEvent( "feedback", { text:"Form data send"} );
    if ( dta != null && ( dta.error != null || dta.error_message != null ) ) {  
      alert( "ERROR: "+ dta.error +": "+ dta.error_message );
    }   
    if ( action.target != null ) {
      if ( action.target == '_parent' ) {
        window.location.replace( dta );
      } else if ( action.target == '_blank' ) {
        window.open( dta );
      } else if ( action.target == 'modal' ) {
        if ( typeof variable === 'string' ) {
          alert( $.i18n( dta ) );
        } else {
          let dtaStr = JSON.stringify( dta )
          alert( dtaStr );  
        }
        if ( action.navto ) {
          window.location.replace( action.navto );
        }
      } else if ( action.target == 'modalstatus' ) {
        alert( $.i18n( status ) );  
        if ( action.navto ) {
          window.location.replace( action.navto );
        }
      } else {
        $( '#'+action.target+'Content' ).html( dta );  
      }
    }
    if ( ( action.update != null ) && ( action.update.length != null ) ) {
      for ( var i = 0; i < action.update.length; i++ ) {
        udateModuleData( action.update[i].resId+'Content', postLst ); 
      }
    }
    if ( ( action.setData != null ) && ( action.setData.length != null ) ) {
      for ( var i = 0; i < action.setData.length; i++ ) {
        log( "Pong-Form", "action: "+ action.id + " setResponse hook "+action.setData[i].resId );
        if ( action.setData[i].dataDocSubPath != null ) {
          setModuleData( action.setData[i].resId+'Content', dta, action.setData[i].dataDocSubPath );                    
        } else {
          setModuleData( action.setData[i].resId+'Content', dta, null );                  
        }
      }      
    }
    return false; 
  }).error( function( jqXHR, textStatus, errorThrown) { 
    $("body").removeClass("waiting");  
    alert( textStatus+": "+jqXHR.responseText );  
  }); 

  if ( action.target == 'modal' ) {
    request.fail(  function(jqXHR, textStatus) {  
      $("body").removeClass("waiting");
      alert( "Failed: "+textStatus ); 
    });
  }
}


function getPostDta( postLst )  {
  var data = JSON.parse( JSON.stringify( postLst ) );
  //alert( data )
  try { 
    if ( grecaptcha ) {
      data[ "g-recaptcha-response" ] = grecaptcha.getResponse();  
    }
  } catch(e) {}; 
  //alert( data )
  return data;
}

function getGeDta( getLst ) {
  var dataStr = getLst;
  try { 
    if ( grecaptcha ) {
       if ( dataStr !== '' ) dataStr += '&';
       dataStr += 'g-recaptcha-response=' + grecaptcha.getResponse() ;
    } 
  } catch(e) {};   
  return dataStr;
}

/** replaces ${xyz} in str by the value of the input text field with ID xyz */
function parsePlaceHolders( divId, str ) {
  //TODO
  var pmd = moduleConfig[ divId ];
  log( "Pong-Form",  "Start value: "+ str );
  if ( pmd.fieldGroups != null ) {
    for ( var i = 0; i < pmd.fieldGroups.length; i++ ) {
      var grp = pmd.fieldGroups[i];
      for ( var j = 0; j < grp.columns.length; j++ ) {
        var col = grp.columns[j];
        for ( var k = 0; k < col.formFields.length; k++ ) {
          var field = col.formFields[k];
          if ( field.type == 'text' ) {
            str = str.replace( '${'+field.id+'}', $( '#'+divId+field.id ).val() );
          }
        }
      }
    }
  }
  log( "Pong-Form", "Processed value: "+ str );
  return str;
}

/*
function createCORSRequest(method, url){
    var xhr = new XMLHttpRequest({mozSystem: true});
    if ("withCredentials" in xhr){
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined"){
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        xhr = null;
    }
    return xhr;
}
*/
function pongFormUpdateData( divId, paramsObj ) {
  log( "Pong-Form",  'update '+divId );
  var def = moduleConfig[ divId ];
  log( "Pong-Form", JSON.stringify( def ) );
  if ( def.resourceURL != null ) {
    $.getJSON( 
        def.resourceURL, 
        paramsObj,
        function( data ) {   
          //salert( data );
          publishEvent( "feedback", { text:"Form data updated"} );
          pongFormSetData( divId, data );
//          if ( def.dataDocSubPath == null ) {
//            // table is the root of the doc
//            log( "Pong-Form",  'no tbl.dataDocSubPath' );
//            // TODO add update code
//            //alert( "Update form with dataDocSubPath..." );
//            pongFormUpdateFieldsData( divId, data ); 
//          } else {
//            log( "Pong-Form",  'tbl.dataDocSubPath='+def.dataDocSubPath );
//            // table is somewhere in the DOM tree
//            var pathToken = def.dataDocSubPath.split('.');
//            log( "Pong-Form",  'pathToken[0] ' + pathToken[0] );
//            var subdata = data[ pathToken[0] ];
//            for ( i = 1; i < pathToken.length; i++ ) {
//              log( "Pong-Form", 'pathToken['+i+'] ' + pathToken[i] );  
//              subdata = subdata[ pathToken[i] ];
//            }
//            // console.log( ' subdata = ' + JSON.stringify( subdata ) );
//            //poList[ divId ].pongListData = subdata;
//            // TODO add update code
//            //alert( "Update form w/o dataDocSubPath..." );
//            pongFormUpdateFieldsData( divId, subdata ); 
//          }
          
          // for cascading update config: afterUpdate
          if ( def.actions != null ) {
            for ( var i = 0; i < def.actions.length; i++ ) {
              var action = def.actions[i];
              if ( action.afterUpdate != null ) {
                if ( action.update != null ) {
                  for ( var i = 0; i < action.update.length; i++ ) {
                    //alert( "afterUpdte > update "+action.update[i].resId );
                    udateModuleData( action.update[i].resId+'Content', paramsObj );
                  }
                }
              }
            }
          }
          
        } 
    );      
  } else {
    alert( "No Update!!" );
  }
}

/** hook and used by update hook */
function pongFormSetData( divId, data ) {
  log( "Pong-Form",  'set data hook: '+divId );
  var def = moduleConfig[ divId ];
  if ( def.dataDocSubPath == null ) {
    // table is the root of the doc
    log( "Pong-Form",  'no tbl.dataDocSubPath' );
    // TODO add update code
    //alert( "Update form with dataDocSubPath..." );
    pongFormUpdateFieldsData( divId, moduleConfig[ divId ], data ); 
  } else {
    log( "Pong-Form",  'tbl.dataDocSubPath='+def.dataDocSubPath );
    // table is somewhere in the DOM tree
    var pathToken = def.dataDocSubPath.split('.');
    log( "Pong-Form",  'pathToken[0] ' + pathToken[0] );
    var subdata = data[ pathToken[0] ];
    for ( var i = 1; i < pathToken.length; i++ ) {
      log( "Pong-Form", 'pathToken['+i+'] ' + pathToken[i] );  
      subdata = subdata[ pathToken[i] ];
    }
    log( "Pong-Form", ' subdata = ' + JSON.stringify( subdata ) );
    //poList[ divId ].pongListData = subdata;
    // TODO add update code
    //alert( "Update form w/o dataDocSubPath..." );
    pongFormUpdateFieldsData( divId, moduleConfig[ divId ], subdata ); 
  }
}


function pongFormUpdateFieldsData( divId, pmd, dta ) {
  log( "Pong-Form",  'pongFormUpdateFieldsData: DIV='+divId );
  if ( pmd.fieldGroups != null ) {
    for ( var i = 0; i < pmd.fieldGroups.length; i++ ) {
      var grp = pmd.fieldGroups[i];
      for ( var j = 0; j < grp.columns.length; j++ ) {
        var col = grp.columns[j];
        for ( var k = 0; k < col.formFields.length; k++ ) {
          var field = col.formFields[k];
          var fieldId = '#'+divId+field.id; 
          if ( ( field.type == "text" )  || ( field.type == "password" ) || ( field.type == "secret" ) || 
               ( field.type == "email" ) || ( field.type == "color" ) ) {
            log( "Pong-Form",  'pongFormUpdateFieldsData text: '+field.id+' '+dta[field.id] );
            if ( dta[field.id] != null ) {
              $( fieldId ).val( dta[field.id] );              
            } else if ( field.map != null &&  dta[ field.map ] != null ) { 
              $( fieldId ).val( dta[ field.map ] );              
            } else {
              $( fieldId ).val( "" );
            }
          } else if ( field.type == "checkbox" ) {
            if ( dta[field.id]  ) {
              $( fieldId ).prop('checked', true);
            } else {
              $( fieldId ).prop('checked', false);
            }
            //TODO update checkbox value with name
          } else if ( field.type == "checkboxList" ) {
            if ( dta[field.id]  ) {
              $( fieldId ).prop('checked', true);
            } else {
              $( fieldId ).prop('checked', false);
            }
            //TODO update checkboxList value with name
          } else if ( field.type == "select" ) {
            log( "Pong-Form",  'pongFormUpdateFieldsData select: '+field.id+' '+dta[field.id] );
            if ( dta[field.id] != null ) {
              $( fieldId ).val( dta[field.id] );              
            }else {
              $( fieldId ).val( -1 );
            }
            //TODO update select value

          } else if ( field.type == "label" ) {
            if ( dta[field.id] ) {
              $( fieldId ).html( $.i18n( dta[field.id] ) )
            }
          } else if ( field.type == "link" ) {
            if ( dta[field.id] ) {
              $( fieldId ).attr( "href", $.i18n( dta[field.id] ) );
            }
          } else if ( field.type == "date" ) {
            if ( dta[field.id] != null ) {
              $( fieldId ).datepicker( 'setDate', new Date( dta[field.id] ) );
            } else {
              $( fieldId ).datepicker( 'setDate', '' );
            }
          } else {
            log( "Pong-Form", "ERROR '"+field.id+"': Can't update "+field.type);
          }

          //alert("trigger change: "+fieldId );
          $( fieldId ).trigger( "change" ); 
        }
      }
    }
  }
} 


function pongFormRenderField( divId, field, col ) {
  log( "Pong-Form", "field '"+field.id+"' ("+ field.type+")");
  var contentItems = [];
  if ( field.id ) {
    contentItems.push( '<div id="'+divId+field.id+'Div" class="pongFormField pongFormField'+col+'">' );
  } else {
    contentItems.push( '<div class="pongFormField pongFormField'+col+'">' );
  }
  
  if ( field.type == "separator" ) {

    contentItems.push( '<hr/>' );
    
  } else if ( field.type == "label" ) {

    contentItems.push( '<span id="'+divId+field.id+'" class="pongFormLabelField">'+$.i18n( field.label )+'</span>' );
      
  } else if ( field.type == "js" && field.js ) {

    contentItems.push( '<script>' );
    contentItems.push( ' $( function() { ' );
    contentItems.push( field.js );
    contentItems.push(  '})' ); 
    contentItems.push( '</script>' );

  } else if ( field.type == "js" && field.jsURL ) {

    $.getScript( field.jsURL );
    // $.ajaxSetup({'async': false, headers: headers });
    // $.get( 
    //     field.jsURL, 
    //     getUrlGETparams(),
    //     function( jsCode ) {
    //       alert( jsCode );
    //       contentItems.push( '<script>' );
    //       contentItems.push( ' $( function() { ' );
    //       contentItems.push( jsCode );
    //       contentItems.push(  '})' ); 
    //       contentItems.push( '</script>' ); 
    //     }
    //   );
    // $.ajaxSetup({'async': true, headers: headers });

  } else {
    
    var title      = ""; if ( field.descr != null ) { title = ' title="'+field.descr+'" '; }
    var defaultVal  = ""; 
    if ( field.defaultVal != null ) { defaultVal = ' value="'+field.defaultVal+'" '; }
    if ( field.value != null      ) { defaultVal = ' value="'+field.value+'" '; }
    if ( field.default != null    ) { defaultVal = ' value="'+field.default+'" '; }

    var uiRO = ''
    var modifier = '';
    if (  field.disabled != null && ( field.disabled === true  || field.disabled == 'true' ) ) { 
      uiRO     =  ' ui-disabled ';
      modifier = ' disabled="disabled" '; 
    }
    if (  field.readonly != null && ( field.readonly === true  || field.readonly == 'true' ) ) { 
      uiRO     =  ' ui-disabled ';
      modifier += ' readonly '; 
    }
    let qr = '';
    if ( field.qr ) { qr = ' qr ' }
    var nameAndClass = 'id="'+divId+field.id.replaceAll('.','')+'" class="text ui-widget-content ui-corner-all '+uiRO+qr+divId+'PongFormField"'; 
    if ( field.type == "checkbox"  && field.name != null ) {
      nameAndClass = 'name="'+field.name+'" ' + nameAndClass; 
    } if ( field.type == "secret" ) {
      nameAndClass = 'name="'+field.name+'" ' + nameAndClass.replace('class="text', 'class="text secret'); 
    } else {
      nameAndClass = 'name="'+field.id+'" ' + nameAndClass;       
    }

    // TODO: How to validate form in ajax style
    if (  field.required != null && ( field.required === true  || field.required == 'true' ) ) { 
      modifier += ' required="required"' 
    }
    if ( field.regExp ) {
      modifier += ' pattern="'+field.regExp +'"'
    }

    if (  field.hidden != null  && ( field.hidden === true  || field.hidden == 'true' ) ) { 
      //nameAndClass += ''; 
    } else {
      contentItems.push( '<p>' );
      if ( field.label != null && field.label != '' ) {
        contentItems.push( '<label for="'+divId+field.id+'">'+ $.i18n( field.label ) +'</label>' ); 
      } else if ( field.type == "radio" ) {       
        contentItems.push( '<label for="'+divId+field.id+'">'+ $.i18n( field.value ) +'</label>' ); 
      } else {
        contentItems.push( '<label for="'+divId+field.id+'"></label>' );                
      }
    }
    
    if (  field.hidden != null  && ( field.hidden === true  || field.hidden == 'true' ) ) { 
      contentItems.push( '<input '+nameAndClass+' type="hidden" value="'+field.value+'"/>' );
    } else if ( field.type == "text"  ||  field.type == null ) {

      if ( field.rows != null ) { 

        contentItems.push( '<textarea type="text" '+nameAndClass + title + modifier + ' rows="'+field.rows+'">'
          + ( field.defaultVal ? field.defaultVal : '' ) +'</textarea>' );

      } else {
        if ( field.options != null || field.optionsResource != null ) {
          defaultVal += ' list="'+field.id+'DataList" ';
        }
        contentItems.push( '<input type="text" '+nameAndClass + title + defaultVal + modifier+'/>' );

          if ( field.options != null ) {
            contentItems.push( '<datalist id="'+field.id+'DataList">' );
            for ( var i = 0; i < field.options.length; i++ ) {
              if ( field.options[i].value != null  ) {
                var optMod = ''
                if ( field.options[i].selected ) { optMod += ' selected'; }
                if ( field.options[i].disabled ) { optMod += ' disabled'; }
                contentItems.push( '<option value="'+ $.i18n( field.options[i].value )+'"'+optMod+'>' );  
              }
            }     
            contentItems.push( '</datalist>' );
          } else if ( field.optionsResource != null ) {
            contentItems.push( '<datalist id="'+field.id+'DataList">' );
            $.ajaxSetup({ 'async': false, headers: headers });
            $.getJSON( 
                field.optionsResource.resourceURL, 
                getUrlGETparams(),
                function( optData ) {
                  for ( var i = 0; i < optData.length; i++ ) {
                    var optMod = ''
                    if ( field.options[i].selected ) { optMod += ' selected'; }
                    if ( field.options[i].disabled ) { optMod += ' disabled'; }
                    contentItems.push( '<option value="'+ $.i18n( optData[i][ field.optionsResource.optionValue ] )+ '"'+optMod+'>' );
                  }
                }
              );          
            $.ajaxSetup({ 'async': true, headers: headers });        
            contentItems.push( '</datalist>' );
          }
        if ( field.qr ) {
          let qID = divId + field.id
          contentItems.push( '<button id="'+qID+'QrBtn" class="qrBtn"><img src="modules/pong-form/barcode.png" class="barcodeImg"></button>' )
          contentItems.push(  modalBarCode( qID ) )
        }
      }
     
    } else if ( field.type == "email" ) {

      contentItems.push( '<input type="email" '+nameAndClass + title + defaultVal + modifier+'/>' );        
      
    } else if ( field.type == "password" ) {
      
      contentItems.push( '<input type="password" '+nameAndClass + title + modifier +'/>' );
              
    } else if ( field.type == "secret" ) {
      
      contentItems.push( '<input type="password" '+nameAndClass + title + modifier +'/>' );
      contentItems.push( '<span class="ui-icon ui-icon-unlocked secret-reveal" id="'+divId+field.id+'SecretReveal"></span>' );
      contentItems.push( '<script>' );
      contentItems.push( ' $(function(){ ');
      contentItems.push( '   $( "#'+divId+field.id+'SecretReveal" ).click( ');
      contentItems.push( '     function(e){  pongFormRevealSecret( "'+divId+field.id+'" ); return false; });' ); 
      contentItems.push( ' });' );
      contentItems.push( '</script>' );

    } else  if ( field.type == "date" ) {

      var modifier = '';
      if ( field.readonly != null && ( field.readonly === true  || field.readonly == 'true' ) ) { modifier += ' disabled="disabled"'; }
      
      contentItems.push( '<input type="text" '+nameAndClass + title + defaultVal + modifier+'/>' );
      contentItems.push( '<script>' );
      contentItems.push( ' $(function(){ ' );
      contentItems.push( '   $( "#'+divId+field.id+'" ).datepicker( { dateFormat: "'+$.i18n("yy-mm-dd")+'" } ); ' );
      contentItems.push( ' }); ' );
      contentItems.push( '</script>' );
      
    } else if ( field.type == "checkbox" ) {
      
      var cbValue = 'value="'+field.id+'" '; // default value=title
      if ( field.value != null ) { cbValue = 'value="'+field.value+'" '; }
      if ( field.readonly   != null && ( field.readonly   === true || field.readonly   == 'true' ) ) { modifier = ' disabled'; }
      if ( field.defaultVal != null && ( field.defaultVal === true || field.defaultVal == 'true' ) ) { modifier += ' checked';  }
      contentItems.push( '<input type="checkbox" '+ cbValue + nameAndClass + title + modifier +'/>' );
      
      var cbActivate   = "[]";
      var cbDeactivate = "[]";
      var cbDoScript   = false;
      if ( field.activate != null  &&
           Object.prototype.toString.call( field.activate ) === '[object Array]' ) {
        cbActivate = JSON.stringify( field.activate );
        cbDoScript = true;
      }
      if ( field.deactivate != null  && 
           Object.prototype.toString.call( field.deactivate ) === '[object Array]' ) {
        cbDeactivate = JSON.stringify( field.deactivate );
        cbDoScript = true;
      }
      if ( cbDoScript ) {
        contentItems.push( '<script>' );
        contentItems.push( ' $(function(){ ' );
        contentItems.push( '   $( "#'+divId+field.id+'" ).on( "change", function() {' )
        contentItems.push( '       var activateArr   = '+cbActivate+'; ' )
        contentItems.push( '       var deactivateArr = '+cbDeactivate+'; ' )
        contentItems.push( '       pongFormCbActivate( "'+divId+'", "'+field.id+'",  activateArr, deactivateArr ); ' )
        contentItems.push( '   });' );
        contentItems.push( ' }); ' );
        contentItems.push( '</script>' );
      }
      
    } else if ( field.type == "checkboxList" ) {

      $.ajaxSetup({ 'async': false, headers: headers });
      $.getJSON( 
          field.resourceURL, 
          getUrlGETparams(),
          function( optData ) {
            for ( var i = 0; i < optData.length; i++ ) {
              var cbValue = 'value="'+optData[i][field.valueField]+'" '; // default value=title
              var modifier = '';
              if ( field.defaultValField != null && ( field.defaultValField === true || optData[i][field.defaultValField] == 'true' ) ) { 
                modifier += ' checked'; 
              }
              contentItems.push( '<input type="checkbox" '+ cbValue + nameAndClass + title + modifier +'/>' );
            }
          }
        );          
      $.ajaxSetup({ 'async': true, headers: headers });        

    } else if ( field.type == "select" ) {
      var multi = '';
      if ( field.multiple ) { multi = ' multiple'; }
      contentItems.push( '<select ' + nameAndClass  + title + modifier+ multi+'>' );
      if ( field.options != null ) {
        for ( var i = 0; i < field.options.length; i++ ) {
          var optValue = '';
          if ( field.options[i].value != null  ) {
            optValue = 'value="'+field.options[i].value+'"';
          } else {
            optValue = 'value="'+field.options[i].option+'"';            
          }
          var optMod = ''
          if ( field.options[i].selected ) { optMod += ' selected'; }
          if ( field.options[i].disabled ) { optMod += ' disabled'; }

          contentItems.push( '<option '+optValue+optMod+'>'+ $.i18n( field.options[i].option )+'</option>' );  
        }     
        contentItems.push( '</select>' );

      } else if ( field.optionsResource != null ) {

        var aId  = divId + field.id;
        var aURL = field.optionsResource.resourceURL;
        var otherParams = JSON.stringify( getUrlGETparams() );
        var val = field.optionsResource.optionValue;
        var fld = field.optionsResource.optionField;

        if ( field.optionsResource.loadOnChange ) {

          contentItems.push( '</select>' );
          contentItems.push( '<script>' )
          contentItems.push( ' $( "#'+divId+field.optionsResource.loadOnChange+'" ).change( ' );
          contentItems.push( '   function() { ' )
          contentItems.push( '     var prm = '+otherParams+'; ' )
          contentItems.push( '     prm["'+field.optionsResource.loadOnChange+'"] = this.value;' )
          contentItems.push( '     pongFormLoadOptions( "'+aId+'", "'+aURL+'", prm, "'+val+'", "'+fld+'" ); }' );
          contentItems.push(  ')' ); 
          contentItems.push( '</script>' )

        } else {

          // $.ajaxSetup({'async': false, headers: headers });
          // $.getJSON( 
          //     field.optionsResource.resourceURL, 
          //     getUrlGETparams(),
          //     function( optData ) {
          //       for ( var i = 0; i < optData.length; i++ ) {
          //         contentItems.push( '<option value="'+optData[i][ field.optionsResource.optionValue ]+'">'+
          //             $.i18n( optData[i][ field.optionsResource.optionField ] ) +'</option>' );
          //       }
          //     }
          //   );          
          // $.ajaxSetup({'async': true, headers: headers });        
          contentItems.push( '</select>' );
          contentItems.push( '<script>' )
          contentItems.push( ' $( function() { ' )
          contentItems.push( '     var prm = '+otherParams+'; ' )
          contentItems.push( '     pongFormLoadOptions( "'+aId+'", "'+aURL+'", prm, "'+val+'", "'+fld+'" ); }' );
          contentItems.push(  ')' ); 
          contentItems.push( '</script>' )
        }
      }
      
    } else if ( field.type == "radio" ) {

      if ( field.name && field.value ) {
        var ch = ( field.checked ? 'checked' : '' );
        var lb = ( field.label ? field.label : field.value ); 
        contentItems.push( '<input type="radio" id="'+divId+field.id+'" name="'+field.name+'" value="'+field.value+'" '+ch+modifier+'>' );  
      } else { 
        logErr( "Pong-Form", "radio input must have a name and value");
      }
      
    } else if ( field.type == "reCAPTCHA" && field.sitekey ) {

      jQuery('head').append( "<script src='https://www.google.com/recaptcha/api.js'></script>" );
      contentItems.push( '<div id="'+divId+field.id+'" class="g-recaptcha" data-sitekey="'+field.sitekey+'"></div>' );  

    } else if ( field.type == "link" ) {

      if ( field.linkText && field.defaultVal ) {
        var target = ( field.target ?  'target="'+field.target+'"' : '' );
        contentItems.push( '<a id="'+divId+field.id+'" href="'+ $.i18n( field.defaultVal )+'" '+target+'>'+ $.i18n( field.linkText )+'</a>' );  
      } else { 
        logErr( "Pong-Form", "link type must have a linkText and defaultVal");
      }

    } else if ( field.type == "color" ) {

      contentItems.push( '<input type="color" '+ nameAndClass  + title + defaultVal +modifier+'/>' );

    } else { 

      contentItems.push( '<input type="text" '+ nameAndClass  + title + defaultVal +modifier+'/>' );

    }
    // TODO: support other form input types 
    contentItems.push( '</p>' );    
  }    
  contentItems.push( '</div>' );  
  return contentItems;
}

function pongFormRevealSecret( id ) {
  alert( id );
  let input = document.getElementById( id ); 
  let ico   = document.getElementById( id + 'SecretReveal' );
  if ( input.type === "password") { input.type = "text"; } else { input.type = "password"; } 
  ico.classList.toggle("ui-icon-unlocked"); 
  ico.classList.toggle("ui-icon-locked"); 
}


function pongFormLoadOptions( selId, resUrl, params, fVal, fName ) {
  $.getJSON( resUrl, params, function( data ) { 
      // alert("Grrrmmm: "+ selId+"/"+fVal+"/"+fName);
      var opt = [];
      // alert( JSON.stringify( data ) );
      for ( var i = 0; i < data.length; i++ ) {
        var optMod = ''
        if ( data[i].selected ) { optMod += ' selected'; }
        if ( data[i].disabled ) { optMod += ' disabled'; }

        opt.push( '<option value="'+data[i][ fVal ]+'" '+optMod+'>'+
            $.i18n( data[i][ fName ] ) +'</option>' );
            //  alert( data[i][ fName ] );
      }
      // alert( opt.join( "\n" ) );
      $( "#"+selId ).html( opt.join( "\n" ) );
      $( "#"+selId ).trigger("change");
  });
}


function pongFormCbActivate( divId, cbId, activateArr, deactivateArr ) {
  var cbValue = $( "#"+divId+cbId ).is( ':checked' );
  for ( var i = 0; i < activateArr.length; i++ ) {
    $( "#"+divId+activateArr[i] ).prop( 'disabled', !cbValue );
    if ( cbValue ) {
      $( "#"+divId+activateArr[i] ).removeClass( 'ui-disabled' )
      $( "#"+divId+"Bt"+activateArr[i] ).removeAttr( 'disabled' );
    } else {
      $( "#"+divId+activateArr[i] ).addClass( 'ui-disabled' )
      $( "#"+divId+"Bt"+activateArr[i] ).attr( 'disabled', 'disabled' );
    }
    // alert( "disabled #"+divId+activateArr[i]+ +'  '+ (!cbValue) )
  }
  for ( var i = 0; i < deactivateArr.length; i++ ) {
    $( "#"+divId+deactivateArr[i] ).prop( 'disabled', cbValue );
    if ( ! cbValue ) {
      $( "#"+divId+deactivateArr[i] ).removeClass( 'ui-disabled' )
      $( "#"+divId+"Bt"+deactivateArr[i] ).removeAttr( 'disabled' );
    } else {
      $( "#"+divId+deactivateArr[i] ).addClass( 'ui-disabled' )
      $( "#"+divId+"Bt"+deactivateArr[i] ).attr( 'disabled', 'disabled' );
    }
    // alert( "disabled #"+divId+deactivateArr[i]+ +'  '+ (cbValue) )
  }
}


// QR CODE Scan

function modalBarCode( qID ) {
  let qIDx =  qID.replaceAll('-','')
  let qrDivs = []
  qrDivs.push( '<div class="modal'+qID+' modalQr qrHidden"><h2>Scan QR or Barcode</h2>' )
  qrDivs.push( ' <div id="qrReader'+qID+'" style="width:500px"></div>' )
  qrDivs.push( ' <div id="qrResult'+qID+'" class="qrResult"></div>' )
  qrDivs.push( ' <script src="modules/pong-form/html5-qrcode.min.js"></script>' )
  qrDivs.push( '</div>' )
  qrDivs.push( '<div class="overlay'+qID+' modalQrOverlay qrHidden"></div>' )
  $( "body" ).append( qrDivs.join('\n') ); 

  let c = '<script>';
  c += '  $( function(){';
  c += '    $( "#'+qID+'QrBtn" ).click( function(e) { toggleModal'+qIDx+'(); return false; } ); ' ;
  c +=  '  }); ' ;
  // c +=  '  function scanQr'+qIDx+'() { scanQr("'+qID+'"); };' ;
  c +=  '  function toggleModal'+qIDx+'() {' ;
  c +=  '    let modal = document.querySelector( ".modal'+qID+'" );' ;
  c +=  '    modal.classList.toggle( "qrHidden" );' ;
  c +=  '    let overlay = document.querySelector( ".overlay'+qID+'" );' ;
  c +=  '    overlay.classList.toggle( "qrHidden" );' ;
  c +=  '    if ( ! modal.classList.contains("qrHidden") ) { scanQr("'+qID+'"); };'
  c +=  '    return false;' ;
  c +=  '  };' ;
  c +=  '</script>' ;
  return c;
}

function scanQr( qID ) {
  let qIDx =  qID.replaceAll('-','')
  var lastResult, countResults = 0;
  $( '#qrResult'+qID ).html( '<button class="closeModal'+qID+'" onclick="toggleModal'+qIDx+'();">Close</button></div>' );

  function onScanSuccess(decodedText, decodedResult) {
    if (decodedText !== lastResult) {
      ++countResults;
      lastResult = decodedText;

      let qrHTML = '<h3>Scan Result:</h3>' +
        '<input id="qrResultTxt'+qID+'" value="'+decodedText+'"/>'+
        '<p><button onclick="qrOk();">Use Scan Result</button>'+
        '<button class="closeModal'+qIDx+'" onclick="toggleModal'+qIDx+'();">Close</button></div>'+
        '<script>function qrOk(){ qrResultTransfer( "'+qID+'", "'+decodedText+'" )} </script>'
      $( '#qrResult'+qID ).html( qrHTML )
    }
  }

  var scanQrCode = new Html5QrcodeScanner( "qrReader"+qID, { fps: 10, qrbox: 250 } );
  scanQrCode.render( onScanSuccess );
}

function qrResultTransfer( qID, scanTxt ) {
  let qIDx =  qID.replaceAll('-','')
  $( '#'+qID ).val( scanTxt )
  // alert( qID+' '+scanTxt )
  var closeScan = window[ 'toggleModal'+qIDx ];
  closeScan();
}