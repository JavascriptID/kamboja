
update:
	for package in $(wildcard packages/*) ; do \
		cd $$package && ncu -a -x gulp-mocha && npm install && cd .. && cd .. ; \
	done 