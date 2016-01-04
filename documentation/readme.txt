SourceB file comments
______________________

./templates/index.html 

./static/bower_components/dist/scripts/ui-iconpicker.js

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
└── readme

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

In order to install the dependant JavaScript libraries defined in bower.json, the
bower package manager must be used:
	cd ./app/static
	bower install


Potential commands to automate file structure build:
mkdir src
rsync -a --remove-source-files SourceA/javascript/ SourceA/python/ SourceA/misc/ SourceB/javascript/ SourceB/python/ SourceB/misc/ SourceC/javascript/ SourceC/python/ SourceC/misc/ src