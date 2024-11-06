import { SERVER_URL } from '@/constants'
import {
  CreateTransactionPayload,
  Domain,
  GetGroupParams,
  GetTransactionParams, GetTransactionResult, Group, UpdateGroupPayload,
  UpdateTransactionPayload,
} from '@/types'

export const api = {
  async getTransactionsByDomain (domain: Domain, query?: GetTransactionParams): Promise<GetTransactionResult[]> {
    const data = await fetch(`${SERVER_URL}/getTransactions/${domain}?${
      new URLSearchParams(query).toString()}`,
    { method: 'GET' }).then(res => res.json()).catch(() => [] as GetTransactionResult[])
    return data as GetTransactionResult[]
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
  async getGroupsByDomain (domain: Domain, query?: GetGroupParams): Promise<Group[]> {
    const data = await fetch(`${SERVER_URL}/getGroups/${domain}?${
      new URLSearchParams(query).toString()}`, { method: 'GET' }).then(res => res.json()).catch(() => [] as Group[])
    return data as Group[]
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
  async getSubgroupsByDomain (domain: Domain, query?: GetGroupParams): Promise<Group[]> {
    const data = await fetch(`${SERVER_URL}/getSubgroups/${domain}?${
      new URLSearchParams(query).toString()}`, { method: 'GET' }).then(res => res.json()).catch(() => [] as Group[])
    return data as Group[]
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
