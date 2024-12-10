from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.urls import re_path as url
from django.views.generic.base import TemplateView

urlpatterns = [ # URL Tömb amibe felsoroljuk az összes .HTML kiterjesztésű fájlt
    # Admin Site URL
    path('admin/', admin.site.urls),
    # Countdown URL
    url(r'^$', TemplateView.as_view(template_name='static_pages/index.html'), name='index'),
    # Főoldal URL
    url('fooldal/', TemplateView.as_view(template_name='static_pages/fooldal.html'), name='home'),
    # News URL
    url('news/', TemplateView.as_view(template_name='static_pages/news.html'), name='news'),
    # Table URL
    url('table/', TemplateView.as_view(template_name='static_pages/table.html'), name='home'),
    
]
# Weboldal összes .css, .js és Kép fájljai.
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)