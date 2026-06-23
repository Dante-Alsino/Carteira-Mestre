from django.db import models

class Transacao(models.Model):
    TIPO_CHOICES = [
        ('RECEITA', 'Receita'),
        ('DESPESA', 'Despesa'),
    ]

    descricao = models.CharField(max_length=255)
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES)
    valor = models.DecimalField(max_digits=12, decimal_places=2)
    data = models.DateField()

    def __str__(self):
        return f"{self.descricao} ({self.tipo}) - R$ {self.valor}"

class Ativo(models.Model):
    ticker = models.CharField(max_length=20)
    quantidade = models.IntegerField()
    preco_medio = models.DecimalField(max_digits=12, decimal_places=2)
    data_aquisicao = models.DateField()

    def __str__(self):
        return f"{self.ticker} - {self.quantidade} cotas"
