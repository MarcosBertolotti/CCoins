#!/bin/bash

docker run --rm -it -p 4200:4200 --name ccoins -v `pwd`:/app ccoins ng serve --configuration=local --port 4200 --host 0.0.0.0