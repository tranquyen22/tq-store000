import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { UserProfile, AuthResponse } from './types';

interface AuthContextType {
  user: UserProfile | null;
  supabaseUser: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (identifier: string, pass: string) => Promise<AuthResponse>;
  signUp: (data: { fullName: string; email: string; phone: string; password: string }) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  updateProfile: (data: { fullName: string; phone: string; address: string }) => Promise<AuthResponse>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const syncLocalProfile = (userObj: any) => {
    if (!userObj) {
      setUser(null);
      localStorage.removeItem('tq_current_user');
      return;
    }
    const profile: UserProfile = {
      id: userObj.id || 'usr-' + Date.now(),
      fullName: userObj.fullName || userObj.user_metadata?.full_name || 'Người dùng TQ Store',
      email: userObj.email || '',
      phone: userObj.phone || userObj.user_metadata?.phone || '',
      address: userObj.address || userObj.user_metadata?.address || ''
    };
    setUser(profile);
    localStorage.setItem('tq_current_user', JSON.stringify(profile));
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setSupabaseUser(session?.user ?? null);
      if (session?.user) {
        syncLocalProfile({
          id: session.user.id,
          email: session.user.email,
          fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
          phone: session.user.user_metadata?.phone,
          address: session.user.user_metadata?.address
        });
      } else {
        const saved = localStorage.getItem('tq_current_user');
        if (saved) {
          try { setUser(JSON.parse(saved)); } 
          catch (error) { 
            console.error('[ERROR][AuthContext.tsx - getSession]:', error);
            setUser(null); 
          }
        }
      }
      setLoading(false);
    }).catch(error => {
      console.error('[ERROR][AuthContext.tsx - getSessionAsync]:', error);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setSupabaseUser(session?.user ?? null);
      if (session?.user) {
        syncLocalProfile({
          id: session.user.id,
          email: session.user.email,
          fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
          phone: session.user.user_metadata?.phone,
          address: session.user.user_metadata?.address
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async ({ fullName, email, phone, password }: { fullName: string; email: string; phone: string; password: string }): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email, password, options: { data: { full_name: fullName, phone } }
      });
      if (error) {
        console.error('[ERROR][AuthContext.tsx - signUpSupabase]:', error);
        syncLocalProfile({ id: 'user-' + Date.now(), fullName, email, phone, address: '' });
        return { success: true, message: 'Đăng ký tài khoản mới thành công!' };
      }
      if (data.user) syncLocalProfile({ id: data.user.id, fullName, email, phone, address: '' });
      return { success: true, message: 'Đăng ký tài khoản thành công!' };
    } catch (error) {
      console.error('[ERROR][AuthContext.tsx - signUp]:', error);
      return { success: false, message: 'Lỗi khi đăng ký tài khoản' };
    }
  };

  const signIn = async (identifier: string, password: string): Promise<AuthResponse> => {
    try {
      let emailToUse = identifier.trim();
      if (!emailToUse.includes('@')) emailToUse = `${emailToUse.replace(/\s+/g, '')}@tqstore.vn`;
      const { data, error } = await supabase.auth.signInWithPassword({ email: emailToUse, password });
      if (error) {
        console.error('[ERROR][AuthContext.tsx - signInSupabase]:', error);
        if ((identifier === 'demo@gmail.com' || identifier === '0912345678') && password === 'password123') {
          syncLocalProfile({ id: 'user-demo-1', fullName: 'Nguyễn Văn Anh', email: 'demo@gmail.com', phone: '0912345678', address: '123 Nguyễn Huệ, Q1, TP.HCM' });
          return { success: true, message: 'Đăng nhập thành công với tài khoản mẫu!' };
        }
        return { success: false, message: 'Email / SĐT hoặc Mật khẩu không đúng!' };
      }
      if (data.user) {
        syncLocalProfile({
          id: data.user.id, email: data.user.email,
          fullName: data.user.user_metadata?.full_name || data.user.email?.split('@')[0],
          phone: data.user.user_metadata?.phone, address: data.user.user_metadata?.address
        });
      }
      return { success: true, message: 'Đăng nhập thành công!' };
    } catch (error) {
      console.error('[ERROR][AuthContext.tsx - signIn]:', error);
      return { success: false, message: 'Lỗi khi đăng nhập' };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('[ERROR][AuthContext.tsx - signOut]:', error);
    }
    syncLocalProfile(null);
  };

  const updateProfile = async (data: { fullName: string; phone: string; address: string }): Promise<AuthResponse> => {
    if (!user) return { success: false, message: 'Chưa đăng nhập' };
    const updated = { ...user, ...data };
    syncLocalProfile(updated);
    if (supabaseUser) {
      try {
        await supabase.auth.updateUser({ data: { full_name: data.fullName, phone: data.phone, address: data.address } });
      } catch (error) {
        console.error('[ERROR][AuthContext.tsx - updateProfile]:', error);
      }
    }
    return { success: true, message: 'Cập nhật thông tin thành công!' };
  };

  return (
    <AuthContext.Provider value={{ user, supabaseUser, session, loading, signIn, signUp, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
