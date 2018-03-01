setup:
	lerna clean --yes && lerna bootstrap && gulp clean

update:
	ncu -a -x gulp-mocha && npm install
	for package in $(wildcard packages/*) ; do \
		cd $$package && ncu -a -x gulp-mocha && cd .. && cd .. ; \
	done 

canary: setup
	gulp && gulp prepublish && lerna publish -c --exact --yes && gulp clean

publish: setup
	gulp && gulp prepublish && lerna publish && gulp clean