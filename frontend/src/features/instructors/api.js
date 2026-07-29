import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../api/apiClient';

export const instructorsKeys = {
  all: ['instructors'],
  list: () => [...instructorsKeys.all, 'list'],
  detail: (id) => [...instructorsKeys.all, 'detail', id],
};

export const useInstructors = () =>
  useQuery({
    queryKey: instructorsKeys.list(),
    queryFn: async () => (await apiClient.get('/instructor/get-all')).data,
  });

export const useInstructor = (id) =>
  useQuery({
    queryKey: instructorsKeys.detail(id),
    queryFn: async () => (await apiClient.get(`/instructor/get/${id}`)).data,
    enabled: Boolean(id),
  });

export const useAddInstructor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (instructor) => apiClient.post('/instructor/add', instructor),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: instructorsKeys.all }),
  });
};

export const useUpdateInstructor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...instructor }) => apiClient.put(`/instructor/update/${id}`, instructor),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: instructorsKeys.all });
      queryClient.invalidateQueries({ queryKey: instructorsKeys.detail(id) });
    },
  });
};

export const useDeleteInstructor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiClient.delete(`/instructor/delete/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: instructorsKeys.all }),
  });
};

export const useUploadInstructorDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData) => apiClient.post('/instructor/document/add', formData),
    onSuccess: (_data, formData) => {
      const id = formData.get('instructorId');
      queryClient.invalidateQueries({ queryKey: instructorsKeys.detail(id) });
    },
  });
};

export const useDeleteInstructorDocument = (instructorId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (documentId) => apiClient.delete(`/instructor/document/delete/${documentId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: instructorsKeys.detail(instructorId) }),
  });
};
