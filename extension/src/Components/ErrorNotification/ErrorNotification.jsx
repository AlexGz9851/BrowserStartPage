import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import './ErrorNotification.css'

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function ErrorNotification({ graphQLError, showError, setShowError }) {
  const error = graphQLError;
  if (!error) { return <></> }
  let errors = [];
  if (error.graphQLErrors) {
    errors = errors.concat(error.graphQLErrors)
  }
  if (error.networkError?.result?.errors) {
    errors = errors.concat(error.networkError.result.errors)
  }
  else if (error.networkError) {
    errors = errors.concat(error.networkError)
  }
  const toasts = errors.map(({ message }, i) => (
    <Snackbar key={i} open={showError} autoHideDuration={6000} onClose={() => { setShowError(false) }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
      <Alert severity="error" onClose={() => { setShowError(false) }}>
        {message}
      </Alert>
    </Snackbar>
  ))
  return <>{toasts}</>
}

export default ErrorNotification