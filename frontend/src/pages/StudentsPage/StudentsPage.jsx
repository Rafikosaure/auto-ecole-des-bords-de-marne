import React from "react";
import Students from "../../components/Students/Students";
import AddStudentForm from "../../components/StudentsAdmin/AddStudentForm";
import UpdateStudentForm from "../../components/StudentsAdmin/UpdateStudent";

const StudentsPage = () => {
  return (
    <>

      <Students />
      <AddStudentForm />
      <UpdateStudentForm />
    </>
  );
};

export default StudentsPage;
