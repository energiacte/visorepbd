start:
	venv/bin/python epbdserver/manage.py runserver
createenv:
	python3 -m venv ./venv
	venv/bin/python -m pip install -Ur requirements.txt
devserver: start
	npm run webpack-server
npminstall:
	curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
	sudo apt-get install -y nodejs
	npm install -g eslint babel-eslint eslint-plugin-react http-webserver webpack-web-server
analyze:
	webpack --json > stats.json
	webpack-bundle-size-analyzer stats.json
.PHONY: build
build:
	npm run buildprod
