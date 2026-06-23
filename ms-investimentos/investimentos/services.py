from decimal import Decimal

class SimulacaoService:
    @staticmethod
    def calcular_juros_compostos(valor, meses, taxa_juros):
        montante = float(valor) * ((1 + float(taxa_juros)) ** meses)
        return Decimal(str(round(montante, 2)))
