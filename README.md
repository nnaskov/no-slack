# cloudapplicationdev

## How to install

Before you deploy, make sure you have bower.
If you're not sure, install it like this globally:

```
npm install -g bower
```

You're only supposed to do this once.

Afterwards go in static/ and type:

```
bower install
```

or if you have any problems try

```
bower install --force
```


You're only supposed to this once unless someone has added a new bower component to bower.json.

To add a new component in Bower, please type:

```
bower install <name-of-component> --save
```


## How to count the lines of code

On 16/12/2015 we had **2830** LOC.

We need to use **cloc** to count the lines of code. You can download it from [here](http://cloc.sourceforge.net/).

You can try the following command for Windows:
```
cloc.exe cloudapplicationdev --exclude-dir=external,lib,unittests,bower_components,css,fonts,img
```

and for Mac:
```
cloc cloudapplicationdev --exclude-dir=external,lib,unittests,bower_components,css,fonts,img
```

Don't forget to add cloc.exe to the PATH for windows or to put cloc immediately outside the cloudapplicationdev folder.