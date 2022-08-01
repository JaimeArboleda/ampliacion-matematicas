node renderer.js $1.txt ../rendered/$1.html
google-chrome --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf-no-header --print-to-pdf="$1.pdf" ../rendered/$1.html
mv $1.pdf ../rendered/$1.pdf
qpdf --collate --empty --pages ../rendered/$1.pdf 1-1 -- ../rendered/$1temp.pdf
mv ../rendered/$1temp.pdf ../rendered/$1.pdf
open ../rendered/$1.pdf
