import { ExpensesResolver } from "./entity/expenses/resolver"

export const Routes = [
    {
        method: "get",
        route: "/getExpenses",
        controller: ExpensesResolver,
        action: "getExpenses"
    },
    {
        method: "post",
        route: "/createExpense",
        controller: ExpensesResolver,
        action: "createExpense"
    },
    {
        method: "delete",
        route: "/deleteExpense/:id",
        controller: ExpensesResolver,
        action: "deleteExpense"
    },
    {
        method: "patch",
        route: "/updateExpense/:id",
        controller: ExpensesResolver,
        action: "updateExpense"
    },
]