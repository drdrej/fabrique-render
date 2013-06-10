/*

 Copyright (c) 2012-2013 Andreas Siebert, ask@touchableheroes.com

 Permission is hereby granted, free of charge, to any person obtaining
 a copy of this software and associated documentation files (the "Software"),
 to deal in the Software without restriction, including without limitation
 the rights to use, copy, modify, merge, publish, distribute, sublicense,
 and/or sell copies of the Software, and to permit persons to whom the
 Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included
 in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 IN THE SOFTWARE.

 */

var LOGGER = require( "fabrique-log" ).logger;
var resolvePath = require( './project/resolve-path.js' );
var fs = require( 'fs' );

module.exports = function prepare( ) {
    /** context to store parameter to call a render-command with
     * resolved pathes.
     *
     * @type {{object}}
     */
    var params = {
        templates : []
    };

    var argv = require('optimist')
        .usage( '$0 --model ./my-data.json --src "..." --dest "..." file1.tmpl, file2.tmpl, file3.tmpl' )
        .demand( [ 'm', 's', 'd' ] )

        .alias( 'm', 'model')
        .describe( 'm', 'relative path to a JSON-file filled with data (to be used to rendered).' )

        .alias( 's', 'src' )
        .describe( 's', 'source-directory with template-files' )

        .alias( 'd', 'dest' )
        .describe( 'd', 'destination-directory where rendered files should be stored' )

        .check( function( argv ) {
            if ( !argv._.length ) {
                throw 'Must define at least one template-file.';
            }

            argv._.forEach( function( tmplName ) {
                var tmplPath = resolvePath( argv.s, tmplName );

                try {
                    fs.statSync( tmplPath );
                    params.templates.push( tmplPath );
                } catch (err) {
                    var userMsg = 'Unable to open template file "' + tmplPath + '"';
                    var errMsg = "error :: " + err;

                    LOGGER.log( userMsg );
                    LOGGER.error( errMsg );

                    throw userMsg;
                }
            });
        })

    .argv;

    return params;
}
