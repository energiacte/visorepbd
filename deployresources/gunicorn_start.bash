#!/bin/bash

NAME="epbdpanel"                               # Name of the application
DJANGODIR=/home/webapps/epbdpanel/epbdserver   # Django project directory
VENVDIR=/home/webapps/epbdpanel/venv
SOCKFILE=/home/webapps/epbdpanel/run/gunicorn.sock  # we will communicate using this unix socket
USER=webapps                                      # the user to run as
GROUP=www-data                                    # the group to run as
NUM_WORKERS=3                                     # how many worker processes should Gunicorn spawn
DJANGO_SETTINGS_MODULE=epbdserver.settings.production # which settings file should Django use
DJANGO_WSGI_MODULE=epbdserver.wsgi                # WSGI module name

echo "Starting $NAME as `whoami`"

# Activate the virtual environment
cd $DJANGODIR
source $VENVDIR/bin/activate
export DJANGO_SETTINGS_MODULE=$DJANGO_SETTINGS_MODULE
export PYTHONPATH=$DJANGODIR:$PYTHONPATH
export PATH=$NODEBINDIR:$PATH

# Create the run directory if it doesn't exist
RUNDIR=$(dirname $SOCKFILE)
test -d $RUNDIR || mkdir -p $RUNDIR

# Start your Django Unicorn
# Programs meant to be run under supervisor should not daemonize themselves (do not use --daemon)
exec $VENVDIR/bin/gunicorn ${DJANGO_WSGI_MODULE}:application \
  --name $NAME \
  --workers $NUM_WORKERS \
  --user=$USER --group=$GROUP \
  --bind=unix:$SOCKFILE \
  --log-level error \
  --log-file=-
