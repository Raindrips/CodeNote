/*************************************************************/
/*                                                           */
/* This program code belongs to the book                     */
/* "Computational Granular Dynamics" by                      */
/* Thorsten Poeschel and Thomas Schwager.                    */
/* ISBN: 3-540-21485-2                                       */
/* http://www.springeronline.com/3-540-21485-2               */
/*                                                           */
/* If you use the code for scientific purposes, please,      */
/* cite it as                                                */
/* "Computational Granular Dynamics"                         */
/* by T. Poeschel and T. Schwager.                           */
/* Springer (Berlin, New York, 2005). 322pp.                 */
/* For commercial use, please contact the authors.           */
/*                                                           */
/* Copyright (C) 2003,                                       */
/* Thorsten Poeschel (thorsten.poeschel@charite.de)          */
/* Thomas Schwager (thomas.schwager@charite.de)              */
/* This program code is distributed without any warranty.    */
/*                                                           */
/*************************************************************/

/*************************************************************/
/*                                                           */
/* This program code belongs to the book                     */
/* "Computational Granular Dynamics" by                      */
/* Thorsten Poeschel and Thomas Schwager.                    */
/* ISBN: 3-540-21485-2                                       */
/* http://www.springeronline.com/3-540-21485-2               */
/*                                                           */
/* If you use the code for scientific purposes, please,      */
/* cite it as                                                */
/* "Computational Granular Dynamics"                         */
/* by T. Poeschel and T. Schwager.                           */
/* Springer (Berlin, New York, 2005). 322pp.                 */
/* For commercial use, please contact the authors.           */
/*                                                           */
/* Copyright (C) 2003,                                       */
/* Thorsten Poeschel (thorsten.poeschel@charite.de)          */
/* Thomas Schwager (thomas.schwager@charite.de)              */
/* This program code is distributed without any warranty.    */
/*                                                           */
/*************************************************************/

#ifndef _common_h
#define _common_h

#include <math.h>
#include <fstream>
#include <vector>
#include <set>
#include <string>

using namespace std;

extern double lx, ly;
extern double x_0, y_0;

extern unsigned int no_of_particles;
extern double Time;
extern ofstream fphase;
extern ofstream fenergy;

void step();
void make_forces();
void integrate();
void init_algorithm();
void phase_plot(ostream & os);
#endif
