import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  await requireAdmin();

  const [users, prompts, logs] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.prompt.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: true }
    }),
    prisma.adminLog.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: true }
    })
  ]);

  return (
    <div className="space-y-10">
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Admin dashboard</h1>
        <p className="mt-2 text-sm text-slate-600">
          Monitor users, prompts, and API usage logs.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Users</h2>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 text-slate-700">{user.email}</td>
                  <td className="px-4 py-3 text-slate-700">
                    {user.name ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{user.role}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {user.createdAt.toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Prompts</h2>
        <div className="space-y-3">
          {prompts.map((prompt) => (
            <div key={prompt.id} className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-xs text-slate-400">
                {prompt.createdAt.toLocaleString()} · {prompt.user.email}
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-900">
                {prompt.promptText}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">API usage logs</h2>
        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-xs text-slate-400">
                {log.createdAt.toLocaleString()} · {log.user.email}
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-900">
                {log.action}
              </p>
              <pre className="mt-2 whitespace-pre-wrap rounded-md bg-slate-50 p-2 text-xs text-slate-600">
                {JSON.stringify(log.metadata, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
