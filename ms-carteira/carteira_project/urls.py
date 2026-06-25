from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from carteira.views import TransacaoViewSet, AtivoViewSet

router = DefaultRouter()
router.register(r'transacoes', TransacaoViewSet)
router.register(r'ativos', AtivoViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
