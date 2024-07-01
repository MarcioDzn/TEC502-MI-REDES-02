import { AddTransactionModalContainer, Background, BankAccountsContainer, BankInfos, CloseModal, ErrorSpan, TransactionForm, TransactionInfos, TransactionList, TransactionPendingContainer, TransactionPendingContainerEmpty } from "./AddTransactionModalStyled";
import { TransactionCard } from "../../components/TransactionCard/TransactionCard";
import { AccountCard } from "../../components/AccountCard/AccountCard";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react"
import { addTransactionSchema } from "../../schemas/addTransactionSchema";

export function AddTransactionModal({accounts, transfers, addPendingTransfers, addingTransfers}) {
    const [sourceAgency, setSourceAgency] = useState(null)
    const [sourceAccount, setSourceAccount] = useState(null)
    const [pendingTransfers, setPendingTransfers] = useState([])

    function handleSelectTransaction(agency, account) {
        setSourceAgency(agency)
        setSourceAccount(account)
    }

    function handlePendingTransfers(data) {
        console.log("b")

        const transfer = {
                "_id": Math.random() * 3728738127,
                "source": data.sourceAgency,
                "destination": data.destAgency,
                "account_source_id": data.sourceAccount,
                "account_dest_id": data.destAccount,
                "amount": parseFloat(data.amount)
            }

        const pendingTransfersCopy = Array.from(pendingTransfers)
        pendingTransfersCopy.push(transfer)
        setPendingTransfers(pendingTransfersCopy)
    }

    function handleDeleteTransfer(id) {
        const pendingTransfersCopy = pendingTransfers.filter(item => item._id !== id);
        setPendingTransfers(pendingTransfersCopy)
    }

    const {
        register: registerTransaction,
        handleSubmit: handleSubmitTransaction,
        formState: { errors: errorsTransaction },
        setValue
    } = useForm({ resolver: zodResolver(addTransactionSchema()) });

    useEffect(() => {
        if (transfers) {
            setPendingTransfers(transfers)
        }
    }, []);

    useEffect(() => {
        setValue("sourceAgency", sourceAgency);
        setValue("sourceAccount", sourceAccount);
      }, [sourceAgency, sourceAccount, setValue]);


    const handleAmountChange = (event) => {
        const value = parseFloat(event.target.value);
        if (value < 0) {
            event.target.value = 0.01;
        }
    };

    return (
        <>
            <AddTransactionModalContainer>
                <CloseModal onClick={() => {addingTransfers(false)}}>X</CloseModal>
                <BankInfos>
                    <h1>Conta de origem</h1>
                    <BankAccountsContainer>
                        {
                            accounts?.map((account) => 
                                <AccountCard key={account._id} acc_type={account.account_type} agency={account.agency} account={account._id} balance={account.balance} 
                                            selectTransaction={handleSelectTransaction}/>
                            )
                        }
                    </BankAccountsContainer>
                </BankInfos>

                <TransactionInfos>
                    <h1>Adicionar transferência</h1>
                    <TransactionForm>
                        <div>
                            <input type="text" id={"src-agency"} placeholder="Agência de origem" disabled={true} value={sourceAgency == null ? "" : sourceAgency} {...registerTransaction("sourceAgency")}/>
                            {errorsTransaction.sourceAgency && <ErrorSpan error_info={errorsTransaction.sourceAgency.message}>Erro</ErrorSpan>}
                        </div>
                        
                        <div>
                            <input type="text" id={"src-account"} placeholder="Conta de origem" disabled={true} value={sourceAccount == null ? "" : sourceAccount} {...registerTransaction("sourceAccount")}/>
                            {errorsTransaction.sourceAccount && <ErrorSpan error_info={errorsTransaction.sourceAccount.message}>Erro</ErrorSpan>}
                        </div>
                        
                        <div>
                            <input type="text" id={"dest-agency"} placeholder="Agência de destino" {...registerTransaction("destAgency")}/>
                            {errorsTransaction.destAgency && <ErrorSpan error_info={errorsTransaction.destAgency.message}>Erro</ErrorSpan>}
                        </div>
                        
                        <div>
                            <input type="text" id={"dest-account"} placeholder="Conta de destino" {...registerTransaction("destAccount")}/>
                            {errorsTransaction.destAccount && <ErrorSpan error_info={errorsTransaction.destAccount.message}>Erro</ErrorSpan>}
                        </div>
                        
                        <div>
                            <input type="number" id={"amount"} placeholder="Valor" {...registerTransaction("amount")} onChange={handleAmountChange}/>
                            {errorsTransaction.amount && <ErrorSpan error_info={errorsTransaction.amount.message}>Erro</ErrorSpan>}
                        </div>
                        

                        <button onClick={handleSubmitTransaction(handlePendingTransfers)}>Adicionar à lista</button>
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