# pip install pyjwt[crypto]
import random, jwt, re

def generate_id(name):

    # cria um id com base no nome do usuário
    individual_mult = 1
    total_ord = ''
    for char in name:
        ord_char = ord(char)

        individual_mult *= ord_char
        total_ord += str(ord_char)

    user_id = int(str((individual_mult * int(total_ord))*random.randint(0, 100000))[0:10])

    return user_id



def generate_jwt_token(id, login, password):
    payload_data = {
        "id": id, 
        "login": login,
        "password": password
    }

    my_secret = "walter white"

    token = jwt.encode(
        payload=payload_data,
        key=my_secret
    )

    return token



def validate_cpf(cpf):
    if (not cpf): 
        return False
    # yyy.yyy.yyy-yy
    cpf_regex = re.compile(r'^\d{3}\.\d{3}\.\d{3}-\d{2}$')
    
    # verifica se a string corresponde ao padrão do CPF
    if cpf_regex.match(cpf):
        return True
    else:
        return False
    

def validate_cnpj(cnpj):
    if (not cnpj): 
        return False
    
    return bool(re.match(r'^\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}$', cnpj))
