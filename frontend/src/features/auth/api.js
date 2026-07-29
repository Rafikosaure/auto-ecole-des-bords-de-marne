import { useMutation } from '@tanstack/react-query';
import apiClient from '../../api/apiClient';

export const useLogin = () =>
  useMutation({
    mutationFn: ({ username, password }) => apiClient.post('/admin/login', { username, password }),
  });
