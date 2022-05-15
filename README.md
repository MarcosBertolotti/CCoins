# CCoins

* Build image:

$ docker build . -t ccoins

* Run commnad line to create / or run angular commands:

$ docker run --rm -it -p 4200:4200 -v `pwd`:/app ccoins /bin/bash

* Install dependencies

$ npm install

* Run project for local:

$ docker run --rm -p 4200:4200 -v `pwd`:/app ccoins

### ENV ###

* To run the project in with envs config, just add the flag --configuration in serve

$ ng serve --configuration=local --port 4200 --host 0.0.0.0

* Or just run:

$ ./run.sh