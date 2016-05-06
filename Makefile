PRJDIR:=/home/webapps/epbdpanel
RESDIR:=${PRJDIR}/deployresources
VENVBINDIR:=${PRJDIR}/venv/bin
REPODIR:=${PRJDIR}
VPYTHON:=${VENVBINDIR}/python
NGINXCONF:=epbdpanel.nginx.conf
SUPERVISORCONF:=epbdpanel.supervisor.conf
SUPERVISORAPPNAME:=epbdpanel

dev:
	venv/bin/python epbdserver/manage.py runserver
createenv:
	python3 -m venv ./venv
	venv/bin/python -m pip install -Ur requirements.txt
npminstall:
	curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
	sudo apt-get install -y nodejs
	npm install -g eslint babel-eslint eslint-plugin-react http-server webpack-dev-server
.PHONY: analyze
analyze:
	webpack --json > stats.json
	webpack-bundle-size-analyzer stats.json
.PHONY: buildjs
buildjs:
	npm run buildprod
	mkdir -p epbdserver/static
	mkdir -p epbdserver/templates
	rm -f epbdserver/static/*
	cp build/* epbdserver/static/
	mv epbdserver/static/index.html epbdserver/templates/

# antes hacer un git pull
update: updaterepo
	$(info [INFO]: actualización del proyecto completada. Complete la operación con $ sudo make restart)

updaterepo: ${REPODIR}/requirements.txt ${REPODIR}/package.json updateresources
	$(info [INFO]: actualizando dependencias)
	${VPYTHON} -m pip install -Ur ${REPODIR}/requirements.txt
	${VPYTHON} -m pip install -U gunicorn setproctitle
	cd ${REPODIR} && npm install

updateresources: ${RESDIR}/secretkey.txt ${RESDIR}/production.py ${RESDIR}/gunicorn_start.bash
	$(info [INFO]: actualizando recursos de despliegue)
	cp -p ${RESDIR}/secretkey.txt ${PRJDIR}/secretkey.txt
	cp -p ${RESDIR}/production.py ${REPODIR}/epbdpanel/epbdserver/settings/production.py
	cp -p ${RESDIR}/gunicorn_start.bash ${VENVBINDIR}/
	touch ${PRJDIR}/gunicorn_supervisor.log
	chown webapps:www-data ${PRJDIR}/gunicorn_supervisor.log

restart: updateresources ${RESDIR}/${NGINXCONF} ${RESDIR}/${SUPERVISORCONF}
	$(info [INFO]: copiando configuración)
	sudo cp ${RESDIR}/${NGINXCONF} /etc/nginx/sites-available/
	sudo cp ${RESDIR}/${SUPERVISORCONF} /etc/supervisor/conf.d/
	$(info [INFO]: reiniciando servicios)
	sudo supervisorctl reread
	sudo supervisorctl update
	sudo supervisorctl restart ${SUPERVISORAPPNAME}
	sudo service nginx restart

installpackages:
	$(info [INFO]: instalación de paquetes)
	sudo aptitude install nginx supervisor git
	sudo aptitude install nodejs nodejs-legacy

configpackages:
	$(info [INFO]: copiando archivos de configuración de nginx)
	sudo cp ${RESDIR}/${NGINXCONF} /etc/nginx/sites-available/
	sudo ln -fs /etc/nginx/sites-available/${NGINXCONF} /etc/nginx/sites-enabled/${NGINXCONF}
	$(info [INFO]: copiando archivos de configuración de supervisor)
	sudo cp ${RESDIR}/${SUPERVISORCONF} /etc/supervisor/conf.d/

testdjango:
	DJANGO_SETTINGS_MODULE=epbdserver.settings.development ${VPYTHON} ${REPODIR}/epbdpanel/manage.py runserver 0.0.0.0:8000

testgunicorn:
	${VENVBINDIR}/gunicorn_start.bash
