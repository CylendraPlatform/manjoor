import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Auth() {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<"login" | "register">("login");

    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as any)?.from?.pathname || "/";

    const formatToE164 = (phone: string) => {
        let cleaned = phone.replace(/\D/g, '');
        if (cleaned.startsWith('0')) {
            cleaned = '964' + cleaned.substring(1);
        }
        if (!cleaned.startsWith('+')) {
            cleaned = '+' + cleaned;
        }
        return cleaned;
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const isEmail = identifier.includes('@');
        const authData = isEmail
            ? { email: identifier, password }
            : { phone: formatToE164(identifier), password };

        try {
            if (mode === "login") {
                const { error } = await supabase.auth.signInWithPassword(authData as any);
                if (error) throw error;
                toast.success("تم تسجيل الدخول بنجاح");
            } else {
                const { error } = await supabase.auth.signUp(authData as any);
                if (error) throw error;
                toast.success(isEmail
                    ? "تم إنشاء الحساب بنجاح. يرجى تفعيل البريد الإلكتروني إذا تطلب الأمر"
                    : "تم إنشاء الحساب بنجاح.");
            }
            navigate(from, { replace: true });
        } catch (error: any) {
            toast.error(error.message || "حدث خطأ أثناء العملية");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-muted/30">
            <Header />
            <main className="flex-1 flex items-center justify-center p-4 py-12">
                <Card className="w-full max-w-md shadow-lg border-2 border-primary/10">
                    <CardHeader className="text-center pb-2">
                        <div className="flex justify-center mb-6">
                            <img src="/dukany-logo.png" alt="متجر دكاني" className="h-28 w-auto object-contain" />
                        </div>
                        <CardTitle className="text-2xl font-bold">مرحباً بك</CardTitle>
                        <CardDescription>سجل دخولك أو أنشئ حساباً جديداً للمتابعة</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="login">تسجيل دخول</TabsTrigger>
                                <TabsTrigger value="register">إنشاء حساب</TabsTrigger>
                            </TabsList>

                            <form onSubmit={handleAuth} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="identifier">البريد الإلكتروني أو رقم الهاتف</Label>
                                    <Input
                                        id="identifier"
                                        type="text"
                                        placeholder="البريد أو 07XXXXXXXX"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        required
                                        dir="ltr"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">كلمة المرور</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        dir="ltr"
                                    />
                                </div>
                                <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={loading}>
                                    {loading ? "جاري التحميل..." : mode === "login" ? "تسجيل الدخول" : "إنشاء الحساب"}
                                </Button>
                            </form>
                        </Tabs>
                    </CardContent>
                </Card>
            </main>
            <Footer />
        </div>
    );
}
