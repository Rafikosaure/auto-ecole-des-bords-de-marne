import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../api/apiClient';

export const adminsKeys = {
  all: ['admins'],
  list: () => [...adminsKeys.all, 'list'],
};

export const useAdmins = () =>
  useQuery({
    queryKey: adminsKeys.list(),
    queryFn: async () => (await apiClient.get('/admin/get-all')).data,
  });

export const useAddAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (admin) => apiClient.post('/admin/signup', admin),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminsKeys.all }),
  });
};

export const useUpdateAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...admin }) => apiClient.put(`/admin/update/${id}`, admin),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminsKeys.all }),
  });
};

export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiClient.delete(`/admin/delete/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminsKeys.all }),
  });
};
