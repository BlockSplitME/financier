import { TransactionsResolver } from "./resolvers"

export const Routes = [
    {
        method: "get",
        route: "/getTransactions/:domain",
        controller: TransactionsResolver,
        action: "getTransactionsByDomain",
    },
    {
        method: "post",
        route: "/createTransaction/:domain",
        controller: TransactionsResolver,
        action: "createTransaction",
    },
    {
        method: "delete",
        route: "/deleteTransaction/:domain/:id",
        controller: TransactionsResolver,
        action: "deleteTransaction",
    },
    {
        method: "patch",
        route: "/updateTransaction/:domain/:id",
        controller: TransactionsResolver,
        action: "updateTransaction",
    },
    {
        method: "get",
        route: "/getGroups/:domain",
        controller: TransactionsResolver,
        action: "getGroups",
    },
    {
        method: "patch",
        route: "/updateGroup/:domain/:id",
        controller: TransactionsResolver,
        action: "updateGroup",
    },
    {
        method: "get",
        route: "/getSubgroups/:domain",
        controller: TransactionsResolver,
        action: "getSubgroups",
    },
    {
        method: "patch",
        route: "/updateSubgroup/:domain/:id",
        controller: TransactionsResolver,
        action: "updateSubgroup",
    },
]