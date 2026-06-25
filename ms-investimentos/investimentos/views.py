from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
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
        # Extrai a intenção do usuário
        usar_saldo_carteira = dados.pop('usar_saldo_carteira', False)
        valor_utilizado = dados.get('valor_utilizado', None)
        meses = dados['meses']
        taxa_juros = dados['taxa_juros']
        
        # ====================================================
        # LÓGICA SOA + FALLBACK DE REDE (Resiliência)
        # ====================================================
        if usar_saldo_carteira:
            saldo_externo = SimulacaoService.get_saldo_da_carteira()
            if saldo_externo is not None:
                # O vizinho respondeu, injetamos o saldo real no cálculo
                valor_utilizado = saldo_externo
            else:
                # A rede vizinha caiu. Acionamos o FALLBACK.
                if valor_utilizado is None:
                    # Se o usuário não mandou um valor manual reserva, nós barrramos a operação.
                    raise ValidationError({
                        "erro": "Serviço de carteira indisponível no momento.",
                        "solucao": "Por favor, envie 'usar_saldo_carteira': false e forneça um 'valor_utilizado' manualmente para prosseguir a simulação."
                    })
        
        # Validação final de segurança
        if valor_utilizado is None:
            raise ValidationError({"valor_utilizado": "Este campo é obrigatório se 'usar_saldo_carteira' for falso ou se a carteira falhar."})
            
        # ====================================================
        
        # Calcula os juros reais
        valor_projetado = SimulacaoService.calcular_juros_compostos(
            valor=valor_utilizado,
            meses=meses,
            taxa_juros=taxa_juros
        )
        
        # Injeta o valor_utilizado final e salva no BD
        serializer.save(valor_projetado=valor_projetado, valor_utilizado=valor_utilizado)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
