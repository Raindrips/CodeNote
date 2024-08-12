string="hello world 12345"

#string length
echo ${#string}

# get string index
echo ${string:0:4}

# find substring
string="Linux is a good operator system"
echo `expr index "${string}" good `


