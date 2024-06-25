class TransferModel():
    def __init__(self, id, operation_id, status, amount, src, src_account_id, dest, dest_account_id):
        self.id = id
        self.operation_id = operation_id
        self.status = status
        self.amount = amount
        self.source = src
        self.account_source_id = src_account_id
        self.destination = dest
        self.account_dest_id = dest_account_id
        