'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const COOKIE_NAME = process.env.COOKIE_NAME || 'admin_session';
// Basit bir güvenlik kontrolü için environment değişkenlerini alıyoruz
const ADMIN_USER = process.env.ADMIN_USERNAME;
const ADMIN_PASS = process.env.ADMIN_PASSWORD;

export async function login(prevState: any, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    // Giriş başarılı ise güvenli bir httpOnly cookie oluşturuyoruz
    // Not: Next.js 15+ sürümlerinde cookies() await gerektirebilir, projeniz 16 göründüğü için await ekliyoruz.
    const cookieStore = await cookies();
    
    cookieStore.set(COOKIE_NAME, 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 gün
      path: '/',
    });

    redirect('/admin');
  } else {
    return { message: 'Kullanıcı adı veya şifre hatalı!' };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect('/admin/login');
}