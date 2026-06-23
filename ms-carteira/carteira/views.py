from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Transacao, Ativo
from .serializers import TransacaoSerializer, AtivoSerializer
from .repositories import TransacaoRepository, AtivoRepository
from .services import TransacaoService

class TransacaoViewSet(viewsets.ModelViewSet):
    queryset = Transacao.objects.all().order_by('-data')
    serializer_class = TransacaoSerializer

    def list(self, request, *args, **kwargs):
        queryset = TransacaoRepository.get_all()
        serializer = self.get_serializer(queryset, many=True)
        saldo_total = TransacaoService.get_saldo_total()
        
        return Response({
            'saldo_total': float(saldo_total),
            'transacoes': serializer.data
        })

class AtivoViewSet(viewsets.ModelViewSet):
    queryset = Ativo.objects.all().order_by('-data_aquisicao')
    serializer_class = AtivoSerializer
