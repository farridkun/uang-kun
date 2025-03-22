'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
import { Plus } from "lucide-react";
import { columns, Payment } from "./columns";
import { DataTable } from "./data-table";

const data: Payment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "728ed52f",
    amount: 50,
    status: "success",
    email: "maaa@example.com",
  }
]

const AccountsPage = () => {
  const newAccount = useNewAccount();

  return (
    <div
      className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24"
    >
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="md:flex flex-col gap-y-2 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Accounts Page
          </CardTitle>
          <Button
            size="sm"
            onClick={newAccount.onOpen}
          >
            <Plus className="size-4 mr-2" />
            Add new
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            filterKey="email"
            columns={columns}
            data={data}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default AccountsPage;
