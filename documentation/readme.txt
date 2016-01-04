SourceB file comments
______________________

./templates/index.html
└─> Landing page template originally theme/index.html from http://bit.ly/1Uubres 
    only minor changes to the content.

./static/bower_components/dist/scripts/ui-iconpicker.js
└─> Line 156 modified to fix bug in library. 

Setup instructions
——————————————————————
The files have been submitted in the format:
.
├── SourceA
│   ├── javascript
│   ├── misc
│   └── python
├── SourceB
│   ├── javascript
│   ├── misc
│   └── python
├── SourceC
│   ├── javascript
│   ├── misc
│   └── python
└── readme.txt

Where each folder javascript, misc and python are representative of the root directory
of the application, with only the files that should be in relevant SourceA/ SourceB/ 
SourceC folder, included. Therefore folders such as ./templates have multiple instance
and all instances of the folder be merged as to form the directory folder shown below.

The directory/ file structure for the application should be set out as follows:
.
├── app
│   ├── __init__.py
│   ├── blank-picture.jpg
│   ├── delegator.py
│   ├── external
│   │   ├── HTMLTestRunner.py
│   │   ├── __init__.py
│   ├── jsons.py
│   ├── lib
│   ├── models.py
│   ├── publisher.py
│   ├── register.py
│   ├── requests.py
│   ├── statistics.py
│   ├── strings.py
│   └── unittests
├── app.yaml
├── appengine_config.py
├── favicon.ico
├── index.yaml
├── main.py
├── static
│   ├── bower.json
│   ├── css
│   ├── fonts
│   ├── img
│   ├── js
│   ├── partials
│   └── scss
└── templates

The following commands should be used to build the folder structure automatically:
mkdir src
rsync -a --remove-source-files SourceA/javascript/ SourceA/python/ SourceA/misc/ SourceB/javascript/ SourceB/python/ SourceB/misc/ SourceC/javascript/ SourceC/python/ SourceC/misc/ src

In order to install the dependant JavaScript libraries defined in bower.json, the
bower package manager must be used:
	cd app/static
	bower install


List of External Libraries and Sources
——————————————————————————————————————
Flatty http://bit.ly/1Uubres
