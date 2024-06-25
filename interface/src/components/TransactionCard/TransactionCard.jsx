import { AmountInfo, DestinationInfo, InfoContainer, SourceInfo, TransactionCardContainer, TransactionDestination, TransactionDestinationId, TransactionSource, TransactionSourceId, TransactionStatus } from "./TransactionCardStyled";

export function TransactionCard({id, status, source, destination, accountSourceId, accountDestId, amount, removeTransfer}) {
    return (
        <TransactionCardContainer>
            <TransactionStatus>
                <span>Status: {status}</span>
                <span onClick={() => {removeTransfer(id)}}>Deletar</span>
            </TransactionStatus>
            <InfoContainer>
                <SourceInfo>
                    <TransactionDestination>Origem: {source}</TransactionDestination>
                    <TransactionDestinationId>Conta: {accountSourceId}</TransactionDestinationId>
                </SourceInfo>

                <AmountInfo>
                    Quantidade
                    <span>R${amount}</span>
                </AmountInfo>

                <DestinationInfo>
                    <TransactionSource>Destino: {destination}</TransactionSource>
                    <TransactionSourceId>Conta: {accountDestId}</TransactionSourceId>
                </DestinationInfo>
            </InfoContainer>
        </TransactionCardContainer>
    )
}