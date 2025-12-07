import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { showToast } from '@/components/ui/sonner-toast';
import type { RegisterData } from '@/types';
import { useAuth } from '@/context/auth-context';
import { RegisterForm } from '@/components/auth/register-form';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = async (data: RegisterData) => {
    try {
      const response = await authService.register(data);
      login(response.access_token, {
        id: '',
        email: data.email
      });
      showToast('Sucess', 'conta criada com sucesso', { type: 'success' });
      navigate('/');
    } catch (error: any) {
      if (error.response?.status === 409) {
        showToast('Erro', 'email já cadastrado', { type: 'error' });
      } else {
        showToast('Erro', 'Não foi possível criar a conta', { type: 'error' });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">🏠 Na Porta</CardTitle>
          <CardDescription>
            Crie sua conta para começar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm onSubmit={handleRegister} />
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/login')}
              className="text-sm text-blue-600 hover:underline"
            >
              Já tem conta? Faça login
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};