@echo off

copy clients\%~1\config.xml ..\www\config.xml
copy clients\%~1\img\*.* ..\www\img

if "%~2"=="clean" (
	call create-android
) else (
	rmdir ..\platforms\android\bin /s /q
	call phonegap build android
)

copy ant.properties ..\platforms\android\ant.properties

cd ..\platforms\android
call ant release

cd bin
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ..\..\..\build\mobileit-release-key.keystore %~1-release-unsigned.apk mobileit
zipalign -v 4 %~1-release-unsigned.apk %~1.apk

cd ..\..\..\build

IF "%~3"=="ftp" ftps -a -user:mobileitstaging -password:1q2w3e4r -s:clients\%~1\stagingupload.ftp ftp.mbl-it.com