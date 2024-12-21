import "../styles/ErrorMessage.css";

const ErrorMessage = ({ error }) => {
  if (!error) return null;
  
  return (
    <div className="errorMessage">
      {error}
    </div>
  );
};

export default ErrorMessage;