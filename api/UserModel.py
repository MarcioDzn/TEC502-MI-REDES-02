class UserModel():
    def __init__(self, name, user_type, cpf, id, cnpj=None):
        # nenhum usuário cadastrado -> id = 0 / id do ultimo usuário + 1
        self._id = id
        self.name = name
        self.user_type = user_type
        self.CPF = cpf
        self.CNPJ = cnpj

