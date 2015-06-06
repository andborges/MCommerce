@echo off

rmdir ..\plugins /s /q
mkdir ..\plugins

rmdir ..\platforms\android /s /q

cd ..

call phonegap build android
call phonegap local plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-device.git
call phonegap local plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-dialogs.git
call phonegap local plugin add https://github.com/jonathannaguin/BarcodeScanner.git

cd build