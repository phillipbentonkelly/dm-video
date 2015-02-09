#!/bin/sh

clear
repoName='dm-video'
dist='/dist/'
rootHost='http://localhost/$repoName$dist'
defaultLocalhostPath='http://localhost/$repoName$dist'
proceedVar=false
useDefaultLocalhostPath=true
tempDirName='GH-page-content'
root=$(pwd)
yourLocalhost=''
localhost=''
framesetString='frameset.php?page-type='
pages=("index" "home")
phpModules=("videojs")
tempModulueName=''
phpExtension='.php'

echo "Welcome ... you are currently in: " 
pwd

echo "This script will do the following:"
echo "- Copy several directories in the dist folder to a new temporary folder one level above."
echo "- After the copy has been made it will change the github branch from master to gh-pages."
echo "- The contents of the temporary folder will be copied to the gh-pages branch and then the (the temporary) folder will be deleted."
echo "Please make sure you are in the correct directory and that you are on the master branch of the dm repo?"
echo ""
echo "Would you like to proceed? Y or N | "
read proceedVar

echo "In order to proceed we need the path to the localhost of your repo. By default, if you are using PHP or other local dev environments, it would be something like this ... http://localhost/dm/dist/. Is http://localhost/$repoName$dist the path to your localhost? Y or N | "
read useDefaultLocalhostPath

echo 'yourLocalhost 1: $yourLocalhost'

if [[ $useDefaultLocalhostPath =~ ^[Yy]$ ]]
	then
		yourLocalhost="$defaultLocalhostPath"
else
	echo "Please enter/paste the path to the repo's localhost URL: ex. http://localhost/$repoName$dist"
	read yourLocalhost
fi

if [[ $proceedVar =~ ^[Yy]$ ]]
	then
		tempDirName="$repoName$tempDirNameString"
		echo "tempDirName: $tempDirName"

		terminal-notifier -sound default -title 'Git: Migrating' -message 'Switching to gh-pages to pull updates and stash changes.'
		git checkout gh-pages
		echo "- Switched to Pages branch"

		sleep 6
		git stash
		terminal-notifier -sound default -title 'Git: Migrating' -message 'Stashed any local changes.'
		echo "- Stashed any local changes"

		sleep 3
		git pull
		terminal-notifier -sound default -title 'Git: Migrating' -message 'Pulled most recent.'
		echo "- Pulled most recent"
		git status

		terminal-notifier -sound default -title 'Git: Migrating' -message 'Switch back to master branch.'
		git checkout master

		sleep 6
		if [[ $yourLocalhost ]]
		then
			cd ..
			mkdir $tempDirName
			root=$(pwd)
			localhost="$yourLocalhost$framesetString"

			cp -a -f $root/$repoName/dist/images/. $root/$tempDirName/images
			cp -a -f $root/$repoName/dist/fonts/. $root/$tempDirName/fonts
			cp -a -f $root/$repoName/dist/js/. $root/$tempDirName/js
			cp -a -f $root/$repoName/dist/styles/. $root/$tempDirName/styles


			
		fi
fi

