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



/**
 * Usage from command-line:
 *
 * > fabrique-render -model ./my-data.json -src "..." -dest "..." file1.tmpl, file2.tmpl, file3.tmpl
 *
 * render file1 ... file3 from directory passed in "-src" parameter to directory passed in
 * "-dest" parameter.
 *
 */

 /** context to store parameter to call a render-command with
 * resolved pathes.
 *
 * @type {{object}}
 */
var params = {};



var _ = require( "underscore" );
var path = require( "path" );

/**
 * function to resolve path of a template.
 *
 * @param dir
 * @param file
 */
function resolvePath( dir, file ) {
    var root = dir;
    if( !_.isString(dir) ) {
        LOGGER.warn( "can't resolve a path, because passed parameter:dir is not a string. dir = " + dir );
        return false;
    }

    if( !_.isString(file) ) {
        LOGGER.warn( "can't resolve a path, because passed parameter:file is not a string. file = " + file );
        return false;
    }

    var full = dir + "/" + file;
    var normalized = path.normalize( full);

    return path.resolve( normalized );
};


var optimist = require('optimist')
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
                throw 'Unable to open template file "' + tmplPath + '"';
            }
        });
    });


var args = optimist.argv;

var render = require( "./render-impl.js" );

/*
.check( function(argv) {
    if ( !argv._.length ) {
        throw 'Must define at least one template-file.';
    }

    argv._.forEach( function(template) {
        try {
            fs.statSync(template);
        } catch (err) {
            throw 'Unable to open template file "' + template + '"';
        }
    });
});
*/


args._.forEach( function( template ) {
    try {
        // param: template - must be a path to a template file.
        var rendered = render( template, args.m );
        console.log( ">>>> rendered: " + rendered );
    } catch (err) {
        LOGGER.warn( 'Unable to render template: "' + template + '". skip it!' );
    }
});











