test-plugin-updates:
	git submodule foreach git pull origin master
docs:
	yarn mk-docs