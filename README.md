This project contains an engine for creating formatted documents. The source files must be placed in "text_sources", and there are two scripts that generate files.
* script.sh generates a single file, given a name (without extension: it is assumed that will be .txt). The option --open open the pdf in the end, and the option --keep-html does not remove the html (for debugging).
* script_all.sh generates all files in the folder, processing all the sources. The option --keep-html does not remove the html (for debugging).

On the other hand, the txt file can be created using a series of tags for formatting. There is a metadata section (specifying it is a single page file or not, the layout -one or two columns-, the title and the subject). 
And then, all sections, starting with begin_section (there, classes to be applied to all elements can be used, and boxed if the section should be placed inside a box)
For each element, the relevant tags are: 
* tx and btx (text and bullet text), for simple text. If LaTeX is inside, it should be created using $...$. 
* eq and beq (equation and bullet equation) for LaTeX with displaystyle. 
* img for placing an image. In case of an image, only the url should be located (the image must be in images folder), and also the size can be specified. 
Note that every element must contain one of the previous four classes. And then, we have: 
* cr, cb, cp, co, cg for colors. 
* ss, sn, sb, sh for sizes. 
* wb for bold. 
* i1 and i2 for two indentation levels. 
* pl, pc, pr for position. 

There are also two special line separators: 
* nl, for new emtpy line, and ln for creating a line with the <hr> tag. In case of ln, a color can be specified. 