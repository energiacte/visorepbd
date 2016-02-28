dev:
	npm run webpack-server
#	./node_modules/webpack-dev-server/bin/webpack-dev-server.js --hot --inline --progress --colors

install:
	npm install -g eslint eslint-plugin-react http-webserver webpack-web-server
analyze:
	webpack --json > stats.json
	webpack-bundle-size-analyzer stats.json
