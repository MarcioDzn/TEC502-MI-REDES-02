import requests, threading, jwt
from flask import Flask, request, jsonify
from flask_cors import CORS
from AccountModel import AccountModel
from AccountDatabase import AccountDatabase
from UserModel import UserModel
from UserDatabase import UserDatabase
from TransferModel import TransferModel
from Token import Token
from utils import *
from time import sleep, time
from threading import Thread, Lock
import os


from concurrent.futures import ThreadPoolExecutor, as_completed

account_db = AccountDatabase()
user_db = UserDatabase()

app = Flask(__name__)
CORS(app)

transfer_lock = Lock()
transfer_list_lock = Lock()

CURRENT_BANK = int(os.getenv('CURRENT_BANK'))
print(CURRENT_BANK)

BANKS = os.getenv('BANKS')

banks = {}
for i, bank in enumerate(BANKS.split("::")):
    banks[f"{i}"] = f"http://{bank}"

print(f"BANCOS: {banks}")

# banks = {
#    "0": "http://172.16.103.12:8080",
#    "1": "http://172.16.103.11:8080",
#    "2": "http://172.16.103.13:8080"
# }

transfer_list = {}

if (CURRENT_BANK == 0):
    token = Token("active")
    print("[TOKEN STATUS]: Token iniciado como ativo.")
else:
    token = Token("undefined")
    print("[TOKEN STATUS]: Token iniciado como inativo.")

transfer_list = {}

token = Token("active")
generate_token = True
bank_online = True
is_transferring = False


# MUDAR DEPOIS PRA FAZER TUDO AO MESMO TEMPO
def ask_for_token():
    for ip in banks.values():
        try:
            response = requests.get(f'{ip}/v1/api/token', timeout=1)

            if (response.json()["message"] == "active"):
                return True

        except:
            pass

    return False


def change_token_id():
    for ip in banks.values():
        try:
            response = requests.patch(f'{ip}/v1/api/token', data={"id": token.id}, timeout=(1/5))

        except:
            pass

    return False


# toma as medidas necessárias caso o token NÃO ESTEJA ATIVO no tempo previsto
def verify_token_active(check_interval_ms=1, timeout_seconds=20):
    start_time = time()

    # se o token não chegar em determinado tempo invalida gera um novo
    while (time() - start_time) < timeout_seconds:
        global generate_token
        if token.status == "active" or not generate_token:
            generate_token = True

            return
        sleep(check_interval_ms / 1000.0)  

    # manda uma mensagem pra todos perguntando se alguém tem o token
    print("Token inexistente")
    is_token_active = ask_for_token()

    # se ninguém tiver o token, gera um novo
    if (not is_token_active):
        token.set_status("active")
        token.set_id(token.id+1)

        # muda o id do token atual para todos os bancos conectados
        change_token_id()


# toma as medidas necessárias caso o token ESTEJA ATIVO por mais tempo que o previsto
def check_token_active(check_interval_ms=1, timeout_seconds=20):
    start_time = time()

    while (time() - start_time) < timeout_seconds:
        if token.status != "active":
            return
        
        sleep(check_interval_ms / 1000.0)  

    # seta a máquina como offline
    print("Token não consegue sair desta máquina")

    global bank_online
    bank_online = False


# envia o token a cada n segundos
def send_token():
    while True: 
        WAIT_TIME = 1

        next_bank = CURRENT_BANK + 1

        while (token.status == "active"):
            # se chegar no último banco da lista volta pra o início
            if len(banks.values()) <= next_bank:
                next_bank = 0

            # não se deve mandar o token pra si mesmo
            if next_bank == CURRENT_BANK:
                next_bank = next_bank + 1

            bank_ip = banks.get(str(next_bank))
            sleep(WAIT_TIME)

            global is_transferring
            while (is_transferring):
                pass

            try:
                response = requests.post(f'{bank_ip}/v1/api/token', json={"token": token.status, "id": token.id}, timeout=(WAIT_TIME/5))

                # Se o token não for recebido pela máquina seguinte é pq os ids não batem, mas o dessa máquina é inativado de qualquer forma
                if response.status_code == 200:
                    token.set_status("undefined")
                    print("[TOKEN STATUS]: Token inativo")

                    threading.Thread(target=verify_token_active, args=(1, 40)).start()

            except:
                next_bank = next_bank + 1
                print("[ERROR]: Não foi possível enviar o token para este banco. Tentando com o próximo da lista.")
    
    



