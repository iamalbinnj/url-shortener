import string, random
from django.shortcuts import get_object_or_404, redirect
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import URL
from .serializers import URLSerializer

def generate_code(length=6):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

@api_view(['POST'])
def create_short_url(request):
    long_url = request.data.get('long_url')
    code = generate_code()
    while URL.objects.filter(short_code=code).exists():
        code = generate_code()
    url = URL.objects.create(long_url=long_url, short_code=code)
    return Response(URLSerializer(url).data)

def redirect_url(request, code):
    url = get_object_or_404(URL, short_code=code)
    return redirect(url.long_url)

@api_view(['GET'])
def list_urls(request):
    urls = URL.objects.all()
    return Response(URLSerializer(urls, many=True).data)
