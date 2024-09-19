// import React, { useState } from 'react'
// import { addStudent } from '../../api/api-client'

// const AddStudentForm = () => {

//     const [student, setStudent] = useState({});
//     const [lastName, setLastName] = useState('');
//     const [firstName, setFirstName] = useState("");
//     const [email, setEmail] = useState("");
//     const [phoneNumber, setPhoneNumber] = useState("");
//     const [birthdate, setBirthdate] = useState("");
//     const [formationStart, setFormationStart] = useState("");
//     const [formationDesiredEnd, setFormationDesiredEnd] = useState("");
//      const [formationMaxDuration, setFormationMaxDuration] = useState("");


//   const handleChange = (event) => {
//     const { name, value } = event.target
//     setStudent((student) => ({ ...student, [name]: value }))
//     console.log(student);

//   }
 
//   const handleSubmit = async (event) => {
    
//     event.preventDefault()
 
//         try {
//         const data = {
//           lastName,
//           firstName,
//           email,
//           phoneNumber,
//           birthdate,
//           formationStart,
//           formationDesiredEnd,
//           formationMaxDuration,
//         };
      
//       const response = await addStudent(data)
//       console.log(response);
     
//     }catch(e){
//       console.log(e);
//     }
//   }
 
//   return (
//     <div>
//       <section>
//         <h1> Ajouter un etudiant</h1>
//         <form onSubmit={handleSubmit} autoComplete="off">
//           <label>
//             lastName
//             <input type="text" onChange={handleChange} name="lastName" />
//           </label>
//           <label>
//             firstName
//             <input type="text" onChange={handleChange} name="firstName" />
//           </label>
//           <label>
//             email
//             <input type="email" onChange={handleChange} name="email" />
//           </label>
//           <label>
//             phoneNumber
//             <input type="text" onChange={handleChange} name="phoneNumber" />
//           </label>
//           <label>
//             birthdate
//             <input type="date" onChange={handleChange} name="birthdate" />
//           </label>
//           <label>
//             formationStart
//             <input type="date" onChange={handleChange} name="formationStart" />
//           </label>
//           <label>
//             formationDesiredEnd
//             <input
//               type="date"
//               onChange={handleChange}
//               name="formationDesiredEnd"
//             />
//           </label>
//           <label>
//             formationMaxDuration
//             <input
//               type="date"
//               onChange={handleChange}
//               name="formationMaxDuration"
//             />
//           </label>
//           <button type="submit">ajouter un cours</button>
//         </form>
//       </section>
//     </div>
//   );
// };

// export default AddStudentForm;


import React, { useState } from "react";
import { addStudent } from "../../api/api-client";
import { Form, Button, Container } from "react-bootstrap";

const AddStudentForm = () => {
  const [student, setStudent] = useState({
    lastName: "",
    firstName: "",
    email: "",
    phoneNumber: "",
    birthdate: "",
    formationStart: "",
    formationDesiredEnd: "",
    formationMaxDuration: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setStudent((prevStudent) => ({
      ...prevStudent,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await addStudent(student);
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Container>
      <h1 className="text-center my-4">Ajouter un étudiant</h1>
      <Form onSubmit={handleSubmit} autoComplete="off">
        <Form.Group controlId="lastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            name="lastName"
            value={student.lastName}
            onChange={handleChange}
            placeholder="Enter last name"
          />
        </Form.Group>

        <Form.Group controlId="firstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            name="firstName"
            value={student.firstName}
            onChange={handleChange}
            placeholder="Enter first name"
          />
        </Form.Group>

        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={student.email}
            onChange={handleChange}
            placeholder="Enter email"
          />
        </Form.Group>

        <Form.Group controlId="phoneNumber">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="text"
            name="phoneNumber"
            value={student.phoneNumber}
            onChange={handleChange}
            placeholder="Enter phone number"
          />
        </Form.Group>

        <Form.Group controlId="birthdate">
          <Form.Label>Birthdate</Form.Label>
          <Form.Control
            type="date"
            name="birthdate"
            value={student.birthdate}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formationStart">
          <Form.Label>Formation Start</Form.Label>
          <Form.Control
            type="date"
            name="formationStart"
            value={student.formationStart}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formationDesiredEnd">
          <Form.Label>Formation Desired End</Form.Label>
          <Form.Control
            type="date"
            name="formationDesiredEnd"
            value={student.formationDesiredEnd}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formationMaxDuration">
          <Form.Label>Formation Max Duration</Form.Label>
          <Form.Control
            type="text"
            name="formationMaxDuration"
            value={student.formationMaxDuration}
            onChange={handleChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Ajouter un étudiant
        </Button>
      </Form>
    </Container>
  );
};

export default AddStudentForm;