@app.route('/v1/api/token', methods=["GET"])
def get_token_status():
    token_status = token.status

    # impede que um novo token seja gerado pois quem enviou esse request já está gerando
    global generate_token
    generate_token = False 

    return jsonify({"message": token_status}), 200


# recebe o token
@app.route('/v1/api/token', methods=["POST"])
def receive_token():
    data = request.get_json()

    # só altera o token se o id do token recebido for o do token "aplicado" na rede
    if (data["id"] >= token.id):
        token.set_status("active")
        if (data["id"] > token.id):
            token.set_id(data["id"])
        print("[TOKEN STATUS]: Token ativo\nId: {}".format(data["id"]))

        return jsonify({"message": "Token recebido com sucesso e alterado."}), 200

    return jsonify({"message": "Token recebido com sucesso mas não alterado (diferentes ids)."}), 200


@app.route('/v1/api/token', methods=["PATCH"])
def modify_token_id():
    data = request.get_json()

    token.set_id(data["id"])
    print("Id alterado para {}".format(data["id"]))

    return jsonify({"message": "Id alterado com sucesso"}), 200


@app.route('/v1/api/accounts', methods=["POST"])
def register_account():
    data = request.get_json()

    primary_name = data["primary_name"]
    primary_cpf = data["primary_cpf"]
    secondary_name = data["secondary_name"]
    secondary_cpf = data["secondary_cpf"]
    cnpj = data["cnpj"]
    user_type = data["user_type"].lower()
    account_type = data["account_type"].lower()
    password = data["password"]
    
    # garante que os tipos de conta sejam respeitados
    if account_type != "normal" and account_type != "conjunta":
        return jsonify({"message":"O tipo de conta pode ser apenas NORMAL ou CONJUNTA."}), 400

    if user_type != "fisica" and user_type != "juridica":
        return jsonify({"message":"O tipo de conta pode ser apena FISICA ou JURIDICA."}), 400
    
    if user_type == "juridica" and account_type == "conjunta":
        return jsonify({"message":"Pessoas jurídicas não podem participar de uma conta conjunta"}), 403
    
    # uma conta com usuário fisico deve ter pelo menos um nome e um cpf de usuário
    if (user_type == "fisica" and (not primary_name or not primary_cpf)):
        return jsonify({"message":"Uma conta deve ter pelo menos um usuário associado."}), 400
    
    # uma conta conjunta deve ter dois usuários com campos válidos
    if user_type == "fisica" and account_type == "conjunta" and (not secondary_name or not secondary_cpf):
        return jsonify({"message":"Contas conjuntas devem ter dois usuários associados"}), 400

    # garante que o CNPJ informado é válido
    if (user_type == "juridica" and not cnpj):
        return jsonify({"message":"Uma pessoa jurídica deve ter um CNPJ válido."}), 400
    
        
    # garante que campos indesejados não sejam adicionados
    if (user_type == "juridica"):
        primary_cpf = None

        # se o CNPJ for inválido retorna erro
        if (not validate_cnpj(cnpj)):
            return jsonify({"message":"CNPJ inválido"}), 400
        
    elif (user_type == "fisica"):
        cnpj = None

        if (not validate_cpf(primary_cpf)):
            return jsonify({"message":"CPF inválido"}), 400
    
        if (account_type == "conjunta"):
            if (not validate_cpf(secondary_cpf)):
                return jsonify({"message":"CPF inválido"}), 400

            # o CPF dos dois usuários não podem ser iguais
            if (primary_cpf == secondary_cpf):
                return jsonify({"message":"O CPF dos dois usuários não podem ser iguais"}), 400
        
    # deve haver apenas uma conta conjunta com um determinado CPF
        pass

    # deve haver apenas uma conta normal com um determinado CPF ou CNPJ
        pass

    # se o usuário já existe não precisa criar
    if (user_type == "fisica"):
        user = user_db.get_user_by_cpf(primary_cpf)
    
    if user_type == "juridica":
        user = user_db.get_user_by_cnpj(cnpj)
    
    print("[PRIMARY_CPF]: {}".format(primary_cpf))
    print("[CNPJ]: {}".format(cnpj))
    print("[USER]: {}".format(user))

    if user: 
        primary_user = user
    else:
        # criando o usuário assim que cadastrado
        id = 0 if len(list(user_db.users_db.items())) == 0 else (user_db.get_all_users()[-1]["_id"] + 1)
        print("[NOVO ID]: {}".format(id))
        primary_user = UserModel(primary_name, user_type, primary_cpf, id, cnpj)
        user_db.create_user(primary_user)

    secondary_user = None
    if (account_type == "conjunta"):
        user = user_db.get_user_by_cpf(secondary_cpf)
        if user: 
            secondary_user = user
        else:
            id = 0 if len(list(user_db.users_db.items())) == 0 else (user_db.get_all_users()[-1]["_id"] + 1)
            secondary_user = UserModel(secondary_name, user_type, secondary_cpf, id)
            user_db.create_user(secondary_user)

    new_account = AccountModel(primary_user, secondary_user, password, account_type)

    account_db.create_account(new_account)

    return jsonify({"message": "Conta criada com sucesso"}), 201


