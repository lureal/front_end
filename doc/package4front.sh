#!/bin/bash
source /etc/profile

project=$1
if [ -z "$project" ] ; then
echo "need project name"

else

if [ "$project" ==  "vendor" ] ;then

su  - maven -c "cd /home/maven/src/front_end ; git pull; cd $project; rm -f /home/maven/package/front_end/$project.tar.gz ;  tar -czf /home/maven/package/front_end/$project.tar.gz  * ;  "

else
su  - maven -c "cd /home/maven/src/front_end ; git pull; cnpm install; gulp build:$project ;     cd $project/dist; rm -f /home/maven/package/front_end/$project.tar.gz ;  tar -czf /home/maven/package/front_end/$project.tar.gz  * ;  "
fi

fi


