#!/bin/bash


# create variable 
name="hello"
id=123
readonly id

# print variable
echo $name
echo ${name} 

# concat string
echo 'concat:'${name}'+'${id}

var=${name}':'${id}
echo ${var}

# get string length
echo ${#var}

# substring length
echo ${var:0:4}

# delete variable
unset name

:<<EOF
注释内容...
注释内容...
注释内容...
EOF

:<<'
注释内容...
注释内容...
注释内容...
'

:<<!
注释内容...
注释内容...
注释内容...
!


