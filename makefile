
update:
	for package in $(wildcard packages/*) ; do \
		cd $$package && ncu -a -x gulp-mocha && npm install && cd .. && cd .. ; \
	done 

canary: 
	lerna clean --yes && lerna bootstrap && gulp && gulp prepublish && lerna publish -c

publish:
	lerna clean --yes && lerna bootstrap && gulp && gulp prepublish && lerna publish

clean:
	lerna clean --yes && lerna bootstrap && gulp clean