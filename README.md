# Investigador de sazonalidade
Esse investigador usa o GBIF API para obter dados de distribuição de espécies em um site gerado por AstroJS.

## Alguns problemas
A API do gbif limita os mapas com range de mês para dentro de um ano, então não é possível fazer um range começando de dezembro e terminando em março. Por conta disso, estou considerando como verão dos meses 1-3 e inverno dos meses 7-9.
