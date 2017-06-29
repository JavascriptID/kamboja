
update:
	for package in $(wildcard packages/*) ; do \
		cd $$package && ncu -a -x gulp-mocha && npm install && cd .. && cd .. ; \
	done 

canary: 
	gulp && gulp prepublish && lerna publish -c

publish:
	gulp && gulp prepublish && lerna publish