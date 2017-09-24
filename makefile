
update:
	ncu -a -x gulp-mocha && npm install
	for package in $(wildcard packages/*) ; do \
		cd $$package && ncu -a -x gulp-mocha && npm install && cd .. && cd .. ; \
	done 

canary: 
	lerna clean --yes && lerna bootstrap && gulp && gulp prepublish && lerna publish -c --exact --yes && gulp clean

publish:
	lerna clean --yes && lerna bootstrap && gulp && gulp prepublish && lerna publish && gulp clean

setup:
	lerna clean --yes && lerna bootstrap && gulp clean