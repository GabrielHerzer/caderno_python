ex 1 
numero1 = int(input('digite o primeiro número: '))
numero2 = int(input('digito o segundo número: '))

soma = numero1 + numero2

print('a soma dos dois dúmeros é:', soma)
ex 2
metro = int(input('valor em metro:'))

milimetros = metro * 1000

print('o valor é', milimetros)

ex 3
dias = int(input('dias'))
horas = int(input('horas'))
minuto = int(input('minuto'))
segundo = int(input('segundo'))

total_de_tempo = ((dias * 24 + horas) * 60 + minuto) * 60 + segundo
print ('o valor em segundos é:', total_de_tempo)
ex 4
salario = int(input('salario: '))
porcentagem = int(input('porcentagem: '))

aumento = (salario * porcentagem / 100)
novo_salario = salario + aumento

print('valor do aumento:', aumento)
print('novo slario:', novo_salario)

ex 5
produto = int(input('valor do produto: '))
desconto = int(input('valor do desconto: '))

desc = (produto * desconto / 100 )
valor_total = produto - desc

print('valor do desconto: ', desc)
print('valor final: ', valor_total
ex 6
distancia = int(input('distancia: '))
velocidade = int(input('velocidade: '))

tempo = (distancia / velocidade)

print('tempo: ', tempo)
ex 7
temperatura = int(input('temperatura: '))

f0 = ( temperatura * 9 / 5 ) + 32

print('f0: ', f0)
ex 8
temperatura = int(input('temperatura: '))

c = ( temperatura - 32 ) * 5 / 9

print('c: ', c)
ex 9
km = int(input('km : '))
dias = int(input('dias :'))

valor = (( km * 0.15 ) + dias * 60 )

print('valor total: ', valor)
ex 10
ano = int(input('ano : '))
cigaros = int(input('cigaros : '))

vida_perdida = (cigaros * 365 * ano) * 10
dias_perdidos = ( vida_perdida / (60 * 24))

print('total de dias de vida perdidos: ', dias_perdidos)
ex 11
numero = 2 ** 10000

quantidade_de_carcteres = len(str(numero))

print('quantidade_de_carcteres:', quantidade_de_carcteres)