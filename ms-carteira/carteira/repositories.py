from django.db.models import Sum
from .models import Transacao, Ativo

class TransacaoRepository:
    @staticmethod
    def get_all():
        return Transacao.objects.all().order_by('-data')

    @staticmethod
    def get_by_id(transacao_id):
        return Transacao.objects.filter(id=transacao_id).first()

    @staticmethod
    def save(transacao):
        transacao.save()
        return transacao

    @staticmethod
    def delete(transacao):
        transacao.delete()

    @staticmethod
    def get_saldo_total():
        receitas = Transacao.objects.filter(tipo='RECEITA').aggregate(total=Sum('valor'))['total'] or 0
        despesas = Transacao.objects.filter(tipo='DESPESA').aggregate(total=Sum('valor'))['total'] or 0
        return receitas - despesas

class AtivoRepository:
    @staticmethod
    def get_all():
        return Ativo.objects.all().order_by('-data_aquisicao')

    @staticmethod
    def get_by_id(ativo_id):
        return Ativo.objects.filter(id=ativo_id).first()

    @staticmethod
    def save(ativo):
        ativo.save()
        return ativo

    @staticmethod
    def delete(ativo):
        ativo.delete()
