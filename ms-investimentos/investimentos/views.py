from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Simulacao
from .serializers import SimulacaoSerializer
from .services import SimulacaoService

class SimulacaoViewSet(viewsets.ModelViewSet):
    queryset = Simulacao.objects.all().order_by('-data_simulacao')
    serializer_class = SimulacaoSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        dados = serializer.validated_data
        valor_utilizado = dados['valor_utilizado']
        meses = dados['meses']
        taxa_juros = dados['taxa_juros']
        
        valor_projetado = SimulacaoService.calcular_juros_compostos(
            valor=valor_utilizado,
            meses=meses,
            taxa_juros=taxa_juros
        )
        
        serializer.save(valor_projetado=valor_projetado)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
