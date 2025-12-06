import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Pencil, Trash2, Save, X, Building2, Wallet, Smartphone, Banknote, CreditCard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface PaymentAccount {
  id: string;
  bank_name: string;
  account_number: string;
  account_name: string;
  icon_name: string;
  is_active: boolean;
  display_order: number;
}

const iconOptions = [
  { value: "Building2", label: "Bank", icon: Building2 },
  { value: "Wallet", label: "Wallet", icon: Wallet },
  { value: "Smartphone", label: "Mobile", icon: Smartphone },
  { value: "Banknote", label: "Cash", icon: Banknote },
  { value: "CreditCard", label: "Card", icon: CreditCard },
];

const AdminPaymentAccounts = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<PaymentAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    bank_name: "",
    account_number: "",
    account_name: "",
    icon_name: "Building2",
    is_active: true,
    display_order: 0,
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUserEmail(session.user.email || null);
          setTimeout(() => {
            checkAdminRole(session.user.id);
          }, 0);
        } else {
          setIsAuthenticated(false);
          setCheckingAuth(false);
          navigate("/admin/auth");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserEmail(session.user.email || null);
        checkAdminRole(session.user.id);
      } else {
        setCheckingAuth(false);
        navigate("/admin/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAdminRole = async (userId: string) => {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (data) {
      setIsAuthenticated(true);
      setCheckingAuth(false);
      fetchAccounts();
    } else {
      setCheckingAuth(false);
      toast({
        title: "Access Denied",
        description: "You don't have admin privileges",
        variant: "destructive",
      });
      await supabase.auth.signOut();
      navigate("/admin/auth");
    }
  };

  const fetchAccounts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("payment_accounts")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      toast({ title: "Error", description: "Failed to load accounts", variant: "destructive" });
    } else {
      setAccounts(data || []);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/auth");
  };

  const handleSave = async (id: string) => {
    const { error } = await supabase
      .from("payment_accounts")
      .update(formData)
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Failed to update account", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Account updated successfully" });
      setEditingId(null);
      fetchAccounts();
    }
  };

  const handleAdd = async () => {
    const { error } = await supabase
      .from("payment_accounts")
      .insert([{ ...formData, display_order: accounts.length + 1 }]);

    if (error) {
      toast({ title: "Error", description: "Failed to add account", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Account added successfully" });
      setShowAddForm(false);
      setFormData({
        bank_name: "",
        account_number: "",
        account_name: "",
        icon_name: "Building2",
        is_active: true,
        display_order: 0,
      });
      fetchAccounts();
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    const { error } = await supabase
      .from("payment_accounts")
      .delete()
      .eq("id", deleteId);

    if (error) {
      toast({ title: "Error", description: "Failed to delete account", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Account deleted successfully" });
      fetchAccounts();
    }
    setDeleteId(null);
  };

  const startEdit = (account: PaymentAccount) => {
    setEditingId(account.id);
    setFormData({
      bank_name: account.bank_name,
      account_number: account.account_number,
      account_name: account.account_name,
      icon_name: account.icon_name,
      is_active: account.is_active,
      display_order: account.display_order,
    });
  };

  const getIconComponent = (iconName: string) => {
    const option = iconOptions.find(o => o.value === iconName);
    return option ? option.icon : Building2;
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Verifying admin access...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-[#222222] text-white py-3 px-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center">
          <button onClick={() => navigate("/dashboard")} className="mr-3">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-semibold">Payment Accounts</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-300 hidden sm:block">{userEmail}</span>
          <Button size="sm" variant="ghost" onClick={handleLogout} className="text-white hover:bg-white/10">
            <LogOut size={18} />
          </Button>
        </div>
      </header>

      <div className="p-4">
        <Button
          onClick={() => setShowAddForm(true)}
          className="w-full mb-4 bg-green-600 hover:bg-green-700"
        >
          <Plus size={20} className="mr-2" /> Add New Account
        </Button>

        {loading ? (
          <p className="text-center py-8 text-gray-500">Loading...</p>
        ) : (
          <div className="space-y-4">
            {accounts.map((account) => {
              const IconComponent = getIconComponent(account.icon_name);
              const isEditing = editingId === account.id;

              return (
                <div key={account.id} className="bg-white rounded-lg shadow p-4">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <Label>Bank Name</Label>
                        <Input
                          value={formData.bank_name}
                          onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Account Number</Label>
                        <Input
                          value={formData.account_number}
                          onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Account Name</Label>
                        <Input
                          value={formData.account_name}
                          onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Icon</Label>
                        <Select
                          value={formData.icon_name}
                          onValueChange={(value) => setFormData({ ...formData, icon_name: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {iconOptions.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                <div className="flex items-center gap-2">
                                  <opt.icon size={16} />
                                  {opt.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Active</Label>
                        <Switch
                          checked={formData.is_active}
                          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleSave(account.id)} className="flex-1 bg-blue-600">
                          <Save size={16} className="mr-2" /> Save
                        </Button>
                        <Button variant="outline" onClick={() => setEditingId(null)} className="flex-1">
                          <X size={16} className="mr-2" /> Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${account.is_active ? 'bg-blue-100' : 'bg-gray-100'}`}>
                          <IconComponent size={24} className={account.is_active ? 'text-blue-600' : 'text-gray-400'} />
                        </div>
                        <div>
                          <p className="font-bold">{account.bank_name}</p>
                          <p className="text-sm text-gray-600">{account.account_number}</p>
                          <p className="text-xs text-gray-500">{account.account_name}</p>
                          {!account.is_active && (
                            <span className="text-xs text-red-500">Inactive</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => startEdit(account)}>
                          <Pencil size={16} />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => setDeleteId(account.id)}>
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Form Dialog */}
      <AlertDialog open={showAddForm} onOpenChange={setShowAddForm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add New Payment Account</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="space-y-3 py-4">
            <div>
              <Label>Bank Name</Label>
              <Input
                value={formData.bank_name}
                onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                placeholder="e.g., OPAY"
              />
            </div>
            <div>
              <Label>Account Number</Label>
              <Input
                value={formData.account_number}
                onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                placeholder="e.g., 1234567890"
              />
            </div>
            <div>
              <Label>Account Name</Label>
              <Input
                value={formData.account_name}
                onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                placeholder="e.g., JOHN DOE"
              />
            </div>
            <div>
              <Label>Icon</Label>
              <Select
                value={formData.icon_name}
                onValueChange={(value) => setFormData({ ...formData, icon_name: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <div className="flex items-center gap-2">
                        <opt.icon size={16} />
                        {opt.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
              Add Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The payment account will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPaymentAccounts;
