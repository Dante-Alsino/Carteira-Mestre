from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from investimentos.views import SimulacaoViewSet

router = DefaultRouter()
router.register(r'simulacoes', SimulacaoViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
