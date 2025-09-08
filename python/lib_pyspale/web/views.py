# coding=utf-8
from django.http import HttpResponse
from django.shortcuts import render

def index(request):
    if request.method == 'GET':
        return render(request, 'index.html')
    if request.method == 'POST':
        x = request.POST['x']
        y = request.POST['y']
        z = int(x) + int(y)
        context = {"x":x, "y":y, "result":z}
        return render(request, 'index.html', context)
