#!/bin/bash
for file in ../metadata_resumenes/*
do
fi=$(echo "$file" | cut -f 3 -d "/")
fbase=$(echo "$fi" | cut -f 1 -d ".")
echo $fbase
node renderer.js $fbase.txt ../rendered/$fbase.html
google-chrome --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf-no-header --print-to-pdf="$fbase.pdf" ../rendered/$fbase.html
mv $fbase.pdf ../rendered/$fbase.pdf
qpdf --collate --empty --pages ../rendered/$fbase.pdf 1-1 -- ../rendered/$fbasetemp.pdf
mv ../rendered/$fbasetemp.pdf ../rendered/$fbase.pdf
done
