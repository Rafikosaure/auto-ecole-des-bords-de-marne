import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getStudents,
  getAllStudents,
  getStudentById,
  addStudent,
  updateStudent,
  deleteStudent,
} from '../../api/apiClient';

export const studentsKeys = {
  all: ['students'],
  allList: () => [...studentsKeys.all, 'all'],
  page: (page, limit) => [...studentsKeys.all, 'page', page, limit],
  detail: (id) => [...studentsKeys.all, 'detail', id],
};

export const useAllStudents = () =>
  useQuery({
    queryKey: studentsKeys.allList(),
    queryFn: async () => (await getStudents()).data,
  });

export const useStudents = (page, limit) =>
  useQuery({
    queryKey: studentsKeys.page(page, limit),
    queryFn: async () => (await getAllStudents(page, limit)).data,
  });

export const useStudent = (id) =>
  useQuery({
    queryKey: studentsKeys.detail(id),
    queryFn: async () => (await getStudentById(id)).data,
    enabled: Boolean(id),
  });

export const useAddStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (student) => addStudent(student),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentsKeys.all });
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (student) => updateStudent(student),
    onSuccess: (_data, student) => {
      queryClient.invalidateQueries({ queryKey: studentsKeys.all });
      queryClient.invalidateQueries({ queryKey: studentsKeys.detail(student.id) });
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentsKeys.all });
    },
  });
};
