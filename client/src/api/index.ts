import { ICreateExpensePayload, IGetExpenseQuery } from '@/types'
import { SERVER_URL } from '@/constants'

export const api = {
  async getExpenses (query: IGetExpenseQuery) {
    await fetch(`${SERVER_URL}/getExpenses?${
      new URLSearchParams(query).toString()}`,
    { method: 'GET' }).then(res => res.json())
  },
  async createExpense (payload: ICreateExpensePayload) {
    await fetch(`${SERVER_URL}/createExpense`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }).then(res => res.json())
  },
  async deleteExpenseById (id: number) {
    await fetch(`${SERVER_URL}/deleteExpense/${id}`, { method: 'DELETE' })
  },
  async updateExpenseById (id: number, payload: ICreateExpensePayload) {
    await fetch(`${SERVER_URL}/updateExpense/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
  },
}
