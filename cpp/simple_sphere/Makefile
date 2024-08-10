#############################################################
#                                                           #
# This program code belongs to the book                     #
# "Computational Granular Dynamics" by                      #
# Thorsten Poeschel and Thomas Schwager.                    #
# ISBN: 3-540-21485-2                                       #
# http://www.springeronline.com/3-540-21485-2               #
#                                                           #
# If you use the code for scientific purposes, please,      #
# cite it as                                                #
# "Computational Granular Dynamics"                         #
# by T. Poeschel and T. Schwager.                           #
# Springer (Berlin, New York, 2005). 322pp.                 #
# For commercial use, please contact the authors.           #
#                                                           #
# Copyright (C) 2003,                                       #
# Thorsten Poeschel (thorsten.poeschel@charite.de)          #
# Thomas Schwager (thomas.schwager@charite.de)              #
# This program code is distributed without any warranty.    #
#                                                           #
#############################################################

#.SUFFIXES:.cc .o
CC=g++
CFLAGS= -Wall
CFLAGS+= -O3 
#CFLAGS+= -gstabs+
#CFLAGS+= -pg

LINKER= $(CC)
LFLAGS= $(CFLAGS)

SRC = common.sphere.cpp simple.sphere.cpp Sphere.cpp

OBJ = $(SRC:.cpp=.o)

HEADERS= common.h Sphere.h Vector.h SimpleVector.h

EXEC = simple.sphere

%.o:	%.cpp $(HEADERS)
	$(CC) -c $(CFLAGS) $< -o $@

all:	$(HEADERS) $(EXEC)

$(EXEC): 	$(OBJ)
		$(LINKER) $(LFLAGS) $(OBJ) -o $@

clean:
	rm -f *.o; rm -f $(EXEC); rm -f core; rm -f *.out; rm -f *~;



