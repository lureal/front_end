#!/bin/bash
source /etc/profile

project=$1
if [ -z "$project" ] ; then
echo "need project name"

else

mkdir -p /data/app/front_end/${project}

cd /data/app/front_end/${project}

rm -rf  /data/app/front_end/${project}/*

wget "http://package.iyouqian.com:8000//front_end/${project}.tar.gz"

tar zxvf ${project}.tar.gz 

rm -rf ${project}.tar.gz

chmod -R  777  /data/app/front_end/

fi
