#!/usr/bin/env bash
service mysql start
mysql -u root < pim.sql
cd app && npm install  && npm start
