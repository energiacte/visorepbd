dev:
	npm run webpack-server
install:
	curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
	sudo apt-get install -y nodejs
	npm install -g eslint babel-eslint eslint-plugin-react http-webserver webpack-web-server
analyze:
	webpack --json > stats.json
	webpack-bundle-size-analyzer stats.json
