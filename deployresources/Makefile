PRJDIR:=/home/webapps/visorepbd
RESDIR:=${PRJDIR}/deployresources
REPODIR:=${PRJDIR}
NGINXCONF:=visorepbd.nginx.conf

# antes hacer un cd ${REPODIR} && git pull
update: ${REPODIR}/package.json
	$(info [INFO]: Actualizando proyecto. Complete la operación con $ sudo make restart)
	$(info [INFO]: actualizando dependencias)
	cd ${REPODIR} && npm install

restart: updateresources ${RESDIR}/${NGINXCONF}
	$(info [INFO]: copiando configuración)
	sudo cp ${RESDIR}/${NGINXCONF} /etc/nginx/sites-available/
	$(info [INFO]: reiniciando servicios)
	sudo service nginx restart

installpackages:
	$(info [INFO]: instalación de paquetes)
	sudo aptitude install nginx git
	sudo aptitude install nodejs nodejs-legacy

configpackages:
	$(info [INFO]: copiando archivos de configuración de nginx)
	sudo cp ${RESDIR}/${NGINXCONF} /etc/nginx/sites-available/
	sudo ln -fs /etc/nginx/sites-available/${NGINXCONF} /etc/nginx/sites-enabled/${NGINXCONF}

