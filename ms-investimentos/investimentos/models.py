from django.db import models

class Simulacao(models.Model):
    valor_utilizado = models.DecimalField(max_digits=15, decimal_places=2)
    meses = models.IntegerField()
    taxa_juros = models.DecimalField(max_digits=5, decimal_places=4) # ex: 0.0100 for 1%
    valor_projetado = models.DecimalField(max_digits=15, decimal_places=2)
    data_simulacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Simulação de R$ {self.valor_utilizado} por {self.meses} meses"
