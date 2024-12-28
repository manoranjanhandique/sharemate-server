exports.getErrorCode = (error) => {
    // Extract the field name and error type
    const { key } = error.context;
    const type = error.type.split('.').pop(); // Extract the specific type (e.g., "required", "email")
  
    // Generate a dynamic error code
    return `ERR_${key.toUpperCase()}_${type.toUpperCase()}`;
  };