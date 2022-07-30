node renderer.js $1.txt ../resumenes/$1.html
google-chrome --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf-no-header --print-to-pdf="$1.pdf" ../resumenes/$1.html
mv $1.pdf ../resumenes/$1.pdf
qpdf --collate --empty --pages ../resumenes/$1.pdf 1-1 -- ../resumenes/$1temp.pdf
mv ../resumenes/$1temp.pdf ../resumenes/$1.pdf
open ../resumenes/$1.pdf
