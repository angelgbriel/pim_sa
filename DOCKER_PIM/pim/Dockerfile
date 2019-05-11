FROM angelgbriel/nod_my:v1
WORKDIR /home
RUN mkdir app 
COPY ./app/bd/pim.sql .
COPY ./app/package.json ./app
COPY ./app/config ./app/config
COPY ./app/main.js ./app
COPY ./inicio.sh .
RUN cd app && ls
EXPOSE 8080
CMD ["bash","inicio.sh"];
#RUN cd /var/run/mysqld &&  > mysqld.sock 
#RUN ps -fea | grep mysqld
#RUN service mysql start && cd app && mysql -u root < pim.sql
#RUN cd app && npm install  && npm start

