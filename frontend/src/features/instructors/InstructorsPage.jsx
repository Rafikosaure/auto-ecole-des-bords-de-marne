import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import {
  useInstructors,
  useAddInstructor,
  useUpdateInstructor,
  useDeleteInstructor,
} from './api';
import { instructorFormSchema } from './schema';
import SearchForm from '../../components/SearchForm/SearchForm';
import { formatPhoneDisplay, normalizePhone } from '../../utils/phoneUtils';

const emptyFormValues = {
  lastName: '',
  firstName: '',
  email: '',
  phoneNumber: '',
  adress: '',
  speciality: [],
};

const InstructorForm = ({ formId, onSubmit, defaultValues }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(instructorFormSchema),
    defaultValues,
  });

  const speciality = watch('speciality');
  const phoneNumber = watch('phoneNumber');

  const toggleSpeciality = (value, checked) => {
    const updated = checked
      ? [...new Set([...speciality, value])]
      : speciality.filter((item) => item !== value);
    setValue('speciality', updated);
  };

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Nom de famille</label>
          <input
            type="text"
            className={`form-control${errors.lastName ? ' is-invalid' : ''}`}
            placeholder="Ex : Dupont"
            {...register('lastName')}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Prénom</label>
          <input
            type="text"
            className={`form-control${errors.firstName ? ' is-invalid' : ''}`}
            placeholder="Ex : Jean"
            {...register('firstName')}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Adresse e-mail</label>
          <input
            type="email"
            className={`form-control${errors.email ? ' is-invalid' : ''}`}
            placeholder="jean.dupont@email.com"
            {...register('email')}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Numéro de téléphone</label>
          <input
            type="text"
            className="form-control"
            placeholder="Ex : 06 12 34 56 78"
            value={phoneNumber}
            onChange={(e) => setValue('phoneNumber', formatPhoneDisplay(e.target.value))}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Adresse</label>
          <input
            type="text"
            className="form-control"
            placeholder="Ex : 1 rue de la Paix, Paris"
            {...register('adress')}
          />
        </div>
        <div className="col-md-6 mb-3">
          <div className="mb-3">
            <label>Spécialités:</label>
            <div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="Auto"
                  id={`${formId}-auto`}
                  checked={speciality.includes('Auto')}
                  onChange={(e) => toggleSpeciality('Auto', e.target.checked)}
                />
                <label className="form-check-label" htmlFor={`${formId}-auto`}>
                  Auto
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="Moto"
                  id={`${formId}-moto`}
                  checked={speciality.includes('Moto')}
                  onChange={(e) => toggleSpeciality('Moto', e.target.checked)}
                />
                <label className="form-check-label" htmlFor={`${formId}-moto`}>
                  Moto
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

const InstructorsPage = () => {
  const navigate = useNavigate();
  const { data: instructors = [], isLoading } = useInstructors();
  const addInstructor = useAddInstructor();
  const updateInstructor = useUpdateInstructor();
  const deleteInstructor = useDeleteInstructor();

  const [editingInstructor, setEditingInstructor] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInstructors = (() => {
    if (!searchTerm) return instructors;
    const lowered = searchTerm.toLowerCase();
    const filtered = instructors.filter(
      (instructor) =>
        instructor.lastName.toLowerCase().startsWith(lowered) ||
        instructor.firstName.toLowerCase().startsWith(lowered)
    );
    return filtered.length > 0 ? filtered : instructors;
  })();

  const handleFormSubmit = async (values) => {
    const dataToSubmit = {
      ...values,
      speciality: values.speciality.join(','),
      phoneNumber: normalizePhone(values.phoneNumber),
    };

    try {
      if (editingInstructor) {
        await updateInstructor.mutateAsync({ id: editingInstructor.id, ...dataToSubmit });
        setSuccessMessage('Un instructeur a bien été modifié');
      } else {
        await addInstructor.mutateAsync(dataToSubmit);
        setSuccessMessage('Un instructeur a bien été ajouté');
      }
      setTimeout(() => setSuccessMessage(''), 3000);
      setEditingInstructor(null);
      setShowForm(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout/modification de l'instructeur:", error);
      setErrorMessage("Erreur lors de l'ajout ou de la modification de l'instructeur");
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet instructeur ?')) return;
    try {
      await deleteInstructor.mutateAsync(id);
      setSuccessMessage('Un instructeur a bien été supprimé');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'instructeur:", error);
      setErrorMessage("Erreur lors de la suppression de l'instructeur");
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleEdit = (instructor) => {
    setEditingInstructor(instructor);
    setShowForm(true);
  };

  const handleInstructorClick = (id) => {
    navigate(`/instructor/${id}`);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-3">Liste des Moniteurs</h1>

      <SearchForm onSearch={setSearchTerm} />

      <div className="text-center mt-4 mb-3">
        <button
          className="btn btn-success"
          onClick={() => {
            setEditingInstructor(null);
            setShowForm(!showForm);
          }}
        >
          {showForm ? 'Annuler' : 'Ajouter Instructeur'}
        </button>
      </div>

      {showForm && !editingInstructor && (
        <div className="card mb-5">
          <div className="card-header">Ajouter le moniteur</div>
          <div className="card-body">
            <InstructorForm formId="add-instructor" onSubmit={handleFormSubmit} defaultValues={emptyFormValues} />
            <div className="d-flex justify-content-center gap-2 mt-3">
              <button type="submit" form="add-instructor" className="btn btn-success">
                Ajouter
              </button>
              <button type="button" className="btn btn-danger ms-2" onClick={() => setShowForm(false)}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoading && <div className="alert alert-info">Chargement des instructeurs...</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <div className="d-flex flex-column-reverse">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Adresse</th>
              <th>Spécialités</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInstructors.map((instructor) => (
              <React.Fragment key={instructor.id}>
                {editingInstructor?.id === instructor.id && showForm && (
                  <tr>
                    <td colSpan="7">
                      <div className="card mb-5">
                        <div className="card-header">Modifier le Moniteur</div>
                        <div className="card-body">
                          <InstructorForm
                            formId={`edit-instructor-${instructor.id}`}
                            onSubmit={handleFormSubmit}
                            defaultValues={{
                              lastName: instructor.lastName,
                              firstName: instructor.firstName,
                              email: instructor.email,
                              phoneNumber: formatPhoneDisplay(instructor.phoneNumber),
                              adress: instructor.adress,
                              speciality: instructor.speciality
                                ? instructor.speciality.split(',').map((spec) => spec.trim())
                                : [],
                            }}
                          />
                          <div className="d-flex justify-content-center gap-2 mt-3">
                            <button type="submit" form={`edit-instructor-${instructor.id}`} className="btn btn-success">
                              Modifier
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger ms-2"
                              onClick={() => {
                                setShowForm(false);
                                setEditingInstructor(null);
                              }}
                            >
                              Annuler
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
                <tr>
                  <td onClick={() => handleInstructorClick(instructor.id)} style={{ cursor: 'pointer' }}>
                    {instructor.lastName}
                  </td>
                  <td>{instructor.firstName}</td>
                  <td>{instructor.email}</td>
                  <td>{formatPhoneDisplay(instructor.phoneNumber)}</td>
                  <td>{instructor.adress}</td>
                  <td>{instructor.speciality}</td>
                  <td>
                    <button className="btn btn-primary" onClick={() => handleEdit(instructor)}>
                      Modifier
                    </button>
                    <button className="btn btn-danger ms-2" onClick={() => handleDelete(instructor.id)}>
                      Supprimer
                    </button>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InstructorsPage;
