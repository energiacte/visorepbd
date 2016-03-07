dev:
	npm run webpack-server
install:
	npm install -g eslint babel-eslint eslint-plugin-react http-webserver webpack-web-server
analyze:
	webpack --json > stats.json
	webpack-bundle-size-analyzer stats.json
