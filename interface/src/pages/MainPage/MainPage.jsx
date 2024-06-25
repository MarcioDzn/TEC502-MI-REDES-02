import { AccountCard } from "../../components/AccountCard/AccountCard";
import { AddTransactionModal } from "../../components/AddTransactionModal/AddTransactionModal";
import { TransactionCard } from "../../components/TransactionCard/TransactionCard";
import { AccountCardInfo, AddTransaction, BankAccountsContainer, BankInfoWrapper, MainPageContainer, TransactionHistoryContainer, TransactionPendingContainer, TransactionPendingContainerEmpty, TransactionPendingContainerInfo, TransactionPendingContent } from "./MainPageStyled";
import { accounts } from "../../Datas";
import { useState } from "react"
import { useMutation } from '@tanstack/react-query';
import { transfer } from "../../services/transferService";

export function MainPage(){
    const [pendingTransfers, setPendingTransfers] = useState([])
    const [addingTransfers, setAddingTransfers] = useState(false)

    const mutation = useMutation({ mutationFn: transfer })

    function handlePendingTransfers(transfers) {
        setPendingTransfers(transfers)
    }

    async function handleTransferSubmit(data) {
        try {
            const response = await mutation.mutateAsync(data)
        } catch (error) {
            // verifica se houve um erro de CPF e definir a mensagem de erro
            if (error.response?.status === 403) {
                console.log("Erro durante a transferência")
            }
        }
    }

    return (
        <>  
            {
                addingTransfers ? 
                <AddTransactionModal accounts={accounts} transfers={pendingTransfers} addPendingTransfers={handlePendingTransfers} addingTransfers={setAddingTransfers}/> :
                <></>
            }
            

            <MainPageContainer>
                <AccountCardInfo>
                    <AccountCard cardType="big" key={accounts[0]._id} acc_type={accounts[0].account_type} agency={"192.168.0.1"} account={accounts[0]._id} balance={accounts[0].balance}/>
                </AccountCardInfo>
                
                <BankInfoWrapper>
                    <div>
                        <h2>Minhas outras contas</h2>
                        
                        <BankAccountsContainer>
                            {
                                accounts.map((account) => 
                                    <AccountCard key={account._id} acc_type={account.account_type} agency={"192.168.0.1"} account={account._id} balance={account.balance}/>
                                )
                            }
                            
                        </BankAccountsContainer>
                    </div>

                    <div>
                        <h2>Histórico de transações</h2>
                        <TransactionHistoryContainer>
                            <TransactionCard />
                            <TransactionCard />
                            <TransactionCard />
                            <TransactionCard />
                            <TransactionCard />
                            <TransactionCard />
                            <TransactionCard />
                            <TransactionCard />
                            <TransactionCard />
                        </TransactionHistoryContainer>
                    </div>

                    <TransactionPendingContent>
                        <TransactionPendingContainerInfo>
                            <h2>Transferências pendentes</h2>
                            {
                                pendingTransfers.length == 0 ? <></> : 
                                <>
                                    <button onClick={() => {setAddingTransfers(true)}}>Editar transferências</button>
                                </>

                            }
                        </TransactionPendingContainerInfo>

 
                        {
                            pendingTransfers.length == 0 ? 
                            <>
                                <TransactionPendingContainerEmpty>
                                    <h2>Sem transferências pendentes</h2>
                                    <button onClick={() => {setAddingTransfers(true)}}>Adicionar transferência</button>
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
                                            /> 
                                        )
                                    }
                                </TransactionPendingContainer>
                            </>
                        }
                        <AddTransaction onClick={() => {handleTransferSubmit(pendingTransfers)}}disabled={pendingTransfers.length == 0 ? true : false}>Realizar transferência</AddTransaction>
                    </TransactionPendingContent>
                </BankInfoWrapper>
            </MainPageContainer>
        </>
        
    )
}