#include <iostream>
#include "Factory.h"
#include "AA.h"

void test1() {
    Factory f;
    Draw* d = f.getDraw("Rectangle");
    d->draw();
    delete d;
    d = f.getDraw("Circle");
    d->draw();
    delete d;
    Rectangle* r=(Rectangle*)f.getDraw("Rectangle");
    r->change();
    delete r;
}

int main()
{
    test1();
}
