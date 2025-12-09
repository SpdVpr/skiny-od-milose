'use server';

import { cookies } from 'next/headers';

export async function login(formData: FormData) {
    const password = formData.get('password') as string;
    const envPassword = process.env.ADMIN_PASSWORD;

    if (!envPassword) {
        console.error('ADMIN_PASSWORD is not set in environment variables');
        return { success: false, error: 'Server configuration error' };
    }

    if (password === envPassword) {
        // Set cookie valid for 7 days
        const cookieStore = await cookies();
        cookieStore.set('admin_authenticated', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });
        return { success: true };
    }

    return { success: false, error: 'Incorrect password' };
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('admin_authenticated');
}
