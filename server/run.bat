@ECHO OFF
echo 
echo Begining to build Coinetion Customer Portal...
cd ..\client
echo Customer Portal build started....
call ng build --environment=DEV
echo Customer Portal build completed!!
cd ..\server
echo Starting Coinetion Customer Portal Server...
npm run dev