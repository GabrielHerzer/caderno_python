ex1 
nota = float(input("Digite uma nota entre 0 e 10: "))

while nota < 0 or nota > 10:
    print("Valor inválido!")
    nota = float(input("Digite uma nota entre 0 e 10: "))
    
if nota > 0 or nota < 10:
    print("Nota válida:", nota)

ex2
usuario = input("Digite o nome de usuário: ")
senha = input("Digite a senha: ")

while senha == usuario:
    print("A senha não pode ser igual ao nome de usuário.")
    
    usuario = input("Digite o nome de usuário: ")
    senha = input("Digite a senha: ")

print("Cadastro realizado com sucesso")
ex3 
populacao_a = 80000
populacao_b = 200000
anos = 0

while populacao_a < populacao_b:
    populacao_a = populacao_a * 1.03
    populacao_b = populacao_b * 1.015
    anos += 1

print("Serão necessários", anos, "anos.")
print("População de A:", populacao_a)
print("População de B:", populacao_b)
ex4
n = int(input("Digite a posição: "))

anterior = 1
atual = 1
contador = 2

while contador < n:
    proximo = anterior + atual
    anterior = atual
    atual = proximo
    contador += 1

print("O Fibonacci é:", atual)
ex5
a = int(input("Digite o primeiro número: "))
b = int(input("Digite o segundo número: "))

while b != 0:
    a, b = b, a % b

print("O MDC é:", a)