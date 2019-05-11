#!/usr/bin/env bash
service mysql start
mysql -u root < bodega.sql
cd app && npm install && npm start
