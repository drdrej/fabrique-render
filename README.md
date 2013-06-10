fabrique-render
===============

render txt-files in fabrique-js.

## Philosophy


## Usage
Use console to call renderer.
```
cli>fabrique-render -m "./example/hello-world.json" -s "./example" -d "c:\temp" hello-world.txt.tmpl
```

Output in console:
```
-- load module
[VALUE] path = C:\home\projects\fabriquejs-core\sources\fabrique-render\example\hello-world.json
[SUCCESSFUL] module loaded. path = C:\home\projects\fabriquejs-core\sources\fabrique-render\example\hello-world.json
-- render: Hello {{WORLD}}!


[SUCCESSFUL] write rendered file to: c:\temp\hello-world.txt.tmpl
```


(c) 2013 Andreas Siebert, ask at touchableheroes.com