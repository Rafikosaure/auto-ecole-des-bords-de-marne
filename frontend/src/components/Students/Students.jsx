import { useState, useEffect } from "react";
import StudentCard from "./StudentCard";
import { GetAllStudents } from "../../api/api-client";

const Students = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data } = await GetAllStudents();
        console.log(data);
        setStudents(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchStudents();
  }, []);

  return (
    <section>
      <h2>all students</h2>
      <ul>
        {students.map((card) => (
          <li key={card.id}>
            <StudentCard
              id={card.id}
              lastName={card.lastName}
              firstName={card.firstName}
              email={card.email}
              phoneNumber={card.phoneNumber}
              birthdate={card.birthdate}
              formationStart={card.formationStart}
              formationDesiredEnd={card.formationDesiredEnd}
              formationMaxDuration={card.formationMaxDuration}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Students;
