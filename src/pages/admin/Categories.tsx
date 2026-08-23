import { useEffect, useState, FormEvent } from "react";
import { toast } from "react-toastify";
import { Trash2, Plus } from "lucide-react";
import DashboardShell from "../../components/layout/DashboardShell";
import { adminNav } from "../../components/layout/navConfig";
import { Card } from "../../components/ui/Primitives";
import AdminTable, { Column } from "../../components/shared/AdminTable";
import { api, apiErrorMessage } from "../../api/client";
import { Category } from "../../types";

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    api.categories().then((res) => setCategories(res.data.categories)).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.createCategory({ name });
      setName("");
      load();
    } catch (err) {
      toast.error(apiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this category? Products using it will need reassigning.")) return;
    try {
      await api.deleteCategory(id);
      load();
    } catch (err) {
      toast.error(apiErrorMessage(err));
    }
  }

  const cols: Column<Category>[] = [
    { header: "Category", render: (c) => c.name },
    { header: "Products", render: (c) => c._count?.products ?? 0 },
    { header: "", render: (c) => <button onClick={() => remove(c.id)} className="btn-outline !py-1 !px-3 text-xs text-red-500"><Trash2 size={13} /></button> },
  ];

  return (
    <DashboardShell navItems={adminNav} sectionLabel="Admin Dashboard" greeting="Categories" subtitle="Manage product categories.">
      <Card className="mb-6 p-5">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input required className="input" placeholder="New category name" value={name} onChange={(e) => setName(e.target.value)} />
          <button type="submit" disabled={saving} className="btn-primary shrink-0"><Plus size={15} /> Add</button>
        </form>
      </Card>
      <AdminTable columns={cols} rows={categories} loading={loading} emptyTitle="No categories yet" />
    </DashboardShell>
  );
}