######## AUTENTICAÇÃO DA CONTA ########

@app.route('/v1/api/auth', methods=["POST"])
def auth():
    data = request.get_json()

    account_cpf = data["cpf"]
    account_cnpj = data["cnpj"]
    account_id = data["account_id"]
    password = data["password"]

    account = account_db.accounts_db.get(str(account_id))

    if (not account):
        return jsonify({"message": "Credenciais inválidas a."}), 401

    is_user_valid = False
    for user_id in account.users:
        user = user_db.get_user_by_id(user_id)
        if (account_cpf == user["cpf"] or account_cnpj == user["cnpj"]):
            is_user_valid = True

    if (not is_user_valid):
        return jsonify({"message": "Credenciais inválidas b."}), 401
    
    if (account.password != password):
        return jsonify({"message": "Credenciais inválidas c."}), 401
    

    auth_token = generate_jwt_token(account._id, 
                                    account_cpf if account_cpf else account_cnpj, 
                                    password)

    return jsonify({"token": auth_token}), 200

#######################################

@app.route('/v1/api/accounts', methods=["GET"])
def get_all_account():
    accounts = []

    cpf = request.args.get('cpf')
    cnpj = request.args.get('cnpj')
    acc_type = request.args.get('type')

    if (cpf == None and cnpj == None and acc_type == None):
        accounts = account_db.get_all_accounts()

    print("[CPF]: {}".format(cpf))
    # busca pelas contas a partir de cpf/cnpj/tipo
    if (cpf):
        accounts = account_db.get_accounts_by_cpf(cpf, user_db)
        print("[CONTAS ENCONTRADAS]: {}".format(accounts))

    if (cnpj and not accounts):
        accounts = account_db.get_accounts_by_cnpj(cnpj, user_db)

    if ((cpf or cnpj) and acc_type != None):
        filtered_accounts = []
        for account in accounts:
            if (account["account_type"] == acc_type):
                filtered_accounts.append(account)
        accounts = filtered_accounts

    # substitui os ids dos usuários por seus atributos
    for account in accounts:
        account["users"] = [user_db.get_user_by_id(user_id) for user_id in account["users"]]
    
    return accounts, 200


@app.route('/v1/api/accounts/<id>', methods=["GET"])
def get_account(id):
    account = account_db.get_account_by_id(id)

    if (account == None):
        return jsonify({"message": "Conta não encontrada"}), 404
    
    # substitui os ids dos usuários por seus atributos
    account["users"] = [user_db.get_user_by_id(user_id) for user_id in account["users"]]

    return account, 200
    

# encontra todas as contas com um determinado CPF ou CNPJ em TODOS os bancos na rede
@app.route('/v1/api/accounts/all/<id>', methods=["GET"])
def get_all_account_interbanks(id):
    # pega o(s) cpf(s) ou o cnpj associado(s) a essa conta
    account = account_db.get_account_by_id(id)

    if (account == None):
        return jsonify({"message": "Conta não encontrada"}), 404

    user_list = [user_db.get_user_by_id(user_id) for user_id in account["users"]]

    search_by = [] # busca por cpf (um ou mais) ou cnpj (um)
    for user in user_list:
        if (user["cpf"] == None):
            search_by.append({"cnpj": user["cnpj"]})
        else:
            search_by.append({"cpf": user["cpf"]})

    # realiza a busca
    results = []
    for ip in banks.values():
        for search in search_by:
            try:
                if (not search.get("cpf")):
                    response = requests.get(f'{ip}/v1/api/accounts?cnpj={search.get("cnpj")}', timeout=10)
                else:
                    response = requests.get(f'{ip}/v1/api/accounts?cpf={search.get("cpf")}', timeout=10)

                result = response.json()
                for r in result:
                    r["agency"] = ip[7:]
                results.append(result)

            except:
                pass
            
    results = [item for sublist in results for item in sublist]
    return jsonify({"data": results}), 200


