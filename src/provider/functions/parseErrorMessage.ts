const parseErrorMessage = (error: any) => {
  let errorMsg = error.message;
  if (error.response) {
    // Try to extract a specific error message from the server response
    if (error.response.data?.result?.error) {
      errorMsg = error.response.data.result.error;
    } else if (error.response.data?.error) {
      errorMsg = error.response.data.error;
    } else if (typeof error.response.data === 'string') {
      errorMsg = error.response.data;
    }
  }
  return errorMsg;
};

export default parseErrorMessage;
