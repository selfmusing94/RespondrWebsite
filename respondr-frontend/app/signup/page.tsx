'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/app/layout';
import { signup } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['Public', 'Responder'], { message: 'Please select a role' }),
});

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });
  const { login: authLogin } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = async (data: SignupForm) => {
    try {
      const response = await signup(data);
      authLogin(response.token, response.role, response.userId);
      toast({
        title: 'Success',
        description: 'Account created successfully!',
      });
      router.push('/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create account',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md md:max-w-2xl p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Sign Up for Respondr</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              className="mt-1 w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              {...register('name')}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="mt-1 w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              {...register('email')}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="mt-1 w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              {...register('password')}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="role" className="text-sm font-medium text-gray-700">Role</Label>
            <select
              id="role"
              className="mt-1 w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              {...register('role')}
            >
              <option value="">Select a role</option>
              <option value="Public">Public</option>
              <option value="Responder">Responder</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition-colors"
          >
            Sign Up
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">Log in</a>
        </p>
      </div>
    </div>
  );
}