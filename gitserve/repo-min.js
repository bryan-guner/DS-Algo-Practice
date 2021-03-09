/*!
 * @mekwall's .vangogh() for Syntax Highlighting

 * https://github.com/mekwall/jquery-vangogh/blob/master/GPL-LICENSE.txt
 * https://github.com/mekwall/jquery-vangogh/blob/master/MIT-LICENSE.txt
 */
( function ( $, a, b ) {
  var c = 1,
    d = !1,
    e = !1,
    f = {
      get: function ( b ) {
        var c = a.location.hash;
        if ( c.length > 0 ) {
          var d = c.match( new RegExp( b + ":{([a-zA-Z0-9,-]*)}" ) );
          if ( d ) return d[ 1 ].split( "," )
        }
        return []
      },
      set: function ( b, c ) {
        var d = a.location.hash,
          e, f = b + ":{" + c.join( "," ) + "}",
          g = d.indexOf( b + ":{" );
        if ( c.length === 0 ) return this.remove( b );
        g !== -1 ? e = d.replace( new RegExp( "(" + b + ":{[a-zA-Z0-9,-]*})" ), f ) : e = d.length > 0 ? d + "," + f : f, a.location.hash = e
      },
      remove: function ( b ) {
        a.location.hash = a.location.hash.replace( new RegExp( "([,]?" + b + ":{[a-zA-Z0-9,-]*}[,]?)" ), "" )
      }
    },
    g = {
      numberRange: /^([0-9]+)-([0-9]+)$/,
      pageNumber: /-([0-9]+)$/,
      multilineBegin: /<span class="([\w-_][^"]+)">(?:.[^<]*(?!<\/span>)|)$/ig,
      multilineEnd: /(<span class="([\w-_][^"]+)">)?(?:.[^<]*)?(<\/span>)/ig
    };
  $.fn.vanGogh = function ( h ) {
    function n() {
      if ( d || e ) setTimeout( n, 100 );
      else {
        k++;
        if ( k >= 10 ) return;
        if ( h.source && !l ) {
          e = !0, $.ajax( {
            url: h.source,
            crossDomain: !0,
            dataType: "text",
            success: function ( a ) {
              l = a
            },
            error: function ( a, b ) {
              l = "ERROR: " + b
            },
            complete: function () {
              e = !1, n()
            }
          } );
          return
        }
        b = b || a.hljs;
        if ( !b ) {
          d = !0, $.getScript( h.autoload, function () {
            d = !1, n()
          } );
          return
        }
        j.filter( "pre,code" ).each( function () {
          function r( b, c, e ) {
            var h = !1,
              i = a.find( ".vg-line" );
            c && ( a.find( ".vg-highlight" ).removeClass( "vg-highlight" ), f.remove( d ), k = [] ), b = $.type( b ) === "array" ? b : [ b ], $.each( b, function ( b, c ) {
              if ( k.indexOf( c ) <= -1 ) {
                !isNaN( parseFloat( c, 10 ) ) && isFinite( c ) && ( c = parseInt( c, 10 ) );
                if ( $.type( c ) === "string" ) {
                  var e = g.numberRange.exec( c );
                  if ( e ) {
                    var f = e[ 1 ],
                      h = e[ 2 ],
                      j = "";
                    for ( var b = f; b <= h; b++ ) j += ",#" + d + "-" + b, k.push( b );
                    i.filter( j.substring( 1 ) ).addClass( "vg-highlight" )
                  } else a.find( ".vg-line:contains(" + c + ")" ).each( function () {
                    var a = $( this ).addClass( "vg-highlight" );
                    a.html( a.html().replace( c, '<span class="vg-highlight">' + c + "</span>" ) )
                  } ), k.push( c )
                } else {
                  var l = d + "-" + this,
                    m = i.filter( "#" + l );
                  m.length && ( m.addClass( "vg-highlight" ), k.push( c ) )
                }
              }
            } ), !e && f.set( d, k )
          }
          var a = $( this ).addClass( "vg-container" ).attr( "id", this.id || "vg-" + c++ ),
            d = this.id,
            e = a.find( "code" ),
            i = !1,
            j = !1,
            k = [];
          e.length || ( e = a, i = !0 ), h.source && l && e.text( l );
          var n = e.text();
          b.highlightBlock( e[ 0 ], h.tab );
          var o = e.html().split( "\n" ),
            p = "",
            q = "";
          if ( !i ) {
            var s = {},
              t = 0;
            $.each( o, function ( a, b ) {
              var c = a + h.firstLine,
                e = d + "-" + c,
                f = b;
              h.numbers && ( p += '<a class="vg-number" rel="#' + e + '">' + c + "</a>" );
              if ( s[ t ] ) {
                var i = g.multilineEnd.exec( b );
                i && !i[ 1 ] ? ( f = '<span class="' + s[ t ] + '">' + f, delete s[ t ], t-- ) : f = '<span class="' + s[ t ] + '">' + f + "</span>"
              }
              var j = g.multilineBegin.exec( b );
              j && ( t++, s[ t ] = j[ 1 ] ), q += '<div class="vg-line" id="' + e + '">' + f + "</div>"
            } ), q = '<code class="vg-code">' + q + "</code>", h.numbers && ( q = '<div class="vg-gutter">' + p + "</div>" + q ), a.html( q ), e = a.find( "code" ), a.find( ".vg-number" ).click( function ( b ) {
              var c = $( this ),
                e = c.attr( "rel" ),
                h = a.find( e );
              if ( h.hasClass( "vg-highlight" ) ) {
                h.removeClass( "vg-highlight" ), k.splice( k.indexOf( c.text() ), 1 ), f.set( d, k ), j = !1;
                return !1
              }
              var i = j;
              j = parseInt( g.pageNumber.exec( e )[ 1 ], 10 ), b.shiftKey && j ? r( i < j ? i + "-" + j : j + "-" + i, !0 ) : r( j, b.ctrlKey ? !1 : !0 );
              return !1
            } );
            var u = a.find( ".vg-gutter" ),
              v = u.outerWidth(),
              w = 0,
              x = !1;
            h.animateGutter && a.scroll( function ( a ) {
              if ( this.scrollLeft !== w )
                if ( this.scrollLeft > v ) {
                  if ( this.scrollLeft < w ) w = this.scrollLeft, u.hide();
                  else if ( this.scrollLeft !== w ) {
                    if ( x ) return;
                    var b = this;
                    w = this.scrollLeft, x = setTimeout( function () {
                      x = !1;
                      var a = b.scrollLeft;
                      e.css( "marginLeft", v ), u.css( {
                        "float": "none",
                        position: "absolute",
                        left: a - v
                      } ).show().stop().animate( {
                        left: a
                      } )
                    }, 500 )
                  }
                } else w = this.scrollLeft, clearTimeout( x ), x = !1, u.css( {
                  "float": "",
                  position: "",
                  left: ""
                } ).show()
            } )
          } else i && a.addClass( "vg-code" );
          e.dblclick( function () {
            m( e[ 0 ] );
            return !1
          } );
          if ( h.maxLines > 0 ) {
            var y = a.find( ".vg-line" ).height(),
              z = parseInt( e.css( "paddingTop" ) ),
              A = y * ( h.maxLines + 1 ) + z;
            a.css( {
              minHeight: y + z,
              maxHeight: A
            } )
          }
          h.highlight && r( h.highlight, !0, !0 );
          var B = f.get( d );
          B.length && r( B, !1, !0 )
        } )
      }
    }

    function m( b ) {
      var c = a,
        d = a.document;
      if ( d.body.createTextRange ) {
        var e = d.body.createTextRange();
        e.moveToElementText( b ), e.select()
      } else if ( d.createRange ) {
        var f = c.getSelection(),
          e = d.createRange();
        e.selectNodeContents( b ), f.removeAllRanges(), f.addRange( e )
      }
    }
    var i = {
      language: "auto",
      firstLine: 1,
      maxLines: 0,
      numbers: !0,
      highlight: null,
      animateGutter: !0,
      autoload: "http://softwaremaniacs.org/media/soft/highlight/highlight.pack.js",
      tab: "    "
    };
    h = $.extend( {}, i, h );
    var j = this,
      k = 0,
      l;
    n();
    return j
  }
} )( jQuery, this, typeof this.hljs != "undefined" ? this.hljs : !1 );


