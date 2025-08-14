from django.urls import path
from . import views

urlpatterns = [
    path('shorten/', views.create_short_url),
    path('list/', views.list_urls),
    path('<str:code>/', views.redirect_url),
]