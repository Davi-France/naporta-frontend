import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/auth-context';
import { showToast } from '@/components/ui/sonner-toast';
import { LoginForm } from '@/components/auth/login-form';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      console.log('Tentando login...');
      const response = await authService.login({ email, password });
      console.log('Resposta do login:', response);

      login(response.access_token, { email, id: '' });
      console.log('Login realizado, token salvo');

      showToast('Sucesso', 'Login realizado com sucesso', { type: 'success' });
      console.log('Navegando para /');
      navigate('/');
    } catch (error) {
      console.error('Erro no login:', error);
      showToast('Erro', 'Credenciais inválidas', { type: 'error' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            faça login para acessar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm onSubmit={handleLogin} />
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/register')}
              className="text-sm text-blue-600 hover:underline"
            >
              nao tem conta? Registre -se
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};