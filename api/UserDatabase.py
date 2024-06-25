from copy import deepcopy

class UserDatabase():
    def __init__(self):
        self.users_db = {}


    def create_user(self, user):
        self.users_db[str(user._id)] = user
        print(self.users_db)
    

    def get_all_users(self):
        users = []

        for user in self.users_db.values():
            users.append({
                "_id": user._id,
                "name": user.name,
                "user_type": user.user_type,
                "cpf": user.CPF,
                "cnpj": user.CNPJ
            })

        return users
    

    def get_user_by_id(self, id):
        user = self.users_db.get(str(id))

        if (user):
            curr_user = {
                "_id": user._id,
                "name": user.name,
                "user_type": user.user_type,
                "cpf": user.CPF,
                "cnpj": user.CNPJ
            }

            return curr_user
        
        return None
    

    def get_user_obj_by_id(self, id):
        return self.users_db.get(str(id))


    def get_user_by_cpf(self, cpf):
        selected_user = None

        print("[USUÁRIOS]: {}".format(self.users_db.values()))
        for user in self.users_db.values():
            print("[USER CPF]: {}".format(user.CPF))
            print("[SEARCHED CPF]: {}".format(cpf))
            if user.CPF == cpf:
                selected_user = user

                break

        return selected_user


    def get_user_by_cnpj(self, cnpj):
        selected_user = None
        for user in self.users_db.values():
            if user.CNPJ == cnpj:
                selected_user = user

                break

        return selected_user
    

    # verifica se o cpf já existe
    def verify_cpf(self, cpf):
        is_cpf_valid = True
        for user in self.users_db.values():
            if user.cpf == cpf:
                is_cpf_valid = False

                break

        return is_cpf_valid


    def remove_user(self, user_id):
        user = self.users_db.get(user_id)

        if not user:
            return
        
        self.users_db.pop(user_id)


    def edit_user(self, user_id, data):
        user = self.users_db.get(str(user_id))
        edited_user = deepcopy(user)

        if not user:
            return
        
        if data.get("name") and data["name"] != "":
            edited_user.name = data["name"]

        if data.get("password") and data["password"] != "":
            edited_user.password = data["password"]

        if data.get("balance") and data["balance"] != "":
            edited_user.set_balance(data["balance"])

        self.users_db[user_id] = edited_user

        return {
            "_id": edited_user._id,
            "name": edited_user.name,
            "age": edited_user.age,
            "cpf": edited_user.cpf
        }