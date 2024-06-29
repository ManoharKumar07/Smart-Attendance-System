from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

# Create your views here.
def Attendance(request):
    return HttpResponse("<h1> Attendance System</h1>")

def test(request):
    data = {
        "message": "test System"
    }
    return JsonResponse(data)
