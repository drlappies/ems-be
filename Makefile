start-db:
	@echo start postgreSQL

	@if [ $(shell docker ps -a | grep -ci ems-postgresql) -eq 0 ]; then \
		echo starting postgreSQL; \
		docker run --name ems-postgresql -d \
			-p 5432:5432 \
			-e POSTGRES_USER=emspguser \
			-e POSTGRES_PASSWORD=emspgpass \
			-e POSTGRES_DB=ems-postgresql \
			postgres; \
	elif [ $(shell docker ps | grep -ci ems-postgresql) -eq 0 ]; then \
		echo starting postgreSQL; \
		docker start postgreSQL;  \
	fi

stop-db:
	@echo stop postgreSQL

	@if [ $(shell docker ps -a | grep -ci ems-postgresql) -eq 1 ]; then \
		echo Stopping ems-postgresql; \
		docker stop ems-postgresql; \
		docker rm ems-postgresql; \
	fi