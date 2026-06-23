from .models import Simulacao

class SimulacaoRepository:
    @staticmethod
    def get_all():
        return Simulacao.objects.all().order_by('-data_simulacao')

    @staticmethod
    def save(simulacao):
        simulacao.save()
        return simulacao
