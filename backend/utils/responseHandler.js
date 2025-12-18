const response = (res, statusCode, message, data=null) => {

  if(!res){
    console.log("Response object null");
    return;
  }
  const respoonseObject = {
    status: statusCode<400 ? "success" : "error",
    message: message,
    data: data
  };
  return res.status(statusCode).json(respoonseObject);
}

export default response;
