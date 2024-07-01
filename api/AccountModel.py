from utils import generate_id
from TransferModel import TransferModel

class AccountModel():
    def __init__(self, primary_user, secondary_user, password, account_type):
        self.account_type = account_type
        self.users = [primary_user._id]
        if (secondary_user != None):
            self.users.append(secondary_user._id)
        
        self._id = "{}".format(generate_id(primary_user.name + (secondary_user.name if secondary_user != None else "")))

        self.password = password
        self.balance = 5000.0

        # armazena os valores em trânsito
        self.blocked_received_balance = [] 
        self.transfer_history = []
        self.blocked_transferred_balance = [] 

    
    def set_balance(self, new_balance):
        if (new_balance >= 0):
            self.balance = new_balance

    
    def increment_balance(self, amount):
        if (amount >= 0):
            self.balance += amount


    def decrement_balance(self, amount):
        if (amount >= 0 and self.balance - amount >= 0):
            self.balance -= amount


    def get_balance(self):
        return self.balance
    

    def add_blocked_transferred_balance(self, id, operation_id,
                                        status, amount, 
                                        source, account_source_id, 
                                        destination, account_dest_id):
        if not self.verify_balance():
            return
        
        transfer = TransferModel(id, operation_id, status, amount, source, account_source_id, destination, account_dest_id)
        self.blocked_transferred_balance.append(transfer)

            
    def add_to_history(self, id, new_status):
        # só pode adicionar no histórico as transferências que estão na lista de bloqueados
        blocked_transfer = self.get_blocked_transfer_by_id(id)

        if (not blocked_transfer):
            return
        
        # remove da lista de bloqueados
        self.blocked_transferred_balance.remove(blocked_transfer)

        blocked_transfer.status == new_status

        self.transfer_history.append(blocked_transfer)


    def change_history_status(self, id, new_status):
        transfer = self.get_history_by_id(id)

        if (not transfer):
            return
        
        # atualiza o status 
        self.transfer_history.remove(transfer)

        transfer.status == new_status

        self.transfer_history.append(transfer)


    def get_blocked_transfer_by_id(self, id):
        for blocked in self.blocked_transferred_balance:
            # busca pelo id específico da transação (!= id da operação)
            if blocked.id == id:
                return blocked
        return None
    

    def get_history_by_id(self, id):
        for transfer in self.transfer_history:
            # busca pelo id específico da transação (!= id da operação)
            if transfer.id == id:
                return transfer
        return None


    def add_blocked_received_balance(self, value):
        self.blocked_received_balance.append(value)
    
    
    def verify_balance(self):
        sum_balance = 0
        for blocked in self.blocked_transferred_balance:
            sum_balance += blocked.amount
    
        if self.balance - sum_balance < 0:
            return False
        
        return True
    

    def get_blocked_transferred_balance(self):
        sum_balance = 0
        for blocked in self.blocked_transferred_balance:
            sum_balance += blocked.amount

        return sum_balance

