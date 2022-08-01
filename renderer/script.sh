#!/bin/bash
node renderer.js ../text_sources/$1.txt ../rendered/$1.html
google-chrome --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf-no-header --print-to-pdf="$1.pdf" ../rendered/$1.html
mv $1.pdf ../rendered/$1.pdf
firstline=$(head -n 1 ../text_sources/$1.txt)
arr=(${firstline//:/ })
if [ "${arr[0]}" == "single_page" ] && [ "${arr[1]}" == "yes" ];
then
qpdf --collate --empty --pages ../rendered/$1.pdf 1-1 -- ../rendered/$1temp.pdf
mv ../rendered/$1temp.pdf ../rendered/$1.pdf
fi
if [ "$2" == "--open" ] || [ "$3" == "--open" ];
then
open ../rendered/$1.pdf
fi

if [ "$2" == "--keep-html" ] || [ "$3" == "--keep-html" ];
then
echo "html saved"
else
rm ../rendered/$1.html
fi
