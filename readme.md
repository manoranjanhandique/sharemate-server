# Mongoose's pre 
    Mongoose's pre middleware allows you to execute custom logic before specific Mongoose methods or lifecycle events (like save, remove, update, etc.) are executed. 
# Key Points About pre Middleware
    ~Runs Before the Specified Operation: Executes before lifecycle events such as save, remove, updateOne, findOne, or aggregate.
    ~Access to the Document or Query: 
        `In document middleware (e.g., save or remove), you have access to the document (this).`
        `In query middleware (e.g., find or updateOne), you can access and modify the query object.`
    ~Asynchronous or Synchronous: Can handle asynchronous operations using async/await or callbacks.
    ~Multiple Middleware Stacking: You can define multiple pre middleware functions, which are executed in the order they are defined.
    ~Control Execution Flow:You must call next() (or let it return in async functions) to proceed to the next middleware or operation.
# Types of pre Middleware
    ~Document Middleware
    ~Query Middleware
    ~Aggregate Middleware