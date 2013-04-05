#!/bin/sh
#afresco init script for Ubuntu
# Created by Carlos Miguens (alfresco)
# 21 March 2010
# Based on work by Joost Howard
#
# This init file now supports an LSB style header.
# Install this file in /etc/init.d, make sure its executable and called "alfresco"
# The run the command "sudo update-rc.d alfresco defaults"
#

### BEGIN INIT INFO
# Provides:          alfresco
# Required-Start:    $remote_fs $syslog
# Required-Stop:     $remote_fs $syslog
# Should-Start:      mysql 
# Should-Stop:       mysql 
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: Start and stop alfresco content server at boot time
# Description:       Controls the alfresco services starting up, alfresco then controls other services like imagemagik and openoffice
### END INIT INFO
#export JAVA_HOME=/opt/java/jdk1.6.0_38

#export JAVA_HOME
export ALFRESCO_HOME=/opt/alfresco
export CATALINA_BASE=/opt/alfresco/tomcat
export CATALINA_HOME=/opt/alfresco/tomcat
export LOGFILE=/opt/alfresco/alfresco.log
export PIDFILE=/var/run/alfresco

# Set any default JVM values
#export JAVA_OPTS='-server -Xmx1024m -XX:MaxPermSize=512m -Djava.io.tmpdir=/var/lib/alfresco/tmp -Dcom.sun.management.jmxremote'
export JAVA_OPTS='-Xss1024k -Xms1G -Xmx2G -XX:MaxPermSize=128m -XX:NewSize=512m-server -Djava.io.tmpdir=/var/lib/alfresco/tmp -Dcom.sun.management.jmxremote'

cd "$ALFRESCO_HOME"



#
# setup_iptables
# setup iptables for redirection of CIFS and FTP
setup_iptables () {

	
	echo 1 > /proc/sys/net/ipv4/ip_forward
	modprobe iptable_nat
	iptables -F
	iptables -t nat -F
	iptables -P INPUT ACCEPT
	iptables -P FORWARD ACCEPT
	iptables -P OUTPUT ACCEPT
	iptables -t nat -A PREROUTING -p tcp --dport 445 -j REDIRECT --to-ports 1445
	iptables -t nat -A PREROUTING -p tcp --dport 139 -j REDIRECT --to-ports 1139
	iptables -t nat -A PREROUTING -p udp --dport 137 -j REDIRECT --to-ports 1137
	iptables -t nat -A PREROUTING -p udp --dport 138 -j REDIRECT --to-ports 1138	
	iptables -t nat -A PREROUTING -p tcp --dport 21 -j REDIRECT --to-ports 2121
}

#
# start_openoffice
#
start_openoffice(){
	sudo -H -u alfresco xvfb-run /usr/lib/libreoffice/program/soffice "--accept=socket,host=localhost,port=8100;urp;StarOffice.ServiceManager" --nologo --headless --nofirststartwizard &
}

case $1 in

start)
#	Commented this out as it too unreliable
#
	if [ -f $PIDFILE ] ; then
		echo "Alfresco is already running!"
		exit 1
	fi
	sudo touch $PIDFILE
	sudo chown alfresco:alfresco $PIDFILE
	echo "Starting OpenOffice service ..."
	start_openoffice

	echo "Setting up iptables ..."
	setup_iptables	

	echo "Starting Alfresco ..."
 	echo  -e "\n\n\n\n\n\n\n\n\n\n`date` Starting Alfresco ..." >>$LOGFILE
 	sudo chown alfresco:alfresco $LOGFILE

	sudo -H -u alfresco sh $CATALINA_HOME/bin/catalina.sh start
        ;;
stop)  
	sudo -H -u alfresco sh $CATALINA_HOME/bin/catalina.sh stop
	#killall -w -u alfresco
        echo  -e "`date` Stopping Alfresco ..." >>$LOGFILE
	sudo rm $PIDFILE
        ;;
restart)
	
	
	sudo -H -u alfresco sh $CATALINA_HOME/bin/catalina.sh stop
	#sudo kill -INT `cat $PIDFILE`
	#killall -w -u alfresco
	sudo rm $PIDFILE 
	echo  -e "\n\n\n\n\n\n\n\n\n`date` Restarting Alfresco ..." >>$LOGFILE
	sudo -H -u alfresco sh $CATALINA_HOME/bin/catalina.sh stop
	sudo touch $PIDFILE
	sudo chown alfresco:alfresco $PIDFILE
        ;;
zap)
	echo "Zapping $PIDFILE ..."
	rm $PIDFILE
	;;
*)
	echo "Usage: alfresco [start|stop|restart|zap] [tail]"
	exit 1
	;;

esac   

case $2 in 
tail)
	tail -f $LOGFILE
	;;
esac


exit 0
