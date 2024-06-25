import { AccountCard } from "../../components/AccountCard/AccountCard";
import { AddTransactionModal } from "../../components/AddTransactionModal/AddTransactionModal";
import { TransactionCard } from "../../components/TransactionCard/TransactionCard";
import LoadingCircle, { AccountCardInfo, AddTransaction, BankAccountsContainer, BankInfoWrapper, MainPageContainer, TransactionHistoryContainer, TransactionPendingContainer, TransactionPendingContainerEmpty, TransactionPendingContainerInfo, TransactionPendingContent } from "./MainPageStyled";
import { accounts } from "../../Datas";
import { useState, useEffect } from "react"
import { useMutation, useQuery } from '@tanstack/react-query';
import { transfer } from "../../services/transferService";
import { getAllAccounts } from "../../services/accountService";

export function MainPage(){
    const [pendingTransfers, setPendingTransfers] = useState([])
    const [addingTransfers, setAddingTransfers] = useState(false)

    const mutation = useMutation({ mutationFn: transfer })

    const {data: accountsData, isFetching, isLoading, isError, refetch} = useQuery({
        queryKey: ["accounts"],
        queryFn: () => getAllAccounts("1650384660")
    })

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

    useEffect(() => {
        const id = setInterval(() => {
            refetch();
        }, 50000); 
        
        // Limpando o timer quando o componente é desmontado
        return () => clearInterval(id);
    }, [refetch]);

    console.log(`aaaa: ${JSON.stringify(accountsData, null, 2) }`)
    return (
        <>  
            {
                addingTransfers ? 
                    <AddTransactionModal accounts={accountsData} transfers={pendingTransfers} addPendingTransfers={handlePendingTransfers} addingTransfers={setAddingTransfers}/> :
                    <></>
            }
            

            <MainPageContainer>
                <AccountCardInfo>
                    <AccountCard cardType="big" key={accounts[0]._id} acc_type={accounts[0].account_type} agency={accounts[0].agency} account={accounts[0]._id} balance={accounts[0].balance}/>
                </AccountCardInfo>
                
                <BankInfoWrapper>
                    <div>
                        <h2>Minhas outras contas</h2>
                        
                        <BankAccountsContainer>
                            {   isLoading ? <LoadingCircle></LoadingCircle> :
                                accountsData?.map((account) => 
                                    <AccountCard key={account._id} acc_type={account.account_type} agency={account.agency} account={account._id} balance={account.balance}/>
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