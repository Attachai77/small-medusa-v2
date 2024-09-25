import { Container, Heading, Table } from "@medusajs/ui"
import { useEffect, useState } from 'react'
import { Cash } from '@medusajs/icons'


interface PaymentOptionItem {
  "sequenceNo": number,
  "name": string,
  "code": string,
  "iconUrl": string,
  "logoUrl": string,
  "default": boolean,
  "expiration": boolean,
  groups?: PaymentOptionItem[]
  channels?: PaymentOptionItem[]
  payment?: {
    code?: {
      channelCode?: string
    }
  }
}

const AvailablePaymentPage = () => {

  const [ paymentOptions, setPaymentOptions ] = useState<PaymentOptionItem[]>([])
  let counter = 1

  useEffect(() => {

    fetch("/admin/payment/available-payments", {
      credentials: "include"
    })
      .then((res) => res.json())
      .then(({ payments }) => {
        setPaymentOptions(payments)
      })
  }, [])

  return (
    <Container>
      <Heading level="h1" className="inline-flex">
        <Cash className="mr-2"/>
        Available Payments
      </Heading>

      <div className="mt-5 mb-5">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>#</Table.HeaderCell>
              <Table.HeaderCell>Category</Table.HeaderCell>
              <Table.HeaderCell>Group</Table.HeaderCell>
              <Table.HeaderCell>Channel</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {paymentOptions.map((paymentOption, indexCat) => {
              return paymentOption.groups?.map((group, indexGroup) => {
                return group.channels.map((channel, indexChannel) => {
                  return (
                    <Table.Row
                      key={channel.code}
                      className="[&_td:last-child]:w-[1%] [&_td:last-child]:whitespace-nowrap"
                    >

                      <Table.Cell>{counter++}</Table.Cell>
                      <Table.Cell>{paymentOption.name} ({paymentOption.code})</Table.Cell>
                      <Table.Cell>
                        {group.name} ({group.code})
                      </Table.Cell>
                      <Table.Cell>
                        <img className="w-8 inline-flex mr-2" src={channel.iconUrl} alt={channel.name}/>
                        {channel.name} ({channel.payment?.code?.channelCode})
                      </Table.Cell>
                      <Table.Cell className="text-ui-fg-muted">
                      </Table.Cell>
                    </Table.Row>
                  )
                })
              })
            })}
          </Table.Body>
        </Table>
      </div>
    </Container>
  )
}


export default AvailablePaymentPage
