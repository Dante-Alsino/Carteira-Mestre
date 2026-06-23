import json
import urllib.request
import urllib.error
from decimal import Decimal

class SimulacaoService:
    @staticmethod
    def get_saldo_da_carteira():
        # A URL aponta para o DNS interno do Docker: ms-carteira na porta 8000
        url = "http://ms-carteira:8000/api/transacoes/"
        try:
            req = urllib.request.Request(url)
            with urllib.request.urlopen(req, timeout=3) as response:
                if response.status == 200:
                    data = json.loads(response.read().decode('utf-8'))
                    return data.get('saldo_total')
        except (urllib.error.URLError, Exception) as e:
            # Captura falha de rede silenciosamente para permitir o fallback
            print(f"Alerta: Falha ao comunicar com ms-carteira: {str(e)}")
            return None
        return None

    @staticmethod
    def calcular_juros_compostos(valor, meses, taxa_juros):
        montante = float(valor) * ((1 + float(taxa_juros)) ** meses)
        return Decimal(str(round(montante, 2)))
