def func(a,b,c):
    p=b*b-4*a*c
    if p<0:
        return 'error'
    elif p==0:
        return -b/(2*a)
    else:
        x1=(-b+p)/(2*a)
        x2=(-b-p)/(2*a)
        return x1,x2
        