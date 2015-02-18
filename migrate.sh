#!/bin/sh

clear
hostStart='http://localhost/'
repoName='dm-video'
dist='/dist/'
rootHost=$hostStart$repoName$dist
defaultLocalhostPath=$hostStart$repoName$dist
tempDirNameString='__GH-page-content'
proceedVar=false
useDefaultLocalhostPath=true
tempDirName='GH-page-content'
root=$(pwd)
yourLocalhost=''
localhost=''
framesetString='frameset.php?page-type='
pages=("")
htmlPages=("index_thumb-slider")
phpModules=("videojs")
tempModulueName=''
phpExtension='.php'
htmlExtension='.html'

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

echo "In order to proceed we need the path to the localhost of your repo. By default, if you are using PHP or other local dev environments, it would be something like this ... $hostStart$repoName/dist/. Is $hostStart$repoName$dist the path to your localhost? Y or N | "
read useDefaultLocalhostPath

echo 'yourLocalhost 1: $yourLocalhost'

if [[ $useDefaultLocalhostPath =~ ^[Yy]$ ]]
	then
		yourLocalhost=$defaultLocalhostPath
else
	echo "Please enter/paste the path to the repo's localhost URL: ex. $hostStart$repoName$dist"
	read yourLocalhost
fi

if [[ $proceedVar =~ ^[Yy]$ ]]
	then
		rootHost=$hostStart$repoName$dist
		echo "rootHost: $rootHost"
		tempDirName=$repoName$tempDirNameString
		echo "tempDirName: $tempDirName"
		echo "yourLocalhost: $yourLocalhost"

		echo "Array Length(pages): ${#pages[@]}"
		echo "Array Length(phpModules): ${#phpModules[@]}"
		echo "Array Length(htmlPages): ${#htmlPages[@]}"

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
			localhost="$yourLocalhost"

			cp -a -f $root/$repoName/dist/images/. $root/$tempDirName/images
			cp -a -f $root/$repoName/dist/fonts/. $root/$tempDirName/fonts
			cp -a -f $root/$repoName/dist/js/. $root/$tempDirName/js
			cp -a -f $root/$repoName/dist/styles/. $root/$tempDirName/styles

			sleep 3
			terminal-notifier -sound default -title 'Git: Migrating Master to GH-Pages' -message 'Creating Module (PHP) Pages'
			if [ ${#phpModules[@]} -gt 0 ];
				then
					for g in "${phpModules[@]}"
					do
						$tempModulueName="$g.php"
						echo "$rootHost$g$phpExtension"
						wget "$rootHost$g$phpExtension"
						sleep 1
						mv -f $g$phpExtension $root/$tempDirName/$g.html

						echo ""
						echo "---------------------------------------------"
						echo ""
					done
			fi
			

			sleep 3
			terminal-notifier -sound default -title 'Git: Migrating Master to GH-Pages' -message 'Creating Pages from PHP frameset'
			if [ ${#pages[@]} -gt 0 ];
				then
					for i in "${pages[@]}"
					do
						echo $localhost$i
						wget $localhost$framesetString$i
						sleep 1
						mv -f $framesetString$i $root/$tempDirName/$i.html

						echo ""
						echo "---------------------------------------------"
						echo ""
					done
			fi


			sleep 3
			terminal-notifier -sound default -title 'Git: Migrating Master to GH-Pages' -message 'Creating Pages from HTML files'

			if [ ${#htmlPages[@]} -gt 0 ];
				then
					for i in "${htmlPages[@]}"
					do
						echo $localhost$i$htmlExtension
						wget $localhost$i$htmlExtension
						sleep 1
						mv -f $i$htmlExtension $root/$tempDirName/$i$htmlExtension

						echo ""
						echo "---------------------------------------------"
						echo ""
					done
			fi
			

			cd $tempDirName
			cp -f home.html index.html
			cd ..

			sleep 5
			terminal-notifier -sound default -title 'Git: Migrating Master to GH-Pages' -message 'Checking GH-Pages branch'
			cd $repoName
			git checkout gh-pages
			git status
			git stash
			git pull
			git status
			cd ..
			
			echo "Removing the several resources from the gh-pages repo folder (folders and html pages)."
			sleep 5
			terminal-notifier -sound default -title 'Git: Migrating Master to GH-Pages' -message 'Removing the several resources from the gh-pages repo folder (folders and html pages).'
			rm -r $root/$repoName/images
			rm -r $root/$repoName/fonts
			rm -r $root/$repoName/js
			rm -r $root/$repoName/styles
			rm -f $root/$repoName/articles.html
			rm -f $root/$repoName/home.html
			rm -f $root/$repoName/index.html

			echo "Copying the content of the temporary folder into the gh-pages repo folder."
			sleep 5
			terminal-notifier -sound default -title 'Git: Migrating Master to GH-Pages' -message 'Copying the content of the temporary folder into the gh-pages repo folder.'
			cp -a -f $root/$tempDirName/. $root/$repoName

			sleep 5
			terminal-notifier -sound default -title 'Git: Migrating Master to GH-Pages' -message 'Removing temporary folder'
			echo "Removing temporary folder"
			rm -r $root/$tempDirName

			sleep 5
			terminal-notifier -sound default -title 'Git: Migrating Master to GH-Pages' -message 'Add/Remove ... Commit/Push changes to the GH-Pages branch'
			cd $repoName
			git status
			git add --all
			git status
			git commit -a -m "Updated GH-Pages with the latest version of this repo that can be used for QA."
			git push

			sleep 5
			terminal-notifier -sound default -title 'Git: Migrating Master to GH-Pages' -message 'Checking out Master branch'
			git checkout master

			echo ""
			echo $root

			sleep 6
			echo "DONE! Check your repo to make sure all folders match what is suppose to be in that branch."
			terminal-notifier -sound default -title 'Git: Migrating Master to GH-Pages' -message 'DONE!!!'
			
		fi
fi