def send_transfer_request(url, data):
    try:
        response = requests.post(url, json=data)
        return response.json(), response.status_code
    except requests.exceptions.RequestException as e:
        return {"error": str(e)}, 500


@app.route('/v1/api/transfers', methods=["PATCH"])
def transfer_funds():
    global is_transferring

    data = request.get_json()

    transaction_error = False

    account_cpf = data["account_cpf"]
    account_cnpj = data["account_cnpj"]
    bank_req_src = data["bank_req_src"]

    transfers = data["transfers"] # lista de transferências

    with transfer_list_lock:
        if (not transfer_list):
            operation_id = 0
        else:
            operation_id = max(transfer_list.keys()) + 1

    transfer_list[operation_id] = []
    for index, transf in enumerate(transfers):
        transfer_list[operation_id].append(TransferModel(index, operation_id, "pending", transf["amount"], 
                                 transf["source"], transf["account_source_id"], 
                                 transf["destination"], transf["account_dest_id"]))
    
    print("[LISTA DE TRANSFERÊNCIAS]: {}".format(transfer_list))
    # aguarda até o token estar ativo para processar as requisições
    while token.status != "active":
        pass
    
    # envia as requisições de transferência
    if (not transfer_list[operation_id]):
        return jsonify({"message": "Nenhuma transação foi solicitada"}), 500
    
    # garantir que só seja enviada a PRIMEIRA OPERAÇÃO da lista e quando o token estiver ATIVO
    while list(transfer_list.keys()).index(operation_id) != 0 or token.status != "active":
        pass
    
    is_transferring = True

    transfer_logs = []
    for index, operation in enumerate(transfer_list[operation_id]):
        try:
            print("[TRANSFERÊNCIA]: {}".format(operation))
            data = {
                "transfer_id": operation.id,
                "operation_id": operation.operation_id,
                "source": operation.source,
                "destination": operation.destination,
                "account_source_id": operation.account_source_id,
                "account_dest_id": operation.account_dest_id,
                "account_cpf": account_cpf,
                "account_cnpj": account_cnpj,
                "amount": operation.amount
            }

            transfer_log = {
                "source_prepare": False, 
                "destination_prepare": False,
                "source_commit": False, 
                "destination_commit": False
            }

            transfer_logs.append(transfer_log)


            ######### PREPARE #########
            print("[INICIANDO A PREPARAÇÃO]")
            data["prepare_type"] = "destination"
            prepare_destination = requests.patch(f'http://{operation.destination}/v1/api/accounts/prepare', 
                                      json=data,
                                      timeout=4)
            
            print("[PREPARAÇÃO INICIAL REALIZADA]")
            if (prepare_destination.status_code == 200): 
                transfer_logs[index]["destination_prepare"] = True
            else:
                transaction_error = True
                error_index = index 
                break
            
            

            data["prepare_type"] = "source"
            prepare_source = requests.patch(f'http://{operation.source}/v1/api/accounts/prepare', 
                                      json=data,
                                      timeout=4)

            print("[PREPARAÇÃO FINAL REALIZADA]")
            if (prepare_source.status_code == 200): 
                transfer_logs[index]["source_prepare"] = True
            else:
                transaction_error = True
                error_index = index 
                break

            print("[PREPARAÇÃO REALIZADA]")
            ######### COMMIT #########
            data["commit_type"] = "destination"
            commit_destination = requests.patch(f'http://{operation.destination}/v1/api/accounts/commit', 
                                      json=data,
                                      timeout=4)
            
            print("[COMMIT INICIAL REALIZADO]")
            if (commit_destination.status_code == 200): 
                transfer_logs[index]["destination_commit"] = True
            else:
                transaction_error = True
                error_index = index 
                break
            
            
            data["commit_type"] = "source"
            commit_source = requests.patch(f'http://{operation.source}/v1/api/accounts/commit', 
                                      json=data,
                                      timeout=4)

            print("[COMMIT FINAL REALIZADO]")
            if (commit_source.status_code == 200): 
                transfer_logs[index]["source_commit"] = True
            else:
                transaction_error = True
                error_index = index 
                break

            if (prepare_destination.status_code != 200 or prepare_source.status_code != 200 or
                commit_destination.status_code != 200 or commit_source.status_code != 200):
                
                transaction_error = True
                error_index = index # até onde na lista foi transferido até dar erro (incluindo o erro)
                break

            
        except:
            transaction_error = True
            error_index = index 
            break
        
    # se ocorreu algum erro precisa dar rollback
    if transaction_error:
        for i in range(error_index):
            transfer = transfer_list[operation_id][i]
            log = transfer_logs[i]
            print("[LOG]: {}".format(log))

            if not log["source_commit"] and log["destination_commit"]:
                data_destination = {
                    "transfer_id": transfer.id,
                    "account_id": transfer.account_dest_id,
                    "amount": transfer.amount,
                    "rollback_type": "destination",
                    "action": "change_amount"  # retira o dinheiro
                }

                response_destination = requests.patch(f'http://{transfer.destination}/v1/api/accounts/rollbacks',
                                                      json=data_destination,
                                                      timeout=4)

                data_source = {
                    "transfer_id": transfer.id,
                    "account_id": transfer.account_source_id,
                    "amount": transfer.amount,
                    "rollback_type": "source",
                    "action": "add_history"  # adiciona no histórico
                }

                response_source = requests.patch(f'http://{transfer.source}/v1/api/accounts/rollbacks',
                                                 json=data_source,
                                                 timeout=4)

            if log["destination_commit"] and log["source_commit"]:
                data_destination = {
                    "transfer_id": transfer.id,
                    "account_id": transfer.account_dest_id,
                    "amount": transfer.amount,
                    "rollback_type": "destination",
                    "action": "change_amount"  # retira o dinheiro
                }

                response_destination = requests.patch(f'http://{transfer.destination}/v1/api/accounts/rollbacks',
                                                      json=data_destination,
                                                      timeout=4)

                data_source = {
                    "transfer_id": transfer.id,
                    "account_id": transfer.account_source_id,
                    "amount": transfer.amount,
                    "rollback_type": "source",
                    "action": "change_amount"  # retira o dinheiro (inclui alterar o histórico)
                }

                response_source = requests.patch(f'http://{transfer.source}/v1/api/accounts/rollbacks',
                                                 json=data_source,
                                                 timeout=4)

        print("[ROLLBACK FINALIZADO]")

    
    with transfer_lock:
        is_transferring = False

    # espera o token ficar inativo pra remover da lista ou espera 10 segundos
    start_time = time()
    while token.status == "active" and (time() - start_time) < 10:
        pass

    # remove a operação da lista quando termina (com erro ou não)
    with transfer_list_lock:
        key = list(transfer_list.keys())[0]
        transfer_list.pop(key)

    print("[LISTA DE TRANSFERÊNCIAS 2]: {}".format(transfer_list))

    if (transaction_error):
        return jsonify({"message": "Erro durante a transação"}), 400
    
    return jsonify({"message": "Transação realizada com sucesso"}), 200


