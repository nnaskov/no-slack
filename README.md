
# No-Slack app

## How to run
1. Go to [no-slack.appspot.com](https://no-slack.appspot.com)
2. Log in with your google account
2. Once you are logged in, you should see a nav bar. In the top right corner there will be a "+" (plus sign). Press it to populate dummy data
3. WAIT! Population may take a minute or 2
4. Once it has finished you can play around

## Story

LIVING IN SHARED HOUSEHOLD IS HARD

Who should throw away the trash today? Who should hover the hallway? How do you get reports on who has done what? 

No-slack solves exactly this - you can create tasks and assign who should do it next. You can keep track of who has done what and who is slacking off.

With a few clicks you can delegate all the tasks to the right people and finally achieve harmony at your shared house.


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
Technologies used:
* AngularJS
* Bootstrap 3
* SCSS

The AngularJS code is in:

```
src/static/js
```
- controllers/
- directives/
- services/

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
Technologies used:
* Google App Engine
* Python

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
