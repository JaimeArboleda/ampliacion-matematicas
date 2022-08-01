#!/bin/bash
for file in ../text_sources/*
do
fi=$(echo "$file" | cut -f 3 -d "/")
fbase=$(echo "$fi" | cut -f 1 -d ".")
echo $fbase
source script.sh $fbase $1
done