@app.route('/v1/api/accounts/prepare', methods=["PATCH"])
def prepare_transfer():
    data = request.get_json()

    transfer_id = data["transfer_id"]
    operation_id = data["operation_id"]
    source = data["source"]
    destination = data["destination"]
    account_source_id = data["account_source_id"]
    account_dest_id = data["account_dest_id"]
    account_cpf = data["account_cpf"]
    account_cnpj = data["account_cnpj"]
    amount = data["amount"]
    prepare_type = data["prepare_type"]

    if (prepare_type == "source"):
        account = account_db.accounts_db.get(str(account_source_id))
    if (prepare_type == "destination"):
        account = account_db.accounts_db.get(str(account_dest_id))

    if (not account):
        return jsonify({"message": "Conta não encontrada"}), 404

    if (prepare_type == "source"):
        # verifica se a conta é realmente do usuário (verificando o CPF)
        is_user_valid = False
        for user_id in account.users:
            user = user_db.get_user_by_id(user_id)
            if (account_cpf == user["cpf"] or account_cnpj == user["cnpj"]):
                is_user_valid = True

        if (not is_user_valid):
            return jsonify({"message": "A conta não pertence ao usuário de CPF {}".format(account_cpf)}), 422
    
        # verifica o saldo da conta
        if (account.balance - account.get_blocked_transferred_balance() - amount) < 0:
            return jsonify({"message": "A conta não tem saldo suficiente para realizar a transação!"}), 422

        # adiciona a transferência na lista de saldo bloqueado (status de pendente)
        account.add_blocked_transferred_balance(transfer_id, operation_id, 
                                                "pending", amount,
                                                source, account_source_id,
                                                destination, account_dest_id)

    return jsonify({"message": "Preparação realizada com sucesso"}), 200


