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

#include "common.h"
#include "Sphere.h"                 /* <===== replace this line if necessary */
using namespace std;

double Time=0, timestep;
int nstep, nprint, nenergy;
Vector G;
double lx, ly, x_0, y_0;
vector<Sphere> particle;            /* <===== replace this line if necessary */
unsigned int no_of_particles;

ofstream fphase("phase.dat"), flast("lastframe.dat"), fenergy("energy.dat");

void init_system(char * fname);
double total_kinetic_energy();
int main(int argc, char ** argv)
{
  if(argc!=2){
    cerr << "usage: " << argv[0] << " particle_initfile\n";
    exit(0);
  }
  fenergy.precision(10);
  init_system(argv[1]);
  init_algorithm();
  phase_plot(fphase);
  for(int i=0;i<nstep;i++){
    step();
    if((i+1)%nprint==0){
      cout << "phase_plot: " << i+1 << "  " << particle.size() << " particles\n";
      phase_plot(fphase);
    }
    if((i+1)%nenergy==0){
      fenergy << Time << "\t" << total_kinetic_energy() << endl;
    }
  }
  phase_plot(flast);
}
void integrate()
{
  for(unsigned int i=0;i<particle.size();i++){
    if(particle[i].ptype()==0) {
      particle[i].set_force_to_zero();
      particle[i].predict(timestep); 
    } else {
      particle[i].boundary_conditions(i,timestep, Time);
    }
  }
  make_forces();
  for(unsigned int i=0;i<particle.size();i++){
    if(particle[i].ptype()==0) particle[i].correct(timestep);
  }
  for(unsigned int i=0;i<particle.size();i++){
    particle[i].periodic_bc(x_0, y_0, lx, ly);
  }
  Time+=timestep;
}
void init_system(char * fname)
{
  ifstream fparticle(fname);
  while(fparticle.peek()=='#'){
    string type;
    fparticle >> type;
    if(type=="#gravity:"){
      fparticle >> G.x() >> G.y() >> G.phi();
      fparticle.ignore(100,'\n');
      cout << "gravity: " << G << endl;
    } else if(type=="#Time:"){
      fparticle >> Time;
      fparticle.ignore(100,'\n');
      cout << "Time: " << Time << endl;
    } else if(type=="#nstep:"){
      fparticle >> nstep;
      fparticle.ignore(100,'\n');
      cout << "nstep: " << nstep << endl;
    } else if(type=="#timestep:"){
      fparticle >> timestep;
      fparticle.ignore(100,'\n');
      cout << "timestep: " << timestep << endl;
    } else if(type=="#nprint:"){
      fparticle >> nprint;
      fparticle.ignore(100,'\n');
      cout << "nprint: " << nprint << endl;
    } else if(type=="#nenergy:"){
      fparticle >> nenergy;
      fparticle.ignore(100,'\n');
      cout << "nenergy: " << nenergy << endl;
    } else if(type=="#lx:"){
      fparticle >> lx;
      fparticle.ignore(100,'\n');
      cout << "lx: " << lx << endl;
    } else if(type=="#ly:"){
      fparticle >> ly;
      fparticle.ignore(100,'\n');
      cout << "ly: " << ly << endl;
    } else if(type=="#x_0:"){
      fparticle >> x_0;
      fparticle.ignore(100,'\n');
      cout << "x_0: " << x_0 << endl;
    } else if(type=="#y_0:"){
      fparticle >> y_0;
      fparticle.ignore(100,'\n');
      cout << "y_0: " << y_0 << endl;
    } else {
      cerr << "init: unknown global property: " << type << endl;
      abort();
    }
  }
  while(fparticle){
    Sphere pp;
    fparticle >> pp;
    if(fparticle){
      particle.push_back(pp);
    }
  }
  no_of_particles=particle.size();
  cout << no_of_particles << " particles read\n" << flush;
}
double total_kinetic_energy()
{
  double sum=0;
  for(unsigned int i=0;i<particle.size();i++){
    if(particle[i].ptype()==0){
      sum+=particle[i].kinetic_energy();
    }
  }
  return sum;
}
void phase_plot(ostream & os)
{
  os << "#NewFrame\n";
  os << "#no_of_particles: " << no_of_particles << endl;
  os << "#compressed: no\n";
  os << "#type: SphereXYPhiVxVyOmegaRMFixed25\n";
  os << "#gravity: " << G.x() << " " << G.y() << " " << G.phi() << endl;
  os << "#Time: " << Time << endl;
  os << "#timestep: " << timestep << endl;
  os << "#EndOfHeader\n";
  for(unsigned int i=0;i<particle.size();i++){
    os << particle[i];
  }
  os << flush;
}
