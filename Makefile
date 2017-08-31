PRJDIR:=/home/webapps/visorepbd
RESDIR:=${PRJDIR}/deployresources
REPODIR:=${PRJDIR}
BUILDDIR:=build
NGINXCONF:=visorepbd.nginx.conf
# usar variable de entorno EPBDURLPREFIX para cambiar prefijos de static y url para ajax
EPBDURLPREFIX:=/visorepbd/

.PHONY: builddevjs
builddevjs:
	$(info [INFO]: Generando bundle JS para desarrollo)
	npm run builddev
.PHONY: buildjs
buildjs:
	$(info [INFO]: Generando bundle JS de producción)
	npm run buildprod

buildprodjs:
	$(info [INFO]: Generando bundle JS de producción con prefijo de URL)
	EPBDURLPREFIX=${EPBDURLPREFIX} make buildjs

# antes hacer un git pull
update: ${REPODIR}/package.json
	$(info [INFO]: actualizando dependencias)
	cd ${REPODIR} && yarn
	$(info [INFO]: actualización del proyecto completada. Complete la operación con $ sudo make restart)

restart: ${RESDIR}/${NGINXCONF}
	$(info [INFO]: copiando configuración)
	sudo cp ${RESDIR}/${NGINXCONF} /etc/nginx/sites-available/
	$(info [INFO]: reiniciando servicios)
	sudo service nginx restart

npminstall:
	$(info [INFO]: Instalación de nodejs y dependencias JS)
	curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
	sudo apt-get install -y nodejs
	sudo npm install -g eslint babel-eslint eslint-plugin-react http-server webpack webpack-dev-server yarn
	yarn

.PHONY: analyze
analyze:
	$(info [INFO]: Estadísticas de rendimiento de webpack)
	webpack --json > stats.json
	webpack-bundle-size-analyzer stats.json

installpackages:
	$(info [INFO]: instalación de paquetes)
	sudo aptitude install nginx git
	sudo aptitude install nodejs nodejs-legacy

configpackages:
	$(info [INFO]: copiando archivos de configuración de nginx)
	sudo cp ${RESDIR}/${NGINXCONF} /etc/nginx/sites-available/
	sudo ln -fs /etc/nginx/sites-available/${NGINXCONF} /etc/nginx/sites-enabled/${NGINXCONF}

${BUILDDIR}:
	mkdir -p ${BUILDDIR}

${BUILDDIR}/constants.js: app/constants.js
	./node_modules/.bin/babel --presets es2015,stage-0 -o ${BUILDDIR}/constants.js app/constants.js

${BUILDDIR}/vecutils.js: app/vecutils.js
	./node_modules/.bin/babel --presets es2015,stage-0 -o ${BUILDDIR}/vecutils.js app/vecutils.js

${BUILDDIR}/energycalculations.js: ${BUILDDIR} app/energycalculations.js ${BUILDDIR}/constants.js ${BUILDDIR}/vecutils.js
	./node_modules/.bin/babel --presets es2015,stage-0 -o ${BUILDDIR}/energycalculations.js app/energycalculations.js

${BUILDDIR}/test.js: ${BUILDDIR} ${BUILDDIR}/energycalculations.js app/test.js
	./node_modules/.bin/babel --presets es2015,stage-0 -o ${BUILDDIR}/test.js app/test.js

build/examples:
	ln -s ../app/examples ${BUILDDIR}/

test: ${BUILDDIR}/test.js ${BUILDDIR}/examples
	node build/test.js

