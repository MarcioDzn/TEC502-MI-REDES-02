import { styled } from "styled-components"

export const TransactionCardContainer = styled.div`
    display: flex;
    flex-direction: column;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
    padding: 15px;
    cursor: pointer;
`

export const TransactionStatus = styled.span`
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;

    span:nth-child(2):hover {
        color: red;
    }
`
export const TransactionSource = styled.span`

`
export const TransactionDestination = styled.span`

`
export const TransactionAmount = styled.span`

`
export const TransactionSourceId = styled.span`

`
export const TransactionDestinationId = styled.span`

`

export const InfoContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

export const DestinationInfo = styled.div`
    display: flex;
    flex-direction: column;
`

export const SourceInfo = styled.div`
    display: flex;
    flex-direction: column;
`

export const AmountInfo = styled.span`
    display: flex;
    flex-direction: column;
    font-size: 0.8rem;
    font-weight: light;

    span {
        font-size: 1.25rem;
        font-weight: bolder;
        margin-top: -10px;
    }
`