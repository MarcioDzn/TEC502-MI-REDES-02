import { AddTransactionModalContainer, Background, BankAccountsContainer, BankInfos, CloseModal, TransactionForm, TransactionInfos, TransactionList, TransactionPendingContainer, TransactionPendingContainerEmpty } from "./AddTransactionModalStyled";
import { TransactionCard } from "../../components/TransactionCard/TransactionCard";
import { AccountCard } from "../../components/AccountCard/AccountCard";
import { useState, useEffect } from "react"

export function AddTransactionModal({accounts, transfers, addPendingTransfers, addingTransfers}) {
    const [sourceAgency, setSourceAgency] = useState(null)
    const [sourceAccount, setSourceAccount] = useState(null)
    const [pendingTransfers, setPendingTransfers] = useState([])

    function handleSelectTransaction(agency, account) {
        setSourceAgency(agency)
        setSourceAccount(account)
    }

    function handlePendingTransfers(transfer) {
        const pendingTransfersCopy = Array.from(pendingTransfers)
        pendingTransfersCopy.push(transfer)
        setPendingTransfers(pendingTransfersCopy)
    }

    function handleDeleteTransfer(id) {
        const pendingTransfersCopy = pendingTransfers.filter(item => item._id !== id);
        setPendingTransfers(pendingTransfersCopy)
    }


    useEffect(() => {
        if (transfers) {
            setPendingTransfers(transfers)
        }
    }, []);

    return (
        <>
            <AddTransactionModalContainer>
                <CloseModal onClick={() => {addingTransfers(false)}}>X</CloseModal>
                <BankInfos>
                    <h1>Conta de origem</h1>
                    <BankAccountsContainer>
                        {
                            accounts?.map((account) => 
                                <AccountCard key={account._id} acc_type={account.account_type} agency={"localhost:8082"} account={account._id} balance={account.balance} 
                                            selectTransaction={handleSelectTransaction}/>
                            )
                        }
                    </BankAccountsContainer>
                </BankInfos>

                <TransactionInfos>
                    <h1>Adicionar transferência</h1>
                    <TransactionForm onSubmit={(event) => {
                        event.preventDefault()
                        const srcAgency = document.querySelector("#src-agency").value
                        const destAgency = document.querySelector("#dest-agency").value
                        const srcAccount = document.querySelector("#src-account").value
                        const destAccount = document.querySelector("#dest-account").value
                        const amount = document.querySelector("#amount").value
                        
                        const data = {
                                "_id": Math.random() * 3728738127,
                                "source": srcAgency,
                                "destination": destAgency,
                                "account_source_id": srcAccount,
                                "account_dest_id": destAccount,
                                "amount": parseFloat(amount)
                            }

                        handlePendingTransfers(data)
                        
                    }}>
                        <input type="text" id={"src-agency"} placeholder="Agência de origem" disabled={true} value={sourceAgency == null ? "" : sourceAgency}/>
                        <input type="text" id={"src-account"} placeholder="Conta de origem" disabled={true} value={sourceAccount == null ? "" : sourceAccount}/>
                        <input type="text" id={"dest-agency"} placeholder="Agência de destino" />
                        <input type="text" id={"dest-account"} placeholder="Conta de destino" />
                        <input type="number" id={"amount"} placeholder="Valor" />
                        <button type="submit">Adicionar à lista</button>
                    </TransactionForm>
                </TransactionInfos>

                <TransactionList>
                    {
                        pendingTransfers.length == 0 ? 
                        <>
                            <TransactionPendingContainerEmpty>
                                <h2>Sem transferências pendentes</h2>
                            </TransactionPendingContainerEmpty>
                        </> :
                        <>
                            <TransactionPendingContainer>
                                {
                                    pendingTransfers.map((transaction) => 
                                        <TransactionCard key={transaction._id} id={transaction._id} status={"Pendente"}
                                                                            source={transaction.source} 
                                                                            destination={transaction.destination} 
                                                                            accountSourceId={transaction.account_source_id} 
                                                                            accountDestId={transaction.account_dest_id} 
                                                                            amount={transaction.amount}
                                                                            removeTransfer={handleDeleteTransfer}
                                        /> 
                                    )
                                }
                            </TransactionPendingContainer>
                        </>
                    }

                    <button onClick={() => {
                        addPendingTransfers(pendingTransfers)
                        addingTransfers(false)
                    }}>Confirmar transferência(s)</button>
                </TransactionList>
            </AddTransactionModalContainer>
            <Background></Background>
        </>
        


        
    )
}