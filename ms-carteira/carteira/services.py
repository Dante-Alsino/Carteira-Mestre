from .repositories import TransacaoRepository, AtivoRepository

class TransacaoService:
    @staticmethod
    def get_saldo_total():
        return TransacaoRepository.get_saldo_total()

class AtivoService:
    pass
