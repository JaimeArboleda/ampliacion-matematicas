#!/bin/bash
for file in ../metadata_resumenes/*
do
fi=$(echo "$file" | cut -f 3 -d "/")
fbase=$(echo "$fi" | cut -f 1 -d ".")
echo $fbase
node renderer.js $fbase.txt ../resumenes/$fbase.html
google-chrome --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf-no-header --print-to-pdf="$fbase.pdf" ../resumenes/$fbase.html
mv $fbase.pdf ../resumenes/$fbase.pdf
qpdf --collate --empty --pages ../resumenes/$fbase.pdf 1-1 -- ../resumenes/$fbasetemp.pdf
mv ../resumenes/$fbasetemp.pdf ../resumenes/$fbase.pdf
done
