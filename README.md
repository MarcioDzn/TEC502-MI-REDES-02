## Como executar?
### API REST (Banco)

### Interface

## Organização do Projeto
O projeto é dividido em dois componentes principais:
- Banco (api)
    - Contém os arquivos referentes ao banco e suas funcionalidades, como criação de contas e transferências.
- Aplicação (interface)
    - Contém os arquivos referentes à interface gráfica, a qual permite ao usuário se registrar, efetuar login e realizar transferências.

## Banco
Os bancos realizam as funcionalidades principais do projeto, permitindo a criação de contas e a realização de transferências. Nesse sentido, o banco é uma API REST que pode se comunicar tanto com um cliente (interface) quanto com outros bancos por meio do protocolo HTTP.

### Arquitetura 
Os módulos principais utilizados no desenvolvimento do projeto são:
- `AccountDatabase`: Referente ao banco de dados responsável por armazenas as contas bancárias criadas;
- `AccountModel`: Referente ao modelo de informações para criação das contas bancárias;
- `TransferModel`: Referente ao modelo de informações relacionado às transferências;
- `UserDatabase`: Referente ao banco de dados responsável por armazenas os usuários criados;
- `UserModel`: Referente ao modelo de informações para criação dos usuários;
- `Token`: Referente às informações relacionadas ao token que circula na rede durante o funcionamento do sistema;
- `utils`: Referente à funções diversas do programa, como geração de id's e tokens de autenticação;
- `app`: Refernte à API do banco e à funções de manipulação do token na rede.

### AccountModel
As informações representadas pela classe `AccountModel` são:
- `_id`: Referente ao id de identificação exclusiva da conta;
- `account_type`: Referente ao tipo da conta, "normal" ou "conjunta";
- `users`: Lista de ids de usuários associados à conta;
- `password`: Senha da conta;
- `balance`: Saldo da conta;
- `blocked_transferred_balance`: Lista de transferências em andamento, representa o saldo bloqueado durante o processo;
- `transfer_history`: Lista de todas as transferências já realizadas ou que iniciaram mas foram interrompidas.

### UserModel
As informações representadas pela classe `UserModel` são:
- `_id`: Referente ao id de identificação exclusivo do usuário;
- `name`: Nome do usuário;
- `user_type`: Tipo de usuário, "pessoa física" ou "pessoa jurídica";
- `CPF`: CPF do usuário, preenchido apenas se for pessoa física;
- `CNPJ`: CNPJ do usuário, preenchido apenas se for pessoa jurídica.

### TransferModel
As informações representadas pela classe `TransferModel` são:

- `id`: Referente ao id de identificação da transferência;
- `operation_id`: Referente ao id de identificação da operação (grupo de transferências);
- `status`: Status da operação, "pending", "done" ou "error";
- `amount`: Quantidade sendo transferida;
- `source`: Agência de origem da transferência
- `account_source_id`: Conta de origem da transferência
- `destination`: Agência de destino da transferência
- `account_dest_id`: Conta de destino da transferência

### API
Para o desenvolvimento da API REST, utilizou-se o framework Flask, na linguagem de programação Python. 

O acesso à API se dá a partir do endereço base `http://<ip>:8080/v1/api/`, no qual o `<ip>` é o endereço ip da máquina executando o arquivo.

A API conta com diferentes rotas para variadas funcionalidades, tais como gerenciamento de contas, transferências bancárias e passagem do token pela rede.

#### Gerenciamento de contas
Uma importante funcionalidade da API é a criação e a busca de contas. Para tanto, as seguintes rotas são utilizadas:

#### POST /accounts
Rota responsável pela criação de uma conta bancária.

Corpo da requisição:
<div align="center">
  <img src="media/create-account.png" alt="Criação de uma nova conta" height="270px" width="auto" />
  <br/> <em>Figura X. Corpo padrão da requisição para criação de uma nova conta.</em> <br/>
  <br/>
</div>

Resposta: 
<div align="center">
  <img src="media/create-account-response.png" alt="Resposta da criação de uma nova conta" height="140px" width="auto" />
  <br/> <em>Figura X. Resposta da requisição para criação de uma nova conta.</em> <br/>
  <br/>
</div>

> O campo `token` refere-se ao token de autenticação

#### GET /accounts
Rota responsável por retornar as contas criadas.

Resposta:
<div align="center">
  <img src="media/get-account-response.png" alt="Resposta da busca por todas as contas" height="400px" width="auto" />
  <br/> <em>Figura X. Resposta da requisição para busca de todas as contas.</em> <br/>
  <br/>
</div>