@app.route('/v1/api/accounts/commit', methods=["PATCH"])
def commit_transfer():
    data = request.get_json()

    transfer_id = data["transfer_id"]
    account_source_id = data["account_source_id"]
    account_dest_id = data["account_dest_id"]
    amount = data["amount"]
    commit_type = data["commit_type"]

    if (commit_type == "source"):
        account = account_db.accounts_db.get(str(account_source_id))
    if (commit_type == "destination"):
        account = account_db.accounts_db.get(str(account_dest_id))

    if (not account):
        return jsonify({"message": "Conta não encontrada"}), 404
    
    if (commit_type == "destination"):
        # realiza a transferência de fato (adiciona o valor na conta)
        account.increment_balance(amount)

    elif (commit_type == "source"):
        # remove o saldo da conta que está transferindo
        transfer = account.get_blocked_transfer_by_id(transfer_id)
        account.decrement_balance(transfer.amount)

        account.add_to_history(transfer_id, "done") # adiciona no histórico de transações

    return jsonify({"message": "Commit realizado com sucesso"}), 200


@app.route('/v1/api/accounts/rollbacks', methods=["PATCH"])
def rollback_transfer():
    data = request.get_json()

    transfer_id = data["transfer_id"]
    account_id = data["account_id"]
    amount = data["amount"]
    rollback_type = data["rollback_type"] # source/destination
    action = data["action"] 

    account = account_db.accounts_db.get(str(account_id))

    if (not account):
        return jsonify({"message": "Conta não encontrada"}), 404

    if (rollback_type == "source"):
        if (action == "change_amount"):
            account.increment_balance(amount)

            account.change_history_status(transfer_id, "error")

        elif (action == "add_history"):
            account.add_to_history(transfer_id, "error")

    if (rollback_type == "destination"):
        if (action == "change_amount"):
            account.decrement_balance(amount)

        

    return jsonify({"message": "Reversão realizada com sucesso"}), 200


