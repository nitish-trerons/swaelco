import Link from "next/link";
import { redirect } from "next/navigation";

import { CustomerCreateForm } from "@/components/forms/customer-create-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageRecords } from "@/lib/rbac";
import { customerWhereForUser } from "@/lib/scope";

export default async function CustomersPage() {
  const session = await getCurrentSession();
  if (!session?.user) {
    redirect("/login");
  }

  const customers = await prisma.customer.findMany({
    where: customerWhereForUser({
      id: session.user.id,
      role: session.user.role,
      customerId: session.user.customerId,
    }),
    include: {
      _count: {
        select: {
          buildings: true,
          projects: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const canManage = canManageRecords(session.user.role);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-white">Customers</h1>
          <p className="text-sm text-slate-300">Customer organizations and contact records.</p>
        </div>
        {canManage ? <CustomerCreateForm /> : null}
      </div>

      <Card className="border-slate-800 bg-slate-900/70">
        <CardHeader>
          <CardTitle className="text-white">Customer Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Buildings</TableHead>
                <TableHead>Projects</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-slate-400">
                    No customers found.
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer: (typeof customers)[number]) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <Link href={`/customers/${customer.id}`} className="font-medium text-blue-300 hover:text-blue-200">
                        {customer.name}
                      </Link>
                    </TableCell>
                    <TableCell>{customer.contactEmail}</TableCell>
                    <TableCell>{customer.contactPhone ?? "-"}</TableCell>
                    <TableCell>{customer._count.buildings}</TableCell>
                    <TableCell>{customer._count.projects}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