##### Parâmetros
É possível utilizar dois parâmetros para realizar a filtragem dos dados retornados, sendo eles:
- **cpf**: Permite que apenas as contas com um determinado CPF sejam retornadas
    - Exemplo: `/v1/api/accounts?cnpj=11.111.111/1111-11`
- **cnpj**: Permite que apenas as contas com um determinado CNPJ sejam retornadas
    - Exemplo: `/v1/api/accounts?cpf=111.111.111-11`

#### GET /accounts/:id
Rota responsável por retornar uma conta com um id em específico.

Resposta:
<div align="center">
  <img src="media/get-account-by-id.png" alt="Resposta da busca de uma conta pelo id" height="400px" width="auto" />
  <br/> <em>Figura X. Resposta da requisição para busca de uma conta com id em específico.</em> <br/>
  <br/>
</div>

#### GET /accounts/all/:id
Rota responsável por retornar TODAS as contas de um usuário (de todos os bancos/APIs) com um determinado CPF ou CNPJ.

Resposta:
<div align="center">
  <img src="media/get-all-accounts.png" alt="Resposta da busca de uma conta em todos os bancos pelo id" height="700px" width="auto" />
  <br/> <em>Figura X. Resposta da requisição para busca de todas as contas de um usuário em específico.</em> <br/>
  <br/>
</div>

> Como podem ser feitas várias outras requisições dentro da requisição principal, o tempo de resposta pode ser alto.

### Token
Para que o sistema funcione corretamente é necessário que um token especial circule entre as máquinas. Dessa forma, as rotas referentes a essa funcionalidade são:
#### GET /token
Rota responsável por retornar o status do token de uma determinada máquina. Esse endpoint é utilizado entre bancos, não havendo requisição direta do usuário final.

Respostas:
- Token presente na máquina
``` bash
STATUS: 200
    {
        "message": "active"
    }
```
- Token não presente na máquina
``` bash
STATUS: 200
    {
        "message": "undefined"
    }
```

#### POST /token
Rota responsável por passar o token de uma máquina a outra na rede. Também garante que tokens "inválidos" sejam descartados.

Corpo da requisição:
``` bash
    {
        "id": <id_atual_do_token>
    }
```

Respostas: 
- Token válido
``` bash
STATUS: 200
    {
        "message": "Token recebido com sucesso e alterado."
    }

```
- Token inválido
``` bash
STATUS: 200
    {
        "message": "Token recebido com sucesso mas não alterado (diferentes ids)."
    }

```

### Transferências
A transferência de saldo entre diferentes contas é parte fundamental de um sistema bancário. Nesse sentido, o sistema contém rotas responsáveis por garantir a execução e a confiabilidade dessa operação.

#### PATCH /transfers
Responsável pela transferência atômica entre dois bancos, podendo realizar uma ou mais transações por vez.

Corpo da requisição:
<div align="center">
  <img src="media/transfer.png" alt="Corpo da requisição para realizar uma transferência" height="700px" width="auto" />
  <br/> <em>Figura X.5. Corpo da requisição para uma transferência.</em> <br/>
  <br/>
</div>

Na figura X.5, o campo `transfers` representa uma lista de transferências, onde cada elemento é o objeto:
```bash
    {
        "source": <agencia_de_origem>,
        "destination": <agencia_de_destino>,
        "account_source_id": <id_da_conta_de_origem>,
        "account_dest_id": <id_da_conta_de_destino>,
        "amount": <valor_a_ser_transferido>
    } 
```

Respostas:
- Transferência realizada com sucesso
<div align="center">
  <img src="media/transfer-error.png" alt="Corpo da requisição para realizar uma transferênciaErro durante uma transferência" height="150px" width="auto" />
  <br/> <em>Figura X.5. Erro durante uma transferência.</em> <br/>
  <br/>
</div>

- Erro durante a transferência

<div align="center">
  <img src="media/transfer-error.png" alt="Erro durante uma transferência" height="150px" width="auto" />
  <br/> <em>Figura X.5. Erro durante uma transferência.</em> <br/>
  <br/>
</div>

#### PATCH /prepare
#### PATCH /commit
#### PATCH /rollback

## Transferência
### 2PC (Transação atômica)
### Sincronização (Lista de operações - só a primeira funciona - só pra lembrar)

## Concorrência distribuída (token)
### Funcionamento teórico
### Funcionamento prático

### Confiabilidade
#### Máquina sem o token caiu
#### Máquina com o token caiu

## Situação da transação concorrente

## Interface gráfica
### Autenticação
#### Registro
#### Login

### Transferência