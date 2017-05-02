# No-Slack app

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





##  Code Structure

### Front-end
The AngularJS code is in:

```
src/static/js
```
* controllers/
* directives/
* services/

The Main HTML templates are in:
```
src/templates
```
The Main HTML are then populated with partials from:
```
src/static/partials
```

We use SCSS, which can be found in:
```
src/static/scss
```


### Back-end
This app is intended to be run on Google App Engine. 


## How to count the lines of code

On 30/12/2015 we had **2858**/4400 LOC.

We need to use **cloc** to count the lines of code. You can download it from [here](http://cloc.sourceforge.net/).

You can try the following command for Windows:
```
cloc.exe cloudapplicationdev --exclude-dir=external,lib,unittests,bower_components,css,fonts,img
```

Don't forget to add cloc.exe to the PATH for windows or to put cloc immediately outside the cloudapplicationdev folder.


and for Mac:
```
cloc cloudapplicationdev --exclude-dir=external,lib,unittests,bower_components,css,fonts,img
```
