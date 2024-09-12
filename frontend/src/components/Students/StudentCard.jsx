const StudentCard = ({
  lastName,
  firstName,
  email,
  phoneNumber,
  birthdate,
  formationStart,
  formationDesiredEnd,
  formationMaxDuration,
}) => {
  return (
    <div>
      <h2>{lastName}</h2>
      <p>{firstName}</p>
      <p>{email}</p>
      <p>{phoneNumber}</p>
      <p>{birthdate}</p>
      <p>{formationStart}</p>
      <p>{formationDesiredEnd}</p>
      <p>{formationMaxDuration}</p>
    </div>
  );
};

export default StudentCard;
