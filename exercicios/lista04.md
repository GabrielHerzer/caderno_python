ex1
import random

lista = random.sample(range(1,100),10)

maior = lista[0] 
menor = lista[0]

for num in lista:
  if num > maior:
    maior = num
  if num < menor:
    menor = num

print("Lista:", lista)
print("Maior valor:", maior)
print("Menor valor:", menor)
ex2
import random

list = random.sample(range(1,100),20)
pares = []
impares = []
for num in list:
    if num % 2 == 0:
        pares.append(num)
for num in list:
    if num % 2 == 1:
        impares.append(num)
print('lista', list )
print('pares', pares)
print('impares', impares)
ex3
import random

lista1 = random.sample(range(1,100), 10)
lista2 = random.sample(range(1,100), 10)
lista3 = []

for a, b in zip(lista1, lista2):
  lista3.append(a)
  lista3.append(b)
  lista3.sort()

print('lista1', lista1)
print('lista2', lista2)
print('lista3', lista3)
ex4
texto = '''The Python Software Foundation and the global Python
community welcome and encou
rage participation by everyone. Our community is based on
mutual respect, tolerance, and encouragement, and we are working to help each other live up
to these principles. We want our community to be more diverse: whoever you are, and
whatever your backgrou
nd, we welcome you.'''

texto = texto.lower()
texto = texto.replace (',', '').replace('.', '') .replace(':', '')
texto = texto.split ()

palavra = 'python'
resultado = [p for p in texto if p == 'python']
print(resultado)
ex5
texto = '''The Python Software Foundation and the global Python
community welcome and encou
rage participation by everyone. Our community is based on
mutual respect, tolerance, and encouragement, and we are working to help each other live up
to these principles. We want our community to be more diverse: whoever you are, and
whatever your backgrou
nd, we welcome you.'''

texto = texto.lower()
texto = texto.replace (',', '').replace('.', '') .replace(':', '')
texto = texto.split ()

alvo = ['p', 'y', 't', 'h', 'o', 'n']

resultado = [p for p in texto if sum(1 for letra in alvo if letra in p) >= 4]

print(resultado)

print(resultado)