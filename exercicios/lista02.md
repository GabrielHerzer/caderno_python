ex1:
lado1 = float(input("Digite o primeiro lado: "))
lado2 = float(input("Digite o segundo lado: "))
lado3 = float(input("Digite o terceiro lado: "))

if lado1 + lado2 > lado3 and lado1 + lado3 > lado2 and lado2 + lado3 > lado1:
    print("Os valores formam um triângulo.")

    if lado1 == lado2 == lado3:
        print("O triângulo é equilátero.")
    elif lado1 == lado2 or lado1 == lado3 or lado2 == lado3:
        print("O triângulo é isósceles.")
    else:
        print("O triângulo é escaleno.")
else:
    print("Os valores não formam um triângulo.")
ex2:
ano = int(input("Digite um ano: "))

if ano % 400 == 0 or (ano % 4 == 0 and ano % 100 != 0):
    print("O ano é bissexto")
else:
    print("O ano não é bissexto")
ex3:
peixe = int(input('numero de peixe: '))
limite = 50
if peixe > limite:
    execesso = peixe - limite
    multa = execesso * 4
    print('o valor da multa é: ',multa )
else:
    print('joão não excedeu o limite')
ex4:
n1 = int(input('insira numero 1: '))
n2 = int(input('insira numero 2: '))
n3 = int(input('insira numero 3: '))
if n1 > n2 and n1 > n3:
    print('numero maior: ',n1)
if n2 > n1 and n2 > n3:
    print('numero maior: ',n2)
if n3 > n2 and n3 > n1:
    print('numero maior: ',n3)
if n1 == n2 == n3:
    print('são iguais')
ex5:
n1 = int(input('insira numero 1: '))
n2 = int(input('insira numero 2: '))
n3 = int(input('insira numero 3: '))
if n1 > n2 and n1 > n3:
    print('numero maior: ',n1)
if n2 > n1 and n2 > n3:
    print('numero maior: ',n2)
if n3 > n2 and n3 > n1:
    print('numero maior: ',n3)
if n1 == n2 == n3:
    print('são iguais')

if n1 < n2 and n1 < n3:
    print('menor numero: ',n1)
if n2 < n1 and n2 < n3:
    print('manor numero: ',n2)
if n3 < n1 and n3 < n2:
    print('menor numero: ',n3)
ex6:
renda_hora = int(input('renda por hora: '))
horas = int(input('horas por dia: '))
dias = int(input('dias de trabalho: '))

salario_total = renda_hora * horas * dias
inss = salario_total * 0.08
ir = salario_total * 0.11
sindicato = salario_total * 0.05
salario_liquido = salario_total - (ir + inss + sindicato)
print('salario liquido: ',salario_liquido)
print('salario bruto: ',salario_total)
print('valor do inss: ',inss)
print('valor do ir: ',ir)
print('valor do sindicato: ',sindicato)
ex7:
area = float(input("Digite a área a ser pintada em m²: "))

litros = area / 3
latas = int(litros / 18)

if litros % 18 != 0:
    latas = latas + 1

preco = latas * 80

print("Quantidade de latas:", latas)
print("Preço total: R$", preco)