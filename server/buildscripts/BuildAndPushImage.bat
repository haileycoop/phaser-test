set imageName=%1
set RepoURL=%2
set AWSProfile=%3
set AWSRegion=%4

cd server

echo Deleting old build folder
rmdir /s /q .\build

echo Installing node modules if needed
call npm i

echo Running npm build
call npm run build

echo Running post build for Windows
call npm run postbuild-windows

echo building Docker container image %imageName%
docker build -f Dockerfile -t %imageName% .

cd ..\

rem Do auth
echo Doing docker auth
aws ecr get-login-password --region %AWSRegion% --profile %AWSProfile% | docker login --username AWS --password-stdin %RepoURL%

rem Push :D
echo Pushing %imageName%
docker push %imageName%