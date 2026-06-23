from rest_framework import serializers
from .models import Simulacao

class SimulacaoSerializer(serializers.ModelSerializer):
    valor_projetado = serializers.DecimalField(max_digits=15, decimal_places=2, read_only=True)

    class Meta:
        model = Simulacao
        fields = '__all__'
