FROM angelgbriel/nod_my:v1
WORKDIR /home
RUN mkdir app 
COPY ./app/bd/bodega.sql .
COPY ./app/package.json ./app
COPY ./app/conf.js ./app
COPY ./app/index.js ./app
COPY ./inicio.sh .
RUN cd app && ls
EXPOSE 8090
CMD ["bash","inicio.sh"];
