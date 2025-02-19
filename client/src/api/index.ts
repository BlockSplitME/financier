import { SERVER_URL } from "@/constants";
import {
  CreateTransactionPayload,
  Domain,
  GetGroupParams,
  GetGroupResult,
  GetTransactionParams,
  GetTransactionsResult,
  TableGroupData,
  TableTransactionData,
  UpdateGroupPayload,
} from "@/types";
import { groupAdapter, transactionAdapter } from "@/adapters";
import axios from "axios";

export const api = {
  async getTransactionsByDomain(
    domain: Domain,
    query?: GetTransactionParams
  ): Promise<TableTransactionData> {
    const { data } = await axios.get(
      `${SERVER_URL}/getTransactions/${domain}?${new URLSearchParams(
        query
      ).toString()}`
    );
    return transactionAdapter(data as GetTransactionsResult);
  },
  async createTransaction(domain: Domain, payload: CreateTransactionPayload) {
    await axios.post(
      `${SERVER_URL}/createTransaction/${domain}`,
      JSON.stringify(payload),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  },
  async deleteTransactionById(domain: Domain, id: number) {
    await axios.delete(`${SERVER_URL}/deleteTransaction/${domain}/${id}`);
  },
  async updateTransaction(
    domain: Domain,
    id: number,
    payload: CreateTransactionPayload
  ) {
    await axios.patch(
      `${SERVER_URL}/updateTransaction/${domain}/${id}`,
      JSON.stringify(payload),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  },
  async getGroupsByDomain(
    domain: Domain,
    query?: GetGroupParams
  ): Promise<TableGroupData> {
    const { data } = await axios.get(
      `${SERVER_URL}/getGroups/${domain}?${new URLSearchParams(
        query
      ).toString()}`
    );
    return groupAdapter(data);
  },
  async updateGroupDescription(
    domain: Domain,
    id: number,
    payload: UpdateGroupPayload
  ) {
    await axios.patch(
      `${SERVER_URL}/updateGroup/${domain}/${id}`,
      JSON.stringify(payload),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  },
  async getSubgroupsByDomain(
    domain: Domain,
    query?: GetGroupParams
  ): Promise<TableGroupData> {
    const { data } = await axios.get(
      `${SERVER_URL}/getSubgroups/${domain}?${new URLSearchParams(
        query
      ).toString()}`
    );
    return groupAdapter(data as GetGroupResult);
  },
  async updateSubgroupsDescription(
    domain: Domain,
    id: number,
    payload: UpdateGroupPayload
  ) {
    await axios.patch(
      `${SERVER_URL}/updateSubgroups/${domain}/${id}`,
      JSON.stringify(payload),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  },
};
