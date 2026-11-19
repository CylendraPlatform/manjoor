import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { db } from "@/integrations/supabase/db";
import type { Category } from "@/integrations/supabase/overrides";
import { getErrorMessage } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Save, X, CornerDownLeft } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function AdminCategories() {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [sortOrder, setSortOrder] = useState("0");
    const [parentId, setParentId] = useState<string>("root");
    const queryClient = useQueryClient();

    const { data: categories, isLoading } = useQuery({
        queryKey: ["admin-categories"],
        queryFn: async () => {
            const { data, error } = await supabase.from("categories").select("*").order("sort_order");
            if (error) throw error;
            return data;
        }
    });

    const saveMutation = useMutation({
        mutationFn: async () => {
            const payload = {
                name,
                slug,
                sort_order: parseInt(sortOrder),
                parent_id: parentId === "root" ? null : parentId
            };

            if (editingId) {
                const { error } = await db.from("categories").update(payload).eq("id", editingId);
                if (error) throw error;
            } else {
                const { error } = await db.from("categories").insert(payload);
                if (error) throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
            toast.success(editingId ? "تم التحديث" : "تمت الإضافة");
            resetForm();
        },
        onError: (err: unknown) => toast.error(getErrorMessage(err)),
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from("categories").delete().eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
            toast.success("تم الحذف");
        },
        onError: () => toast.error("لا يمكن حذف قسم يحتوي على منتجات أو أقسام فرعية"),
    });

    const resetForm = () => {
        setEditingId(null);
        setName("");
        setSlug("");
        setSortOrder("0");
        setParentId("root");
    };

    const handleEdit = (cat: Category) => {
        setEditingId(cat.id);
        setName(cat.name);
        setSlug(cat.slug);
        setSortOrder(cat.sort_order?.toString() || "0");
        setParentId(cat.parent_id || "root");
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const generateSlug = (val: string) => {
        return val.toLowerCase().replace(/[^\w\s\u0600-\u06FF]/g, "").replace(/\s+/g, "-");
    };

    // Organise categories hierarchically for the table
    const rootCategories = categories?.filter(c => !c.parent_id) || [];
    const getChildren = (id: string) => categories?.filter(c => c.parent_id === id) || [];
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">إدارة الأقسام</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Form */}
                <div className="lg:col-span-1">
                    <Card className="lg:sticky lg:top-24 shadow-lg border-primary/10">
                        <CardHeader className="bg-primary/5 pb-4">
                            <CardTitle className="text-lg">{editingId ? "تعديل قسم" : "إضافة قسم جديد"}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div className="space-y-2">
                                <Label>اسم القسم</Label>
                                <Input
                                    value={name}
                                    placeholder="مثال: موبايلات"
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        if (!editingId) setSlug(generateSlug(e.target.value));
                                    }}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>الرابط (Slug)</Label>
                                <Input value={slug} onChange={(e) => setSlug(e.target.value)} dir="ltr" placeholder="mobiles" />
                            </div>

                            <div className="space-y-2">
                                <Label>القسم الرئيسي (اختياري)</Label>
                                <Select value={parentId} onValueChange={setParentId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="اختر قسماً رئيسياً" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="root">-- قسم رئيسي --</SelectItem>
                                        {rootCategories
                                            .filter(c => c.id !== editingId)
                                            .map(cat => (
                                                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                                <p className="text-[10px] text-muted-foreground">اتركه كما هو ليكون قسماً أساسياً</p>
                            </div>

                            <div className="space-y-2">
                                <Label>ترتيب العرض</Label>
                                <Input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} dir="ltr" />
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button className="flex-1 gap-2" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
                                    <Save size={18} />
                                    {editingId ? "تحديث القسم" : "حفظ القسم"}
                                </Button>
                                {editingId && (
                                    <Button variant="outline" size="icon" onClick={resetForm}>
                                        <X size={18} />
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* List */}
                <div className="lg:col-span-2">
                    <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="text-right w-16">#</TableHead>
                                    <TableHead className="text-right">الاسم</TableHead>
                                    <TableHead className="text-right">الرابط</TableHead>
                                    <TableHead className="text-center">إجراءات</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-10">جاري التحميل...</TableCell>
                                    </TableRow>
                                ) : rootCategories.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">لا توجد أقسام</TableCell>
                                    </TableRow>
                                ) : rootCategories.map((cat) => (
                                    <React.Fragment key={cat.id}>
                                        {/* Root Category */}
                                        <TableRow className="group hover:bg-muted/30">
                                            <TableCell>{cat.sort_order}</TableCell>
                                            <TableCell className="font-bold text-primary">{cat.name}</TableCell>
                                            <TableCell className="text-sm font-mono text-muted-foreground">{cat.slug}</TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(cat)}>
                                                        <Edit size={16} />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:text-destructive"
                                                        onClick={() => {
                                                            if (confirm("هل أنت متأكد؟ سيتم حذف جميع الأقسام الفرعية أيضاً")) deleteMutation.mutate(cat.id);
                                                        }}
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>

                                        {/* Children */}
                                        {getChildren(cat.id).map(child => (
                                            <TableRow key={child.id} className="bg-muted/5 hover:bg-muted/20">
                                                <TableCell className="text-muted-foreground/50">{child.sort_order}</TableCell>
                                                <TableCell className="pr-8">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <CornerDownLeft size={14} className="text-muted-foreground" />
                                                        <span>{child.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-xs font-mono text-muted-foreground/70">{child.slug}</TableCell>
                                                <TableCell className="text-center">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(child)}>
                                                            <Edit size={14} />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7 text-destructive hover:text-destructive"
                                                            onClick={() => {
                                                                if (confirm("هل أنت متأكد؟")) deleteMutation.mutate(child.id);
                                                            }}
                                                        >
                                                            <Trash2 size={14} />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
}
