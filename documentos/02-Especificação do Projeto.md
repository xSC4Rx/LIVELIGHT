# Especificação do Projeto

## Perfis de Usuários

<table>
<tbody>
<tr align=center>
<th colspan="2">Perfil 1: Usuário Geral</th>
</tr>
<tr>
<td width="150px"><b>Descrição</b></td>
<td width="600px">
  O Usuário Geral é qualquer pessoa que precise calcular seu Índice de Massa Corporal (IMC) junto com consumo ideal de calorias por dia para entender sua saúde física. Ele pode ser uma pessoa de qualquer faixa etária ou condição física, interessado em verificar seu peso ideal ou monitorar mudanças ao longo do tempo.</td>
</tr>
<tr>
<td><b>Necessidades</b></td>
<td>
1. Calcular o IMC de forma simples e rápida; 
2. Calcular o consumo de calorias necessárias por dia de forma simples e rápida;  
3. Receber orientações sobre o significado do valor obtido na calculadora de IMC (por exemplo, se está abaixo do peso, com peso normal, sobrepeso ou obesidade);
4. Receber orientações sobre o significado do valor obtido na calculadora de consumo calórico (por exemplo, quanto se deve consumir de calorias ao dia para que atinja seus objetivos); 
5. Acompanhamento constante e sugestões de metas (se o IMC está dentro ou fora do intervalo ideal);
6. Acesso a um histórico de IMC, caso deseje monitorar variações ao longo do tempo; 
7. Integração com outras ferramentas de acompanhamento de saúde, como consumo de calorias e apresentar uma tabela de sugestões de alimentos; 
8. Definir e definir/personalizar suas metas especificas de performance.
</td>
</tr>
</tbody>
</table>

<table>
<tbody>
<tr align=center>
<th colspan="2">Perfil 2: Profissional de Saúde (Médico, Nutricionista, Personal Trainer)</th>
</tr>
<tr>
<td width="150px"><b>Descrição</b></td>
<td width="600px">
Este perfil inclui profissionais que utilizam a ferramenta para avaliar rapidamente o IMC e a ingestão calórica diária de seus pacientes ou clientes como parte do processo de diagnóstico ou acompanhamento de saúde.
</tr>
<tr>
<td><b>Necessidades</b></td>
<td>
1. Calcular IMC e a ingestão calórica diária de forma eficiente, com a possibilidade de adicionar outras informações relevantes (como idade e sexo) para cálculos mais precisos; 
2. Possibilidade de gerar relatórios com histórico do IMC dos pacientes/clientes; 
3. Opção de personalizar a interface e resultados para melhor atender a casos específicos. 
</td>
</tr>
</tbody>
</table>

## Histórias de Usuários

Foram identificadas as seguintes histórias de usuários:

|EU COMO... `QUEM`   | QUERO/PRECISO ... `O QUE` |PARA ... `PORQUE`                 |
|--------------------|---------------------------|----------------------------------|
| Usuário Comum      | Calcular meu IMC e a ingestão calórica diária | Acompanhar minha saúde e controlar meu peso, apresentar. |
| Usuário Comum      | Visualizar meu histórico de IMC em um gráfico | Ter uma visão melhor da minha evolução de peso. |
| Usuário Comum      | Entrar em contato com um profissional da saúde| Obter orientação sobre minha saúde. | 
| Profissional da Saúde | Responder mensagens dos usuários | Fornecer suporte e aconselhamento sobre saúde. |
| Usuário Comum  | Definir metas de peso e acompanhamento | Melhorar meu controle de peso e saúde. |
| Usuário Comum  | Visualizar um histórico mais detalhado do meu IMC   | Monitorar minha performance e ajustes na alimentação e treinamento. |
| Usuário Comum  | Acessar conteúdo especializado para atletas | Melhorar meu desempenho esportivo. |


## Requisitos do Projeto

### Requisitos Funcionais

|ID     | Descrição                | Prioridade |
|-------|---------------------------------|----|
| RF-01 | Cadastro: (Usuário comum, cadastro usuário profissional da saúde). | Alta |
| RF-02 | Login. | Alta |
| RF-03 | Recuperação de senha atravez de palavras chaves. | Alta |
| RF-04 | Permitir que o usuário calcule seu IMC a partir de peso e altura. | Alta |
| RF-05 | Permitir que o usuário calcule a ingestão calórica diária. | Alta |
| RF-06 | Exibir um histórico de IMC para cada usuário. | Alta |
| RF-07 | Exibir um histórico de consumo calórico para cada usuário. | Alta |
| RF-08 | Permitir que o usuário envie mensagens para profissionais da saúde. | Alta |
| RF-09 | Permitir que profissionais da saúde visualizem duvidas geradas por usuarios. | Alta |
| RF-10 |  Permitir que usuários definam metas de peso e acompanhem seu progresso. | Alta |

**Prioridade: Alta / Média / Baixa. 

### Requisitos não Funcionais

|ID      | Descrição               |Prioridade |
|--------|-------------------------|----|
| RNF-01 | O sistema deve ser responsivo. | Alta | 
| RNF-02 | Os dados do histórico de IMC devem ser armazenados de forma segura. | Alta | 
| RNF-03 | A interface deve ser intuitiva e fácil de usar. | Média | 

**Prioridade: Alta / Média / Baixa. 