( function ( a ) {
  a.fn.repo = function ( j ) {
    var g = this,
      b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
      i = function ( t ) {
        t = escape( t );
        var s = "";
        var r, q, p = "";
        var o, n, m, l = "";
        var k = 0;
        do {
          r = t.charCodeAt( k++ );
          q = t.charCodeAt( k++ );
          p = t.charCodeAt( k++ );
          o = r >> 2;
          n = ( r & 3 ) << 4 | q >> 4;
          m = ( q & 15 ) << 2 | p >> 6;
          l = p & 63;
          if ( isNaN( q ) ) {
            m = l = 64
          } else {
            if ( isNaN( p ) ) {
              l = 64
            }
          }
          s = s + b.charAt( o ) + b.charAt( n ) + b.charAt( m ) + b.charAt( l );
          r = q = p = "";
          o = n = m = l = ""
        } while ( k < t.length );
        return s
      },
      c = function ( v ) {
        var u = "";
        var t, s, r = "";
        var q, p, o, n = "";
        var m = 0;
        var l = /[^A-Za-z0-9\+\/\=]/g;
        if ( l.exec( v ) ) {}
        v = v.replace( /[^A-Za-z0-9\+\/\=]/g, "" );
        do {
          q = b.indexOf( v.charAt( m++ ) );
          p = b.indexOf( v.charAt( m++ ) );
          o = b.indexOf( v.charAt( m++ ) );
          n = b.indexOf( v.charAt( m++ ) );
          t = q << 2 | p >> 4;
          s = ( p & 15 ) << 4 | o >> 2;
          r = ( o & 3 ) << 6 | n;
          u = u + String.fromCharCode( t );
          if ( o != 64 ) {
            u = u + String.fromCharCode( s )
          }
          if ( n != 64 ) {
            u = u + String.fromCharCode( r )
          }
          t = s = r = "";
          q = p = o = n = ""
        } while ( m < v.length );
        return unescape( u )
      },
      h = function ( k, m, n ) {
        var l = ( m === "left" ) ? "" : "left";
        if ( n ) {
          k.addClass( "active" );
          g.container.css( {
            height: f( k ) + "px"
          } )
        } else {
          g.container.find( ".page.active" ).css( "position", "absolute" ).addClass( m ).removeClass( "active" ).end().css( {
            height: f( k ) + "px"
          } );
          k.addClass( "active" ).removeClass( l ).delay( 250 ).queue( function () {
            a( this ).css( "position", "relative" ).dequeue()
          } )
        }
      },
      f = function ( k ) {
        return ( k[ 0 ].clientHeight + g.container.find( "h1" ).outerHeight( true ) + 15 )
      },
      e = function ( l ) {
        var k = {
          png: "image/png",
          gif: "image/gif",
          jpg: "image/jpeg",
          jpeg: "image/jpeg",
          ico: "image/x-icon"
        };
        return k[ l ] ? k[ l ] : "text/plain"
      };
    g.settings = a.extend( {
      user: "",
      name: "",
      branch: "master",
      css: '@font-face{font-family:"Octicons Regular";src:url("https://a248.e.akamai.net/assets.github.com/fonts/octicons/octicons-regular-webfont.eot?639c50d4");src:url("https://a248.e.akamai.net/assets.github.com/fonts/octicons/octicons-regular-webfont.eot?639c50d4#iefix") format("embedded-opentype"),url("https://a248.e.akamai.net/assets.github.com/fonts/octicons/octicons-regular-webfont.woff?0605b255") format("woff"),url("https://a248.e.akamai.net/assets.github.com/fonts/octicons/octicons-regular-webfont.ttf?f82fcba7") format("truetype"),url("https://a248.e.akamai.net/assets.github.com/fonts/octicons/octicons-regular-webfont.svg?1f7afa21#newFontRegular") format("svg");font-weight:normal;font-style:normal}@font-face{font-family:"repo-icons";src:url("https://raw.github.com/darcyclarke/Repo.js/master/fonts/repo.eot");src:url("https://raw.github.com/darcyclarke/Repo.js/master/fonts/repo.eot#iefix") format("embedded-opentype"),url("https://raw.github.com/darcyclarke/Repo.js/master/fonts/repo.woff") format("woff"),url("https://raw.github.com/darcyclarke/Repo.js/master/fonts/repo.ttf") format("truetype"),url("https://raw.github.com/darcyclarke/Repo.js/master/fonts/repo.svg") format("svg");font-weight:normal;font-style:normal}.repo,.repo *{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;-ms-box-sizing:border-box;box-sizing:border-box}.repo ul *{display:block;font-family:sans-serif;font-size:13px;line-height:18px}.repo{width:100%;margin:0 0 15px 0;position:relative;padding-bottom:1px;color:#555;overflow:hidden;height:300px;-webkit-transition:height .25s;-moz-transition:height .25s;-o-transition:height .25s;-ms-transition:height .25s;transition:height .25s}.repo .page{background:#f8f8f8;border:4px solid rgba(0,0,0,0.08);border-radius:3px;-ms-filter:"alpha(opacity=0)";filter:alpha(opacity=0);opacity:0;left:100%;width:98%;position:absolute;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s;-ms-transition:all .25s;transition:all .25s}.repo .page.active{left:1%!important;-ms-filter:"alpha(opacity=100)";filter:alpha(opacity=100);opacity:1;display:block}.repo .page.left{left:-100%}.repo .loader{position:absolute;display:block;width:100%;height:300px;top:0;left:0;background:url(data:image/gif;base64,R0lGODlhQABAALMIAOzu7PT29Ozq7PTy9Pz6/Pz+/OTm5OTi5P///wAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpBN0RGOTZFMEJFNDAxMUUxOThFRUU2MTc0Q0I1MERFRCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpBN0RGOTZFMUJFNDAxMUUxOThFRUU2MTc0Q0I1MERFRCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkE3REY5NkRFQkU0MDExRTE5OEVFRTYxNzRDQjUwREVEIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkE3REY5NkRGQkU0MDExRTE5OEVFRTYxNzRDQjUwREVEIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Af/+/fz7+vn49/b19PPy8fDv7u3s6+rp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) no-repeat center 50%}.repo.loaded .loader{display:none}.repo h1{padding:0 0 0 10px;font-family:sans-serif;font-size:20px;line-height:26px;color:#000;font-weight:normal}.repo h1 a:nth-of-type(1),.repo h1 a.active{font-weight:bold}.repo h1 a.active,.repo h1 a.active:active,.repo h1 a.active:visited,.repo h1 a.active:hover{color:#000}.repo h1 a,.repo h1 a:active,.repo h1 a:visited,.repo h1 a:hover{color:#4183c4;text-decoration:none}.repo h1 a:after{content:"/";color:#999;padding:0 5px;font-weight:normal}.repo h1 a:last-child:after{content:""}.repo .page,.repo ul{zoom:1}.repo .page:before,.repo .page:after,.repo ul:before,.repo ul:after{content:"";display:table}.repo .page:after,.repo ul:after{clear:both}.repo ul{border:1px solid rgba(0,0,0,0.25);margin:0;padding:0}.repo li{width:100%;margin:0;padding:0;float:left;border-bottom:1px solid #ccc;position:relative;white-space:nowrap}.repo li.titles{background:-webkit-linear-gradient(#fafafa,#eaeaea);background:-moz-linear-gradient(#fafafa,#eaeaea);background:-o-linear-gradient(#fafafa,#eaeaea);background:-ms-linear-gradient(#fafafa,#eaeaea);background:linear-gradient(#fafafa,#eaeaea);font-weight:bold;padding:10px 10px 8px 36px;text-shadow:0 1px 0 #fff}.repo li:before{content:"t";font-family:"repo-icons";position:absolute;top:10px;left:10px;font-size:18px;-webkit-font-smoothing:antialiased}.repo li.dir:before{content:"f ";color:#80a6cd}.repo li.titles:before,.repo li.back:before{content:""}.repo li:last-child{border:0;padding-bottom:none;margin:0}.repo li a,.repo li a:visited,.repo li a:active{color:#4183c4;width:100%;padding:10px 10px 8px 36px;display:block;text-decoration:none}.repo li a:hover{text-decoration:underline}.repo li span{display:inline-block}.repo li span:nth-of-type(1){width:30%}.repo li span:nth-of-type(2){width:20%}.repo li span:nth-of-type(3){width:40%}.repo .vg-container{position:relative;overflow:auto;white-space:pre!important;word-wrap:normal!important}.repo .vg-container,.repo .vg-code{border:0;margin:0;overflow:auto}.repo .vg-code .vg-line,.repo .vg-gutter .vg-number{display:block;height:1.5em;line-height:1.5em!important}.repo .vg-gutter{float:left;min-width:20px;width:auto;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.repo .vg-number{cursor:pointer}.repo .vg-container{font-family:"Bitstream Vera Sans Mono","Courier New",monospace;font-size:13px;border:1px solid #ddd}.repo .vg-gutter{background-color:#ececec;border-right:1px solid #ddd;text-align:right;color:#aaa;padding:1em .5em;margin-right:.5em}.repo .vg-code *::-moz-selection,.repo .vg-code *::-webkit-selection,.repo .vg-code *::selection,.repo .vg-line.vg-highlight{background-color:#ffc}.repo .vg-line span.vg-highlight{color:blue;font-weight:bold;text-decoration:underline}.repo .vg-container .vg-code{display:block;padding:1em .5em;background:#fff}.repo .vg-code{color:#000;background:#f8f8ff;border:0;padding:.4em}.repo .vg-code .comment,.repo .vg-code .template_comment,.repo .vg-code .diff .header,.repo .vg-code .javadoc{color:#998;font-style:italic}.repo .vg-code .keyword,.repo .vg-code .css .rule .keyword,.repo .vg-code .winutils,.repo .vg-code .javascript .title,.repo .vg-code .lisp .title,.repo .vg-code .subst{color:#000;font-weight:bold}.vg-code .number,.vg-code .hexcolor{color:#40a070}.vg-code .string,.repo .vg-code .tag .value,.repo .vg-code .phpdoc,.repo .vg-code .tex .formula{color:#d14}.repo .vg-code .title,.repo .vg-code .id{color:#900;font-weight:bold}.repo .vg-code .javascript .title,.repo .vg-code .lisp .title,.repo .vg-code .subst{font-weight:normal}.repo .vg-code .class .title,.repo .vg-code .haskell .label,.repo .vg-code .tex .command{color:#458;font-weight:bold}.repo .vg-code .tag,.repo .vg-code .tag .title,.repo .vg-code .rules .property,.repo .vg-code .django .tag .keyword{color:#000080;font-weight:normal}.repo .vg-code .attribute,.repo .vg-code .variable,.repo .vg-code .instancevar,.repo .vg-code .lisp .body{color:#008080}.repo .vg-code .regexp{color:#009926}.repo .vg-code .class{color:#458;font-weight:bold}.repo .vg-code .symbol,.repo .vg-code .ruby .symbol .string,.repo .vg-code .ruby .symbol .keyword,.repo .vg-code .ruby .symbol .keymethods,.repo .vg-code .lisp .keyword,.repo .vg-code .tex .special,.repo .vg-code .input_number{color:#990073}.repo .vg-code .builtin,.repo .vg-code .built_in,.repo .vg-code .lisp .title{color:#0086b3}.repo .vg-code .codeprocessor,.repo .vg-code .pi,.repo .vg-code .doctype,.repo .vg-code .shebang,.repo .vg-code .cdata{color:#999;font-weight:bold}.repo .vg-code .deletion{background:#fdd}.repo .vg-code .addition{background:#dfd}.repo .vg-code .diff .change{background:#0086b3}.repo .vg-code .chunk{color:#aaa}.repo .vg-code .tex .formula{-ms-filter:"alpha(opacity=50)";filter:alpha(opacity=50);opacity:.5}'
    }, j );
    g.extensions = {
      as: "actionscript",
      coffee: "coffeescript",
      css: "css",
      html: "html",
      js: "javascript",
      md: "markdown",
      php: "php",
      py: "python",
      rb: "ruby"
    };
    g.repo = {
      name: "default",
      folders: [],
      files: []
    };
    g.namespace = g.settings.name.toLowerCase().replace( /[^a-z0-9]-_/g, "" );
    var d = a( "[data-id^=" + g.namespace + "]" );
    if ( d.length ) {
      g.namespace += String( d.length )
    }
    if ( typeof g.settings.css != "undefined" && g.settings.css !== "" && a( "#repojs_css" ).length <= 0 ) {
      a( "body" ).prepend( a( '<style id="repojs_css">' ).html( g.settings.css ) )
    }
    a.ajax( {
      url: "https://api.github.com/repos/" + g.settings.user + "/" + g.settings.name + "/git/trees/" + g.settings.branch + "?recursive=1",
      type: "GET",
      data: {},
      dataType: "jsonp",
      success: function ( k ) {
        var l = k.data.tree.length;
        a.each( k.data.tree, function ( m ) {
          if ( !--l ) {
            g.container.addClass( "loaded" );
            setTimeout( function () {
              h( g.container.find( ".page" ).first(), "left", true )
            }, 10 )
          }
          if ( this.type != "blob" ) {
            return
          }
          var n = g.container.find( ".page" ).first();
          ctx = g.repo, output = n, path = this.path, arr = path.split( "/" ), file = arr[ ( arr.length - 1 ) ], id = "";
          arr = arr.slice( 0, -1 );
          id = g.namespace;
          a.each( arr, function ( q ) {
            var p = String( this ),
              o = 0,
              r = false;
            id = id + "_split_" + p.replace( ".", "_dot_" );
            a.each( ctx.folders, function ( s ) {
              if ( this.name == p ) {
                o = s;
                r = true
              }
            } );
            if ( !r ) {
              if ( output !== n ) {
                output.find( "ul li.back" ).after( a( '<li class="dir"><a href="#" data-id="' + id + '">' + p + "</a></li>" ) )
              } else {
                output.find( "ul li" ).first().after( a( '<li class="dir"><a href="#" data-id="' + id + '">' + p + "</a></li>" ) )
              }
              ctx.folders.push( {
                name: p,
                folders: [],
                files: [],
                element: a( '<div class="page" id="' + id + '"><ul><li class="titles"><span>name</span></li><li class="back"><a href="#">..</a></li></ul></page>' ).appendTo( g.container )[ 0 ]
              } );
              o = ctx.folders.length - 1
            }
            output = a( ctx.folders[ o ].element );
            ctx = ctx.folders[ o ]
          } );
          output.find( "ul" ).append( a( '<li class="file"><a href="#" data-path="' + path + '" data-id="' + id + '">' + file + "</a></li>" ) );
          ctx.files.push( file )
        } );
        g.container.on( "click", "a", function ( r ) {
          r.preventDefault();
          var p = a( this ),
            o = p.parents( "li" ),
            q = p.parents( ".page" ),
            m = p.parents( ".repo" ),
            n = a( "#" + p.data( "id" ) );
          if ( o.hasClass( "file" ) ) {
            n = a( "#" + p.data( "id" ) );
            if ( n.legnth > 0 ) {
              n.addClass( "active" )
            } else {
              a.ajax( {
                url: "https://api.github.com/repos/" + g.settings.user + "/" + g.settings.name + "/contents/" + p.data( "path" ) + "?ref=" + g.settings.branch,
                type: "GET",
                data: {},
                dataType: "jsonp",
                success: function ( t ) {
                  var s = a( '<div class="file page" id="' + p.data( "id" ) + '"></div>' ),
                    v = t.data.name.split( "." ).pop().toLowerCase(),
                    u = e( v );
                  if ( "image" === u.split( "/" ).shift() ) {
                    n = s.append( a( '<div class="image"><span class="border-wrap"><img src="" /></span></div>' ) ).appendTo( m );
                    n.find( "img" ).attr( "src", "data:" + u + ";base64," + t.data.content ).attr( "alt", t.data.name )
                  } else {
                    n = s.append( a( "<pre><code></code></pre>" ) ).appendTo( m );
                    if ( typeof g.extensions[ v ] != "undefined" ) {
                      n.find( "code" ).addClass( g.extensions[ v ] )
                    }
                    n.find( "code" ).html( String( c( t.data.content ) ).replace( /&/g, "&amp;" ).replace( /</g, "&lt;" ).replace( />/g, "&gt;" ).replace( /"/g, "&quot;" ) );
                    n.find( "pre" ).vanGogh()
                  }
                  h( n, "left" )
                },
                error: function ( s ) {
                  if ( console && console.log ) {
                    console.log( "Request Error:", r )
                  }
                }
              } )
            }
          } else {
            if ( o.hasClass( "dir" ) ) {
              g.container.find( "h1" ).find( ".active" ).removeClass( "active" ).end().append( '<a href="#" data-id="' + p.data( "id" ) + '" class="active">' + p.text() + "</a>" );
              h( n, "left" )
            } else {
              if ( o.hasClass( "back" ) ) {
                g.container.find( "h1 a" ).last().remove();
                n = q[ 0 ].id.split( "_split_" ).slice( 0, -1 ).join( "_split_" );
                n = ( n == g.namespace ) ? g.container.find( ".page" ).first() : a( "#" + n );
                h( n, "right" )
              } else {
                n = n.length ? n : g.container.find( ".page" ).eq( p.index() );
                if ( p[ 0 ] !== g.container.find( "h1 a" )[ 0 ] ) {
                  p.addClass( "active" )
                }
                g.container.find( "h1 a" ).slice( ( p.index() + 1 ), g.container.find( "h1 a" ).length ).remove();
                h( n, "right" )
              }
            }
          }
        } )
      },
      error: function ( k ) {
        if ( console && console.log ) {
          console.log( "Request Error:", k )
        }
      }
    } );
    return this.each( function () {
      g.container = a( '<div class="repo"><h1><a href="#" data-id="' + g.namespace + '_split_default">' + g.settings.name + '</a></h1><div class="loader"></div><div class="page" id="' + g.namespace + '_split_default"><ul><li class="titles"><span>name</span></li></ul></div></div>' ).appendTo( a( this ) )
    } )
  }
} )( jQuery );