# transferência direta de uma conta a outra
@app.route('/v1/api/accounts/transfers', methods=["PATCH"])
def transfer_funds_to_account():
    data = request.get_json()

    transfer_id = data["transfer_id"]
    operation_id = data["operation_id"]
    source = data["source"]
    destination = data["destination"]
    account_source_id = data["account_source_id"]
    account_dest_id = data["account_dest_id"]
    amount = data["amount"]


    transaction_log = {
        "source_prepare": False, "destination_prepare": False,
        "source_commit": False, "destination_commit": False
    }

    timeout_seconds = 5

    # [SOURCE PREPARE]
    # verificando se a conta que envia tem o saldo necessário 
    account = account_db.accounts_db.get(str(account_source_id))

    if (not account):
        return jsonify({"message": "Conta de origem não encontrada",
                        "log": {
                            "source_prepare": transaction_log["source_prepare"],
                            "destination_prepare": transaction_log["destination_prepare"],
                            "source_commit": transaction_log["source_commit"],
                            "destination_commit": transaction_log["destination_commit"]
                        }}), 404
        
    
    # DÁ ERRO QUANDO O BALANCE É 10 E TENTA TRANSFERIR 10 POR EXEMPLO
    # DÁ ERRO QUANDO O BALANCE É 10 E TENTA TRANSFERIR 10 POR EXEMPLO
    # DÁ ERRO QUANDO O BALANCE É 10 E TENTA TRANSFERIR 10 POR EXEMPLO
    # DÁ ERRO QUANDO O BALANCE É 10 E TENTA TRANSFERIR 10 POR EXEMPLO
    # DÁ ERRO QUANDO O BALANCE É 10 E TENTA TRANSFERIR 10 POR EXEMPLO
    # DÁ ERRO QUANDO O BALANCE É 10 E TENTA TRANSFERIR 10 POR EXEMPLO
    if (account.balance - account.get_blocked_transferred_balance() - amount) < 0:
        return jsonify({"message": "A conta não tem saldo suficiente para realizar a transação!",
                        "log": {
                            "source_prepare": transaction_log["source_prepare"],
                            "destination_prepare": transaction_log["destination_prepare"],
                            "source_commit": transaction_log["source_commit"],
                            "destination_commit": transaction_log["destination_commit"]
                        }}), 422
    
    transaction_log["source_prepare"] = True

    # adiciona a transferência na lista de saldo bloqueado (status de pendente)
    account.add_blocked_transferred_balance(transfer_id, operation_id, 
                                            "pending", amount,
                                            source, account_source_id,
                                            destination, account_dest_id)
    
    try:
        # [DESTINATION PREPARE]
        response_prepare = requests.patch(f'http://{destination}/v1/api/accounts/prepare', 
                                json={
                                    "transfer_id": transfer_id,
                                    "amount": amount, 
                                    "account_dest_id": account_dest_id
                                    },
                                timeout=timeout_seconds)
        
        if(response_prepare.status_code != 200):
            # atualiza o status da transferência pra "erro"
            account.change_blocked_transfer_status("error", transfer_id)

            return jsonify({"message": response_prepare.json()["message"],
                            "log": {
                                "source_prepare": transaction_log["source_prepare"],
                                "destination_prepare": transaction_log["destination_prepare"],
                                "source_commit": transaction_log["source_commit"],
                                "destination_commit": transaction_log["destination_commit"]
                            }}), response_prepare.status_code

        transaction_log["destination_prepare"] = True

        # [SOURCE COMMIT]
        # remove o saldo da conta que está transferindo
        transfer = account.get_blocked_transfer_by_id(transfer_id)

        account.decrement_balance(transfer.amount)

        transaction_log["source_commit"] = True

        # [DESTINATION COMMIT]
        response_commit = requests.patch(f'http://{destination}/v1/api/accounts/commit', 
                                json={
                                    "transfer_id": transfer_id,
                                    "amount": amount, 
                                    "account_dest_id": account_dest_id
                                    },
                                timeout=timeout_seconds)
        

        if(response_commit.status_code != 200):
            account.change_blocked_transfer_status("error", transfer_id)

            return jsonify({"message": response_commit.json()["message"],
                            "log": {
                                "source_prepare": transaction_log["source_prepare"],
                                "destination_prepare": transaction_log["destination_prepare"],
                                "source_commit": transaction_log["source_commit"],
                                "destination_commit": transaction_log["destination_commit"] 
                            }}), response_commit.status_code
        
        
        # atualiza o status da transferência pra "realizada"
        account.change_blocked_transfer_status("done", transfer_id)

        transfer = account.get_blocked_transfer_by_id(transfer_id)

        transaction_log["destination_commit"] = True

        # sucesso
        return jsonify({"message": "Transação realizada com sucesso",
                        "log": {
                            "source_prepare": transaction_log["source_prepare"],
                            "destination_prepare": transaction_log["destination_prepare"],
                            "source_commit": transaction_log["source_commit"],
                            "destination_commit": transaction_log["destination_commit"]
                        }}), 200
        
    except requests.exceptions.Timeout:
        account.change_blocked_transfer_status("error", transfer_id)

        return jsonify({"message": "Não foi possível estabelecer uma conexão com a conta!", 
                        "log": {
                            "source_prepare": transaction_log["source_prepare"],
                            "destination_prepare": transaction_log["destination_prepare"],
                            "source_commit": transaction_log["source_commit"],
                            "destination_commit": transaction_log["destination_commit"]
                        }}), 504


@app.route('/v1/api/receipts', methods=["PATCH"])
def receive_funds():
    data = request.get_json()

    source = data["source"]
    destination = data["destination"]
    account_source_id = data["account_source_id"]
    account_dest_id = data["account_dest_id"]
    amount = data["amount"]

    # valor a ser transferido deve ser um float
    if (not(type(amount) is float)):
        return jsonify({"message": "Valor a ser transferido deve ser um número"}), 400

    account = account_db.accounts_db.get(str(account_dest_id))

    if (not account):
        return jsonify({"message": "Conta não encontrada"}), 404
    
    # incrementando o saldo
    account.increment_balance(amount)

    return jsonify({"message": "Saldo recebido com sucesso!"}), 200


if __name__ == "__main__":
    threading.Thread(target=send_token).start()

    app.run(host='0.0.0.0', port=8080, debug=False, threaded=True)