from copy import deepcopy

class AccountDatabase():
    def __init__(self):
        self.accounts_db = {}


    def create_account(self, user):
        self.accounts_db[user._id] = user
    

    def get_all_accounts(self):
        accounts = []

        for account in self.accounts_db.values():
            accounts.append({
                "_id": account._id,
                "account_type": account.account_type,
                "users": account.users,
                "balance": account.balance,
                "password": account.password
            })

        return accounts
    

    def get_account_by_id(self, id):
        account = self.accounts_db.get(str(id))

        curr_account = None
        if (account):
            curr_account = {
                "_id": account._id,
                "account_type": account.account_type,
                "users": account.users,
                "balance": account.balance,
                "password": account.password
            }

        return curr_account
    
    def get_accounts_by_cpf(self, cpf, user_db):
        if (not cpf):
            return []
        
        user = user_db.get_user_by_cpf(cpf)
        if (not user):
            return []
        
        accounts = []

        for account in self.accounts_db.values():
            if user._id in account.users:
                accounts.append({
                    "_id": account._id,
                    "account_type": account.account_type,
                    "users": account.users,
                    "balance": account.balance,
                    "password": account.password
                })

        return accounts


    def get_accounts_by_cnpj(self, cnpj, user_db):
        if (not cnpj):
            return []
        
        user = user_db.get_user_by_cnpj(cnpj)
        if (not user):
            return []
        
        accounts = []
        for account in self.accounts_db.values():
            
            if user._id in account.users:
                accounts.append({
                    "_id": account._id,
                    "account_type": account.account_type,
                    "users": account.users,
                    "balance": account.balance,
                    "password": account.password
                })

        return accounts


    def get_account_obj_by_id(self, id):
        return self.accounts_db.get(str(id))
    
    
    def remove_account(self, account_id):
        account = self.accounts_db.get(account_id)

        if not account:
            return
        
        self.accounts_db.pop(account_id)


    def edit_account(self, account_id, data):
        account = self.accounts_db.get(account_id)
        edited_account = deepcopy(account)

        if not account:
            return
        
        if data.get("name") and data["name"] != "":
            edited_account.name = data["name"]

        if data.get("password") and data["password"] != "":
            edited_account.password = data["password"]

        if data.get("balance") and data["balance"] != "":
            edited_account.set_balance(data["balance"])

        self.accounts_db[account_id] = edited_account

        return {
            "_id": edited_account._id,
            "name": edited_account.name,
            "password": edited_account.password,
            "balance": edited_account.balance
        }
    

    def get_account_by_user(self, user_id):
        user_accounts = {"normal": None, "conjunta": None}
        for acc in self.accounts_db.values():
            for id in acc.users_id:
                print(acc.acc_type)
                print(acc._id)
                if str(id) == str(user_id):
                    user_accounts[acc.acc_type] = self.get_account_by_id(acc._id)

        return user_accounts