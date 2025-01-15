import { SERVER_URL } from '@/constants'
import {
  CreateTransactionPayload,
  Domain,
  GetGroupParams, GetGroupResult, GetTransactionData,
  GetTransactionParams, GetTransactionsResult, Group, TableGroupData, TableTransactionData, UpdateGroupPayload,
  UpdateTransactionPayload,
} from '@/types'
import { groupAdapter, transactionAdapter } from '@/adapters'

export const api = {
  async getTransactionsByDomain (domain: Domain, query?: GetTransactionParams): Promise<TableTransactionData> {
    const data = await fetch(`${SERVER_URL}/getTransactions/${domain}?${
      new URLSearchParams(query).toString()}`,
    { method: 'GET' })
      .then(res => res.json())
      .catch(() => (
        {
          data: [] as GetTransactionData[],
        }
      ))
    return transactionAdapter(data as GetTransactionsResult)
  },
  async createTransaction (domain: Domain, payload: CreateTransactionPayload) {
    await fetch(`${SERVER_URL}/createTransaction/${domain}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).then(res => res.json())
  },
  async deleteTransactionById (domain: Domain, id: number) {
    await fetch(`${SERVER_URL}/deleteTransaction/${domain}/${id}`, { method: 'DELETE' })
  },
  async updateTransaction (domain: Domain, id: number, payload: UpdateTransactionPayload) {
    await fetch(`${SERVER_URL}/updateTransaction/${domain}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  },
  async getGroupsByDomain (domain: Domain, query?: GetGroupParams): Promise<TableGroupData> {
    const data: GetGroupResult = await fetch(`${SERVER_URL}/getGroups/${domain}?${
      new URLSearchParams(query).toString()}`, { method: 'GET' }).then(res => res.json()).catch(() => (
      {
        data: [] as Group[],
      }
    ))
    return groupAdapter(data)
  },
  async updateGroupDescription (domain: Domain, id: number, payload: UpdateGroupPayload) {
    await fetch(`${SERVER_URL}/updateGroup/${domain}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  },
  async getSubgroupsByDomain (domain: Domain, query?: GetGroupParams): Promise<TableGroupData> {
    const data = await fetch(`${SERVER_URL}/getSubgroups/${domain}?${
      new URLSearchParams(query).toString()}`, { method: 'GET' }).then(res => res.json()).catch(() => (
      {
        data: [] as Group[],
      }
    ))
    return groupAdapter(data as GetGroupResult)
  },
  async updateSubgroupsDescription (domain: Domain, id: number, payload: UpdateGroupPayload) {
    await fetch(`${SERVER_URL}/updateSubgroups/${domain}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  },
}
