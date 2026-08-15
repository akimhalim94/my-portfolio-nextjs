import { getMessages } from "@/app/db-controller/server-actions";
import AdminLayout from "@/components/AdminLayout";
import DeleteMessageButton from "@/components/DeleteMessageButton";

export default async function AdminDashboard() {
  const result = await getMessages();
  const messages = result.success && result.messages ? result.messages : [];

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Tajuk */}
        <div className="rounded-2xl bg-gray-950/80 border border-white/10 backdrop-blur-md p-6 shadow-2xl">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            📊 Visitor Messages Inbox
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            List of messages sent by visitors through the contact form on your
            portfolio.
          </p>
        </div>

        {/* Statistik Ringkas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-gray-950/80 border border-white/10 backdrop-blur-md p-6 shadow-xl">
            <p className="text-xs text-gray-400 font-medium">
              Total Messages Received
            </p>
            <p className="text-3xl font-bold mt-2 text-blue-400">
              {messages.length}
            </p>
          </div>
          <div className="rounded-2xl bg-gray-950/80 border border-white/10 backdrop-blur-md p-6 shadow-xl">
            <p className="text-xs text-gray-400 font-medium">
              Database Status
            </p>
            <p className="text-sm font-semibold mt-3 text-green-400 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
              Supabase Connected
            </p>
          </div>
        </div>

        {/* Messages List (Inbox) */}
        <div className="rounded-2xl bg-gray-950/80 border border-white/10 backdrop-blur-md p-6 shadow-2xl space-y-4">
          <h2 className="text-lg font-semibold text-white">
            📬 Inquiries List
          </h2>

          {messages.length === 0 ? (
            <div className="text-center py-10 text-gray-500 text-xs sm:text-sm border border-dashed border-white/10 rounded-xl">
              No messages from visitors yet.
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg: any) => (
                <div
                  key={msg.id}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 hover:border-blue-500/30 transition-all"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                    <span className="font-semibold text-sm text-blue-300">
                      {msg.name}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500">
                        {new Date(msg.createdAt).toLocaleString("en-GB", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                      <DeleteMessageButton
                        id={msg.id}
                        senderName={msg.name}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 font-mono">{msg.email}</p>
                  <p className="text-xs sm:text-sm text-gray-200 mt-2 bg-black/40 p-3 rounded-lg border border-white/5 leading-relaxed">
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
